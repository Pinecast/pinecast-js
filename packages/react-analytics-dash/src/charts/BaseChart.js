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
    componentWillUnmount() {
        if (this.state.xhr) {
            this.state.xhr.abort();
        }
    }

    getBaseLoadURL() {
        return `/analytics/${this.props.endpoint}`;
    }
    getLoadURL(timeframe, granularity) {
        const {
            props: {episode, network, podcast},
        } = this;

        return `${this.getBaseLoadURL()}?` +
            (episode ? `episode=${encodeURIComponent(episode)}` : '') +
            (granularity ? `interval=${encodeURIComponent(granularity)}&` : '') +
            (network ? `network_id=${encodeURIComponent(network)}&` : '') +
            (podcast ? `podcast=${encodeURIComponent(podcast)}&` : '') +
            (timeframe ? `timeframe=${encodeURIComponent(timeframe)}&` : '');
    }

    getCurrentTimeframe() {
        if (this.state.timeframe) {
            return this.state.timeframe;
        }
        const timeframes = this.getTimeframes();
        if (!timeframes) {
            return null;
        }

        const keys = Object.keys(timeframes);
        if (!keys.length) {
            return null;
        }

        if (keys.indexOf(constants.DEFAULT_TIMEFRAME) !== -1) {
            return constants.DEFAULT_TIMEFRAME;
        }

        return keys[keys.length - 1];
    }


    getCurrentGranularity() {
        if (this.state.granularity) {
            return this.state.granularity;
        }
        const granularities = this.getGranularities();
        if (!granularities) {
            return null;
        }

        const keys = Object.keys(granularities);
        if (!keys.length) {
            return null;
        }

        if (keys.indexOf(constants.DEFAULT_GRANULARITY) !== -1) {
            return constants.DEFAULT_GRANULARITY;
        }

        return keys[keys.length - 1];
    }

    startLoadingData() {
        if (this.state.xhr) {
            this.state.xhr.abort();
        }

        const timeframe = this.getCurrentTimeframe();
        const granularity = this.getCurrentGranularity();

        const req = xhr({
            method: 'get',
            url: this.getLoadURL(timeframe, granularity),
        }, (err, res, body) => {
            const data = JSON.parse(body);
            this.setState({
                data,
                granularity,
                timeframe,
                xhr: null,
            });
        });
        this.setState({xhr: req});
    }

    getTimeframes() {
        const {type} = this.props;
        return constants.TYPE_TIMEFRAMES[type] || constants.DEFAULT_TIMEFRAMES;
    }

    getGranularities() {
        const {type} = this.props;
        return constants.TYPE_GRANULARITIES[type];
    }

    renderTimeframeSelector() {
        const timeframes = this.getTimeframes();
        const granularities = this.getGranularities();

        const {granularity, timeframe} = this.state;

        const extra = this.renderTimeframeSelectorExtra();

        return (timeframes || granularities || extra) &&
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
                {Boolean(extra) && extra}
            </div>;
    }

    renderTimeframeSelectorExtra() {
        return null;
    }

    render() {
        return this.state.data ?
            this.renderBody() :
            <div style={{padding: '100px 0', textAlign: 'center'}}>
                <Spinner />
            </div>;
    }

};
