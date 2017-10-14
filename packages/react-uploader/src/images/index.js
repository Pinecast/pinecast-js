import {Buffer} from 'buffer';

import {init as initToBlob} from 'canvas-to-blob';
initToBlob();

import {decodeFileObject} from '../legacy/util';
import {getExifData} from './exif';

export function decodeImage(fileObj) {
  return new Promise((resolve, reject) => {
    const u = URL.createObjectURL(fileObj);
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
}

export function reformatImage(img, quality = 0.6, minWidth = 0, maxWidth = Infinity) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const sourceSize = Math.min(img.height, img.width);
    const size = Math.max(Math.min(sourceSize, maxWidth), minWidth);
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      img,
      img.width / 2 - sourceSize / 2,
      img.height / 2 - sourceSize / 2,
      sourceSize,
      sourceSize,
      0,
      0,
      size,
      size,
    );
    canvas.toBlob(
      resizedBlob => {
        const fr = new FileReader();
        fr.onload = e => {
          const result = e.target.result;
          result.type = 'image/jpeg';
          result.name = img.name;
          resolve(result);
        };
        fr.onerror = reject;
        fr.readAsArrayBuffer(resizedBlob);
      },
      'image/jpeg',
      quality,
    );
  });
}

export async function detectImageProblems(fileObj) {
  const i = await decodeImage(fileObj);

  const problems = [];
  if (i.width < 1400 || i.height < 1400) {
    problems.push('min_size');
  } else if (i.width > 3000 || i.height > 3000) {
    problems.push('max_size');
  } else if (i.width !== i.height) {
    problems.push('not_square');
  }

  if (fileObj.type !== 'image/jpeg') {
    return problems;
  }

  const buff = Buffer.from(await decodeFileObject(fileObj));
  const exifData = await getExifData(buff);
  if (
    (exifData.image.XResolution && exifData.image.XResolution !== 72) ||
    (exifData.image.YResolution && exifData.image.YResolution !== 72)
  ) {
    problems.push('dpi');
  }

  if (exifData.exif.ColorSpace && exifData.exif.ColorSpace !== 1) {
    problems.push('color_space');
  }

  if (exifData.image.Orientation && exifData.image.Orientation !== 1) {
    problems.push('orientation');
  }

  return problems;
}
