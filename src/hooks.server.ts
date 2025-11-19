import type { Handle } from '@sveltejs/kit';
import { sequence } from "@sveltejs/kit/hooks"
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request, locale }) => {
	event.request = request;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
	});
});

const headersHandle: Handle = async ({ event, resolve }) => {

	const response = await resolve(event)

	// response.headers.set('Link', '</fonts/PPNeueMontreal-Book.woff2>; rel="preload"; as="font"; type="font/woff2"; crossorigin="anonymous", </fonts/PPNeueMontreal-Medium.woff2>; rel="preload"; as="font"; type="font/woff2"; crossorigin="anonymous", </fonts/PPNeueMachina-Bold.woff2>; rel="preload"; as="font"; type="font/woff2"; crossorigin="anonymous",')
	response.headers.set('Vercel-CDN-Cache-Control', 'max-age=3600000');
  response.headers.set('Cache-Control', 'max-age=3600000');
	response.headers.set('Etag', `"${process.env.VERCEL_URL || 'dev'}"`);

	// if (!request.headers.authorization) {
	// 	return {
	// 		status: 401,
	// 		headers: {
	// 			'WWW-Authenticate': 'Basic'
	// 		}
	// 	}
	// }

	// const [user, password] = Buffer.from(request.headers.authorization.split(' ')[1], 'base64').toString().split(':')

	// if (user !== 'indicateurs' || password !== import.meta.env.VITE_PASSWORD) {
	// 	return {
	// 		status: 401,
	// 		headers: {
	// 			'WWW-Authenticate': 'Basic'
	// 		}
	// 	}
	// }

	return response
}

export const handle: Handle = sequence(handleParaglide, headersHandle);
