import React, {Component} from 'react';

import ProgressBar from './ProgressBar';
import Step1 from './steps/step-1';
import Step2 from './steps/step-2';
import Step3 from './steps/step-3';

export default class Importer extends Component {
  static selector = '.importer-placeholder';

  static propExtraction = {
    rssFetch: node => node.getAttribute('data-rss-fetch'),
  };

  constructor(props) {
    super(props);
    this.state = {
      step: 1,

      feed: null,
      feedURL: null,
    };
  }

  renderStep() {
    switch (this.state.step) {
      case 1:
        return (
          <Step1
            onNextStep={(feed, feedURL) => this.setState({step: 2, feed, feedURL})}
            rssFetch={this.props.rssFetch}
          />
        );
      case 2:
        return <Step2 onNextStep={updatedFeed => this.setState({step: 3, feed: updatedFeed})} feed={this.state.feed} />;
      case 3:
        return <Step3 feed={this.state.feed} feedURL={this.state.feedURL} />;
    }
  }

  render() {
    return <div>{this.renderStep()}</div>;
  }
}
