import React from 'react';

import ChartOptionSelector from './ChartOptionSelector';


export default class ChartType extends React.Component {
    render() {
        return <div style={{'text-align': 'center', display: 'inline-block'}}>
            <ChartOptionSelector
                onChange={this.props.onChange}
                options={{line: gettext('Line'), area: gettext('Area')}}
                defaultSelection={this.props.chartType} />
        </div>;
    }

};
