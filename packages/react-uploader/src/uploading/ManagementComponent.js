import * as React from 'react';

import {gettext, ngettext} from 'pinecast-i18n';

import Button from '../Button';
import Card from '../Card';
import ProgressBar from '../legacy/ProgressBar';
import TimeRemainingIndicator from '../legacy/TimeRemainingIndicator';
import UploadIcon from '../icons/upload';

export default class ManagementComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      files: props.orders.map(order => order.getManager(this).getEntry()),
      startTime: Date.now(),
      totalPercent: 0,
    };

    this.aborted = false;
  }

  refresh() {
    const {aborted, state: {files}} = this;
    if (aborted) {
      return;
    }

    const newFiles = files.map(f => f.inst.getEntry());
    this.setState({
      files: newFiles,
      totalPercent:
        files.reduce((acc, cur) => acc + cur.completed, 0) /
        files.reduce((acc, cur) => acc + cur.inst.getSize(), 0) *
        100,
    });

    if (newFiles.every(x => x.progress === 100 && !x.error)) {
      this.props.onComplete();
    }
  }

  abort = () => {
    this.aborted = true;
    this.props.orders.forEach(f => f.abort());
    this.props.onCancel();
  };

  render() {
    const {props: {orders}, state: {files, startTime, totalPercent}} = this;
    return (
      <Card>
        <div style={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
          <UploadIcon height={46} width={46} />
          <strong>{ngettext('Your file is uploading', 'Your files are uploading', orders.length)}</strong>
        </div>
        {files.map((manager, i) => (
          <div key={i} style={{padding: '0 10px'}}>
            <strong style={{display: 'block', fontSize: 13, lineHeight: '1.5em'}}>{orders[i].title}</strong>
            <ProgressBar progress={manager.progress} />
          </div>
        ))}
        <div style={{display: 'flex', justifyContent: 'flex-start', padding: '0.5em 10px'}}>
          <Button onClick={this.abort} style={{marginRight: 15}}>
            {gettext('Cancel')}
          </Button>
          <TimeRemainingIndicator
            progress={totalPercent}
            renderer={body => <span>{body}</span>}
            startTime={startTime}
          />
        </div>
      </Card>
    );
  }
}
