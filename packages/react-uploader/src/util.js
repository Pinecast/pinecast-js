// Must come first.
// `exif` tries to monkeypatch `Buffer.prototype` but it all goes poorly
// because of how `blob-to-buffer` does its thing.
import {Buffer} from 'buffer';
global.Buffer = Buffer;
import 'exif/lib/exif/Buffer';

import {ExifImage} from 'exif';
import imageSize from 'pinecast-image-size';
import toBuffer from 'blob-to-buffer';
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


export function detectImageProblems(fileObj) {
    if (typeof FileReader === 'undefined') {
        // Dead promise
        return new Promise(() => {});
    }
    return new Promise(resolve => {
        toBuffer(fileObj, (err, buff) => {
            const i = imageSize(buff);
            if (i.width < 1400 || i.height < 1400) {
                resolve('min_size');
                return;
            } else if (i.width > 3000 || i.height > 3000) {
                resolve('max_size');
                return;
            } else if (i.width !== i.height) {
                resolve('not_square');
                return;
            }

            if (fileObj.type !== 'image/jpeg') {
                return;
            }

            new ExifImage({image: buff}, (err, exifData) => {
                if (err) {
                    return;
                }

                if (
                    exifData.image.XResolution && exifData.image.XResolution !== 72 ||
                    exifData.image.YResolution && exifData.image.YResolution !== 72
                ) {
                    resolve('dpi');
                    return;
                }

                if (exifData.exif.ColorSpace && exifData.exif.ColorSpace !== 1) {
                    resolve('color_space');
                    return;
                }

                if (exifData.image.Orientation && exifData.image.Orientation !== 1) {
                    resolve('orientation');
                    return;
                }
            });
        });
    });
};

export function detectAudioSize(fileObj) {
    return new Promise(resolve => {
        try {
            const audio = new Audio(URL.createObjectURL(fileObj));
            audio.addEventListener('loadedmetadata', () => {
                const dur = audio.duration | 0;
                resolve({
                    hours: dur / 3600 | 0,
                    minutes: dur % 3600 / 60 | 0,
                    seconds: dur % 60 | 0
                });
            });
        } catch (e) {}
    });
};
