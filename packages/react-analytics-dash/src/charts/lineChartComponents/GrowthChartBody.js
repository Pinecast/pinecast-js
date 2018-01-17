import * as React from 'react';

import BaseChartBody from './BaseChartBody';

export default class GrowthChartBody extends BaseChartBody {
  getYDomain() {
    const {data, selectedSeries} = this.props;
    return [
      0,
      Math.max(
        0,
        0,
        ...data.datasets.filter((_, i) => selectedSeries[i]).map(ds => Math.max(0, 0, ...ds.data)),
      ),
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
                      `${xRange(i)},${yRange(
                        dataset.data[i] || 0,
                      )}`,
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
