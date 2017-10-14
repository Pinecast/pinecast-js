import {ExifImage} from 'exif';

export function getExifData(buff) {
  return new Promise((resolve, reject) => {
    new ExifImage({image: buff}, (err, exifData) => {
      if (err) {
        if (/no exif segment found/i.exec(err)) {
          resolve({image: {}, exif: {}});
          return;
        }
        if (/The Exif data is not valid/i.exec(err)) {
          resolve({image: {}, exif: {}});
          return;
        }
        reject(err);
      } else {
        resolve(exifData);
      }
    });
  });
}
