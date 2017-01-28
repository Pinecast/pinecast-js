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

            width: 200,

            displayType: 'line',
            selectedSeries: null,
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
        const supRaw = super.getGranularities();
        if (!supRaw) {
            return null;
        }
        const {timeframe} = this.state;
        if (timeframe === 'day') {
            return {'hourly': supRaw.hourly};
        }
        if (timeframe === 'week') {
            return {'daily': supRaw.daily};
        }
        if (timeframe === 'all') {
            return {'monthly': supRaw.monthly};
        }

        const sup = {...supRaw};
        delete sup.hourly;

        if (timeframe === 'year') {
            delete sup.daily;
        } else if (timeframe === 'month') {
            delete sup.month;
        }
        return sup;
    }

    startLoadingData() {
        super.startLoadingData();

        if (this.state.episodeListXHR) {
            this.state.episodeListXHR.abort();
        }

        const {podcast, network} = this.props;
        const startDate = this.getStartDate();
        const episodeListXHR = xhr({
            method: 'get',
            url: '/dashboard/services/get_episodes?' +
                (podcast ? `podcast=${encodeURIComponent(podcast)}&` : '') +
                (network ? `network_id=${encodeURIComponent(network)}&` : '') +
                `start_date=${startDate.toISOString().replace(/\.\d+Z$/, '')}`, // Fuck off, milliseconds
        }, (err, res, body) => {
            const episodeList = JSON.parse(body);
            this.setState({episodeListXHR: null, episodeList});
        });

        this.setState({episodeListXHR});
    }

    gotData(data) {
        this.setState({selectedSeries: [...new Array(data.datasets.length)].fill(true)});
    }

    renderData() {
        const {
            state: {data, displayType, episodeList, selectedSeries, width},
        } = this;
        if (!data || data.datasets.every(ds => !ds.data.length)) {
            return <ChartEmptyState />;
        }

        const startDate = this.getStartDate();
        const filteredData = selectedSeries.every(x => x) ?
            data :
            {
                ...data,
                datasets: data.datasets.filter((_, i) => selectedSeries[i]),
            };
        return <div>
            {displayType === 'line' &&
                <LineChartBody
                    data={filteredData}
                    episodeList={episodeList}
                    height={300}
                    startDate={startDate}
                    width={width || 0}
                />}
            {displayType === 'area' &&
                <AreaChartBody
                    data={filteredData}
                    episodeList={episodeList}
                    height={300}
                    startDate={startDate}
                    width={width || 0}
                />}
        </div>;
    }
    renderLegend() {
        const {
            state: {data, selectedSeries},
        } = this;

        if (!data || data.datasets.length < 2) {
            return null;
        }

        return <div>
            {data.datasets.map((x, i) =>
                <div
                    key={i}
                    onClick={() => {
                        const newSelection = [...selectedSeries];
                        newSelection[i] = !newSelection[i];
                        this.setState({selectedSeries: newSelection});
                    }}
                >
                    <b
                        style={{
                            background: selectedSeries[i] ? x.strokeColor : '#fff',
                            border: `1px solid ${x.strokeColor}`,
                            borderRadius: 2,
                            display: 'inline-block',
                            height: 8,
                            marginRight: 10,
                            width: 8,
                        }}
                    />
                    <span style={{opacity: selectedSeries[i] ? 1 : 0.5}}>
                        {x.label}
                    </span>
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
