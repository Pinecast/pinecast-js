import React from 'react';


const ChartEmptyState = () =>
    <div className='episode-empty-state empty-state'>
        {gettext('There is no analytics data available for this timeframe.')}
    </div>;
export default ChartEmptyState;
