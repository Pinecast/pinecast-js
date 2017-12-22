import * as React from 'react';

import {gettext} from 'pinecast-i18n';
import Spinner from 'pinecast-spinner';
import xhr from 'pinecast-xhr';

import BankDetails from './BankDetails';
import ExternalAccount from './ExternalAccount';
import NewAccountForm from './NewAccountForm';

export default class BankForm extends React.Component {
  static selector = '.bank-info-form';

  static propExtraction = {};

  constructor(props) {
    super(props);
    this.state = {
      settings: null,
      settingsError: null,

      savingExtAcct: false,
      updateExtAcctError: null,
      extAccountSuccess: false,
    };
    this.updateExtAcct = null;
  }

  componentDidMount() {
    this.refreshSettings();
  }

  refreshSettings = () => {
    this.setState({settings: null, settingsError: null});

    xhr(
      {
        method: 'get',
        url: '/payments/services/tip_jar/get_settings',
      },
      (err, res, body) => {
        if (err || res.statusCode !== 200) {
          this.setState({
            settingsError: gettext('There was a problem submitting the form.'),
          });
          return;
        }

        this.setState({settings: JSON.parse(body), settingsError: null});
      },
    );
  };

  handleUpdateExtAcctRef = el => {
    this.updateExtAcct = el;
  };

  handleUpdateExtAcctSubmit = async e => {
    e.preventDefault();
    if (!this.updateExtAcct || this.state.savingExtAcct) {
      return;
    }
    this.setState({updateExtAcctError: null, savingExtAcct: true, extAccountSuccess: false});

    let token;
    try {
      token = await this.updateExtAcct.getToken();
    } catch (e) {
      console.error(e);
      this.setState({
        updateExtAcctError: gettext('There was a problem sending your account information to Stripe.'),
        savingExtAcct: false,
      });
      return;
    }

    xhr(
      {
        method: 'post',
        url: '/payments/services/tip_jar/update/external_account',
        form: {
          token: token.token.id,
        },
      },
      (err, res, body) => {
        if (err || res.statusCode !== 200) {
          let error = gettext('There was a problem adding your bank account to Pinecast.');
          if (!err && body) {
            try {
              error = JSON.parse(body).error;
            } catch (e) {}
          }
          this.setState({
            updateExtAcctError: error,
            savingExtAcct: false,
          });
          return;
        }

        this.setState({
          updateExtAcctError: null,
          savingExtAcct: false,
          extAccountSuccess: true,
        });
      },
    );
  };

  renderSpinner() {
    return (
      <div style={{padding: 40, display: 'flex', justifyContent: 'center'}}>
        <Spinner />
      </div>
    );
  }

  render() {
    const {extAccountSuccess, savingExtAcct, settings, settingsError, updateExtAcctError} = this.state;
    if (settingsError) {
      return (
        <React.Fragment>
          <strong>{gettext('There was a problem loading your bank information')}</strong>
          <p>{settingsError}</p>
        </React.Fragment>
      );
    }

    if (!settings) {
      return this.renderSpinner();
    }

    if (!settings.setup) {
      return (
        <React.Fragment>
          <strong style={{display: 'block', marginBottom: '1em'}}>{gettext('Add tip jar information')}</strong>
          <p>
            {gettext(
              'Adding a bank account will allow your podcasts to begin accepting tips. All information provided will stored securely by our payment processor and will never pass through Pinecast servers.',
            )}
          </p>
          <NewAccountForm onAccountCreated={this.refreshSettings} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <strong style={{display: 'block', marginBottom: '1em'}}>{gettext('Existing tip jar information')}</strong>
        <p>
          {gettext(
            'A payout account is already linked to your Pinecast account. You are all set to accept tips for your podcast!',
          )}
        </p>
        <BankDetails externalAccount={settings.external_account} />
        <hr />
        <form onSubmit={this.handleUpdateExtAcctSubmit}>
          <strong style={{display: 'block', marginBottom: '1em'}}>{gettext('Update payout account')}</strong>
          {extAccountSuccess && <div className="success">{gettext('Your account was updated successfully')}</div>}
          {updateExtAcctError && <div className="error">{updateExtAcctError}</div>}
          {savingExtAcct && this.renderSpinner()}
          <div style={{display: savingExtAcct || extAccountSuccess ? 'none' : null}}>
            <ExternalAccount country={settings.country.toLowerCase()} isUpdate ref={this.handleUpdateExtAcctRef} />
            <button className="btn" type="submit">
              {gettext('Save')}
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}
