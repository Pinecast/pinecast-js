import * as React from 'react';

import {gettext} from 'pinecast-i18n';
import xhr from 'pinecast-xhr';

import AreaChartBody from './lineChartComponents/AreaChartBody';
import ChartEmptyState from './ChartEmptyState';
import ChartOptionSelector from '../optionSelector';
import * as constants from '../constants';
import CSVLink from '../CSVLink';
import LineChart from './LineChart';
import TimeSeriesChartBody from './lineChartComponents/TimeSeriesChartBody';

export default class TimeSeriesChart extends LineChart {
  constructor(...args) {
    super(...args);
    this.state = {
      ...this.state,

      episodeListXHR: null,
      episodeList: null,

      displayType: constants.LINE_CHART_DEFAULT_DISPLAY_OVERRIDE[this.props.type] || 'line',
      showEpisodes: true,
    };
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

  renderData() {
    const {
      state: {data, displayType, episodeList, hoveringSeries, selectedSeries, showEpisodes, width},
    } = this;
    if (!data || data.datasets.every(ds => !ds.data.length)) {
      return <ChartEmptyState />;
    }

    const startDate = this.getStartDate();
    const endDate =
      this.getCurrentTimeframe() === 'custom' ? this.state.customTimeframe[1] : new Date();

    const props = {
      data,
      endDate,
      episodeList: showEpisodes ? episodeList : null,
      hovering: hoveringSeries,
      height: 300,
      selectedSeries,
      startDate,
      width: width || 0,
    };
    switch (displayType) {
      case 'line':
        return <TimeSeriesChartBody {...props} />;
      case 'area':
        return <AreaChartBody {...props} />;
      default:
        throw new Error(`Unknown chart type "${displayType}"`);
    }
  }

  renderCSVLink() {
    const {data: {datasets, labels}} = this.state;
    const data = [
      ['Timestamp', ...datasets.map(d => d.label)],
      ...labels.map((label, i) => [
        label,
        ...datasets.map(d => d.data[labels.length - d.data.length + i]),
      ]),
    ];
    return <CSVLink data={data}>{gettext('CSV')}</CSVLink>;
  }

  handleShowEpisodesChange = e => {
    this.setState({showEpisodes: e.target.checked});
  };
  handleChartOptionSelectorChange = value => {
    this.setState({displayType: value});
  };

  renderTimeframeSelectorExtra() {
    const {state: {data, displayType, showEpisodes}} = this;

    if (!data || !data.datasets.length) {
      return null;
    }

    const out = (
      <React.Fragment>
        <label style={{display: 'inline-block'}}>
          <input
            checked={showEpisodes}
            onChange={this.handleShowEpisodesChange}
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
        </label>
        {Boolean(data) && this.renderCSVLink()}
      </React.Fragment>
    );

    if (!data || data.datasets.length < 2) {
      return out;
    }

    return (
      <React.Fragment>
        <ChartOptionSelector
          defaultSelection={displayType}
          onChange={this.handleChartOptionSelectorChange}
          options={{
            area: gettext('Area'),
            line: gettext('line'),
          }}
        />
        {out}
      </React.Fragment>
    );
  }
}
