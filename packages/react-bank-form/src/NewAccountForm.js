import * as React from 'react';

import {gettext} from 'pinecast-i18n';

import {countryOptions} from './constants';
import ExternalAccount from './ExternalAccount';
import LEAddressCityField from './fields/LEAddressCityField';
import LEAddressStateField from './fields/LEAddressStateField';
import LEAddressSecondField from './fields/LEAddressSecondField';
import LEAddressStreetField from './fields/LEAddressStreetField';
import LEAddressZipField from './fields/LEAddressZipField';
import LEDOBField from './fields/LEDOBField';
import LEFirstNameField from './fields/LEFirstNameField';
import LELastNameField from './fields/LELastNameField';
import LESSNLastFourField from './fields/LESSNLastFourField';
import Select from './Select';

export default class NewAccountForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: 'us',
      legalEntity: {},

      saving: false,
    };

    this.externalAccount = null;
  }

  handleSubmit = async e => {
    e.preventDefault();

    if (!this.externalAccount.isReady()) {
      this.externalAccount.setError(gettext('You must fill out all fields completely.'));
      return;
    }

    this.setState({saving: true});

    const [acctToken, bankToken] = await Promise.all([
      stripe.createToken('account', {legal_entity: this.state.legalEntity, tos_shown_and_accepted: true}),
      this.externalAccount.getToken(),
    ]);

    //
  };

  handleChangeCountry = country => {
    this.setState({country});
  };

  updateLegalEntityValue(key, value) {
    this.setState({
      legalEntity: {
        ...this.state.legalEntity,
        [key]: value || undefined,
      },
    });
  }
  updateLegalEntitySubkeyValue(key, subkey, value) {
    const parentkeyValue = this.state.legalEntity[key];
    if (!parentkeyValue && !value) {
      return;
    }
    const newParent = {
      ...parentkeyValue,
      [subkey]: value || undefined,
    };
    this.setState({
      legalEntity: {
        ...this.state.legalEntity,
        [key]: newParent,
      },
    });
  }
  handleFirstName = value => this.updateLegalEntityValue('first_name', value);
  handleLastName = value => this.updateLegalEntityValue('last_name', value);

  handleAddressLine1 = value => this.updateLegalEntitySubkeyValue('address', 'line1', value);
  handleAddressLine2 = value => this.updateLegalEntitySubkeyValue('address', 'line2', value);
  handleAddressCity = value => this.updateLegalEntitySubkeyValue('address', 'city', value);
  handleAddressState = value => this.updateLegalEntitySubkeyValue('address', 'state', value);
  handleAddressPostalCode = value => this.updateLegalEntitySubkeyValue('address', 'postal_code', value);

  handleDob = value => {
    this.setState({
      legalEntity: {
        ...this.state.legalEntity,
        dob: value,
      },
    });
  };

  handleSSNLast4 = value => this.updateLegalEntityValue('ssn_last_4', value);

  handleEARef = ref => {
    this.externalAccount = ref;
  };

  render() {
    const {state: {country}} = this;
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
        <label>
          <span>{gettext('Country')}</span>
          <Select onChange={this.handleChangeCountry} options={countryOptions} value={country} />
        </label>

        <hr />

        <aside>
          <p>
            {gettext(
              'This information should reflect the owner of the podcast. These details will be used for tax purposes, if necessary.',
            )}
          </p>
        </aside>

        <LEFirstNameField onInput={this.handleFirstName} />
        <LELastNameField onInput={this.handleLastName} />

        <hr />

        <LEAddressStreetField onInput={this.handleAddressLine1} />
        <LEAddressSecondField onInput={this.handleAddressLine2} />
        <LEAddressCityField onInput={this.handleAddressCity} />
        <LEAddressStateField onInput={this.handleAddressState} country={country} />
        <LEAddressZipField onInput={this.handleAddressPostalCode} country={country} />

        <hr />

        <div style={{position: 'relative'}}>
          <aside className="aside--secure">
            <strong>{gettext('Personal Details')}</strong>
            <p>{gettext('Stripe uses these details to verify your identity and prevent fraud.')}</p>
          </aside>

          <LEDOBField onInput={this.handleDob} />
          {country === 'us' && <LESSNLastFourField onInput={this.handleSSNLast4} />}
        </div>

        <hr />

        <ExternalAccount country={country} ref={this.handleEARef} />

        <hr />

        <div>
          <button className="btn" type="submit">
            {gettext('Set Bank Account')}
          </button>
        </div>
      </form>
    );
  }
}
