import React from 'react';

import {gettext} from 'pinecast-i18n';
import xhr from 'pinecast-xhr';

import AreaChartBody from './lineChartComponents/AreaChartBody';
import BaseChart from './BaseChart';
import ChartEmptyState from './ChartEmptyState';
import ChartOptionSelector from '../optionSelector';
import * as constants from '../constants';
import CSVLink from '../CSVLink';
import Legend from './lineChartComponents/Legend';
import LineChartBody from './lineChartComponents/LineChartBody';

export default class LineChart extends BaseChart {
  constructor(...args) {
    super(...args);
    this.state = {
      ...this.state,

      episodeListXHR: null,
      episodeList: null,

      width: 200,

      displayType: constants.LINE_CHART_DEFAULT_DISPLAY_OVERRIDE[this.props.type] || 'line',
      selectedSeries: null,
      showEpisodes: true,

      hoveringSeries: null,
    };

    this.wrapper = null;
    this.widthCalcer = null;
  }

  componentDidMount() {
    super.componentDidMount();
    this.widthCalcer = setInterval(() => this.calcWidth(), 250);
    this.calcWidth();
  }

  componentWillReceiveProps(newProps) {
    super.componentWillReceiveProps(newProps);
    const {type: newType} = newProps;
    if (newType !== this.props.type) {
      if (newType in constants.LINE_CHART_DEFAULT_DISPLAY_OVERRIDE) {
        this.setState({displayType: constants.LINE_CHART_DEFAULT_DISPLAY_OVERRIDE[newType]});
      } else {
        this.setState({displayType: 'line'});
      }
    }
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

  getGranularities() {
    const {timeframe} = this.state;
    if (timeframe === 'custom') {
      const out = {
        daily: constants.DEFAULT_GRANULARITIES.daily,
      };
      const {customTimeframe: [startDate, endDate]} = this.state;
      if (endDate - startDate < 86400 * 3 * 1000) {
        out.hourly = constants.DEFAULT_GRANULARITIES.hourly;
      }
      if (endDate - startDate > 86400 * 7 * 1000) {
        out.weekly = constants.DEFAULT_GRANULARITIES.weekly;
      }
      if (endDate - startDate > 86400 * 30 * 1000) {
        out.monthly = constants.DEFAULT_GRANULARITIES.monthly;
      }
      return out;
    }

    const supRaw = super.getGranularities();
    if (!supRaw) {
      return null;
    }
    if (timeframe === 'day') {
      return {hourly: supRaw.hourly};
    }
    if (timeframe === 'week') {
      return {daily: supRaw.daily};
    }
    if (timeframe === 'all') {
      return {monthly: supRaw.monthly, weekly: supRaw.weekly};
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
    const currentTimeframe = this.getCurrentTimeframe();
    const episodeListXHR = xhr(
      {
        method: 'get',
        url:
          '/dashboard/services/get_episodes?' +
          (podcast ? `podcast=${encodeURIComponent(podcast)}&` : '') +
          (network ? `network_id=${encodeURIComponent(network)}&` : '') +
          `start_date=${startDate.toISOString().replace(/\.\d+Z$/, '')}` + // Fuck off, milliseconds
          (currentTimeframe === 'custom'
            ? `&end_date=${this.state.customTimeframe[1].toISOString().replace(/\.\d+Z$/, '')}`
            : ''),
      },
      (err, res, body) => {
        const episodeList = JSON.parse(body);
        this.setState({episodeListXHR: null, episodeList});
      },
    );

    this.setState({episodeListXHR});
  }

  gotData(data) {
    this.setState({selectedSeries: data.datasets.map(() => true)});
  }

  renderData() {
    const {state: {data, displayType, episodeList, hoveringSeries, selectedSeries, showEpisodes, width}} = this;
    if (!data || data.datasets.every(ds => !ds.data.length)) {
      return <ChartEmptyState />;
    }

    const startDate = this.getStartDate();
    const endDate = this.getCurrentTimeframe() === 'custom' ? this.state.customTimeframe[1] : new Date();
    const filteredData = (selectedSeries || []).every(x => x)
      ? data
      : {
          ...data,
          datasets: data.datasets.filter((_, i) => selectedSeries[i]),
        };
    return (
      <div>
        {displayType === 'line' && (
          <LineChartBody
            data={filteredData}
            endDate={endDate}
            episodeList={showEpisodes ? episodeList : null}
            hovering={hoveringSeries}
            height={300}
            startDate={startDate}
            width={width || 0}
          />
        )}
        {displayType === 'area' && (
          <AreaChartBody
            data={filteredData}
            endDate={endDate}
            episodeList={showEpisodes ? episodeList : null}
            hovering={hoveringSeries}
            height={300}
            startDate={startDate}
            width={width || 0}
          />
        )}
      </div>
    );
  }

  renderCSVLink() {
    const {data: {datasets, labels}} = this.state;
    const data = [
      ['Timestamp', ...datasets.map(d => d.label)],
      ...labels.map((label, i) => [label, ...datasets.map(d => d.data[labels.length - d.data.length + i])]),
    ];
    return <CSVLink data={data}>{gettext('CSV')}</CSVLink>;
  }

  renderTimeframeSelectorExtra() {
    const {state: {data, displayType, showEpisodes}} = this;

    if (!data || !data.datasets.length) {
      return null;
    }

    const out = [
      <label
        key="eptog"
        style={{
          display: 'inline-block',
        }}
      >
        <input
          checked={showEpisodes}
          onChange={e => this.setState({showEpisodes: e.target.checked})}
          style={{
            border: '1px solid #ccc',
            borderRadius: 3,
            display: 'inline-block',
            float: 'none',
            height: 13,
            margin: 0,
            verticalAlign: 'middle',
            width: 13,
          }}
          type="checkbox"
        />
        <span
          style={{
            display: 'inline-block',
            marginLeft: 5,
          }}
        >
          {gettext('Episodes')}
        </span>
      </label>,
      Boolean(data) && React.cloneElement(this.renderCSVLink(), {key: 'csv-link'}),
    ];

    if (!data || data.datasets.length < 2) {
      return out;
    }

    return [
      <ChartOptionSelector
        defaultSelection={displayType}
        key="tfsel"
        onChange={value => this.setState({displayType: value})}
        options={{
          area: gettext('Area'),
          line: gettext('line'),
        }}
      />,
      ...out,
    ];
  }

  renderBody() {
    const {props: {type}, state: {data, hoveringSeries, selectedSeries}} = this;

    return (
      <div
        ref={e => {
          this.wrapper = e;
          this.calcWidth();
        }}
      >
        {this.renderTimeframeSelector()}
        {this.renderData()}
        <Legend
          data={data}
          hovering={hoveringSeries}
          onHover={i => {
            this.setState({hoveringSeries: i});
          }}
          onToggle={i => {
            const newSelection = [...selectedSeries];
            newSelection[i] = !newSelection[i];
            this.setState({selectedSeries: newSelection});
          }}
          selectedSeries={selectedSeries}
          type={type}
        />
      </div>
    );
  }
}
