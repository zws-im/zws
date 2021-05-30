import millify from 'millify';

export function abbreviateNumber(number: number): string {
	return millify(number);
}
