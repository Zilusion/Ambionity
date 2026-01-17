import type { Configuration } from 'lint-staged';

const config: Configuration = {
	'*.{js,ts,svelte}': ['eslint --fix', 'prettier --write'],
	'*.{json,md,yml,css,html}': ['prettier --write']
};

export default config;
