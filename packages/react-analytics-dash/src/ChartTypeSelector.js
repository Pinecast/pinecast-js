import React, {Component} from 'react';

import {gettext} from 'pinecast-i18n';

import ChartOptionSelector from './optionSelector';

export default class ChartType extends Component {
  render() {
    return (
      <div style={{'text-align': 'center', display: 'inline-block'}}>
        <ChartOptionSelector
          onChange={this.props.onChange}
          options={{line: gettext('Line'), area: gettext('Area')}}
          defaultSelection={this.props.chartType}
        />
      </div>
    );
  }
}
