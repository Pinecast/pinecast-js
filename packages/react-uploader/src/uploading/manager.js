import {gettext} from 'pinecast-i18n';
import xhr from 'pinecast-xhr';


class UploadManager {
    constructor(component, order) {
        this.component = component;

        this.order = order;

        this.error = null;
        this.progress = 0;
        this.completed = 0;
        this.xhr = null;

        this.startUpload();

        this.finalContentURL = null;
    }

    unloadHandler = e => {
         e.returnValue = gettext('A file is currently uploading. Are you sure you wish to leave this page?');
    };
    setUnloadHandler() {
        window.addEventListener('beforeunload', this.unloadHandler);
    }
    clearUnloadHandler() {
        window.removeEventListener('beforeunload', this.unloadHandler);
    }

    getEntry() {
        return {
            inst: this,

            completed: this.completed,
            error: this.error,
            progress: this.progress,
        };
    }

    update() {
        this.component.refresh();
    }

    getType() {
        return this.order.blob.type || this.defaultMIME;
    }

    getSize() {
        return this.order.getSize();
    }

    startUpload() {
        this.xhr = xhr({
            method: 'get',
            url: `/dashboard/services/getUploadURL/${encodeURIComponent(this.order.podcast)}/${this.order.type}?` +
                `type=${encodeURIComponent(this.order.blob.type)}&name=${encodeURIComponent(this.order.fileName)}`,
        }, (err, res, body) => {
            if (err || res.statusCode !== 200) {
                this.error = gettext('Could not contact Pinecast');
                this.update();
                return;
            }

            const {fields, destination_url: finalContentURL, headers, method, url} = JSON.parse(body);
            this.finalContentURL = finalContentURL;

            const xhr = new XMLHttpRequest();
            this.setUnloadHandler();

            xhr.onload = xhr.upload.onload = () => {
                if (this.progress === 100 || this.error) {
                    return;
                }
                this.clearUnloadHandler();
                this.progress = 100;
                this.update();
            };
            xhr.onerror = xhr.upload.onerror = () => {
                this.clearUnloadHandler();
                this.error = gettext('There was a problem while uploading the file');
                this.update();
            };
            xhr.upload.onprogress = e => {
                if (!e.lengthComputable) return;
                this.completed = e.loaded;
                this.progress = Math.min((e.loaded / e.total) * 100, 99.9);
                this.update();
            };

            xhr.open(method, url, true);
            for (let key in headers) {
                if (!headers.hasOwnProperty(key)) continue;
                xhr.setRequestHeader(key, headers[key]);
            }

            const data = new FormData();
            for (let key in fields) {
                if (!fields.hasOwnProperty(key)) continue;
                data.append(key, fields[key]);
            }
            data.append('file', this.getSendable());
            xhr.send(data);

            this.xhr = xhr;
        });
    }

    getSendable() {
        const blob = this.order.blob;
        if (blob instanceof File) {
            return blob;
        }
        if (blob instanceof ArrayBuffer) {
            return new Blob([blob], {type: blob.type});
        }
        return blob;
    }

    abort() {
        if (!this.xhr || this.progress === 100 || this.error) {
            return;
        }
        this.clearUnloadHandler();
        this.xhr.abort();
        this.error = gettext('Aborted');
        this.update();
    }
}

export class AudioUploadManager extends UploadManager {
    get type() {
        return 'audio';
    }
    get defaultMIME() {
        return 'audio/mp3';
    }
};
export class ImageUploadManager extends UploadManager {
    get type() {
        return 'image';
    }
    get defaultMIME() {
        return 'image/jpeg';
    }
};
