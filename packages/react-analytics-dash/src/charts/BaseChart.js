import React, {Component} from 'react';

import Spinner from 'pinecast-spinner';
import xhr from 'pinecast-xhr';

import ChartOptionSelector from '../optionSelector';
import * as constants from '../constants';


export default class BaseChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            xhr: null,

            granularity: null,
            timeframe: null,
        };
    }

    componentDidMount() {
        this.startLoadingData();
    }
    componentWillReceiveProps() {
        if (this.state.xhr) {
            this.state.xhr.abort();
        }
        this.setState(
            {
                data: null,
                timeframe: null,
                xhr: null,
            },
            () => this.startLoadingData()
        );
    }

    getLoadURL(timeframe) {
        const {
            props: {endpoint, episode, podcast},
        } = this;

        return `/analytics/${endpoint}?podcast=${encodeURIComponent(podcast)}` +
                (timeframe ? `&timeframe=${encodeURIComponent(timeframe)}` : '') +
                (episode ? `&episode=${encodeURIComponent(episode)}` : '');
    }

    getCurrentTimeframe() {
        const timeframes = constants.TABLE_TIMEFRAMES[this.props.type];
        return this.state.currentTimeframe || timeframes && Object.keys(timeframes)[0] || null;
    }

    startLoadingData() {
        if (this.state.xhr) {
            this.state.xhr.abort();
        }

        const timeframe = this.getCurrentTimeframe();

        const req = xhr({
            method: 'get',
            url: this.getLoadURL(timeframe),
        }, (err, res, body) => {
            const data = JSON.parse(body);
            this.setState({
                data,
                timeframe,
                xhr: null,
            });
        });
        this.setState({xhr: req});
    }

    renderTimeframeSelector() {
        const {
            props: {type},
            state: {granularity, timeframe},
        } = this;

        const timeframes = constants.TABLE_TIMEFRAMES[type];
        const granularities = constants.TABLE_GRANULARITIES[type];

        return (timeframes || granularities) &&
            <div style={{marginTop: 30, textAlign: 'center'}}>
                {timeframes &&
                    <ChartOptionSelector
                        defaultSelection={timeframe}
                        onChange={value => {
                            this.setState(
                                {data: null, timeframe: value},
                                () => this.startLoadingData()
                            );
                        }}
                        options={timeframes}
                    />}
                {granularities &&
                    <ChartOptionSelector
                        defaultSelection={granularity}
                        onChange={value => {
                            this.setState(
                                {data: null, granularity: value},
                                () => this.startLoadingData()
                            );
                        }}
                        options={granularities}
                    />}
            </div>;
    }

    render() {
        return this.state.data ?
            this.renderBody() :
            <div style={{padding: '100px 0', textAlign: 'center'}}>
                <Spinner />
            </div>;
    }

};
