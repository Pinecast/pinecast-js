import moment from 'moment';
import React, {Component} from 'react';

import Spinner from 'pinecast-spinner';
import xhr from 'pinecast-xhr';

import ChartOptionSelector from '../optionSelector';
import DateRangePicker from '../DateRangePicker';
import * as constants from '../constants';

const durations = {
  day: 1,
  week: 7,
  month: 30,
  sixmonth: 30 * 6,
  year: 365,
  all: 365,
};

export default class BaseChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      xhr: null,

      granularity: null,
      timeframe: null,
      customTimeframe: null,
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
      () => this.startLoadingData(),
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
    const {props: {episode, network, podcast}, state: {customTimeframe}} = this;

    return (
      `${this.getBaseLoadURL()}?` +
      (episode ? `episode=${encodeURIComponent(episode)}&` : '') +
      (granularity ? `interval=${encodeURIComponent(granularity)}&` : '') +
      (network ? `network_id=${encodeURIComponent(network)}&` : '') +
      (podcast ? `podcast=${encodeURIComponent(podcast)}&` : '') +
      (timeframe ? `timeframe=${encodeURIComponent(timeframe)}&` : '') +
      (timeframe === 'custom'
        ? `tf_range=${encodeURIComponent(customTimeframe.map(x => x.toISOString()).join(','))}`
        : '')
    );
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

    if (keys.includes(constants.DEFAULT_TIMEFRAME)) {
      return constants.DEFAULT_TIMEFRAME;
    }

    return keys[keys.length - 1];
  }

  getCurrentGranularity() {
    const granularities = this.getGranularities();
    if (!granularities) {
      return null;
    }

    const {granularity} = this.state;
    if (granularity && granularity in granularities) {
      return granularity;
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
    const {customTimeframe} = this.state;
    const timeframe = this.getCurrentTimeframe();

    if (timeframe === 'custom' && (!customTimeframe[0] || !customTimeframe[1])) {
      return;
    }

    if (this.state.xhr) {
      this.state.xhr.abort();
    }

    const granularity = this.getCurrentGranularity();

    const req = xhr(
      {
        method: 'get',
        url: this.getLoadURL(timeframe, granularity),
      },
      (err, res, body) => {
        const data = JSON.parse(body);
        this.setState({
          data,
          granularity,
          timeframe,
          xhr: null,
          ...this.gotData(data),
        });
      },
    );
    this.setState({xhr: req});
  }

  gotData() {}

  getTimeframes() {
    const {type} = this.props;
    return constants.TYPE_TIMEFRAMES[type] || constants.DEFAULT_TIMEFRAMES;
  }

  getGranularities() {
    const {type} = this.props;
    return constants.TYPE_GRANULARITIES[type];
  }

  getStartDate(timeframe = this.getCurrentTimeframe()) {
    if (timeframe === 'custom') {
      return this.state.customTimeframe[0];
    }
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - durations[timeframe]);
    return startDate;
  }

  getCustomTimeframeFromNow(timeframe) {
    return [
      moment(this.getStartDate(timeframe))
        .startOf('day')
        .toDate(),
      moment()
        .endOf('day')
        .toDate(),
    ];
  }

  setTimeframe(newTimeframe, cb) {
    const {timeframe} = this.state;
    this.setState(
      {
        data: null,
        timeframe: newTimeframe,
        customTimeframe:
          newTimeframe === 'custom' ? this.getCustomTimeframeFromNow(timeframe) : null,
      },
      cb,
    );
  }

  handleTimeframeChanged = value => {
    this.setTimeframe(value, () => this.startLoadingData());
  };
  handleGranularityChanged = value => {
    this.setState({data: null, granularity: value}, () => this.startLoadingData());
  };

  isDateOutsideRange = day =>
    moment(this.state.customTimeframe[0])
      .add(365, 'days')
      .isBefore(day) ||
    moment(this.state.customTimeframe[1])
      .subtract(365, 'days')
      .isAfter(day) ||
    day.isAfter(
      moment()
        .startOf('day')
        .add(1, 'days'),
    );
  handleCustomDatesChanged = ({startDate, endDate}) => {
    if (!startDate || !endDate) {
      return;
    }
    this.setState({customTimeframe: [startDate.toDate(), endDate.toDate()]}, () =>
      this.startLoadingData(),
    );
  };

  renderTimeframeSelector() {
    const timeframes = this.getTimeframes();
    const granularities = this.getGranularities();

    const {customTimeframe, granularity, timeframe} = this.state;

    const extra = this.renderTimeframeSelectorExtra();

    return (
      Boolean(timeframes || granularities || extra) && (
        <div style={{marginTop: 30, textAlign: 'center'}}>
          {timeframes && (
            <ChartOptionSelector
              defaultSelection={timeframe}
              onChange={this.handleTimeframeChanged}
              options={timeframes}
            />
          )}
          {granularities && (
            <ChartOptionSelector
              defaultSelection={granularity}
              onChange={this.handleGranularityChanged}
              options={granularities}
            />
          )}
          {extra}
          {this.getCurrentTimeframe() === 'custom' && (
            <DateRangePicker
              endDate={moment(customTimeframe[1])}
              isOutsideRange={this.isDateOutsideRange}
              onDatesChange={this.handleCustomDatesChanged}
              startDate={moment(customTimeframe[0])}
            />
          )}
        </div>
      )
    );
  }

  renderTimeframeSelectorExtra() {}

  handleTooltipWrapperRef = e => this.bindTooltips(e);
  handleTooltipRef = e => {
    this.tooltip = e;
  };

  render() {
    return this.state.data ? (
      <div ref={this.handleTooltipWrapperRef}>
        {this.renderBody()}
        <div
          ref={this.handleTooltipRef}
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '3px',
            boxShadow: '0 2px 1px rgba(0, 0, 0, 0.1)',
            display: 'none',
            padding: '5px 10px',
            pointerEvents: 'none',
            position: 'fixed',
            transition: 'left 0.05s, top 0.05s',
            zIndex: '100',
          }}
        />
      </div>
    ) : (
      <div style={{padding: '100px 0', textAlign: 'center'}}>
        <Spinner />
      </div>
    );
  }

  bindTooltips(elem) {
    if (!elem) {
      return;
    }

    let shown = false;
    elem.addEventListener(
      'mouseenter',
      e => {
        if (!this.tooltip) {
          return;
        }
        if (e.target.getAttribute('class') !== 'has-tooltip') {
          return;
        }
        const tooltip = this.tooltip;
        tooltip.style.display = 'block';
        tooltip.innerHTML = e.target.getAttribute('data-tooltip');
        shown = true;
      },
      true,
    );

    elem.addEventListener(
      'mouseout',
      e => {
        if (!this.tooltip) {
          return;
        }
        let node = e.target;
        do {
          if (node === document.body) {
            return;
          }
          if (node.getAttribute('class') === 'has-tooltip') {
            break;
          }
          node = node.parentNode;
        } while (node);
        if (!node) {
          return;
        }
        this.tooltip.style.display = 'none';
        shown = false;
      },
      true,
    );

    elem.addEventListener(
      'mousemove',
      e => {
        if (!shown || !this.tooltip) {
          return;
        }
        if (e.clientX + this.tooltip.clientWidth + 16 > document.body.clientWidth) {
          this.tooltip.style.left = `${e.clientX - this.tooltip.clientWidth - 10}px`;
        } else {
          this.tooltip.style.left = `${e.clientX + 16}px`;
        }
        this.tooltip.style.top = `${e.clientY}px`;
      },
      true,
    );
  }
}
