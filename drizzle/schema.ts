import { pgTable, index, text, integer, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const entries = pgTable("entries", {
	id: text().primaryKey().notNull(),
	space: text().notNull(),
	environment: text().notNull(),
	contentType: text("content_type").notNull(),
	version: integer(),
	fields: json(),
}, (table) => [
	index("content_type").using("btree", table.contentType.asc().nullsLast().op("text_ops")),
	index("space").using("btree", table.space.asc().nullsLast().op("text_ops"), table.environment.asc().nullsLast().op("text_ops")),
]);

export const assets = pgTable("assets", {
	id: text().primaryKey().notNull(),
	space: text().notNull(),
	environment: text().notNull(),
	version: integer(),
	fields: json(),
}, (table) => [
	index("assets_space").using("btree", table.space.asc().nullsLast().op("text_ops"), table.environment.asc().nullsLast().op("text_ops")),
]);
