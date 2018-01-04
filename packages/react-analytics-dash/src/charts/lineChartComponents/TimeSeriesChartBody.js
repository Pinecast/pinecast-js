import * as React from 'react';

import renderBalloons from './balloons';
import BaseChartBody from './BaseChartBody';

export default class TimeSeriesChartBody extends BaseChartBody {
  getYDomain() {
    const {data} = this.props;
    return [
      Math.min(0, ...data.datasets.map(ds => Math.min(...ds.data))),
      Math.max(0, ...data.datasets.map(ds => Math.max(...ds.data))),
    ];
  }

  renderLines(data, xRange, yRange) {
    const {hovering, selectedSeries} = this.props;
    return data.datasets.map(
      (dataset, idx) =>
        selectedSeries[idx] && (
          <polyline
            className="chart-line"
            fill="none"
            key={idx}
            points={data.labels
              .map(
                (_, i) => `${xRange(i)},${yRange(dataset.data[i - (data.labels.length - dataset.data.length)] || 0)}`,
              )
              .join(' ')}
            stroke={dataset.strokeColor}
            strokeWidth={hovering === idx ? 3.5 : 2}
          />
        ),
    );
  }

  renderChartExtra(data) {
    const {endDate, episodeList, height, startDate, width} = this.props;
    if (!episodeList) {
      return null;
    }

    const {marginBottom, marginLeft, marginRight, xAxisHeight} = this.getMargins();
    const innerWidth = width - marginLeft - marginRight;

    return renderBalloons(
      startDate,
      endDate,
      data,
      episodeList,
      innerWidth,
      `translate(${marginLeft}, ${height - marginBottom - xAxisHeight})`,
    );
  }
}
