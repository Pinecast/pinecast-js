import React, {PureComponent} from 'react';

import {gettext} from 'pinecast-i18n';

import {decodeFileObject, guardCallback, getInstance} from './legacy/util';

import addMetadata from './mp3/addMetadata';
import AudioFilePicker from './AudioFilePicker';
import AudioFilePreview from './AudioFilePreview';
import CardAddMetadata from './cards/AddMetadata';
import CardAddArtwork from './cards/AddArtwork';
import CardRemoveArtwork from './cards/RemoveArtwork';
import {detectAudioSize, getID3Tags} from './mp3';
import ErrorComponent from './Error';
import ImageFilePreview from './ImageFilePreview';
import RequiredPlaceholder from './RequiredPlaceholder';
import UploadManager from './uploading/ManagementComponent';
import UploadOrder from './uploading/order';
import WaitingPlaceholder from './WaitingPlaceholder';


const maxUploadSize = Number(document.querySelector('main').getAttribute('data-max-upload-size'));

const typeNames = {
    audio: gettext('Audio'),
    image: gettext('Artwork'),
};
const typeDefaultFilenamesByMIME = {
    'image/jpeg': 'artwork.jpg',
    'image/jpg': 'artwork.jpg',
    'image/png': 'artwork.png',
};

const uploadedPhases = {
    uploaded: true,
    'confirm remove artwork': true,
};

function unsign(signedURL) {
    return signedURL.split('.').slice(0, -1).join('.');
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
    };

    constructor(props) {
        super(props);

        const hasDef = !!props.defURL;
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

            readyToSubmit: false,
        };
    }

    clearFile = (extra, cb) => {
        if (this.state.phase === 'uploading' && this.state.uploadOrders) {
            this.state.uploadOrders.forEach(order => order.abort());
        }
        this.setState({
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

            readyToSubmit: false,
            ...extra,
        }, cb);
    }

    promiseSetState(state) {
        return new Promise(resolve => this.setState(state, resolve));
    }

    getUploadOrder(type, object, fileName = object.name) {
        const order = new UploadOrder(
            this.props.podcast,
            typeNames[type],
            fileName,
            type,
            object
        );
        return order;
    }

    gotFileToUpload = async () => {
        const {
            props: {podcastAuthor},
            state: {fileObj},
        } = this;

        if (fileObj.size > maxUploadSize) {
            this.clearFile({error: gettext('The file you chose is too large to upload with your plan.')});
            return;
        }

        try {
            const duration = await guardCallback(this, detectAudioSize(fileObj));
            await this.promiseSetState({fileObj, fileSize: fileObj.size, fileType: fileObj.type, duration});
        } catch (e) {
            await this.promiseSetState({fileObj, fileSize: fileObj.size, fileType: fileObj.type, duration: 0});
        }

        switch (fileObj.type) {
            case 'audio/m4a':
            case 'audio/x-m4a':
            case 'audio/aac':
                this.startUploading([
                    this.getUploadOrder('audio', fileObj),
                ]);
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
            if (
                !id3Tags.tags.title ||
                !id3Tags.tags.artist && podcastAuthor ||
                !id3Tags.tags.album
            ) {
                // -> missing id3
                this.setState({phase: 'missing id3'});
            } else if (!id3Tags.tags.picture) {
                // -> has id3, missing artwork
                this.setState({
                    phase: 'missing pic',
                    metadataScratch: {
                        title: id3Tags.tags.title,
                        artist: id3Tags.tags.artist,
                        album: id3Tags.tags.album,
                    },
                });
            } else {
                // -> has id3
                const imgBuffer = (new Uint8Array(id3Tags.tags.picture.data)).buffer;
                imgBuffer.type = id3Tags.tags.picture.format;
                await this.promiseSetState({imageAsArrayBuffer: imgBuffer});
                this.startUploading([
                    this.getUploadOrder('audio', fileObj),
                    this.getUploadOrder('image', imgBuffer, typeDefaultFilenamesByMIME[imgBuffer.type] || 'artwork.jpg'),
                ]);
            }
        } catch (e) {
            // -> start uploading
            this.startUploading([
                this.getUploadOrder('audio', fileObj),
            ]);
        }
    };

    addMetadata = async () => {
        const {state: {fileObj, fileAsArrayBuffer, metadataScratch}} = this;
        let blob;
        try {
            blob = addMetadata(fileAsArrayBuffer, metadataScratch);
            blob.name = fileObj.name;
            blob.type = fileObj.type;
            await this.promiseSetState({fileAsArrayBuffer: blob, fileSize: blob.byteLength});
        } catch (e) {
            blob = fileAsArrayBuffer;
        }

        this.startUploading([
            this.getUploadOrder('audio', blob),
            metadataScratch.artwork && this.getUploadOrder('image', metadataScratch.artwork),
        ]);
    };

    startUploading = orders => {
        this.setState({
            phase: 'uploading',
            uploadOrders: orders ? orders.filter(x => x) : [this.getUploadOrder('audio', this.state.fileObj)],
        });
    };

    renderAudioPreview() {
        const {state: {duration, fileObj, fileAsArrayBuffer, fileSize, phase}} = this;
        return <AudioFilePreview
            duration={duration}
            isUploaded={Boolean(uploadedPhases[phase])}
            name='Episode Audio'
            onCancel={this.clearFile}
            size={fileSize}
        />;
    }

    renderImagePreview() {
        const {state: {imageFileObj, imageAsArrayBuffer, imageSourceURL}} = this;
        if (!(imageFileObj || imageAsArrayBuffer || imageSourceURL)) {
            return null;
        }
        return <ImageFilePreview
            name='Episode Artwork'
            onRemove={() => this.setState({phase: 'confirm remove artwork'})}
            size={imageSourceURL ? null : (imageAsArrayBuffer ? imageAsArrayBuffer.byteLength : fileObj.size)}
            source={imageAsArrayBuffer || imageFileObj || (imageSourceURL && unsign(imageSourceURL))}
        />;
    }

    renderBody() {
        const {props, state: {duration, metadataScratch, phase, uploadOrders}} = this;
        switch (phase) {
            case 'ready':
                return <AudioFilePicker
                    onGetFile={
                        file => this.setState(
                            {fileObj: file, phase: 'waiting'},
                            this.gotFileToUpload
                        )
                    }
                />;

            case 'waiting':
                return <WaitingPlaceholder />;

            case 'missing id3':
                return <div>
                    {this.renderAudioPreview()}
                    <CardAddMetadata
                        onAccept={() => {
                            this.setState({
                                phase: 'missing pic',
                                metadataScratch: {
                                    title: document.querySelector('input[name=title]').value,
                                    artist: props.podcastAuthor,
                                    album: props.podcastName,
                                },
                            });
                        }}
                        onReject={() => this.startUploading()}
                    />
                </div>;

            case 'missing pic':
                return <div>
                    {this.renderAudioPreview()}
                    <CardAddArtwork
                        onGotFile={file => {
                            this.setState({
                                imageAsArrayBuffer: file,
                                metadataScratch: {...metadataScratch, artwork: file},
                                phase: 'waiting',
                            }, this.addMetadata);
                        }}
                        onReject={() => {
                            if (metadataScratch) {
                                this.setState({phase: 'waiting'}, this.addMetadata);
                                return;
                            }
                            this.startUploading();
                        }}
                    />
                </div>;

            case 'uploading':
                return <UploadManager
                    onCancel={() => this.clearFile()}
                    onComplete={() => this.setState({phase: 'uploaded'})}
                    orders={uploadOrders}
                />;

            case 'uploaded':
                return <div>
                    {this.renderAudioPreview()}
                    {this.renderImagePreview()}
                </div>;
            case 'confirm remove artwork':
                return <div>
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
                </div>;
        }
    }

    renderFields() {
        const {
            state: {
                duration,
                fileSize,
                fileSourceURL,
                fileType,
                imageSourceURL,
                phase,
                uploadOrders,
            },
        } = this;

        if (!uploadedPhases[phase]) {
            return null;
        }
        const field = (key, value) => Boolean(value) && <input key={key} name={key} type='hidden' value={value} />;
        return [
            ...(
                uploadOrders ?
                    uploadOrders.map(x => field(`${x.type}-url`, x.getURL())) :
                    [
                        field('audio-url', fileSourceURL),
                        field('image-url', imageSourceURL),
                    ]
            ),
            field('audio-url-size', fileSize),
            field('audio-url-type', fileType),
            field('duration', duration),
        ].filter(x => x);
    }

    render() {
        const {state: {error, phase}} = this;
        return <div>
            {error && <ErrorComponent>{error}</ErrorComponent>}
            {this.renderBody()}
            {this.renderFields()}
            {!uploadedPhases[phase] && <RequiredPlaceholder />}
        </div>;
    }

};
