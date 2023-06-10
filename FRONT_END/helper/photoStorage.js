export function saveImage(barcode, base64Image) {
    // Remove the data URI scheme part
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');

    // Convert the base64 data to a Blob object
    const blob = base64ToBlob(base64Data, 'image/png');

    // Generate a unique filename or use an existing filename
    const filename = barcode + '.png';

    // Create a temporary anchor element to trigger the file download
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;

    // Programmatically trigger the download
    anchor.click();

    // Clean up the temporary anchor element
    URL.revokeObjectURL(anchor.href);
    anchor.remove();

    console.log('Image saved successfully.');
}

function base64ToBlob(base64Data, contentType) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}