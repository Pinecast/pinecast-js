import * as React from 'react';

import BaseChartBody from './BaseChartBody';

export default class GrowthChartBody extends BaseChartBody {
  getYDomain() {
    const {data} = this.props;
    return [
      Math.min(0, ...data.datasets.map(ds => Math.min(...ds.data))),
      Math.max(0, ...data.datasets.map(ds => Math.max(...ds.data))),
    ];
  }

  renderLines(data, xRange, yRange) {
    const {hovering, selectedSeries} = this.props;
    // TODO: calculate trendlines?
    return (
      <g className="lines">
        {data.datasets.map(
          (dataset, idx) =>
            selectedSeries[idx] && (
              <polyline
                className="chart-line"
                fill="none"
                key={idx}
                points={data.labels
                  .slice(0, dataset.data.length)
                  .map(
                    (_, i) =>
                      `${xRange(i)},${yRange(dataset.data[i - (data.labels.length - dataset.data.length)] || 0)}`,
                  )
                  .join(' ')}
                stroke={dataset.strokeColor}
                strokeWidth={hovering === idx ? 3.5 : 2}
              />
            ),
        )}
      </g>
    );
  }
}
