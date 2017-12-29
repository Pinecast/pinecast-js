import * as React from 'react';

import {gettext} from 'pinecast-i18n';

const ChartEmptyState = () => (
  <div className="episode-empty-state empty-state">
    {gettext('There is no analytics data available for this timeframe.')}
  </div>
);
export default ChartEmptyState;
