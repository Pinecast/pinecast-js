import * as React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import {gettext} from 'pinecast-i18n';

import AccountNumberField from './fields/AccountNumberField';
import * as currencies from './currencies';
import LEAddressCityField from './fields/LEAddressCityField';
import LEAddressStateField from './fields/LEAddressStateField';
import LEAddressSecondField from './fields/LEAddressSecondField';
import LEAddressStreetField from './fields/LEAddressStreetField';
import LEAddressZipField from './fields/LEAddressZipField';
import LEDOBField from './fields/LEDOBField';
import LEFirstNameField from './fields/LEFirstNameField';
import LELastNameField from './fields/LELastNameField';
import LESSNLastFourField from './fields/LESSNLastFourField';
import OwnerField from './fields/OwnerField';
import RoutingNumberField from './fields/RoutingNumberField';

export default class LegalEntityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      entityCountry: 'US',
    };
  }
  isValid() {
    return (
      this.refs.owner.isValid &&
      this.refs.account.isValid &&
      this.refs.routing.isValid &&
      this.refs.leaddressstr.isValid &&
      this.refs.leaddresscity.isValid &&
      this.refs.leaddressstate.isValid &&
      this.refs.leaddresszip.isValid &&
      (!this.refs.ssnlf || this.refs.ssnlf.isValid) &&
      this.refs.lefn.isValid &&
      this.refs.leln.isValid &&
      this.refs.ledob.isValid
    );
  }

  getValues() {
    return {
      addressStreet: this.refs.leaddressstr.value,
      addressSecond: this.refs.leaddresssec.value,
      addressCity: this.refs.leaddresscity.value,
      addressState: this.refs.leaddressstate.value,
      addressZip: this.refs.leaddresszip.value,
      addressCountry: this.state.entityCountry,
      dob: this.refs.ledob.value.toISOString(),
      firstName: this.refs.lefn.value,
      lastName: this.refs.leln.value,
      ssnLastFour: this.refs.ssnlf ? this.refs.ssnlf.value : '',
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    if (!this.isValid()) {
      return;
    }
    this.props.onSubmit(this.getValues());
  };

  render() {
    const {state: {entityCountry, error, saving}} = this;
    return (
      <form
        className="bank-form"
        onSubmit={this.handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 0,
        }}
      >
        {error && <div className="error">{error}</div>}

        <aside>
          <p>
            {gettext(
              'This information should reflect the owner of the podcast. These details will be used for tax purposes, if necessary.',
            )}
          </p>
        </aside>

        <LEFirstNameField ref="lefn" />
        <LELastNameField ref="leln" />

        <hr />

        <LEAddressStreetField ref="leaddressstr" />
        <LEAddressSecondField ref="leaddresssec" />
        <LEAddressCityField ref="leaddresscity" />
        <LEAddressStateField ref="leaddressstate" country={entityCountry} />
        <LEAddressZipField ref="leaddresszip" />
        {!hasExisting && (
          <label>
            <span>{gettext('Country')}</span>
            <Select
              clearable={false}
              onChange={({value}) => {
                this.setState({
                  entityCountry: value,
                  bankCountry: value,
                  bankCurrency: currencies.countriesToCurrencies[value][0],
                });
              }}
              options={countryOptions}
              value={entityCountry}
            />
          </label>
        )}

        <hr />

        <div style={{position: 'relative'}}>
          <aside className="aside--secure">
            <strong>{gettext('Personal Details')}</strong>
            <p>{gettext('Stripe uses these details to verify your identity and prevent fraud.')}</p>
          </aside>

          <LEDOBField ref="ledob" />
          {entityCountry === 'us' && <LESSNLastFourField ref="ssnlf" />}
        </div>

        <hr />

        <label>
          <span>{gettext('Bank Country')}</span>
          <Select
            clearable={false}
            onChange={({value}) => {
              this.setState({bankCountry: value});
              if (!currencies.countriesToCurrencies[value].some(x => x === bankCurrency)) {
                this.setState({bankCurrency: currencies.countriesToCurrencies[value][0]});
              }
            }}
            options={countryOptions.filter(({value}) => {
              const bankCountryCurrencies = currencies.countriesToCurrencies[value];
              const entityCountryCurrencies = currencies.countriesToCurrencies[entityCountry];
              return bankCountryCurrencies.some(x => entityCountryCurrencies.indexOf(x) !== -1);
            })}
            value={bankCountry}
          />
        </label>

        {availableCurrencies.length > 1 && (
          <label>
            <span>{gettext('Account Currency')}</span>
            <Select
              clearable={false}
              onChange={({value}) => this.setState({bankCurrency: value})}
              options={availableCurrencies.map(value => ({label: currencies.names[value], value}))}
              value={bankCurrency}
            />
          </label>
        )}

        <OwnerField ref="owner" />

        <RoutingNumberField ref="routing" country={bankCountry} />
        <AccountNumberField ref="account" country={bankCountry} />

        <div>
          <button className="btn" disabled={saving}>
            {gettext('Set Bank Account')}
          </button>
        </div>
      </form>
    );
  }
}
