import React from 'react';
import xhr from 'pinecast-xhr';

import AccountNumberField from './fields/AccountNumberField';
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


export default class BankForm extends React.Component {
    static selector = '.bank-info-form';

    static propExtraction = {
        hasExisting: e => e.getAttribute('data-has-existing') === 'true',
    };

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            saving: false,

            collapsed: !!this.props.hasExisting,
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
            country: 'US',
            currency: 'USD',

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
                dob: this.refs.ledob.value.toISOString(),
                firstName: this.refs.lefn.value,
                lastName: this.refs.leln.value,
                ssnLastFour: this.refs.ssnlf.value,
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
            this.refs.ssnlf.isValid &&
            this.refs.lefn.isValid &&
            this.refs.leln.isValid &&
            this.refs.ledob.isValid;
    }

    render() {
        if (this.state.collapsed) {
            return <button className='bank-form-update-account-btn'
                onClick={() => this.setState({collapsed: false})}
                type='button'>
                <span>{gettext('Update Account')}</span>
                <i className='arrowicon' />
            </button>;
        }
        return <form className='bank-form'
            onSubmit={this.save.bind(this)}
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}>

            {this.state.error && <div className='error'>{this.state.error}</div>}

            <LEFirstNameField ref='lefn' />
            <LELastNameField ref='leln' />
            <LEDOBField ref='ledob' />
            <LESSNLastFourField ref='ssnlf' />

            <hr />

            <LEAddressStreetField ref='leaddressstr' />
            <LEAddressSecondField ref='leaddresssec' />
            <LEAddressCityField ref='leaddresscity' />
            <LEAddressStateField ref='leaddressstate' />
            <LEAddressZipField ref='leaddresszip' />

            <hr />

            <OwnerField ref='owner' />

            <RoutingNumberField ref='routing' />
            <AccountNumberField ref='account' />

            <div>
                <button className='btn' disabled={this.state.saving}>
                    {gettext('Set Bank Account')}
                </button>
            </div>
        </form>;
    }

};
