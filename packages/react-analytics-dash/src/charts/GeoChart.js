import {Chart} from 'react-google-charts';
import React from 'react';

import BaseChart from './BaseChart';


export default class GeoChart extends BaseChart {
    renderBody() {
        return <div>
            {this.renderTimeframeSelector()}
            <Chart
                chartType='GeoChart'
                data={this.state.data}
                height='600px'
                options={{
                    height: '600px',
                    width: null,
                }}
                width={null}
            />
        </div>;
    }
};
