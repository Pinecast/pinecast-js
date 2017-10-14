import React from 'react';

import {gettext} from 'pinecast-i18n';

import Button from '../Button';
import Card from '../Card';
import ErrorComponent from '../Error';
import {decodeImage, reformatImage} from '../images';
import {downloadAsArrayBuffer} from '../legacy/util';
import Dropzone from '../Dropzone';
import ImageViewer from '../ImageViewer';
import MusicInfo from '../icons/music-info';

export default class AddArtwork extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  render() {
    const {props: {existingSource, onGotFile, onReject, onRequestWaiting, sizeLimit}, state: {error}} = this;

    return (
      <Card style={{flexDirection: 'row'}}>
        <MusicInfo width={46} height={46} style={{flex: '0 0 46px', marginRight: 15}} />
        <div>
          <b style={{display: 'block'}}>{gettext('Would you like to add artwork to your episode?')}</b>
          <span style={{display: 'block', marginBottom: '0.5em'}}>
            {gettext(
              'Artwork will appear on your podcast website and in podcast apps instead of your cover art. Images should be square and between 1400x1400 and 3000x3000 pixels, up to 2MB.',
            )}
          </span>
          {error && <ErrorComponent>{error}</ErrorComponent>}
          <Dropzone
            accept="image/jpg, image/jpeg, image/png"
            label="Drop a PNG or JPG file here"
            onDrop={async fileObj => {
              if (fileObj.size > 1024 * 1024 * 2) {
                this.setState({error: gettext('That file is too big. Images may be up to 2MB.')});
                return;
              }

              // TODO: this could probably use guards
              const decoded = await decodeImage(fileObj);
              const reformatted = await reformatImage(decoded);

              if (reformatted.byteLength > sizeLimit) {
                this.setState({error: gettext('That file works, but it will make your MP3 file too big to upload.')});
                return;
              }

              reformatted.name = fileObj.name;
              if (!reformatted.type) {
                reformatted.type = 'image/jpeg';
              }
              this.setState({error: null}, () => onGotFile(reformatted));
            }}
            style={{marginBottom: 10}}
          />
          {existingSource && (
            <div style={{alignItems: 'center', display: 'flex', padding: '10px 0 20px'}}>
              <ImageViewer height={50} source={existingSource} style={{marginRight: 15}} width={50} />
              <div>
                <b style={{display: 'block', lineHeight: '1em', marginBottom: '0.25em'}}>
                  {gettext('...or use the artwork we have on file.')}
                </b>
                <Button
                  onClick={async () => {
                    await onRequestWaiting();
                    // TODO: add guards and stuff and show progress
                    let content;
                    try {
                      content = await downloadAsArrayBuffer(existingSource);
                    } catch (e) {
                      console.error(e);
                      onReject();
                      return;
                    }
                    onGotFile(content, true);
                  }}
                  primary
                >
                  {gettext('Use Existing')}
                </Button>
              </div>
            </div>
          )}
          <div>
            <Button onClick={onReject}>{gettext('Skip Artwork')}</Button>
          </div>
        </div>
      </Card>
    );
  }
}
