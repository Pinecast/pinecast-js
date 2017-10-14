import React from 'react';
import ReactDOM from 'react-dom';

import AnalyticsDash from './AnalyticsDash.js';

var elem = document.querySelector('.analytics-dash');
if (elem) {
  ReactDOM.render(
    <AnalyticsDash
      episode={elem.getAttribute('data-episode')}
      isOwner={elem.getAttribute('data-is-podcast-owner') == 'true'}
      isPro={elem.getAttribute('data-is-pro') == 'true'}
      isStarter={elem.getAttribute('data-is-starter') == 'true'}
      network={elem.getAttribute('data-network')}
      podcast={elem.getAttribute('data-podcast')}
      upgradeURL={elem.getAttribute('data-upgrade-url')}
    />,
    elem,
  );
}

if (typeof window !== 'undefined') {
  window.Pinecast = window.Pinecast || {};
  window.Pinecast.AnalyticsDash = AnalyticsDash;
}
