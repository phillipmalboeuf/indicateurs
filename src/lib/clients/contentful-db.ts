import { getLocale } from '$lib/paraglide/runtime';
import { db } from '$lib/server/db';
import { entries as entriesTable, assets as assetsTable } from '../../../drizzle/schema';
import { eq, and, inArray } from 'drizzle-orm';
import type { EntrySkeletonType, Entry, Asset } from 'contentful';

// Map locale codes (en -> en-CA)
const localeMap: Record<string, string> = {
	'en': 'en-CA',
	'fr': 'fr-CA'
};

// Cache for resolved entries/assets to avoid circular references
const resolvedCache = new Map<string, Entry<any> | Asset>();

// Batch resolution: collect link IDs and resolve them in batches
const pendingLinks = new Set<string>();
const linkResolutionQueue = new Map<string, Promise<Entry<any> | Asset | any>>();

/**
 * Get the locale code to use for field extraction
 */
function getContentfulLocale(): string {
	const locale = getLocale();
	return localeMap[locale] || locale;
}

/**
 * Extract localized fields from a fields object
 */
function extractLocalizedFields(fields: any, locale: string): any {
	if (!fields || typeof fields !== 'object') {
		return fields;
	}

	const result: any = {};

	for (const [key, value] of Object.entries(fields)) {
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			// Check if this is a localized field (has locale keys)
			if (locale in value) {
				result[key] = value[locale];
			} else if ('en-CA' in value || 'fr-CA' in value || 'en' in value || 'fr' in value) {
				// Try to find a fallback locale
				const fallback = value[locale] || value['en-CA'] || value['fr-CA'] || value['en'] || value['fr'] || Object.values(value)[0];
				result[key] = fallback;
			} else {
				// Not a localized field, recurse
				result[key] = extractLocalizedFields(value, locale);
			}
		} else if (Array.isArray(value)) {
			// Handle arrays (could contain links or nested objects)
			result[key] = value.map((item) => {
				if (item && typeof item === 'object') {
					return extractLocalizedFields(item, locale);
				}
				return item;
			});
		} else {
			result[key] = value;
		}
	}

	return result;
}

/**
 * Check if an object is a Rich Text document node (should not be processed as a link)
 */
function isRichTextNode(obj: any): boolean {
	return obj && typeof obj === 'object' && 'nodeType' in obj;
}

/**
 * Extract link ID from various formats
 */
function extractLinkId(link: any): string | null {
	if (!link) return null;
	
	if (typeof link === 'string') {
		return link;
	} else if (link.sys?.id) {
		return link.sys.id;
	} else if (link.id) {
		return link.id;
	} else if (link.sys?.linkType === 'Entry' || link.sys?.linkType === 'Asset') {
		return link.sys.id;
	}
	
	return null;
}

/**
 * Batch resolve multiple links at once
 */
async function batchResolveLinks(
	linkIds: string[],
	locale: string,
	include: number,
	currentDepth: number
): Promise<Map<string, Entry<any> | Asset | any>> {
	if (linkIds.length === 0) {
		return new Map();
	}

	const result = new Map<string, Entry<any> | Asset | null>();

	// Batch query entries
	const entryResults = await db
		.select()
		.from(entriesTable)
		.where(inArray(entriesTable.id, linkIds));

	// Batch query assets
	const assetResults = await db
		.select()
		.from(assetsTable)
		.where(inArray(assetsTable.id, linkIds));

	// Create maps for quick lookup
	const entryMap = new Map(entryResults.map(e => [e.id, e]));
	const assetMap = new Map(assetResults.map(a => [a.id, a]));

	// Resolve each link
	for (const linkId of linkIds) {
		const cacheKey = `${linkId}-${locale}-${currentDepth}`;
		
		// Check if already resolved
		if (resolvedCache.has(cacheKey)) {
			result.set(linkId, resolvedCache.get(cacheKey)!);
			continue;
		}

		// Check if we should resolve (based on include depth)
		if (currentDepth >= include) {
			result.set(linkId, {
				sys: {
					type: 'Link',
					linkType: 'Entry',
					id: linkId
				}
			} as any);
			continue;
		}

		// Try entry first
		if (entryMap.has(linkId)) {
			const entry = entryMap.get(linkId)!;
			const resolved = await buildEntry(entry, locale, include, currentDepth + 1);
			resolvedCache.set(cacheKey, resolved);
			result.set(linkId, resolved);
		} else if (assetMap.has(linkId)) {
			const asset = assetMap.get(linkId)!;
			const resolved = await buildAsset(asset, locale, include, currentDepth + 1);
			resolvedCache.set(cacheKey, resolved);
			result.set(linkId, resolved);
		} else {
			result.set(linkId, {
				sys: {
					type: 'Link',
					linkType: 'Entry',
					id: linkId
				}
			} as any);
		}
	}

	return result;
}

/**
 * Resolve a link reference (EntryLink or AssetLink)
 * Uses batching for performance
 */
async function resolveLink(
	link: any,
	locale: string,
	include: number,
	currentDepth: number = 0
): Promise<Entry<any> | Asset | any> {
	if (!link) {
		return null;
	}

	// If it's already a resolved entry/asset (has sys with type), return as is
	if (link.sys && (link.sys.type === 'Entry' || link.sys.type === 'Asset')) {
		return link;
	}

	// Extract the ID
	const linkId = extractLinkId(link);
	if (!linkId) {
		return link; // Return as-is if we can't extract an ID
	}

	// Check cache
	const cacheKey = `${linkId}-${locale}-${currentDepth}`;
	if (resolvedCache.has(cacheKey)) {
		return resolvedCache.get(cacheKey)!;
	}

	// Check if we should resolve (based on include depth)
	if (currentDepth >= include) {
		// Return unresolved link in Contentful format
		return {
			sys: {
				type: 'Link',
				linkType: link.sys?.linkType || 'Entry',
				id: linkId
			}
		};
	}

	// Add to pending links for batch resolution
	pendingLinks.add(linkId);

	// Check if there's already a resolution in progress
	if (linkResolutionQueue.has(linkId)) {
		return linkResolutionQueue.get(linkId)!;
	}

	// For immediate resolution (when we can't batch), resolve individually
	// This happens when we're deep in recursion
	try {
		const entryResult = await db
			.select()
			.from(entriesTable)
			.where(eq(entriesTable.id, linkId))
			.limit(1);

		if (entryResult.length > 0) {
			const entry = entryResult[0];
			const resolved = await buildEntry(entry, locale, include, currentDepth + 1);
			resolvedCache.set(cacheKey, resolved);
			return resolved;
		}

		const assetResult = await db
			.select()
			.from(assetsTable)
			.where(eq(assetsTable.id, linkId))
			.limit(1);

		if (assetResult.length > 0) {
			const asset = assetResult[0];
			const resolved = await buildAsset(asset, locale, include, currentDepth + 1);
			resolvedCache.set(cacheKey, resolved);
			return resolved;
		}
	} catch (error) {
		console.error(`Error resolving link ${linkId}:`, error);
	}

	// Return unresolved link if not found
	return {
		sys: {
			type: 'Link',
			linkType: 'Entry',
			id: linkId
		}
	};
}

/**
 * Check if an object is already a resolved entry/asset (has sys.type)
 */
function isResolvedEntryOrAsset(obj: any): boolean {
	return obj && typeof obj === 'object' && obj.sys && 
		(obj.sys.type === 'Entry' || obj.sys.type === 'Asset');
}

/**
 * Check if a string looks like a Contentful ID (UUID format)
 */
function looksLikeContentfulId(str: string): boolean {
	// Contentful IDs are UUIDs: 8-4-4-4-12 hex characters
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Collect all link IDs from a value structure
 * Skips Rich Text nodes, resolved entries/assets, and non-UUID strings
 */
function collectLinkIds(value: any, linkIds: Set<string>, visited: Set<any> = new Set()): void {
	if (!value || typeof value !== 'object') return;
	
	// Prevent infinite loops
	if (visited.has(value)) return;
	visited.add(value);
	
	// Skip Rich Text nodes entirely (don't recurse into their content/data)
	if (isRichTextNode(value)) return;
	
	// Skip already resolved entries/assets
	if (isResolvedEntryOrAsset(value)) return;
	
	if (Array.isArray(value)) {
		for (const item of value) {
			if (item && typeof item === 'object') {
				// Skip Rich Text nodes
				if (isRichTextNode(item)) continue;
				// Skip resolved entries/assets
				if (isResolvedEntryOrAsset(item)) continue;
				
				const linkId = extractLinkId(item);
				if (linkId) {
					linkIds.add(linkId);
				} else {
					// Only recurse if it's not a Rich Text node
					collectLinkIds(item, linkIds, visited);
				}
			} else if (typeof item === 'string' && looksLikeContentfulId(item)) {
				// Only add strings that look like UUIDs
				linkIds.add(item);
			}
		}
	} else {
		const linkId = extractLinkId(value);
		if (linkId) {
			linkIds.add(linkId);
		} else {
			// Recurse into object properties, but skip known Rich Text properties
			for (const [key, val] of Object.entries(value)) {
				// Skip Rich Text specific properties that contain nested structures
				if (key === 'content' && Array.isArray(val) && val.length > 0 && val[0]?.nodeType) {
					continue; // This is Rich Text content, skip it
				}
				if (key === 'marks' && Array.isArray(val)) {
					continue; // Rich Text marks, skip
				}
				if (key === 'data' && val && typeof val === 'object' && 'target' in val) {
					// This might be a Rich Text embedded entry/asset - check if target is already resolved
					if (isResolvedEntryOrAsset(val.target)) {
						continue; // Already resolved, skip
					}
					// Otherwise, it's a link that needs resolution
					const targetLinkId = extractLinkId(val.target);
					if (targetLinkId) {
						linkIds.add(targetLinkId);
						continue;
					}
				}
				collectLinkIds(val, linkIds, visited);
			}
		}
	}
}

/**
 * Replace link references with resolved entries/assets
 */
function replaceLinks(
	value: any,
	resolvedMap: Map<string, Entry<any> | Asset | any>,
	locale: string,
	include: number,
	currentDepth: number
): any {
	if (value === null || value === undefined) {
		return value;
	}
	
	if (isRichTextNode(value)) {
		return value;
	}
	
	if (Array.isArray(value)) {
		return value.map(item => {
			if (item && typeof item === 'object') {
				if (isRichTextNode(item)) {
					return item;
				}
				const linkId = extractLinkId(item);
				if (linkId && resolvedMap.has(linkId)) {
					return resolvedMap.get(linkId);
				}
				return replaceLinks(item, resolvedMap, locale, include, currentDepth);
			} else if (typeof item === 'string' && item.length > 0) {
				return resolvedMap.get(item) || item;
			}
			return item;
		});
	}
	
	if (typeof value === 'object') {
		const linkId = extractLinkId(value);
		if (linkId && resolvedMap.has(linkId)) {
			return resolvedMap.get(linkId);
		}
		
		const result: any = {};
		for (const [key, val] of Object.entries(value)) {
			result[key] = replaceLinks(val, resolvedMap, locale, include, currentDepth);
		}
		return result;
	}
	
	return value;
}

/**
 * Build a Contentful Entry object from database row
 */
async function buildEntry(
	dbEntry: typeof entriesTable.$inferSelect,
	locale: string,
	include: number,
	currentDepth: number = 0
): Promise<Entry<any>> {
	const fields = extractLocalizedFields(dbEntry.fields, locale);

	// Collect all link IDs that need to be resolved at this depth
	const linkIds = new Set<string>();
	for (const value of Object.values(fields)) {
		collectLinkIds(value, linkIds);
	}

	// Batch resolve all links at this depth
	let resolvedMap = new Map<string, Entry<any> | Asset | any>();
	if (linkIds.size > 0 && currentDepth < include) {
		const idsArray = Array.from(linkIds);
		resolvedMap = await batchResolveLinks(idsArray, locale, include, currentDepth);
	}

	// Replace link references with resolved entries/assets
	const resolvedFields: any = {};
	for (const [key, value] of Object.entries(fields)) {
		resolvedFields[key] = replaceLinks(value, resolvedMap, locale, include, currentDepth);
	}

	return {
		sys: {
			id: dbEntry.id,
			type: 'Entry',
			contentType: {
				sys: {
					type: 'Link',
					linkType: 'ContentType',
					id: dbEntry.contentType
				}
			},
			revision: dbEntry.version || 1,
      publishedVersion: dbEntry.version || 1,
			space: {
				sys: {
					type: 'Link',
					linkType: 'Space',
					id: dbEntry.space
				}
			},
			environment: {
				sys: {
					type: 'Link',
					linkType: 'Environment',
					id: dbEntry.environment
				}
			}
		},
		fields: resolvedFields,
		metadata: {} as any
	} as Entry<any>;
}

/**
 * Build a Contentful Asset object from database row
 */
async function buildAsset(
	dbAsset: typeof assetsTable.$inferSelect,
	locale: string,
	include: number,
	currentDepth: number = 0
): Promise<Asset> {
	const fields = extractLocalizedFields(dbAsset.fields, locale);

	return {
		sys: {
			id: dbAsset.id,
			type: 'Asset',
			revision: dbAsset.version || 1,
			publishedVersion: dbAsset.version || 1,
			space: {
				sys: {
					type: 'Link',
					linkType: 'Space',
					id: dbAsset.space
				}
			},
			environment: {
				sys: {
					type: 'Link',
					linkType: 'Environment',
					id: dbAsset.environment
				}
			}
		},
		fields: fields as any,
		metadata: {} as any
	} as Asset;
}

/**
 * Resolve nested fields that might contain links
 * This is used for nested objects that aren't part of the main entry structure
 * Uses replaceLinks which handles batch resolution through buildEntry
 */
async function resolveNestedFields(
	obj: any,
	locale: string,
	include: number,
	currentDepth: number
): Promise<any> {
	if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
		return obj;
	}

	// Collect all link IDs in this nested structure
	const linkIds = new Set<string>();
	for (const value of Object.values(obj)) {
		collectLinkIds(value, linkIds);
	}

	// Batch resolve all links at this depth
	let resolvedMap = new Map<string, Entry<any> | Asset | any>();
	if (linkIds.size > 0 && currentDepth < include) {
		const idsArray = Array.from(linkIds);
		resolvedMap = await batchResolveLinks(idsArray, locale, include, currentDepth);
	}

	// Replace link references with resolved entries/assets
	const result: any = {};
	for (const [key, value] of Object.entries(obj)) {
		result[key] = replaceLinks(value, resolvedMap, locale, include, currentDepth);
	}
	return result;
}

/**
 * Get a single entry by ID from the database
 */
export async function entry<T extends EntrySkeletonType>(
	id: string,
	query: { [key: string]: any } = {},
	include: 1 | 2 | 3 | 4 = 2
): Promise<Entry<T>> {
	// Clear cache for this request
	resolvedCache.clear();

	const locale = getContentfulLocale();

	// Build where conditions
	const conditions = [eq(entriesTable.id, id)];

	const result = await db
		.select()
		.from(entriesTable)
		.where(and(...conditions))
		.limit(1);

	if (result.length === 0) {
		throw new Error(`Entry with id ${id} not found`);
	}

	const builtEntry = await buildEntry(result[0], locale, include, 0);

	// Apply post-query filters if needed
	if (query['fields.id'] && (builtEntry.fields as any).id !== query['fields.id']) {
		throw new Error(`Entry with fields.id ${query['fields.id']} not found`);
	}

	// Apply other field filters
	for (const [key, value] of Object.entries(query)) {
		if (key.startsWith('fields.') && key !== 'fields.id') {
			const fieldName = key.replace('fields.', '');
			const fieldValue = (builtEntry.fields as any)[fieldName];
			if (typeof value === 'object' && value._eq !== undefined) {
				if (fieldValue !== value._eq) {
					throw new Error(`Entry does not match filter ${key}`);
				}
			} else if (fieldValue !== value) {
				throw new Error(`Entry does not match filter ${key}`);
			}
		}
	}

	return builtEntry as Entry<T>;
}

/**
 * Get multiple entries by content type from the database
 */
export async function entries<T extends EntrySkeletonType>(
	content_type: string,
	query: { [key: string]: any } = {},
	include: 1 | 2 | 3 | 4 = 2
): Promise<Entry<T>[]> {
	// Clear cache for this request
	resolvedCache.clear();

	const locale = getContentfulLocale();

	// Build where conditions
	const conditions = [eq(entriesTable.contentType, content_type)];

	// Apply additional filters from query
	// Note: Complex JSON queries would need JSON path operators
	// For now, we'll filter after fetching for simple cases

  // console.log("content_type", content_type);
  // console.log("query", query);
  // console.log("conditions", conditions);
  // console.log("locale", locale);
  // console.log("include", include);

	let result = await db
		.select()
		.from(entriesTable)
		.where(and(...conditions))
		.limit(query.limit || 200);

  // console.log("result", result);

	// Build entries
	const builtEntries = await Promise.all(
		result.map((row) => buildEntry(row, locale, include, 0))
	);

	// Apply post-query filters
	let filtered = builtEntries;
	if (query['fields.id']) {
		filtered = filtered.filter((entry) => entry.fields.id === query['fields.id']);
	}

	// Apply other field filters
	for (const [key, value] of Object.entries(query)) {
		if (key.startsWith('fields.') && key !== 'fields.id') {
			const fieldName = key.replace('fields.', '');
			filtered = filtered.filter((entry) => {
				const fieldValue = (entry.fields as any)[fieldName];
				if (typeof value === 'object' && value._eq !== undefined) {
					return fieldValue === value._eq;
				}
				return fieldValue === value;
			});
		}
	}

	return filtered as Entry<T>[];
}
