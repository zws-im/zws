const mappings = Object.entries({
	B: 1e9,
	M: 1e6,
	k: 1e3
});

export function abbreviateNumber(number: number): string {
	for (const [unit, ratio] of mappings) {
		if (ratio <= number) {
			const abbreviated = number / ratio;

			const withDecimal = abbreviated.toFixed(1);

			return `${withDecimal.length > 3 || ratio === number ? Math.round(abbreviated) : withDecimal}${unit}`;
		}
	}

	return number.toString();
}
