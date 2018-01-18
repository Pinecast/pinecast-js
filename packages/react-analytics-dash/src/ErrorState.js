import * as React from 'react';

import {gettext} from 'pinecast-i18n';

const ErrorState = () => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      padding: 50,
      textAlign: 'center',
    }}
  >
    <b>{gettext('Oh no! There was a problem loading those analytics.')}</b>
    <br />
    <span>{gettext('We have logged the error and will investigate ASAP.')}</span>
  </div>
);

export default ErrorState;
