import React from 'react';

import {gettext} from 'pinecast-i18n';

import Button from '../Button';
import Card from '../Card';
import prettyBytes from '../formatSize';
import ProgressBar from '../legacy/ProgressBar';
import StorageFull from '../icons/storage-full';
import StoragePartial from '../icons/storage-partial';

const ToggleButton = ({isToggled, onClick}) => (
  <button
    onClick={e => {
      e.preventDefault();
      onClick();
    }}
    style={{
      appearance: 'none',
      MsAppearance: 'none',
      MozAppearance: 'none',
      WebkitAppearance: 'none',
      backgroundColor: 'transparent',
      border: 0,
      cursor: 'pointer',
      transform: isToggled ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s',
    }}
    type="button"
  >
    <i className="icon icon-angle-down" />
  </button>
);

export default class Storage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  toggle = () => this.setState({open: !this.state.open});

  render() {
    const {props: {limit, plan, surge}, state: {open}} = this;
    const IconComponent = surge < limit ? StoragePartial : StorageFull;
    return (
      <Card
        style={{
          backgroundColor: open ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.3)',
          marginTop: 15,
          transition: 'background-color 0.3s',
        }}
      >
        <div style={{display: 'flex'}}>
          <IconComponent style={{flex: '0 0 23px', marginRight: 10}} />
          <div style={{flex: '1 1', fontSize: 14, fontWeight: 600}}>
            {gettext('You can upload files up to %s.').replace(/%s/, prettyBytes(limit + surge))}
          </div>
          <ToggleButton onClick={this.toggle} isToggled={open} />
        </div>
        {open && (
          <div style={{paddingLeft: 33}}>
            <div>{gettext('This podcast may have audio files as big as %s.').replace(/%s/, prettyBytes(limit))}</div>
            {plan === '0' ? (
              <div>{gettext('This podcast is on a free plan, so there is no upload surge.')}</div>
            ) : (
              <div>{gettext('This podcast has %s of upload surge available.').replace(/%s/, prettyBytes(surge))}</div>
            )}
            {plan !== '0' && (
              <div style={{alignItems: 'center', display: 'flex'}}>
                <span style={{flex: '0 0', marginRight: 10, whiteSpace: 'nowrap'}}>{gettext('Surge Remaining:')}</span>
                <ProgressBar progress={surge / limit * 100} style={{flex: '1 1', marginBottom: 0}} />
              </div>
            )}
          </div>
        )}
      </Card>
    );
  }
}
