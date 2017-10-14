import React, {Component} from 'react';

import ChartOptionSelector from './optionSelector';

export default class TimeframeAndIntervalSelector extends Component {
  render() {
    return (
      <div style={{textAlign: 'center', display: 'inline-block'}}>
        {this.renderGranularity()}
        {this.renderTimeframe()}
      </div>
    );
  }

  renderGranularity() {
    if (this.props.hideGranularity || this.props.chartType !== 'line') {
      return null;
    }
    return (
      <ChartOptionSelector
        onChange={this.props.onGranularityChanged}
        options={this.props.granularities}
        defaultSelection={this.props.granularity}
      />
    );
  }

  renderTimeframe() {
    if (this.props.hideTimeframe) {
      return null;
    }
    return (
      <ChartOptionSelector
        onChange={this.props.onTimeframeChanged}
        options={this.props.timeframes}
        defaultSelection={this.props.timeframe}
      />
    );
  }
}
