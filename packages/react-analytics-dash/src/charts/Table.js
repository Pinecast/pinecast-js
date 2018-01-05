import * as React from 'react';

import BaseChart from './BaseChart';
import ChartEmptyState from './ChartEmptyState';
import CSVLink from '../CSVLink';

export default class Table extends BaseChart {
  renderBody() {
    const {state: {data}} = this;

    return (
      <div>
        {this.renderTimeframeSelector()}
        {this.renderTable(data)}
      </div>
    );
  }

  renderTable(data) {
    if (!data || data.length < 2) {
      return <ChartEmptyState />;
    }
    return (
      <table>
        <thead>
          <tr>{data[0].map((header, i) => <th key={i}>{header}</th>)}</tr>
        </thead>
        <thead>
          {data
            .slice(1)
            .map((row, i) => (
              <tr key={i}>{row.map((value, i) => <td key={i}>{this.renderCell(value)}</td>)}</tr>
            ))}
        </thead>
      </table>
    );
  }

  renderCell(value) {
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }

    const formattedValue = value.title;

    if (value.href) {
      return <a href={value.href}>{formattedValue}</a>;
    }

    return formattedValue;
  }

  renderTimeframeSelectorExtra() {
    if (!this.state.data || !this.state.data.length) {
      return null;
    }
    return <CSVLink data={this.state.data}>CSV</CSVLink>;
  }
}
