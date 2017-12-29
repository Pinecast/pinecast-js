import * as React from 'react';
import SimplePieChart from 'react-simple-pie-chart';

import {gettext} from 'pinecast-i18n';

import BaseChart from './BaseChart';
import ChartEmptyState from './ChartEmptyState';
import CSVLink from '../CSVLink';

export default class PieChart extends BaseChart {
  renderTimeframeSelectorExtra() {
    const data = [['Type', 'Count'], ...this.state.data.map(d => [d.label, d.value])];
    return <CSVLink data={data}>{gettext('CSV')}</CSVLink>;
  }

  renderData() {
    const {data} = this.state;
    if (!data || !data.length) {
      return <ChartEmptyState />;
    }
    const total = data.reduce((acc, cur) => acc + cur.value, 0);
    return (
      <figure>
        <div style={{height: 300, width: 300, margin: 'auto'}}>
          <SimplePieChart
            slices={data.map(x => ({
              value: x.value,
              color: x.color,
            }))}
          />
        </div>
        <figcaption style={{marginTop: 15}}>
          {data.map((x, i) => (
            <div key={i}>
              <b
                style={{
                  background: x.color,
                  borderRadius: 2,
                  display: 'inline-block',
                  height: 10,
                  marginRight: 10,
                  width: 10,
                }}
              />
              {`${x.label} (${x.value}; ${(x.value / total * 100).toFixed(1)}%)`}
            </div>
          ))}
        </figcaption>
      </figure>
    );
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
