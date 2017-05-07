import React, {Component} from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import {gettext} from 'pinecast-i18n';
import xhr from 'pinecast-xhr';

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


const countryOptions = [
    {label: 'United States', value: 'us'},
    {label: 'Australia', value: 'au'},
    {label: 'Canada', value: 'ca'},
    {label: 'United Kingdom', value: 'gb'},
];


export default class BankForm extends Component {
    static selector = '.bank-info-form';

    static propExtraction = {
        hasExisting: e => e.getAttribute('data-has-existing') === 'true',

        entityCountry: e => e.getAttribute('data-entity-country'),
        existingCountry: e => e.getAttribute('data-bank-country'),
        existingCurrency: e => e.getAttribute('data-currency'),
    };

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            saving: false,

            collapsed: !!props.hasExisting,

            entityCountry: (props.entityCountry || 'us').toLowerCase(),
            bankCountry: (props.existingCountry || 'us').toLowerCase(),
            bankCurrency: (props.existingCurrency || 'usd').toLowerCase(),
        };
    }


    save(e) {
        e.preventDefault();

        if (this.state.saving) {
            return;
        }

        if (!this.isValid()) {
            this.setState({error: gettext('Please fill out all fields correctly.')});
            return;
        }
        this.setState({saving: true, error: null});

        Stripe.bankAccount.createToken({
            country: this.state.bankCountry,
            currency: this.state.bankCurrency,

            routing_number: this.refs.routing.value,
            account_number: this.refs.account.value,
            account_holder_name: this.refs.owner.value,
            account_holder_type: 'individual',
        }, (status, resp) => {
            if (status !== 200) {
                console.error(status.toString() + ' response from Stripe!');
            }
            if (resp.error) {
                this.setState({error: resp.error.message, saving: false});
                return;
            }

            this.tokenCreated(resp.id);
        });
    }

    tokenCreated(token) {
        xhr({
            method: 'post',
            form: {
                token,

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
            },
            url: '/payments/services/set_tip_cashout',
        }, (err, res, body) => {
            if (err || res.statusCode !== 200) {
                this.setState({
                    error: gettext('There was a problem submitting the form.'),
                    saving: false,
                });
                return;
            }

            this.setState({saving: false});
            window.location.reload();
        });
    }

    isValid() {
        return this.refs.owner.isValid &&
            this.refs.account.isValid &&
            this.refs.routing.isValid &&
            this.refs.leaddressstr.isValid &&
            this.refs.leaddresscity.isValid &&
            this.refs.leaddressstate.isValid &&
            this.refs.leaddresszip.isValid &&
            (!this.refs.ssnlf || this.refs.ssnlf.isValid) &&
            this.refs.lefn.isValid &&
            this.refs.leln.isValid &&
            this.refs.ledob.isValid;
    }

    render() {
        const {
            props: {hasExisting},
            state: {bankCountry, bankCurrency, collapsed, entityCountry, error, saving},
        } = this;

        if (collapsed) {
            return <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '40px 0',
                }}
            >
                <button className='bank-form-update-account-btn'
                    onClick={() => this.setState({collapsed: false})}
                    type='button'>
                    <span>{gettext('Update Account')}</span>
                    <i className='arrowicon' />
                </button>
            </div>;
        }

        const availableCurrencies = (
            currencies
                .countriesToCurrencies[entityCountry]
                .filter(x => currencies.countriesToCurrencies[bankCountry].indexOf(x) !== -1)
        );

        return <form className='bank-form'
            onSubmit={this.save.bind(this)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: 0,
            }}>

            {error && <div className='error'>{error}</div>}

            <aside>
                <p>
                    {gettext('This information should reflect the owner of the podcast. These details will be used for tax purposes, if necessary.')}
                </p>
                {hasExisting && <p>{gettext('To change an account country, please contact Pinecast support.')}</p>}
            </aside>

            <LEFirstNameField ref='lefn' />
            <LELastNameField ref='leln' />

            <LEAddressStreetField ref='leaddressstr' />
            <LEAddressSecondField ref='leaddresssec' />
            <LEAddressCityField ref='leaddresscity' />
            <LEAddressStateField ref='leaddressstate' country={entityCountry} />
            <LEAddressZipField ref='leaddresszip' />
            {!hasExisting &&
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
                </label>}

            <hr />

            <div style={{position: 'relative'}}>
                <aside className='aside--secure'>
                    <strong>{gettext('Personal Details')}</strong>
                    <p>
                        {gettext('Stripe uses these details to verify your identity and prevent fraud.')}
                    </p>
                </aside>

                <LEDOBField ref='ledob' />
                {entityCountry === 'us' && <LESSNLastFourField ref='ssnlf' />}
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

            {availableCurrencies.length > 1 &&
                <label>
                    <span>{gettext('Account Currency')}</span>
                    <Select
                        clearable={false}
                        onChange={({value}) => this.setState({bankCurrency: value})}
                        options={availableCurrencies.map(value => ({label: currencies.names[value], value}))}
                        value={bankCurrency}
                    />
                </label>}

            <OwnerField ref='owner' />

            <RoutingNumberField ref='routing' country={bankCountry} />
            <AccountNumberField ref='account' country={bankCountry} />

            <div>
                <button className='btn' disabled={saving}>
                    {gettext('Set Bank Account')}
                </button>
            </div>
        </form>;
    }

};
