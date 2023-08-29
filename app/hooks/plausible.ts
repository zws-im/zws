import { usePlausible as baseUsePlausible } from 'next-plausible';

export type PlausibleEvents = {
	'Shorten URL': never;
	'Check URL stats': never;
};

export const usePlausible = () => baseUsePlausible<PlausibleEvents>();
