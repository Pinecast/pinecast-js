import {Buffer} from 'buffer';
import jsmediatags from '@mattbasta/jsmediatags';

export function getID3Tags(audioFileBuffer) {
  return new Promise((resolve, reject) => {
    jsmediatags.read(Buffer.from(audioFileBuffer), {
      onSuccess: resolve,
      onError: e => {
        if (e && e.type && e.type === 'tagFormat') {
          resolve(null);
        } else {
          reject(e);
        }
      },
    });
  });
}

export function detectAudioSize(fileObj) {
  return new Promise((resolve, reject) => {
    try {
      const u = URL.createObjectURL(fileObj);
      const audio = new Audio(u);
      let handled = false;
      function handler() {
        if (handled) {
          return;
        }
        if (audio.duration === Infinity || isNaN(audio.duration)) {
          return;
        }
        handled = true;
        URL.revokeObjectURL(u);
        resolve(audio.duration);
      }
      audio.addEventListener('loadedmetadata', handler);
      audio.addEventListener('durationchanged', handler);
      setTimeout(() => {
        handler();
        if (!handled) {
          reject();
        }
      }, 3000);
    } catch (e) {
      reject();
    }
  });
}
