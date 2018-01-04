import * as numeral from 'numeral';
import * as React from 'react';

const gridlineStyle = {stroke: 'rgba(0, 0, 0, 0.075)', strokeWidth: 0.5};

const c = document.createElement('canvas');
const ctx = c.getContext('2d');

function measureText(text, font = '14px sans-serif') {
  ctx.font = font;
  return ctx.measureText(text).width;
}

function scaleLinearLight(rangeMin, rangeMax, domainMin, domainMax) {
  return domainValue => {
    const domainPercent = (domainValue - domainMin) / (domainMax - domainMin);
    return (rangeMax - rangeMin) * domainPercent + rangeMin;
  };
}

const E10 = Math.sqrt(50);
const E5 = Math.sqrt(10);
const E2 = Math.sqrt(2);

function getTickIncrement(min, max) {
  if (min === max) {
    return 0;
  }
  const step = (max - min) / 5;
  const power = Math.floor(Math.log(step) / Math.LN10);
  const error = step / Math.pow(10, power);
  return power >= 0
    ? (error >= E10 ? 10 : error >= E5 ? 5 : error >= E2 ? 2 : 1) * Math.pow(10, power)
    : -Math.pow(10, -power) / (error >= E10 ? 10 : error >= E5 ? 5 : error >= E2 ? 2 : 1);
}
function getTickValues(min, max) {
  const step = getTickIncrement(min, max);
  if (step > 0) {
    const start = Math.ceil(min / step);
    const stop = Math.floor(max / step);
    return [...new Array(Math.ceil(stop - start + 1))].map((_, i) => (start + i) * step);
  } else {
    const start = Math.floor(min * step);
    const stop = Math.ceil(max * step);
    return [...new Array(Math.ceil(start - stop + 1))].map((_, i) => (start - i) * step);
  }
}

export default class BaseChartBody extends React.Component {
  getYDomain() {
    throw new Error('Not implemented');
  }

  getMargins() {
    const {data} = this.props;
    return {
      marginBottom: 15,
      marginLeft: 30 + Math.max(0, 0, ...data.datasets.map(ds => measureText(Math.max(ds.data).toString()))),
      marginRight: 15,
      marginTop: 30,

      xAxisHeight: 60,
    };
  }

  render() {
    const {data, height, width} = this.props;

    const {marginBottom, marginLeft, marginRight, marginTop, xAxisHeight} = this.getMargins();

    // Ranges
    const xRange = scaleLinearLight(marginLeft, width - marginRight, 0, data.labels.length - 1);

    const yRangeTop = height - marginBottom - xAxisHeight;
    const yRangeBottom = marginTop;
    const [yMin, yMax] = this.getYDomain();
    const yRange = scaleLinearLight(yRangeTop, yRangeBottom, yMin, yMax);

    const innerWidth = width - marginLeft - marginRight;

    const yTicks = getTickValues(yMin, yMax);
    const xTicks = getTickValues(0, data.labels.length - 1);

    return (
      <svg
        className="line-chart"
        height={height}
        width={width}
        style={{
          display: 'block',
          margin: 'auto',
        }}
      >
        <g className="grid">
          <g className="gridlines-x">
            <line style={gridlineStyle} x1={marginLeft} x2={width - marginRight} y1={marginTop} y2={marginTop} />
            {yTicks.map(tickVal => {
              const y = yRange(tickVal);
              return <line key={y} style={gridlineStyle} x1={marginLeft} x2={width - marginRight} y1={y} y2={y} />;
            })}
          </g>
          <g className="gridlines-y">
            <line
              style={gridlineStyle}
              x1={width - marginRight}
              x2={width - marginRight}
              y1={marginTop}
              y2={yRangeTop}
            />
            {xTicks.map(tickVal => {
              const x = xRange(tickVal);
              return <line key={x} style={gridlineStyle} x1={x} x2={x} y1={marginTop} y2={yRangeTop} />;
            })}
          </g>
        </g>
        <g
          className="xAxis"
          fill="none"
          fontSize={12}
          fontFamily="sans-serif"
          textAnchor="end"
          transform={`translate(0, ${height - marginBottom - xAxisHeight})`}
        >
          <line className="domain" stroke="#666" x1={marginLeft} x2={width - marginRight} y1={0} y2={0} />
          {xTicks.map((tickValue, i) => {
            return (
              <g className="tick" key={i} transform={`translate(${xRange(tickValue)}, 0)`}>
                <text dy="0.71em" fill="#999" transform="rotate(-45)" y={0} x={-6}>
                  {data.labels[tickValue]}
                </text>
              </g>
            );
          })}
        </g>
        <g className="yAxis" fill="none" fontSize={12} textAnchor="end" transform={`translate(${marginLeft}, 0)`}>
          <line className="domain" stroke="#999" x1={0} x2={0} y1={yRangeTop} y2={yRangeBottom} />
          {yTicks.map((tickValue, i) => {
            return (
              <g className="tick" key={i} transform={`translate(0, ${yRange(tickValue)})`}>
                <line stroke="#666" x2={-1} />
                <text dy="0.32em" fill="#999" x={-8}>
                  {Math.ceil(tickValue) === Math.floor(tickValue) ? numeral(tickValue).format('0,0') : ''}
                </text>
              </g>
            );
          })}
        </g>
        {this.renderLines(data, xRange, yRange)}
        <g className="tooltips">
          {data.labels.map((label, idx) => {
            return (
              <g className="tooltip-group" key={idx}>
                <line
                  className="tooltip-marker"
                  x1={xRange(idx)}
                  x2={xRange(idx)}
                  y1={marginTop}
                  y2={height - marginBottom - xAxisHeight}
                />
                <rect
                  className="has-tooltip"
                  data-tooltip={`
                    <b>${label}</b>${data.datasets.length > 1
                    ? ` · Total: ${numeral(data.datasets.reduce((acc, cur) => acc + (cur.data[idx] || 0), 0)).format(
                        '0,0',
                      )}`
                    : ''}
                    <br>
                    ${data.datasets
                      .filter(x => x.data[idx])
                      .sort((a, b) => b.data[idx] - a.data[idx])
                      .map(x => `${x.label}: ${numeral(x.data[idx]).format('0,0')}`)
                      .join('<br>')}
                  `}
                  fill="transparent"
                  height={height - marginTop - marginBottom - xAxisHeight}
                  key={idx}
                  width={Math.ceil(innerWidth / data.labels.length)}
                  x={Math.floor((xRange(idx) + xRange(idx - 1)) / 2 + 1)}
                  y={marginTop}
                />
              </g>
            );
          })}
        </g>
        {this.renderChartExtra(data)}
      </svg>
    );
  }

  renderLines() {
    throw new Error('Not implemented');
  }

  renderChartExtra() {
    return null;
  }
}
