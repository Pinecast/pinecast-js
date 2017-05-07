import React, {Component} from 'react';

import {gettext} from 'pinecast-i18n';


export default class TimeRemainingIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeRemaining: null,
        };

        this.timer = null;

        this.tick = this.tick.bind(this);
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

    tick() {
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
    }

    render() {
        return <div className='time-remaining'>
            {this.state.timeRemaining || gettext('Calculating time remaining...')}
        </div>;
    }

};
