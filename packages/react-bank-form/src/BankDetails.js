import * as React from 'react';

import {gettext} from 'pinecast-i18n';

const BankDetails = ({externalAccount: {account_holder_name, bank_name, country, last4}}) => (
  <div className="panel bank-details-container">
    {account_holder_name ? (
      <div className="segment-fill">
        <b>{gettext('Owner')}</b>
        <br />
        {account_holder_name}
      </div>
    ) : (
      <div className="segment-fill">
        <b>{gettext('Account number')}</b>
        <br />
        {`···· ${last4}`}
      </div>
    )}
    <div className="segment-divide">
      <b>{gettext('Bank')}</b>
      <br />
      {bank_name}
    </div>
    <div className="segment-divide">
      <b>{gettext('Country')}</b>
      <br />
      {country}
    </div>
  </div>
);

export default BankDetails;
