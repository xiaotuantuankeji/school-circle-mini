/**
 * Base64 编码/解码工具
 */

function base64_encode(str: string): string {
	const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	let out = ''
	let i = 0
	const len = str.length
	let c1: number, c2: number, c3: number

	while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff
		if (i === len) {
			out += base64EncodeChars.charAt(c1 >> 2)
			out += base64EncodeChars.charAt((c1 & 0x3) << 4)
			out += '=='
			break
		}
		c2 = str.charCodeAt(i++)
		if (i === len) {
			out += base64EncodeChars.charAt(c1 >> 2)
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
			out += base64EncodeChars.charAt((c2 & 0xf) << 2)
			out += '='
			break
		}
		c3 = str.charCodeAt(i++)
		out += base64EncodeChars.charAt(c1 >> 2)
		out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
		out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6))
		out += base64EncodeChars.charAt(c3 & 0x3f)
	}
	return out
}

function utf16to8(str: string): string {
	let out = ''
	const len = str.length
	for (let i = 0; i < len; i++) {
		const c = str.charCodeAt(i)
		if (c >= 0x0001 && c <= 0x007f) {
			out += str.charAt(i)
		} else if (c > 0x07ff) {
			out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f))
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f))
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f))
		} else {
			out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f))
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f))
		}
	}
	return out
}

function base64_decode(input: string): string {
	const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	let output = ''
	let chr1: number, chr2: number, chr3: number
	let enc1: number, enc2: number, enc3: number, enc4: number
	let i = 0

	input = input.replace(/[^A-Za-z0-9+/=]/g, '')

	while (i < input.length) {
		enc1 = base64EncodeChars.indexOf(input.charAt(i++))
		enc2 = base64EncodeChars.indexOf(input.charAt(i++))
		enc3 = base64EncodeChars.indexOf(input.charAt(i++))
		enc4 = base64EncodeChars.indexOf(input.charAt(i++))

		chr1 = (enc1 << 2) | (enc2 >> 4)
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
		chr3 = ((enc3 & 3) << 6) | enc4

		output += String.fromCharCode(chr1)
		if (enc3 !== 64) {
			output += String.fromCharCode(chr2)
		}
		if (enc4 !== 64) {
			output += String.fromCharCode(chr3)
		}
	}
	return utf8_decode(output)
}

function utf8_decode(utftext: string): string {
	let str = ''
	let i = 0
	let c = 0
	let c1 = 0
	let c2 = 0

	while (i < utftext.length) {
		c = utftext.charCodeAt(i)
		if (c < 128) {
			str += String.fromCharCode(c)
			i++
		} else if (c > 191 && c < 224) {
			c1 = utftext.charCodeAt(i + 1)
			str += String.fromCharCode(((c & 31) << 6) | (c1 & 63))
			i += 2
		} else {
			c1 = utftext.charCodeAt(i + 1)
			c2 = utftext.charCodeAt(i + 2)
			str += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63))
			i += 3
		}
	}
	return str
}

function baseEncode(str: string): string {
	return base64_encode(utf16to8(str))
}

function baseDecode(str: string): string {
	return base64_decode(str)
}

export default {
	baseEncode,
	baseDecode
}
