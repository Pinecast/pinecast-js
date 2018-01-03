import * as React from 'react';

import TimeSeriesChartBody from './TimeSeriesChartBody';

export default class AreaChartBody extends TimeSeriesChartBody {
  getYDomain() {
    const {data} = this.props;
    return [
      0,
      Math.max(
        0,
        ...data.labels.map((_, i) =>
          data.datasets.reduce((acc, cur) => acc + (cur.data[i - (data.labels.length - cur.data.length)] || 0), 0),
        ),
      ),
    ];
  }

  renderLines(data, xRange, yRange) {
    const {height, hovering, width} = this.props;
    const {marginBottom, marginLeft, marginRight, xAxisHeight} = this.getMargins();

    const totals = data.labels.map(() => 0);

    return (
      <g className="lines">
        {data.datasets
          .map((dataset, idx) => {
            const points = data.labels
              .map((_, i) => {
                const start = totals[i];
                const value = dataset.data[i - (data.labels.length - dataset.data.length)] || 0;
                totals[i] += value;
                return `${xRange(i)},${yRange(value + start)}`;
              })
              .join(' ');
            return (
              <g key={idx}>
                <polyline
                  className="chart-line-stroke"
                  fill="transparent"
                  points={points}
                  stroke={dataset.strokeColor}
                  strokeWidth={2}
                />
                <polyline
                  className="chart-line-fill"
                  fill={hovering === idx ? dataset.strokeColor : dataset.pointColor}
                  points={
                    points +
                    ` ${width - marginRight},${height - marginBottom - xAxisHeight} ` +
                    `${marginLeft},${height - marginBottom - xAxisHeight}`
                  }
                />
              </g>
            );
          })
          .reverse()}
      </g>
    );
  }
}
