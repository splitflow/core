export function hex(buffer: ArrayBuffer) {
    const byteArray = Array.from(new Uint8Array(buffer))
    return byteArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
