async function delay(duration: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function delayMinimum<T>(promise: Promise<T>, duration: number): Promise<T> {
	const [result] = await Promise.all([promise, delay(duration)]);

	return result;
}
