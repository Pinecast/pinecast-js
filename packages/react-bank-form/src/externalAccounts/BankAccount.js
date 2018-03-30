import * as React from 'react';

import {gettext} from 'pinecast-i18n';

import CheckImage from './CheckImage';
import * as currencies from '../currencies';
import Select from '../Select';

export default class BankAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      selected: null,
      values: {
        currency: currencies.countriesToCurrencies[props.country][0],
      },
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.country !== this.props.country) {
      this.setState({
        values: {
          ...this.state.values,
          currency: currencies.countriesToCurrencies[newProps.country][0],
        },
      });
    }
  }

  isReady() {
    const {values: {account_holder_name, account_number, currency, routing_number}} = this.state;
    return Boolean(account_holder_name && account_number && currency && routing_number);
  }

  getToken() {
    const {country} = this.props;
    return stripe.createToken('bank_account', {
      ...this.state.values,
      country,
      account_holder_type: 'individual',
    });
  }

  updateValue(key, value) {
    const updatedValues = {...this.state.values, [key]: value || undefined};
    if (key === 'currency' && value && value.toUpperCase() === 'EUR') {
      delete updatedValues.routing_number;
    }
    this.setState({
      values: updatedValues,
    });
  }

  getRoutingNumberLabel() {
    switch (this.state.values.currency.toUpperCase()) {
      case 'GBP':
        return gettext('Sort code');
      default:
        return gettext('Routing number');
    }
  }

  handleChangeCurrency = value => this.updateValue('currency', value);

  handleFocusAcctNum = () => {
    this.setState({selected: 'acct'});
  };
  handleBlurAcctNum = () => {
    this.setState({selected: null});
  };

  handleFocusRoutingNum = () => {
    this.setState({selected: 'routing'});
  };
  handleBlurRoutingNum = () => {
    this.setState({selected: null});
  };

  handleAcctHolderChange = e => this.updateValue('account_holder_name', e.target.value);
  handleAcctNumChange = e => this.updateValue('account_number', e.target.value);
  handleRoutingNumChange = e => this.updateValue('routing_number', e.target.value);

  render() {
    const {props: {country}, state: {selected, values}} = this;
    const availableCurrencies = currencies.countriesToCurrencies[country];
    const isEuro = values.currency.toUpperCase() === 'EUR';
    return (
      <React.Fragment>
        <label>
          <span>{gettext('Account holder name')}</span>
          <input
            type="text"
            onChange={this.handleAcctHolderChange}
            value={values.account_holder_name || ''}
          />
        </label>
        {availableCurrencies.length > 1 && (
          <label>
            <span>{gettext('Currency')}</span>
            <Select
              onChange={this.handleChangeCurrency}
              options={availableCurrencies.map(cur => ({label: currencies.names[cur], value: cur}))}
              value={values.currency}
            />
          </label>
        )}
        {values.currency.toUpperCase() === 'USD' && (
          <div>
            <CheckImage
              highlightAcctNum={selected === 'acct'}
              highlightRoutingNum={selected === 'routing'}
            />
          </div>
        )}
        <label>
          <span>{isEuro ? gettext('IBAN') : gettext('Account number')}</span>
          <input
            type="text"
            onBlur={this.handleBlurAcctNum}
            onChange={this.handleAcctNumChange}
            onFocus={this.handleFocusAcctNum}
            value={values.account_number || ''}
          />
        </label>
        {!isEuro && (
          <label>
            <span>{this.getRoutingNumberLabel()}</span>
            <input
              type="text"
              onBlur={this.handleBlurRoutingNum}
              onChange={this.handleRoutingNumChange}
              onFocus={this.handleFocusRoutingNum}
              value={values.routing_number || ''}
            />
          </label>
        )}
      </React.Fragment>
    );
  }
}
