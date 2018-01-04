import * as React from 'react';

import GeoChart from './GeoChart';
import GranularGeoChart from './GranularGeoChart';
import GrowthChart from './GrowthChart';
import TimeSeriesChart from './TimeSeriesChart';
import Menu from './Menu';
import PieChart from './PieChart';
import Table from './Table';

export default function render(chartType, commonProps) {
  switch (chartType) {
    case 'geo':
      return <GeoChart {...commonProps} />;
    case 'geo_gran':
      return <GranularGeoChart {...commonProps} />;
    case 'growth':
      return <GrowthChart {...commonProps} />;
    case 'timeseries':
      return <TimeSeriesChart {...commonProps} />;
    case 'menu':
      return <Menu {...commonProps} />;
    case 'pie':
      return <PieChart {...commonProps} />;
    case 'table':
      return <Table {...commonProps} />;
    default:
      return <b>Invalid Chart Type</b>;
  }
}
