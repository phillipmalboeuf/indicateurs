/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {

	const response = await resolve(request)

	if (!request.headers.authorization) {
		return {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic'
			}
		}
	}

	const [user, password] = Buffer.from(request.headers.authorization.split(' ')[1], 'base64').toString().split(':')

	if (user !== 'indicateurs' || password !== import.meta.env.VITE_PASSWORD) {
		return {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic'
			}
		}
	}

	return {
		...response,
		headers: {
			...response.headers,
			'Cache-Control': 's-maxage=1, stale-while-revalidate'
		}
	};
}