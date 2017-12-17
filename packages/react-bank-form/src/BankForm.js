import * as React from 'react';

import {gettext} from 'pinecast-i18n';
import Spinner from 'pinecast-spinner';
import xhr from 'pinecast-xhr';

import BankDetails from './BankDetails';
import NewAccountForm from './NewAccountForm';

export default class BankForm extends React.Component {
  static selector = '.bank-info-form';

  static propExtraction = {};

  constructor(props) {
    super(props);
    this.state = {
      settings: null,
      settingsError: null,
    };
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

  render() {
    const {settings, settingsError} = this.state;
    if (settingsError) {
      return (
        <React.Fragment>
          <strong>{gettext('There was a problem loading your bank information')}</strong>
          <p>{settingsError}</p>
        </React.Fragment>
      );
    }

    if (!settings) {
      return (
        <div style={{padding: 40, display: 'flex', justifyContent: 'center'}}>
          <Spinner />
        </div>
      );
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
        <strong style={{display: 'block', marginBottom: '1em'}}>{gettext('Update account information')}</strong>
        <p>{gettext('New account details can be provided at any time.')}</p>
      </React.Fragment>
    );
  }
}
