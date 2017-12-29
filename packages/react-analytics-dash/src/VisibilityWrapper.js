import * as React from 'react';

import {gettext, interpolate} from 'pinecast-i18n';

const VisibilityWrapper = props => {
  const {children, isOwner, meetsRequirement, requirement, upgradeURL} = props;
  if (meetsRequirement) {
    return children;
  }

  if (!isOwner) {
    return (
      <div className="upgrade-empty-state empty-state">
        {gettext('These analytics are only available to podcasts owned by Pro customers.')}
      </div>
    );
  }

  return (
    <div className="upgrade-empty-state empty-state">
      {interpolate(gettext('These analytics are only available to %s customers.'), [
        requirement === 'pro' ? gettext('Pro') : gettext('Starter'),
      ])}
      <br />
      <a className="btn" href={upgradeURL}>
        {gettext('Upgrade Now')}
      </a>
    </div>
  );
};

export default VisibilityWrapper;
