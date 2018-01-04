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

    const filteredData = (selectedSeries || []).every(x => x)
      ? data
      : {
          ...data,
          datasets: data.datasets.filter((_, i) => selectedSeries[i]),
        };

    return <GrowthChartBody data={filteredData} height={300} hovering={hoveringSeries} width={width || 0} />;
  }
}
