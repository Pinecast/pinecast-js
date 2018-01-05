import React, {Component} from 'react';

import * as constants from './constants';
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
      type: constants.TYPE_LISTENS,
    };
  }

  get typeType() {
    if (this.props.network) {
      return 'network';
    }
    if (this.props.episode) {
      return 'episode';
    }
    return 'podcast';
  }

  renderBody() {
    const {
      props: {episode, isOwner, isPro, isStarter, network, podcast, upgradeURL},
      state: {type},
    } = this;

    const requires = constants.TYPES_CHART_REQUIRES[type];
    const meetsRequirement =
      (requires === 'pro' && isPro) ||
      (requires === 'starter' && (isPro || isStarter)) ||
      !requires;

    const typeType = this.typeType;
    const commonProps = {
      endpoint: constants.TYPES_ENDPOINTS[typeType][type],
      episode,
      network,
      podcast,
      type,
      typeType,
    };

    if (type === constants.TYPE_SUBS) {
      commonProps.availableTimeframes = 'month,sixmonth,year'; // TODO: Allow "all"?
      commonProps.hideGranularity = true;
    }

    return (
      <VisibilityWrapper
        {...{...commonProps, isOwner, meetsRequirement, requirement: requires, upgradeURL}}
      >
        {render(constants.TYPES_CHART_TYPES[type], commonProps)}
      </VisibilityWrapper>
    );
  }

  render() {
    const {state: {type}} = this;

    return (
      <div>
        <TypePicker onChange={type => this.setState({type})} type={type} typeType={this.typeType} />
        {this.renderBody()}
      </div>
    );
  }
}
