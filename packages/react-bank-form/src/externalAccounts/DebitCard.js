import * as React from 'react';

import {gettext} from 'pinecast-i18n';

import * as currencies from '../currencies';
import Select from '../Select';

const cardStyle = {
  base: {},
};

export default class DebitCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      currency: currencies.countriesToCurrencies[props.country][0],
    };

    this.elements = stripe.elements();
    this.card = null;
    this.cardEl = null;
  }

  componentDidMount() {
    this.card = this.elements.create('card', {style: cardStyle});
    this.card.mount(this.cardEl);
    this.card.on('change', e => {
      this.setState({complete: e.complete});
    });
    this.cardEl.firstChild.style.flex = '1 1';
    setTimeout(() => {
      this.card.update({style: {base: {fontSize: '13px'}}});
    }, 0);
  }

  isReady() {
    return this.state.complete;
  }

  getToken() {
    return stripe.createToken(this.card, {currency: this.state.currency});
  }

  handleCardRef = ref => {
    this.cardEl = ref;
  };
  handleChangeCurrency = currency => {
    this.setState({currency});
  };

  render() {
    const availableCurrencies = currencies.countriesToCurrencies[this.props.country];
    return (
      <div style={{position: 'relative'}}>
        <aside style={{top: '-3em'}}>
          <p>{gettext('We can send tips as credit to your debit card, arriving faster than bank transfers.')}</p>
          <p>{gettext('Credit cards are not supported.')}</p>
        </aside>
        <label>
          <span>{gettext('Card details')}</span>
          <div ref={this.handleCardRef} />
        </label>
        {availableCurrencies.length > 1 && (
          <label>
            <span>{gettext('Currency')}</span>
            <Select
              onChange={this.handleChangeCurrency}
              options={availableCurrencies.map(cur => ({label: currencies.names[cur], value: cur}))}
              value={this.state.currency}
            />
          </label>
        )}
      </div>
    );
  }
}
