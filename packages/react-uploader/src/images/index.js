export function decodeImage(fileObj) {
    return new Promise((resolve, reject) => {
        const blob = new Blob([fileObj], {type: fileObj.type});
        const u = URL.createObjectURL(blob);
        const img = new Image();
        img.src = u;
        img.onload = () => {
            URL.revokeObjectURL(u);
            resolve(img);
        };
        img.onerror = err => {
            reject(err);
            URL.revokeObjectURL(u);
        };
    });
};

export function reformatImage(img, quality = 0.6) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.height, img.width);
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (img.height < img.width) {
            ctx.drawImage(img, size / 2 - img.width / 2, 0);
        } else {
            ctx.drawImage(img, 0, size / 2 - img.height / 2);
        }
        canvas.toBlob(
            resizedBlob => {
                const fr = new FileReader();
                fr.onload = e => resolve(e.target.result);
                fr.onerror = reject;
                fr.readAsArrayBuffer(resizedBlob);
            },
            'image/jpeg',
            quality
        );
    });
};
