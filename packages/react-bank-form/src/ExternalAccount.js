import * as React from 'react';

import {gettext} from 'pinecast-i18n';

import BankAccount from './externalAccounts/BankAccount';
import DebitCard from './externalAccounts/DebitCard';

export default class ExternalAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'debit_card',
      error: null,
    };
    this.debitForm = null;
    this.bankForm = null;
  }

  isReady() {
    return (this.debitForm || this.bankForm).isReady();
  }
  getToken() {
    return (this.debitForm || this.bankForm).getToken();
  }

  setError(error) {
    this.setState({error});
  }

  handleSetDebit = () => {
    this.setState({type: 'debit_card'});
  };
  handleSetBank = () => {
    this.setState({type: 'bank_account'});
  };

  handleRefDebit = ref => {
    this.debitForm = ref;
  };
  handleRefBank = ref => {
    this.bankForm = ref;
  };

  render() {
    const {props: {country, isUpdate}, state: {error, type}} = this;
    return (
      <React.Fragment>
        {isUpdate ? (
          <p>{gettext('What type of account would you like to send tip payouts to?')}</p>
        ) : (
          <strong style={{display: 'block', marginBottom: '1em'}}>
            {gettext('Where should we send your tips?')}
          </strong>
        )}
        {error && <div className="error">{error}</div>}
        <div className="radio-group half-flush">
          <label className="radio">
            <input checked={type === 'debit_card'} onChange={this.handleSetDebit} type="radio" />
            <span>{gettext('Debit card')}</span>
          </label>
        </div>
        {type === 'debit_card' && <DebitCard country={country} ref={this.handleRefDebit} />}
        <div className="radio-group half-flush">
          <label className="radio">
            <input checked={type === 'bank_account'} onChange={this.handleSetBank} type="radio" />
            <span>{gettext('Bank account')}</span>
          </label>
        </div>
        {type === 'bank_account' && <BankAccount country={country} ref={this.handleRefBank} />}
      </React.Fragment>
    );
  }
}
