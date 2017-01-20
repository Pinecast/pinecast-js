import React from 'react';

import xhr from 'pinecast-xhr';

import AreaChartBody from './lineChartComponents/AreaChartBody';
import BaseChart from './BaseChart';
import ChartEmptyState from './ChartEmptyState';
import ChartOptionSelector from '../optionSelector';
import LineChartBody from './lineChartComponents/LineChartBody';


const durations = {
    day: 1,
    week: 7,
    month: 30,
    sixmonth: 30 * 6,
    year: 365,
    all: null,
};


export default class LineChart extends BaseChart {
    constructor(...args) {
        super(...args);
        this.state = {
            ...this.state,

            episodeListXHR: null,
            episodeList: null,

            width: null,

            displayType: 'line',
        };

        this.wrapper = null;
        this.widthCalcer = null;
    }

    componentDidMount() {
        super.componentDidMount();
        this.widthCalcer = setInterval(() => this.calcWidth(), 250);
        this.calcWidth();
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.state.episodeListXHR) {
            this.state.episodeListXHR.abort();
        }
        clearInterval(this.widthCalcer);
    }

    calcWidth() {
        if (!this.wrapper) {
            return;
        }
        const width = this.wrapper.clientWidth;
        if (width !== this.state.width) {
            this.setState({width});
        }
    }

    getStartDate() {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - durations[this.getCurrentTimeframe()]);
        return startDate;
    }

    getGranularities() {
        const sup = super.getGranularities();
        if (!sup) {
            return null;
        }
        const {timeframe} = this.state;
        if (timeframe === 'day') {
            return {'hourly': sup.hourly};
        }
        if (timeframe === 'all') {
            return {'monthly': sup.monthly};
        }

        delete sup.hourly;

        if (timeframe === 'week') {
            delete sup.monthly;
        } else if (timeframe === 'year') {
            delete sup.daily;
        }
        return sup;
    }

    startLoadingData() {
        super.startLoadingData();

        if (this.state.episodeListXHR) {
            this.state.episodeListXHR.abort();
        }

        const {podcast, extra} = this.props;
        const startDate = this.getStartDate();
        const episodeListXHR = xhr({
            method: 'get',
            url: '/dashboard/services/get_episodes?' +
                (podcast ? `podcast=${encodeURIComponent(podcast)}&` : '') +
                (extra ? `${extra}&` : '') +
                `start_date=${startDate.toISOString().replace(/\.\d+Z$/, '')}`, // Fuck off, milliseconds
        }, (err, res, body) => {
            const episodeList = JSON.parse(body);
            this.setState({episodeListXHR: null, episodeList});
        });

        this.setState({episodeListXHR});
    }

    renderData() {
        const {
            state: {data, displayType, width},
        } = this;
        if (!data || data.datasets.every(ds => !ds.data.length)) {
            return <ChartEmptyState />;
        }

        return <div>
            {displayType === 'line' &&
                <LineChartBody
                    data={data}
                    height={300}
                    width={width || 0}
                />}
            {displayType === 'area' &&
                <AreaChartBody
                    data={data}
                    height={300}
                    width={width || 0}
                />}
        </div>;
    }
    renderLegend() {
        const {
            state: {data},
        } = this;

        if (!data || data.datasets.length < 2) {
            return null;
        }

        return <div>
            {data.datasets.map((x, i) =>
                <div key={i}>
                    <b
                        style={{
                            background: x.strokeColor,
                            borderRadius: 2,
                            display: 'inline-block',
                            height: 10,
                            marginRight: 10,
                            width: 10,
                        }}
                    />
                    {x.label}
                </div>)}
        </div>;
    }

    renderTimeframeSelectorExtra() {
        const {
            state: {data, displayType},
        } = this;

        if (!data || data.datasets.length < 2) {
            return null;
        }

        return <ChartOptionSelector
            defaultSelection={displayType}
            onChange={value => this.setState({displayType: value})}
            options={{
                area: gettext('Area'),
                line: gettext('line'),
            }}
        />;
    }

    renderBody() {
        return <div
            ref={e => {
                this.wrapper = e;
                this.calcWidth();
            }}
        >
            {this.renderTimeframeSelector()}
            {this.renderData()}
            {this.renderLegend()}
        </div>;
    }
};
