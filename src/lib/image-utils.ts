/**
 * Convert a base64 string to a Blob object
 * @param base64
 * @returns Blob
 */
export const base64toBlob = (base64: any) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteCharacters.length);
    const byteArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: "image/png" });
}