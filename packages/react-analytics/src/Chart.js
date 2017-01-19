import React from 'react';

import Spinner from 'pinecast-spinner';
import xhr from 'pinecast-xhr';

import {D3Chart} from './d3Chart';
import ChartType from './options/ChartType';
import TimeframeAndInterval from './options/TimeframeAndInterval';


const durations = {
    day: 1,
    month: 30,
    sixmonth: 30 * 6,
    year: 365,
    all: null,
};


export default class ChartComponent extends React.Component {
    static selector = '.chart-placeholder';

    static propExtraction = {
        chartType: e => e.getAttribute('data-chart-type'),
        hideGranularity: e => e.getAttribute('data-hide-granularity'),
        hideTimeframe: e => e.getAttribute('data-hide-timeframe'),
        podcast: e => e.getAttribute('data-podcast'),
        episode: e => e.getAttribute('data-episode'),
        type: e => e.getAttribute('data-type'),
        extra: e => e.getAttribute('data-extra'),
        hasLegend: e => e.getAttribute('data-has-legend') === 'true',
        availableTimeframes: e => e.getAttribute('data-timeframes') || '',
    };

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            episodeData: null,
            xhrAnalytics: null,
            xhrEpisodes: null,

            chart: null,

            chartType: 'line',
            granularity: 'daily',
            timeframe: 'month',
        };
    }

    componentDidMount() {
        setTimeout(this.startLoadingData.bind(this), Math.random() * 500);
    }
    componentWillReceiveProps() {
        this.killXHRs();
        this.cleanSurface();
        this.setState({
            chart: null,
            data: null,
            episodeData: null,

            chartType: 'line',
            granularity: 'daily',
            timeframe: 'month',
        }, () => this.startLoadingData());
    }
    componentWillUnmount() {
        this.killXHRs();
    }

    killXHRs() {
        if (this.state.xhrAnalytics) {
            this.state.xhrAnalytics.abort();
        }
        if (this.state.xhrEpisodes) {
            this.state.xhrEpisodes.abort();
        }
        this.setState({xhrAnalytics: null, xhrEpisodes: null});
    }

    granularityChanged(newGranularity) {
        this.killXHRs();
        this.cleanSurface();
        this.setState({granularity: newGranularity, xhrAnalytics: null, xhrEpisodes: null, data: null, episodeData: null});
        setTimeout(this.startLoadingData.bind(this), 0);
    }
    timeframeChanged(newTimeframe) {
        this.killXHRs();
        this.cleanSurface();
        this.setState({timeframe: newTimeframe, xhrAnalytics: null, xhrEpisodes: null, data: null, episodeData: null});

        var granularities = this.getGranularities(newTimeframe);
        if (!(this.state.granularity in granularities)) {
            this.setState({granularity: Object.keys(granularities)[0]});
        }
        setTimeout(this.startLoadingData.bind(this), 0);
    }

    chartTypeChanged(type) {
        this.setState({chartType: type});
        if (this.state.chart) {
            setTimeout(this.setUpChart.bind(this), 0);
        }
    }


    getGranularities(newTimeframe) {
        var output = {};
        switch (newTimeframe || this.state.timeframe) {
            case 'day':
                return {hourly: gettext('Hourly')};
            case 'month':
            case 'sixmonth':
                output.daily = gettext('Day');
            case 'year':
                output.weekly = gettext('Week');
            case 'all':
                output.monthly = gettext('Month');
        }

        return output;
    }
    getTimeframes() {
        var tfs = {
            day: gettext('Today'),
            month: gettext('30d'),
            sixmonth: gettext('6m'),
            year: gettext('1y'),
            all: gettext('All'),
        };

        const atsRaw = this.props.availableTimeframes;
        if (!atsRaw) return tfs;

        const ats = atsRaw.split(',');
        if (!ats.length) return tfs;

        Object.keys(tfs).forEach(tf => {
            if (ats.indexOf(tf) === -1) {
                delete tfs[tf];
            }
        });

        return tfs;
    }

    render() {
        return <div style={{boxSizing: 'content-box'}}>
            <div ref='surface'>
                {this.state.data ? null : this.renderSpinner()}
            </div>
            <div className='chart-toolbar' style={{textAlign: 'center'}}>
                <TimeframeAndInterval
                    onGranularityChanged={this.granularityChanged.bind(this)}
                    onTimeframeChanged={this.timeframeChanged.bind(this)}
                    hideGranularity={this.props.hideGranularity}
                    chartType={this.props.chartType}
                    granularity={this.state.granularity}
                    timeframe={this.state.timeframe}
                    granularities={this.getGranularities()}
                    timeframes={this.getTimeframes()} />
                {!this.props.hasLegend ?
                    null :
                    <ChartType
                        onChange={this.chartTypeChanged.bind(this)}
                        chartType={this.state.chartType} />}
            </div>
        </div>;
    }

    renderSpinner() {
        return <div style={{padding: '100px 0', textAlign: 'center'}}>
            <Spinner />
        </div>;
    }

    cleanSurface() {
        const surface = this.refs.surface;
        while (surface.firstChild) {
            surface.removeChild(surface.firstChild);
        }
        return surface;
    }

    setUpChart() {
        const surface = this.cleanSurface();

        let chartType;
        if (this.props.chartType === 'pie') {
            chartType = 'pie';
        } else {
            chartType = this.state.chartType;
        }

        const c = new D3Chart[chartType](this.state.data, surface.clientWidth, this.props.hasLegend);
        if (this.state.episodeData) {
            c.setEpisodeData(this.state.episodeData, this.getStartDate());
        }
        this.setState({chart: c});
        surface.appendChild(c.getNode());
    }

    startLoadingData() {
        const {
            props: {chartType, episode, extra, podcast, type},
            state: {granularity, timeframe},
        } = this;

        const req = xhr({
            method: 'get',
            url: `/analytics/${type}` +
                '?podcast=' + encodeURIComponent(podcast) +
                (episode ? '&episode=' + encodeURIComponent(episode) : '') +
                (extra ? '&' + extra : '') +
                `&interval=${granularity}&timeframe=${timeframe}`,
        }, (err, res, body) => {
            const parsed = JSON.parse(body);
            this.setState({data: parsed, xhrAnalytics: null});

            this.setUpChart();
        });

        this.setState({xhrAnalytics: req});

        if (chartType !== 'line') {
            return;
        }
        this.startLoadingEpisodeData();
    }

    startLoadingEpisodeData() {
        const {
            props: {podcast, extra},
        } = this;

        const startDate = this.getStartDate();

        const req = xhr({
            method: 'get',
            url: `/dashboard/services/get_episodes?` +
                (podcast ? `podcast=${encodeURIComponent(podcast)}&` : '') +
                (extra ? `${extra}&` : '') +
                `start_date=${startDate.toISOString().replace(/\.\d+Z$/, '')}`, // Fuck off, milliseconds
        }, (err, res, body) => {
            const parsed = JSON.parse(body);
            this.setState({episodeData: parsed, xhrEpisodes: null});

            if (this.state.chart) {
                this.state.chart.setEpisodeData(parsed, this.getStartDate());
            }
        });

        this.setState({xhrEpisodes: req});
    }

    getStartDate() {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - durations[this.state.timeframe]);
        return startDate;
    }

};
