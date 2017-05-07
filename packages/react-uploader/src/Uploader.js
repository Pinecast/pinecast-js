import React, {Component} from 'react';

import {gettext} from 'pinecast-i18n';

import ErrorComponent from './Error';
import ImagePreview from './ImagePreview';
import ProgressBar from './ProgressBar';
import TimeRemainingIndicator from './TimeRemainingIndicator';
import {detectAudioSize, detectImageProblems, getFields} from './util';


export default class Uploader extends Component {
    static selector = '.upload-placeholder';

    static propExtraction = {
        accept: e => e.getAttribute('data-accept'),
        name: e => e.getAttribute('data-name'),
        podcast: e => e.getAttribute('data-podcast'),
        type: e => e.getAttribute('data-type'),

        defURL: e => e.getAttribute('data-default-url'),
        defName: e => e.getAttribute('data-default-name'),
        defSize: e => e.getAttribute('data-default-size'),
        defType: e => e.getAttribute('data-default-type'),
        noiTunesSizeCheck: e => e.getAttribute('data-no-itunes-size-check') === 'true',
        audioDurationSelector: e => e.getAttribute('data-audio-duration-selector'),

        optional: e => e.getAttribute('data-optional') || false,
    };

    constructor(props) {
        super(props);

        const hasDef = !!props.defURL;
        this.state = {
            dragging: 0,
            error: null,
            fileObj: !hasDef ? null : {
                name: props.defName,
                size: props.defSize,
                type: props.defType,
            },
            progress: 0,
            uploaded: hasDef,
            uploading: false,
            uploadStart: null,

            finalContentURL: props.defURL || null,

            maxUploadSize: document.querySelector('main').getAttribute('data-max-upload-size') | 0,
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({uploaded: !!newProps.defURL});
    }

    clearFile() {
        this.setState({
            error: null,
            fileObj: null,
            finalContentURL: '',
            uploaded: false,
        });
    }

    detectSize(fileObj) {
        switch (fileObj.type) {
            case 'image/jpeg':
            case 'image/jpg':
            case 'image/png':
                if (this.props.noiTunesSizeCheck) {
                    return;
                }
                detectImageProblems(fileObj).then(error => this.setState({error}));
            case 'audio/mp3':
            case 'audio/mpeg':
            case 'audio/m4a':
            case 'audio/wav':
                if (!this.props.audioDurationSelector) {
                    return;
                }
                detectAudioSize(fileObj).then(({hours, minutes, seconds}) => {
                    const durLab = document.querySelector(this.props.audioDurationSelector);
                    const durHours = durLab.querySelector('[name="duration-hours"]');
                    const durMinutes = durLab.querySelector('[name="duration-minutes"]');
                    const durSeconds = durLab.querySelector('[name="duration-seconds"]');

                    durHours.value = hours;
                    durMinutes.value = minutes;
                    durSeconds.value = seconds;
                });
        }
    }

    getImageURL() {
        return this.state.finalContentURL.split('.').slice(0, -1).join('.');
    }
    getSafeName(name) {
        return name.replace(/[^a-zA-Z0-9\._\-]/g, '_');
    }

    isImage() {
        const {
            state: {fileObj, finalContentURL},
            props: {accept},
        } = this;
        if (finalContentURL && accept === 'image/*') {
            return true;
        }
        return (fileObj ? fileObj.type || '' : '').split('/')[0] === 'image';
    }

    setNewFile(fileObj) {
        const {
            props: {podcast, type},
            state: {maxUploadSize},
        } = this;

        this.setState({dragging: 0});

        if (fileObj.size > maxUploadSize) {
            this.setState({error: `file_too_big_${type}`});
            return;
        } else if (fileObj.size === 0) {
            this.setState({error: 'file_read_error'});
            return;
        }
        if (type === 'image' && fileObj.size > 1024 * 1024 * 2) {
            this.setState({error: 'image_too_big'});
            return;
        }
        if (type === 'audio' && fileObj.type === 'audio/wav') {
            this.setState({error: 'no_wav'});
            return;
        }

        this.setState({
            fileObj,
            uploading: true,
            error: null,
        });

        this.detectSize(fileObj);

        getFields(
            podcast,
            type,
            fileObj.type,
            this.getSafeName(fileObj.name),
            (err, data) => {
                if (!err) {
                    this.startUploading(data);
                    return;
                }
                console.error(err);
                alert(gettext('There was a problem contacting the server for upload information.'));
                this.setState({
                    fileObj: null,
                    uploading: false,
                });
            }
        );
    }

    startUploading({fields, destination_url: finalContentURL, headers, method, url}) {
        const xhr = new XMLHttpRequest();

        const uh = e => {
            e.returnValue = gettext('A file is currently uploading. Are you sure you wish to leave this page?');
        };
        window.addEventListener('beforeunload', uh);

        xhr.onload = xhr.upload.onload = () => {
            window.removeEventListener('beforeunload', uh);
            this.setState({
                uploadStart: null,
                uploading: false,
                uploaded: true,
                finalContentURL,
            });
        };
        xhr.onerror = xhr.upload.onerror = () => {
            window.removeEventListener('beforeunload', uh);
            alert(gettext('There was a problem while uploading the file'));
            this.setState({
                fileObj: null,
                uploading: false,
                progress: 0,
            });
        };
        xhr.upload.onprogress = e => {
            if (!e.lengthComputable) return;
            this.setState({progress: (e.loaded / e.total) * 100});
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
        data.append('file', this.state.fileObj);
        xhr.send(data);

        this.setState({uploadStart: Date.now()});
    }

    renderRequiredPlaceholder() {
        return <input
            className='required-placeholder'
            key='opf'
            required
            style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                height: 0,
                opacity: 0.00001,
                width: 0,
            }}
            title={gettext('You must upload a file')}
            type='text'
        />;
    }

    renderBody() {
        const {
            props: {name: nameProp, optional},
            state: {
                error,
                fileObj: {name, size, type},
                finalContentURL,
                progress,
                uploaded,
                uploading,
                uploadStart,
            },
        } = this;

        if (uploading) {
            return [
                <ErrorComponent error={error} key='err' />,
                <ProgressBar key='pb' progress={progress} />,
                <TimeRemainingIndicator
                    key='tri'
                    progress={progress}
                    startTime={uploadStart}
                />,
                optional || this.renderRequiredPlaceholder(),
            ];
        }

        if (uploaded) {
            return <div className='uploaded-file-card'>
                <strong>{gettext('File Uploaded')}</strong>
                {Boolean(name || size || type) &&
                    <dl>
                        {Boolean(size) && <dt>{gettext('Size')}</dt>}
                        {Boolean(size) && <dd>{size}b</dd>}
                        {Boolean(name) && <dt>{gettext('Name')}</dt>}
                        {Boolean(name) && <dd>{name}</dd>}
                    </dl>}
                {this.isImage() && <ImagePreview url={this.getImageURL()} />}
                <button
                    className='btn btn--danger btn--tiny uploader-btn'
                    onClick={() => this.clearFile()}
                    type='button'
                >
                    {gettext('Clear File')}
                </button>
                <ErrorComponent error={error} />
                <input type='hidden' name={nameProp} value={finalContentURL} />
                <input type='hidden' name={`${nameProp}-name`} value={this.getSafeName(name) || ''} />
                <input type='hidden' name={`${nameProp}-size`} value={size || 0} />
                <input type='hidden' name={`${nameProp}-type`} value={type || ''} />
            </div>;
        }

        return null;
    }

    render() {
        const {
            props: {accept, optional},
            state: {
                dragging,
                error,
                uploading,
                uploaded,
            },
        } = this;

        if (!uploading && !uploaded) {
            return <label
                className={`upload-dd-label ${dragging ? 'is-dragging' : ''}`}
                onDragEnter={() => this.setState({dragging: dragging + 1})}
                onDragLeave={() => this.setState({dragging: dragging - 1})}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                    e.preventDefault();
                    this.setNewFile(e.dataTransfer.files[0]);
                }}
                style={{
                    flexWrap: 'wrap',
                }}
            >
                <ErrorComponent error={error} />
                <i
                    data-text-choose={gettext('Choose a file to upload')}
                    data-text-drop={gettext('or drop a file to upload')}
                />
                <input
                    accept={accept}
                    onChange={e => this.setNewFile(e.target.files[0])}
                    required={!optional}
                    type='file'
                />
                {!optional && this.renderRequiredPlaceholder()}
            </label>;
        }

        return <div
            className={`uploader ${uploading ? 'is-uploading' : ''} ${uploaded ? 'is-uploaded' : ''}`}
        >
            {this.renderBody()}
        </div>;
    }

};
