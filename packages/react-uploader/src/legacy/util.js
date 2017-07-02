// Must come first.
// `exif` tries to monkeypatch `Buffer.prototype` but it all goes poorly
// because of how `blob-to-buffer` does its thing.
import {Buffer} from 'buffer';
global.Buffer = Buffer;
import 'exif/lib/exif/Buffer';

import {ExifImage} from 'exif';
import imageSize from 'pinecast-image-size';
import xhr from 'pinecast-xhr';


export function getFields(podcastSlug, type, fileType, fileName, cb) {
    xhr({
        method: 'get',
        url: `/dashboard/services/getUploadURL/${encodeURIComponent(podcastSlug)}/${encodeURIComponent(type)}?` +
            `type=${encodeURIComponent(fileType)}&name=${encodeURIComponent(fileName)}`,
    }, (err, res, body) => {
        if (err || res.statusCode !== 200) {
            cb(err || res.status);
            return;
        }

        cb(null, JSON.parse(body));
    });
};

export function getExifData(buff) {
    return new Promise((resolve, reject) => {
        new ExifImage({image: buff}, (err, exifData) => {
            if (err) {
                reject(err);
            } else {
                resolve(exifData);
            }
        });
    });
};

export async function detectImageProblems(fileObj) {
    const buff = Buffer.from(await decodeFile(fileObj));
    const i = imageSize(buff);
    if (i.width < 1400 || i.height < 1400) {
        return 'min_size';
    } else if (i.width > 3000 || i.height > 3000) {
        return 'max_size';
    } else if (i.width !== i.height) {
        return 'not_square';
    }

    if (fileObj.type !== 'image/jpeg') {
        return null;
    }

    const exifData = await getExifData(buff);
    if (
        exifData.image.XResolution && exifData.image.XResolution !== 72 ||
        exifData.image.YResolution && exifData.image.YResolution !== 72
    ) {
        return 'dpi';
    }

    if (exifData.exif.ColorSpace && exifData.exif.ColorSpace !== 1) {
        return 'color_space';
    }

    if (exifData.image.Orientation && exifData.image.Orientation !== 1) {
        return 'orientation';
    }

    return null;
};

let inst = 0;
export function getInstance() {
    inst += 1;
    return inst.toString(36);
};

export function guardCallback(component, promise) {
    const origInstance = component.state.instance;
    return new Promise((resolve, reject) => {
        promise.then(
            val => {
                if (component.state.instance !== origInstance) {
                    return;
                }
                resolve(val);
            },
            err => {
                if (component.state.instance !== origInstance) {
                    return;
                }
                reject(err);
            },
        );
    });
};

export function decodeFileObject(fileObj) {
    if (typeof FileReader === 'undefined') {
        return Promise.reject(new Error('No FileReader available'));
    }
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = e => {
            resolve(e.target.result);
        };
        fr.onerror = err => reject(err);
        fr.readAsArrayBuffer(fileObj);
    });
};
