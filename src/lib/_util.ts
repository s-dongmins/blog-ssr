export function timeCalc(timestamp: number): string {
	const date = new Date(timestamp);
	return `${date.getFullYear() % 100}${(date.getMonth() + 1).toString().padStart(2, '0')}${date
		.getDate()
		.toString()
		.padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date
		.getMinutes()
		.toString()
		.padStart(2, '0')}`;
}
