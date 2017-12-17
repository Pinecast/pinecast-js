import React, {PureComponent} from 'react';

import {gettext} from 'pinecast-i18n';

export default class TimeRemainingIndicator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: null,
    };

    this.timer = null;
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 250);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.startTime !== this.props.startTime) {
      this.setState({timeRemaining: null});
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick = () => {
    let percent = this.props.progress;
    if (!percent) {
      return;
    }
    percent /= 100;

    const duration = Date.now() - this.props.startTime;
    const fullTime = Math.ceil(duration / percent / 1000);
    const remaining = fullTime - Math.floor(duration / 1000);

    const seconds = Math.ceil(remaining % 60);
    const minutes = (remaining - seconds) / 60;

    this.setState({timeRemaining: `${minutes}:${('00' + seconds).slice(-2)}`});
  };

  render() {
    const body = this.state.timeRemaining || gettext('Calculating time remaining…');
    if (this.props.renderer) {
      return this.props.renderer(body);
    }
    return <div className="time-remaining">{body}</div>;
  }
}
