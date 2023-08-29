import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			white: colors.white,
			black: colors.black,
			purple: colors.purple,
			red: colors.rose,
			green: colors.green,
			'zws-purple': {
				'50': '#EDE7FF',
				'100': '#DCD5F0',
				'400': '#9B77FF',
				'500': '#4413CB',
				'700': '#483775',
				'800': '#301B66',
				'900': '#140A2E',
			},
		},
	},
	plugins: [],
};
export default config;
