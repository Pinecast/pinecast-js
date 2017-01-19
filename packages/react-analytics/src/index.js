import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import ChartComponent from './Chart';


Array.from(document.querySelectorAll('.chart-placeholder')).forEach(placeholder => {
    ReactDOM.render(
        <ChartComponent
            chartType={placeholder.getAttribute('data-chart-type')}
            hideGranularity={!!placeholder.getAttribute('data-hide-granularity')}
            hideTimeframe={!!placeholder.getAttribute('data-hide-timeframe')}
            podcast={placeholder.getAttribute('data-podcast')}
            episode={placeholder.getAttribute('data-episode')}
            type={placeholder.getAttribute('data-type')}
            extra={placeholder.getAttribute('data-extra')}
            hasLegend={placeholder.getAttribute('data-has-legend') === 'true'}
            availableTimeframes={placeholder.getAttribute('data-timeframes') || ''}
        />,
        placeholder
    );
});
