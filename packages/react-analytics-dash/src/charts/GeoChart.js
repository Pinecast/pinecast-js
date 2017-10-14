import {Chart} from 'react-google-charts';
import React from 'react';

import BaseChart from './BaseChart';
import ChartEmptyState from './ChartEmptyState';
import CSVLink from '../CSVLink';

export default class GeoChart extends BaseChart {
  renderData() {
    if (!this.state.data || !this.state.data.length) {
      return <ChartEmptyState />;
    }
    return (
      <Chart
        chartType="GeoChart"
        data={this.state.data}
        height="600px"
        options={{
          height: '600px',
          width: null,
        }}
        width={null}
      />
    );
  }

  renderTimeframeSelectorExtra() {
    if (!this.state.data || !this.state.data.length) {
      return null;
    }
    return <CSVLink data={this.state.data}>CSV</CSVLink>;
  }

  renderBody() {
    return (
      <div>
        {this.renderTimeframeSelector()}
        {this.renderData()}
      </div>
    );
  }
}
