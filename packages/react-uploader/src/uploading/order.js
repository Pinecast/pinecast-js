import {AudioUploadManager, ImageUploadManager} from './manager';

export default class UploadOrder {
  constructor(podcast, title, fileName, type, fileOrArrayBuffer) {
    this.podcast = podcast;
    this.title = title;
    this.fileName = fileName;
    this.type = type;
    this.blob = fileOrArrayBuffer;

    this.manager = null;
  }

  getManager(component) {
    if (this.type === 'audio') {
      return (this.manager = new AudioUploadManager(component, this));
    } else {
      return (this.manager = new ImageUploadManager(component, this));
    }
  }

  getSize() {
    return this.blob.byteLength || this.blob.size;
  }

  getURL() {
    return this.manager.finalContentURL;
  }

  abort() {
    if (!this.manager) {
      return;
    }
    this.manager.abort();
  }
}
