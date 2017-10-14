import React from 'react';

import {gettext} from 'pinecast-i18n';

import Button from '../Button';
import Card from '../Card';
import MusicInfo from '../icons/music-info';

class TitleMonitor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
    };

    this.targetComponent = document.querySelector('input[name=title]');
  }

  componentDidMount() {
    this.targetComponent.addEventListener('input', this.onInput);
    this.onInput({target: this.targetComponent});
  }

  componentWillUnmount() {
    this.targetComponent.removeEventListener('input', this.onInput);
  }

  onInput = e => {
    this.setState({isValid: e.target.validity.valid});
  };

  render() {
    const style = {
      border: '2px solid #eee',
      borderRadius: 2,
      color: '#999',
      marginBottom: '1em',
      padding: '0 0.5em',
      transition: 'border 0.2s, color 0.2s',
    };
    if (this.state.isValid) {
      return (
        <div style={style}>{gettext("The title you've entered above will be written to the file's metadata.")}</div>
      );
    } else {
      return (
        <div style={{...style, border: '2px solid #B75B5B', color: '#B75B5B'}}>
          {gettext('Set a title in the field above. It will fill the title in the metadata.')}
        </div>
      );
    }
  }
}

export default ({onAccept, onReject}) => (
  <Card style={{flexDirection: 'row'}}>
    <MusicInfo width={46} height={46} style={{flex: '0 0 46px', marginRight: 15}} />
    <div>
      <b style={{display: 'block'}}>{gettext("Your file doesn't contain any metadata.")}</b>
      <span style={{display: 'block', marginBottom: '0.5em'}}>
        {gettext(
          'Would you like us to automatically add it for you? This will show episode and podcast information in non-podcast apps.',
        )}
      </span>
      <TitleMonitor />
      <div>
        <Button onClick={onAccept} primary>
          {gettext('Add Metadata')}
        </Button>
        <Button onClick={onReject}>{gettext('Skip')}</Button>
      </div>
    </div>
  </Card>
);
