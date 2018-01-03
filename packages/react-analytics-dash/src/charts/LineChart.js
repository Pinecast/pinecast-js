import * as React from 'react';

import BaseChart from './BaseChart';
import Legend from './lineChartComponents/Legend';

export default class LineChart extends BaseChart {
  constructor(...args) {
    super(...args);
    this.state = {
      ...this.state,

      width: 200,

      selectedSeries: null,

      hoveringSeries: null,
    };

    this.wrapper = null;
    this.widthCalcer = null;
  }

  componentDidMount() {
    super.componentDidMount();
    this.widthCalcer = setInterval(() => this.calcWidth(), 250);
    this.calcWidth();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    clearInterval(this.widthCalcer);
  }

  calcWidth() {
    if (!this.wrapper) {
      return;
    }
    const width = this.wrapper.clientWidth;
    if (width !== this.state.width) {
      this.setState({width});
    }
  }

  gotData(data) {
    this.setState({selectedSeries: data.datasets.map(() => true)});
  }

  handleLegendHover = i => {
    this.setState({hoveringSeries: i});
  };
  handleLegendToggle = i => {
    const newSelection = [...this.state.selectedSeries];
    newSelection[i] = !newSelection[i];
    this.setState({selectedSeries: newSelection});
  };

  renderBody() {
    const {props: {type}, state: {data, hoveringSeries, selectedSeries}} = this;

    return (
      <div
        ref={e => {
          this.wrapper = e;
          this.calcWidth();
        }}
      >
        {this.renderTimeframeSelector()}
        {this.renderData()}
        <Legend
          data={data}
          hovering={hoveringSeries}
          onHover={this.handleLegendHover}
          onToggle={this.handleLegendToggle}
          selectedSeries={selectedSeries}
          type={type}
        />
      </div>
    );
  }
}
