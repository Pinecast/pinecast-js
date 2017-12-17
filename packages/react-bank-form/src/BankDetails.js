import * as React from 'react';

import {gettext} from 'pinecast-i18n';

const BankDetails = ({externalAccount: {account_holder_name, bank_name, country, last4}}) => (
  <div class="panel bank-details-container">
    {account_holder_name ? (
      <div class="segment-fill">
        <b>{gettext('Owner')}</b>
        <br />
        {account_holder_name}
      </div>
    ) : (
      <div class="segment-fill">
        <b>{gettext('Account number')}</b>
        <br />
        {`···· ${last4}`}
      </div>
    )}
    <div class="segment-divide">
      <b>{gettext('Bank')}</b>
      <br />
      {bank_name}
    </div>
    <div class="segment-divide">
      <b>{gettext('Country')}</b>
      <br />
      {country}
    </div>
  </div>
);

export default BankDetails;
