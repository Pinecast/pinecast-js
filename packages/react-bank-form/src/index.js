import React from 'react';
import ReactDOM from 'react-dom';

import BankForm from './BankForm.js';

var elem = document.querySelector('.bank-info-form');
if (elem) {
  Stripe.setPublishableKey(elem.getAttribute('data-publishable-key'));
  ReactDOM.render(<BankForm hasExisting={elem.getAttribute('data-has-existing') === 'true'} />, elem);
}

if (typeof window !== 'undefined') {
  window.Pinecast = window.Pinecast || {};
  window.Pinecast.BankForm = BankForm;
}
