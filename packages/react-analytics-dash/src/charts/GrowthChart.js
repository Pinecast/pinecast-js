import * as React from 'react';

import ChartEmptyState from './ChartEmptyState';
import LineChart from './LineChart';
import GrowthChartBody from './lineChartComponents/GrowthChartBody';

export default class GrowthChart extends LineChart {
  renderData() {
    const {state: {data, hoveringSeries, selectedSeries, width}} = this;
    if (!data || data.datasets.every(ds => !ds.data.length)) {
      return <ChartEmptyState />;
    }

    return (
      <GrowthChartBody
        data={data}
        height={300}
        hovering={hoveringSeries}
        selectedSeries={selectedSeries}
        width={width || 0}
      />
    );
  }
}
