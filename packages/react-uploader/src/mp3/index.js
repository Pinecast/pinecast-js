import {Buffer} from 'buffer';
import jsmediatags from 'jsmediatags';


export function getID3Tags(audioFileBuffer) {
    return new Promise((resolve, reject) => {
        const reader = jsmediatags.read(Buffer.from(audioFileBuffer), {
            onSuccess: resolve,
            onError: reject,
        });
    });
};


export function detectAudioSize(fileObj) {
    return new Promise((resolve, reject) => {
        try {
            const u = URL.createObjectURL(fileObj);
            const audio = new Audio(u);
            audio.addEventListener('loadedmetadata', () => {
                URL.revokeObjectURL(u);
                resolve(audio.duration);
            });
        } catch (e) {
            reject();
        }
    });
};
