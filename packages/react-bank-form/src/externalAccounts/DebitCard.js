import * as React from 'react';

import {gettext} from 'pinecast-i18n';

export default class DebitCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
    };

    this.elements = stripe.elements();
    this.card = null;
    this.cardEl = null;
  }

  componentDidMount() {
    this.card = this.elements.create('card');
    this.card.mount(this.cardEl);
    this.card.on('change', e => {
      this.setState({complete: e.complete});
    });
  }

  isReady() {
    return this.state.complete;
  }

  getToken() {
    return stripe.createToken(this.card);
  }

  handleCardRef = ref => {
    this.cardEl = ref;
  };

  render() {
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
      </div>
    );
  }
}
