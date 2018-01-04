import * as React from 'react';

import TimeSeriesChartBody from './TimeSeriesChartBody';

export default class AreaChartBody extends TimeSeriesChartBody {
  getYDomain() {
    const {data, selectedSeries} = this.props;
    return [
      0,
      Math.max(
        0,
        0,
        ...data.labels.map((_, i) =>
          data.datasets
            .filter((_, i) => selectedSeries[i])
            .reduce((acc, cur) => acc + (cur.data[i - (data.labels.length - cur.data.length)] || 0), 0),
        ),
      ),
    ];
  }

  renderLines(data, xRange, yRange) {
    const {height, hovering, selectedSeries, width} = this.props;
    const {marginBottom, marginLeft, marginRight, xAxisHeight} = this.getMargins();

    const totals = data.labels.map(() => 0);

    const taggedDatasets = data.datasets.map((d, i) => [d, i]);
    const filteredDatasets = taggedDatasets.filter(x => selectedSeries[x[1]]);

    const points = filteredDatasets.map(([dataset]) =>
      data.labels.map((_, i) => {
        const start = totals[i];
        const value = dataset.data[i - (data.labels.length - dataset.data.length)] || 0;
        totals[i] += value;
        return `${xRange(i)},${yRange(value + start)}`;
      }),
    );

    function getPathRemainder(idx) {
      if (!idx) {
        return (
          `${width - marginRight},${height - marginBottom - xAxisHeight} ` +
          `${marginLeft},${height - marginBottom - xAxisHeight}`
        );
      }
      return points[idx - 1]
        .slice()
        .reverse()
        .join(' ');
    }

    return filteredDatasets
      .map(([dataset, idx], i) => {
        const renderedPoints = points[i].join(' ');
        const active = hovering === idx;
        return (
          <React.Fragment key={idx}>
            <polyline
              className="chart-line-stroke"
              fill="transparent"
              points={renderedPoints}
              stroke={dataset.strokeColor}
              strokeWidth={2}
            />
            <polyline
              className="chart-line-fill"
              fill={active ? dataset.strokeColor : dataset.pointColor}
              fillOpacity={active ? 0.8 : 0.4}
              points={renderedPoints + ' ' + getPathRemainder(i)}
            />
          </React.Fragment>
        );
      })
      .reverse();
  }
}
