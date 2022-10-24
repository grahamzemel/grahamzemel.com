export const splitText = text => {
	const words = text
		.replace(/\s+/g, m => m.includes('\n') ? '\n ' : ' ')
		.trim()
		.split(' ')
	return words
}
