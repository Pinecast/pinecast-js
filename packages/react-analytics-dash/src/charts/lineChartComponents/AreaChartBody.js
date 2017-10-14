import * as spline from '@yr/monotone-cubic-spline';
import React, {Component} from 'react';

import LineChartBody from './LineChartBody';

export default class AreaChartBody extends LineChartBody {
  getYDomain() {
    const {data} = this.props;
    return [
      0,
      Math.max(
        ...data.labels.map((_, i) =>
          data.datasets.reduce((acc, cur) => acc + cur.data[i - (data.labels.length - cur.data.length)] || 0, 0),
        ),
      ),
    ];
  }

  renderLines(data, xRange, yRange) {
    const {height, hovering, width} = this.props;
    const {marginBottom, marginLeft, marginRight, xAxisHeight} = this.getMargins();

    const keys = data.datasets.map((_, i) => `key_${i}`);
    const blob = data.labels.map((_, i) =>
      data.datasets.reduce((acc, cur, idx) => {
        acc[`key_${idx}`] = cur.data[i];
        return acc;
      }, {}),
    );

    const totals = data.labels.map(_ => 0);

    return (
      <g className="lines">
        {data.datasets
          .map((dataset, idx) => {
            return (
              <path
                className="chart-line"
                d={
                  spline.svgPath(
                    spline.points(
                      data.labels.map((_, i) => {
                        const start = totals[i];
                        const value = dataset.data[i - (data.labels.length - dataset.data.length)] || 0;
                        totals[i] += value;
                        return [xRange(i), yRange(value + start)];
                      }),
                    ),
                  ) +
                  `L${width - marginRight}, ${height - marginBottom - xAxisHeight}` +
                  `L${marginLeft}, ${height - marginBottom - xAxisHeight} Z`
                }
                fill={hovering === idx ? dataset.strokeColor : dataset.pointColor}
                key={idx}
                stroke={dataset.strokeColor}
                strokeWidth={2}
              />
            );
          })
          .reverse()}
      </g>
    );
  }
}
