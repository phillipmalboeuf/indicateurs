/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {

	const response = await resolve(request)

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

	return {
		...response,
		headers: {
			...response.headers,
			'Link': '</fonts/PPNeueMontreal-Book.woff2>; rel="preload"; as="font"; type="font/woff2"; crossorigin="anonymous", </fonts/PPNeueMontreal-Medium.woff2>; rel="preload"; as="font"; type="font/woff2"; crossorigin="anonymous", </fonts/PPNeueMachina-Bold.woff2>; rel="preload"; as="font"; type="font/woff2"; crossorigin="anonymous",',
			'Cache-Control': 's-maxage=1, stale-while-revalidate'
		}
	};
}