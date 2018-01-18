import React, {Component} from 'react';

import * as constants from './constants';
import ErrorState from './ErrorState';
import render from './charts';
import TypePicker from './TypePicker';
import VisibilityWrapper from './VisibilityWrapper';

export default class AnalyticsDash extends Component {
  static selector = '.analytics-dash';

  static propExtraction = {
    episode: e => e.getAttribute('data-episode'),
    network: e => e.getAttribute('data-network'),
    isOwner: e => e.getAttribute('data-is-podcast-owner') === 'true',
    isPro: e => e.getAttribute('data-is-pro') === 'true',
    isStarter: e => e.getAttribute('data-is-starter') === 'true',
    podcast: e => e.getAttribute('data-podcast'),
    upgradeURL: e => e.getAttribute('data-upgrade-url'),
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      type: constants.TYPE_LISTENS,
    };
  }

  getType() {
    if (this.props.network) {
      return 'network';
    }
    if (this.props.episode) {
      return 'episode';
    }
    return 'podcast';
  }

  handleError = err => {
    this.setState({error: err || true});
  };

  renderBody() {
    const {
      props: {episode, isOwner, isPro, isStarter, network, podcast, upgradeURL},
      state: {error, type},
    } = this;

    const requires = constants.TYPES_CHART_REQUIRES[type];
    const meetsRequirement =
      (requires === 'pro' && isPro) ||
      (requires === 'starter' && (isPro || isStarter)) ||
      !requires;

    const typeType = this.getType();
    const commonProps = {
      endpoint: constants.TYPES_ENDPOINTS[typeType][type],
      episode,
      network,
      podcast,
      type,
      typeType,

      onError: this.handleError,
    };

    if (type === constants.TYPE_SUBS) {
      commonProps.availableTimeframes = 'month,sixmonth,year'; // TODO: Allow "all"?
      commonProps.hideGranularity = true;
    }

    return (
      <VisibilityWrapper
        {...{...commonProps, isOwner, meetsRequirement, requirement: requires, upgradeURL}}
      >
        {error ? <ErrorState /> : render(constants.TYPES_CHART_TYPES[type], commonProps)}
      </VisibilityWrapper>
    );
  }

  handleChangeType = type => {
    this.setState({type, error: null});
  };

  render() {
    const {state: {type}} = this;

    return (
      <div>
        <TypePicker onChange={this.handleChangeType} type={type} typeType={this.getType()} />
        {this.renderBody()}
      </div>
    );
  }
}
