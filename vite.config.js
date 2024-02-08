import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	...process.env.NODE_ENV !== 'development' ? {ssr: {
		noExternal: ['contentful', '@amcharts/amcharts5']
	}} : {
		ssr: {
		noExternal: ['@amcharts/amcharts5']
	}
	}
});
