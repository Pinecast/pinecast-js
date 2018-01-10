import React, {PureComponent} from 'react';

import {gettext} from 'pinecast-i18n';

import {decodeFileObject, downloadAsArrayBuffer, guardCallback, getInstance} from './legacy/util';

import addMetadata from './mp3/addMetadata';
import AudioFilePicker from './AudioFilePicker';
import AudioFilePreview from './AudioFilePreview';
import CardAddMetadata from './cards/AddMetadata';
import CardAddArtwork from './cards/AddArtwork';
import CardRemoveArtwork from './cards/RemoveArtwork';
import CardReplaceArtwork from './cards/ReplaceArtwork';
import CardStorage from './cards/Storage';
import {decodeImage, reformatImage} from './images';
import {detectAudioSize, getID3Tags} from './mp3';
import ErrorComponent from './Error';
import ImageFilePreview from './ImageFilePreview';
import RequiredPlaceholder from './RequiredPlaceholder';
import UploadManager from './uploading/ManagementComponent';
import UploadOrder from './uploading/order';
import WaitingPlaceholder from './WaitingPlaceholder';

const typeNames = {
  audio: gettext('Audio'),
  image: gettext('Artwork'),
};
const typeDefaultFilenamesByMIME = {
  'image/jpeg': 'artwork.jpg',
  'image/jpg': 'artwork.jpg',
  'image/png': 'artwork.png',
};
function getFilenameForImage(blob) {
  return typeDefaultFilenamesByMIME[blob.type] || 'artwork.jpg';
}

const uploadedPhases = {
  uploaded: true,
  'confirm remove artwork': true,
};

function unsign(signedURL) {
  if (!signedURL) {
    return null;
  }
  return signedURL
    .split('.')
    .slice(0, -1)
    .join('.');
}

export default class AudioUploader extends PureComponent {
  static selector = '.audio-upload-placeholder';

  static propExtraction = {
    podcast: e => e.getAttribute('data-podcast'),
    podcastName: e => e.getAttribute('data-podcast-name'),
    podcastAuthor: e => e.getAttribute('data-podcast-author'),

    duration: e => parseFloat(e.getAttribute('data-duration')),

    defURL: e => e.getAttribute('data-default-url'),
    defImageURL: e => e.getAttribute('data-image-url'),
    defSize: e => e.getAttribute('data-default-size'),
    defType: e => e.getAttribute('data-default-type'),

    plan: e => e.getAttribute('data-plan'),
    uploadLimit: e => parseFloat(e.getAttribute('data-upload-limit')),
    uploadSurge: e => parseFloat(e.getAttribute('data-upload-surge')),
  };

  constructor(props) {
    super(props);
    this.state = {
      instance: getInstance(),
      error: null,

      phase: props.defURL ? 'uploaded' : 'ready',
      fileObj: null,
      fileAsArrayBuffer: null,
      fileSourceURL: props.defURL || null,
      fileSize: props.defSize ? parseFloat(props.defSize) : null,
      fileType: props.defType || null,
      duration: props.duration === null ? null : props.duration,
      metadataScratch: null,

      imageFileObj: null,
      imageAsArrayBuffer: null,
      imageSourceURL: props.defImageURL || null,

      uploadOrders: null,
    };
  }

  clearFile = (extra, cb) => {
    if (this.state.phase === 'uploading' && this.state.uploadOrders) {
      this.state.uploadOrders.forEach(order => order.abort());
    }
    this.setState(
      {
        instance: getInstance(),
        error: null,

        phase: 'ready',
        fileObj: null,
        fileAsArrayBuffer: null,
        fileSourceURL: null,
        fileSize: null,
        fileType: null,
        duration: null,
        metadataScratch: null,

        imageFileObj: null,
        imageAsArrayBuffer: null,
        imageSourceURL: null,

        uploadOrders: null,
        ...extra,
      },
      cb,
    );
  };

  promiseSetState(state) {
    return new Promise(resolve => this.setState(state, resolve));
  }

  getUploadOrder(type, object, fileName = object.name) {
    const order = new UploadOrder(this.props.podcast, typeNames[type], fileName, type, object);
    return order;
  }

  async decodeImageFromID3(imgBuffer, type) {
    imgBuffer.type = type;
    if (imgBuffer.byteLength < 1024 * 1024) {
      return imgBuffer;
    }

    // Resize the image to save space
    const decodedImage = await guardCallback(this, decodeImage(imgBuffer));
    imgBuffer = await guardCallback(this, reformatImage(decodedImage));
    if (imgBuffer.byteLength > 2 * 1024 * 1024) {
      return null;
    }

    return imgBuffer;
  }

  async gotFileToUpload() {
    const {props: {defImageURL, podcastAuthor, uploadLimit, uploadSurge}, state: {fileObj}} = this;

    if (fileObj.size > uploadLimit + uploadSurge) {
      this.clearFile({error: gettext('The file you chose is too large to upload with your plan.')});
      return;
    }
    if (fileObj.size === 0) {
      this.clearFile({
        error: gettext('When we tried to read the file you chose, we got back no data.'),
      });
      return;
    }

    const baseState = {fileSize: fileObj.size, fileType: fileObj.type};

    try {
      const duration = await guardCallback(this, detectAudioSize(fileObj));
      await this.promiseSetState({...baseState, duration});
    } catch (e) {
      console.error(e);
      await this.promiseSetState({...baseState, duration: 0});
    }

    switch (fileObj.type) {
      case 'audio/m4a':
      case 'audio/x-m4a':
      case 'audio/aac':
        this.startUploading();
        return;
    }

    let decoded;
    try {
      decoded = await guardCallback(this, decodeFileObject(fileObj));
      await this.promiseSetState({fileAsArrayBuffer: decoded});
    } catch (e) {
      this.clearFile({error: gettext('We could not open the file that you selected.')});
      return;
    }

    try {
      const id3Tags = await guardCallback(this, getID3Tags(decoded));
      const getBaseMetadata = (tags = (id3Tags && id3Tags.tags) || {}) => ({
        title: tags.title,
        artist: tags.artist,
        album: tags.album,
        chapters: tags.CHAP,
        tableOfContents: tags.CTOC,
      });
      // this.setState({
      //   phase: 'missing id3',
      //   metadataScratch: getBaseMetadata(),
      // });
      // return;
      if (
        !id3Tags ||
        !id3Tags.tags.title ||
        (!id3Tags.tags.artist && podcastAuthor) ||
        !id3Tags.tags.album
      ) {
        // -> missing id3
        this.setState({
          phase: 'missing id3',
          metadataScratch: getBaseMetadata(),
        });
        return;
      } else if (!id3Tags.tags.picture) {
        // -> has id3, missing artwork
        this.setState({
          phase: 'missing pic',
          metadataScratch: getBaseMetadata(),
        });
        return;
      }

      const imgBuffer = await this.decodeImageFromID3(
        new Uint8Array(id3Tags.tags.picture.data).buffer,
        id3Tags.tags.picture.format,
      );
      if (!imgBuffer) {
        this.setState({
          phase: 'missing pic',
          metadataScratch: getBaseMetadata(),
        });
        return;
      }

      if (defImageURL) {
        await this.promiseSetState({
          imageAsArrayBuffer: imgBuffer,
          metadataScratch: getBaseMetadata(),
          phase: 'replace pic',
        });
        return;
      }
      await this.promiseSetState({imageAsArrayBuffer: imgBuffer});
      this.startUploading([
        this.getUploadOrder('audio', fileObj),
        this.getUploadOrder('image', imgBuffer, getFilenameForImage(imgBuffer)),
      ]);
    } catch (e) {
      console.error(e);
      // -> start uploading
      this.startUploading([this.getUploadOrder('audio', fileObj)]);
    }
  }

  async replacePicWithExisting() {
    await this.promiseSetState({phase: 'waiting'});

    const {props: {defImageURL}, state: {fileObj, imageAsArrayBuffer, metadataScratch}} = this;

    let imgContent;
    try {
      // TODO: Move this into the card and show progress.
      // I didn't do that now because it means a few things:
      //  1. Much more complicated error handling
      //  2. Extra work is needed because the audio can be cleared while this downloads
      imgContent = await downloadAsArrayBuffer(unsign(defImageURL));
    } catch (e) {
      console.error(e);
      // Just give up and use the new one
      this.startUploading([
        this.getUploadOrder('audio', fileObj),
        this.getUploadOrder('image', imageAsArrayBuffer, getFilenameForImage(imageAsArrayBuffer)),
      ]);
      return;
    }

    await this.promiseSetState({
      imageAsArrayBuffer: imgContent,
      imageSourceURL: defImageURL,
      metadataScratch: {...metadataScratch, artwork: imgContent},
    });

    return this.addMetadata(true);
  }

  async addMetadata(noImageUpload = false) {
    const {state: {fileObj, fileAsArrayBuffer, metadataScratch}} = this;
    let blob;
    try {
      blob = addMetadata(fileAsArrayBuffer, metadataScratch);
      blob.name = fileObj.name;
      if (!blob.type) {
        blob.type = fileObj.type;
      }
      await this.promiseSetState({fileAsArrayBuffer: blob, fileSize: blob.byteLength || blob.size});
    } catch (e) {
      console.error(e);
      blob = fileAsArrayBuffer;
      blob.name = fileObj.name;
    }

    this.startUploading([
      this.getUploadOrder('audio', blob),
      metadataScratch.artwork &&
        !noImageUpload &&
        this.getUploadOrder('image', metadataScratch.artwork),
    ]);
  }

  startUploading = orders => {
    this.setState({
      phase: 'uploading',
      uploadOrders: orders
        ? orders.filter(x => x)
        : [this.getUploadOrder('audio', this.state.fileObj)],
    });
  };

  renderAudioPreview() {
    const {state: {duration, fileSourceURL, fileSize, phase, uploadOrders}} = this;
    return (
      <AudioFilePreview
        duration={duration}
        isUploaded={Boolean(uploadedPhases[phase])}
        name="Episode Audio"
        onCancel={this.clearFile}
        size={fileSize}
        url={unsign(
          uploadOrders ? uploadOrders.find(x => x.type === 'audio').getURL() : fileSourceURL,
        )}
      />
    );
  }

  renderImagePreview() {
    const {state: {fileObj, imageFileObj, imageAsArrayBuffer, imageSourceURL}} = this;
    if (!(imageFileObj || imageAsArrayBuffer || imageSourceURL)) {
      return null;
    }
    return (
      <ImageFilePreview
        name="Episode Artwork"
        onRemove={() => this.setState({phase: 'confirm remove artwork'})}
        size={
          imageSourceURL ? null : imageAsArrayBuffer ? imageAsArrayBuffer.byteLength : fileObj.size
        }
        source={imageAsArrayBuffer || imageFileObj || (imageSourceURL && unsign(imageSourceURL))}
      />
    );
  }

  handleGotFileToUpload = () => {
    this.gotFileToUpload();
  };

  handleSetMetadata = () => {
    this.setState({
      phase: 'missing pic',
      metadataScratch: {
        ...this.state.metadataScratch,
        title: document.querySelector('input[name=title]').value,
        artist: this.props.podcastAuthor,
        album: this.props.podcastName,
      },
    });
  };
  handleSkipMetadata = () => {
    this.startUploading();
  };

  handleUseExistingPic = () => {
    this.replacePicWithExisting();
  };
  handleAddMetadata = () => {
    this.addMetadata();
  };

  renderBody() {
    const {
      props,
      state: {fileObj, imageAsArrayBuffer, metadataScratch, phase, uploadOrders},
    } = this;
    switch (phase) {
      case 'ready':
        return (
          <div>
            <AudioFilePicker
              onGetFile={file =>
                this.setState({fileObj: file, phase: 'waiting'}, this.handleGotFileToUpload)}
            />
            <CardStorage limit={props.uploadLimit} plan={props.plan} surge={props.uploadSurge} />
          </div>
        );

      case 'waiting':
        return <WaitingPlaceholder />;

      case 'missing id3':
        return (
          <div>
            {this.renderAudioPreview()}
            <CardAddMetadata onAccept={this.handleSetMetadata} onReject={this.handleSkipMetadata} />
          </div>
        );

      case 'missing pic':
        return (
          <div>
            {this.renderAudioPreview()}
            <CardAddArtwork
              existingSource={unsign(props.defImageURL)}
              onGotFile={(file, isExisting) => {
                this.setState(
                  {
                    imageAsArrayBuffer: file,
                    imageSourceURL: isExisting ? props.defImageURL : null,
                    metadataScratch: {...metadataScratch, artwork: file},
                    phase: 'waiting',
                  },
                  () => this.addMetadata(isExisting),
                );
              }}
              onReject={() => {
                if (metadataScratch) {
                  this.setState({phase: 'waiting'}, this.handleAddMetadata);
                  return;
                }
                this.startUploading();
              }}
              onRequestWaiting={() => this.promiseSetState({phase: 'waiting'})}
              sizeLimit={props.uploadLimit + props.uploadSurge - fileObj.size}
            />
          </div>
        );

      case 'replace pic':
        return (
          <div>
            {this.renderAudioPreview()}
            <CardReplaceArtwork
              existingSource={unsign(props.defImageURL)}
              newSource={imageAsArrayBuffer}
              onChooseExisting={this.handleUseExistingPic}
              onChooseNew={() => {
                this.setState({metadataScratch: null}, () => {
                  this.startUploading([
                    this.getUploadOrder('audio', fileObj),
                    this.getUploadOrder(
                      'image',
                      imageAsArrayBuffer,
                      getFilenameForImage(imageAsArrayBuffer),
                    ),
                  ]);
                });
              }}
            />
          </div>
        );

      case 'uploading':
        return (
          <UploadManager
            onCancel={() => this.clearFile()}
            onComplete={() => this.setState({phase: 'uploaded'})}
            orders={uploadOrders}
          />
        );

      case 'uploaded':
        return (
          <div>
            {this.renderAudioPreview()}
            {this.renderImagePreview()}
          </div>
        );
      case 'confirm remove artwork':
        return (
          <div>
            {this.renderAudioPreview()}
            <CardRemoveArtwork
              onAccept={() => {
                this.setState({
                  imageFileObj: null,
                  imageAsArrayBuffer: null,
                  imageSourceURL: null,

                  phase: 'uploaded',
                });
              }}
              onCancel={() => this.setState({phase: 'uploaded'})}
            />
          </div>
        );
    }
  }

  renderFields() {
    const {
      state: {duration, fileSize, fileSourceURL, fileType, imageSourceURL, phase, uploadOrders},
    } = this;

    if (!uploadedPhases[phase]) {
      return null;
    }
    const field = (key, value) =>
      Boolean(value && value !== 0) && <input key={key} name={key} type="hidden" value={value} />;
    const getOrderURL = (type, def) => {
      if (!uploadOrders) {
        if (!def) {
          return null;
        }
        return field(`${type}-url`, def);
      }
      const order = uploadOrders.find(x => x.type === type);
      if (!order && !def) {
        return null;
      }
      return field(`${type}-url`, order ? order.getURL() : def);
    };
    return [
      getOrderURL('audio', fileSourceURL),
      getOrderURL('image', imageSourceURL),
      field('audio-url-size', fileSize),
      field('audio-url-type', fileType),
      field('duration', duration),
    ].filter(x => x);
  }

  render() {
    const {state: {error, phase}} = this;
    return (
      <div>
        {error && <ErrorComponent>{error}</ErrorComponent>}
        {this.renderBody()}
        {this.renderFields()}
        {!uploadedPhases[phase] && <RequiredPlaceholder />}
      </div>
    );
  }
}
