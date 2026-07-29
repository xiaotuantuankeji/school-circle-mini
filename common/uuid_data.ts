function uuidToString(): string {
	const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
	const uuid: (string)[] = []

	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
	uuid[14] = '4'

	for (let i = 0; i < 36; i++) {
		if (!uuid[i]) {
			const r = 0 | Math.random() * 16
			uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
		}
	}

	let id = uuid.join('')
	while (id.indexOf('-') > -1) {
		id = id.replace('-', '')
	}
	return id
}

export default {
	uuidToString
}
