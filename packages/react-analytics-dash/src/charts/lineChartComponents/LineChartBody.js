import * as spline from '@yr/monotone-cubic-spline';
import React, {Component} from 'react';

import renderBalloons from './balloons';

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
  const step = (max - min) / 10;
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

export default class LineChartBody extends Component {
  getYDomain() {
    const {data} = this.props;
    return [
      Math.min(...data.datasets.map(ds => Math.min(...ds.data))),
      Math.max(...data.datasets.map(ds => Math.max(...ds.data))),
    ];
  }

  getMargins() {
    const {data} = this.props;
    return {
      marginBottom: 15,
      marginLeft: 30 + Math.max(...data.datasets.map(ds => measureText(Math.max(ds.data).toString()))),
      marginRight: 15,
      marginTop: 30,

      xAxisHeight: 60,
    };
  }

  render() {
    const {data, endDate, episodeList, height, startDate, width} = this.props;

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
          <line className="domain" stroke="#000" x1={marginLeft} x2={width - marginRight} y1={0} y2={0} />
          {xTicks.map((tickValue, i) => {
            return (
              <g className="tick" key={i} transform={`translate(${xRange(tickValue)}, 0)`}>
                <text dy="0.71em" fill="#000" transform="rotate(-45)" y={0} x={-6}>
                  {data.labels[tickValue]}
                </text>
              </g>
            );
          })}
        </g>
        <g className="yAxis" fill="none" fontSize={12} textAnchor="end" transform={`translate(${marginLeft}, 0)`}>
          <line className="domain" stroke="#000" x1={0} x2={0} y1={yRangeTop} y2={yRangeBottom} />
          {yTicks.map((tickValue, i) => {
            return (
              <g className="tick" key={i} transform={`translate(0, ${yRange(tickValue)})`}>
                <line stroke="#000" x2={-1} />
                <text dy="0.32em" fill="#000" x={-8}>
                  {Math.ceil(tickValue) === Math.floor(tickValue) ? tickValue : ''}
                </text>
              </g>
            );
          })}
        </g>
        {this.renderLines(data, xRange, yRange)}
        <g className="tooltips">
          {data.labels.map((label, idx) => {
            return (
              <g key={idx}>
                <rect
                  className="has-tooltip"
                  data-tooltip={`
                                <b>${label}</b><br>
                                ${data.datasets.length > 1
                                  ? `Total: ${data.datasets.reduce((acc, cur) => acc + cur.data[idx], 0)}<br>`
                                  : ''}
                                ${data.datasets
                                  .filter(x => x.data[idx])
                                  .map(x => `${x.label}: ${x.data[idx]}`)
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
        {episodeList &&
          renderBalloons(
            startDate,
            endDate,
            data,
            episodeList,
            innerWidth,
            `translate(${marginLeft}, ${height - marginBottom - xAxisHeight})`,
          )}
      </svg>
    );
  }

  renderLines(data, xRange, yRange) {
    const {hovering} = this.props;
    return (
      <g className="lines">
        {data.datasets.map((dataset, idx) => (
          <g key={idx}>
            <path
              className="chart-line"
              d={spline.svgPath(
                spline.points(
                  data.labels.map((_, i) => [
                    xRange(i),
                    yRange(dataset.data[i - (data.labels.length - dataset.data.length)] || 0),
                  ]),
                ),
              )}
              fill="none"
              stroke={dataset.strokeColor}
              strokeWidth={hovering === idx ? 3.5 : 2}
            />
            {data.labels.map((_, i) => {
              const value = dataset.data[i - (data.labels.length - dataset.data.length)] || 0;
              return (
                <circle
                  key={i}
                  cx={xRange(i)}
                  cy={yRange(value)}
                  r={value ? 4.5 : 2.5}
                  fill={dataset.pointColor}
                  stroke={value ? '#fff' : 'transparent'}
                  strokeWidth="2px"
                />
              );
            })}
          </g>
        ))}
      </g>
    );
  }
}
