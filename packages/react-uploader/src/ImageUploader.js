import React, {PureComponent} from 'react';

import {gettext} from 'pinecast-i18n';

import {guardCallback, getInstance} from './legacy/util';

import CardFixImageProblems from './cards/FixImageProblems';
import {decodeImage, reformatImage, detectImageProblems} from './images';
import ErrorComponent from './Error';
import ImageFilePicker from './ImageFilePicker';
import ImageFilePreview from './ImageFilePreview';
import RequiredPlaceholder from './RequiredPlaceholder';
import UploadManager from './uploading/ManagementComponent';
import UploadOrder from './uploading/order';
import WaitingPlaceholder from './WaitingPlaceholder';

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

export default class ImageUploader extends PureComponent {
  static selector = '.image-upload-placeholder';

  static propExtraction = {
    defURL: e => e.getAttribute('data-default-url'),
    label: e => e.getAttribute('data-label') || gettext('Image'),
    name: e => e.getAttribute('data-name'),
    podcast: e => e.getAttribute('data-podcast'),

    noiTunesSizeCheck: e => e.getAttribute('data-no-itunes-size-check') === 'true',
    optional: e => Boolean(e.getAttribute('data-optional')),
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

      problems: null,
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

        problems: null,
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
    const order = new UploadOrder(this.props.podcast, this.props.label, fileName, type, object);
    return order;
  }

  gotFileToUpload = async () => {
    const {props: {noiTunesSizeCheck}, state: {fileObj}} = this;

    if (fileObj.size > 1024 * 1024 * 2) {
      this.clearFile({error: gettext('That image is too large. Images may be up to 2MB.')});
      return;
    }
    if (fileObj.size === 0) {
      this.clearFile({error: gettext('When we tried to read the file you chose, we got back no data.')});
      return;
    }

    if (noiTunesSizeCheck) {
      this.startUploading();
      return;
    }

    const problems = await guardCallback(this, detectImageProblems(fileObj));
    if (!problems || !problems.length) {
      this.startUploading();
      return;
    }

    this.setState({
      phase: 'problems',
      problems,
    });
  };

  fixImageProblems = async () => {
    const {state: {fileObj}} = this;

    await this.promiseSetState({phase: 'waiting'});

    const decoded = await guardCallback(this, decodeImage(fileObj));
    let reformatted;
    try {
      reformatted = await guardCallback(this, reformatImage(decoded, 0.8, 1400, 3000));
    } catch (e) {
      console.error(e);
      this.startUploading();
      return;
    }

    await this.promiseSetState({fileAsArrayBuffer: reformatted});
    this.startUploading([this.getUploadOrder('image', reformatted, fileObj.name || getFilenameForImage(fileObj))]);
  };

  startUploading = orders => {
    this.setState({
      phase: 'uploading',
      uploadOrders: orders ? orders.filter(x => x) : [this.getUploadOrder('image', this.state.fileObj)],
    });
  };

  renderImagePreview() {
    const {props: {label}, state: {fileObj, fileAsArrayBuffer, fileSourceURL, phase}} = this;
    if (!(fileObj || fileAsArrayBuffer || fileSourceURL)) {
      return null;
    }
    return (
      <ImageFilePreview
        isUploaded={Boolean(uploadedPhases[phase])}
        name={label}
        onRemove={() => this.clearFile()}
        source={fileAsArrayBuffer || fileObj || (fileSourceURL && unsign(fileSourceURL))}
      />
    );
  }

  renderBody() {
    const {state: {phase, problems, uploadOrders}} = this;
    switch (phase) {
      case 'ready':
        return (
          <ImageFilePicker onGetFile={file => this.setState({fileObj: file, phase: 'waiting'}, this.gotFileToUpload)} />
        );

      case 'waiting':
        return <WaitingPlaceholder />;

      case 'problems':
        return (
          <div>
            {this.renderImagePreview()}
            <CardFixImageProblems
              onAccept={this.fixImageProblems}
              onIgnore={() => this.startUploading()}
              problems={problems}
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
        return this.renderImagePreview();
    }
  }

  renderFields() {
    const {props: {name}, state: {fileSourceURL, phase, uploadOrders}} = this;

    if (!uploadedPhases[phase]) {
      return null;
    }

    const order = uploadOrders && uploadOrders.find(x => x.type === 'image');
    if (order) {
      return <input name={name} type="hidden" value={order.getURL()} />;
    }

    if (!fileSourceURL) {
      return null;
    }

    return <input name={name} type="hidden" value={fileSourceURL} />;
  }

  render() {
    const {props: {optional}, state: {error, phase}} = this;
    return (
      <div>
        {error && <ErrorComponent>{error}</ErrorComponent>}
        {this.renderBody()}
        {this.renderFields()}
        {!uploadedPhases[phase] && !optional && <RequiredPlaceholder />}
      </div>
    );
  }
}
