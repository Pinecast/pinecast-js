import * as numeral from 'numeral';
import * as React from 'react';

import {gettext} from 'pinecast-i18n';

import {TYPES_SHOW_TOTAL} from '../../constants';

export default class Legend extends React.PureComponent {
  render() {
    const {data, hovering, onHover, onToggle, selectedSeries, type} = this.props;
    function getTotal() {
      return (
        gettext('Total: ') +
        numeral(
          data.datasets.reduce((acc, cur, i) => {
            if (selectedSeries && !selectedSeries[i]) {
              return acc;
            }
            return acc + cur.data.reduce((acc2, cur2) => acc2 + cur2, 0);
          }, 0),
        ).format('0,0')
      );
    }

    if (!data || data.datasets.length < 2) {
      if (TYPES_SHOW_TOTAL[type]) {
        return <span style={{fontSize: '0.8em'}}>{getTotal()}</span>;
      } else {
        return null;
      }
    }

    const totals = new Map();
    data.datasets.forEach(ds => {
      const total = ds.data.reduce((acc, cur) => acc + cur, 0);
      totals.set(ds, total);
    });

    return (
      <div
        className="dash-legend"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {TYPES_SHOW_TOTAL[type] && <div style={{flex: '1 1 100%', fontSize: '0.8em'}}>{getTotal()}</div>}
        {data.datasets
          .map((d, i) => [d, i])
          .sort(([a], [b]) => totals.get(b) - totals.get(a))
          .map(([x, i]) => (
            <div
              className="dash-legend-item"
              data-orig-idx={i}
              key={i}
              onClick={() => {
                if (!selectedSeries || selectedSeries.every((selected, idx) => !selected || i === idx)) {
                  return;
                }
                onToggle(i);
              }}
              onMouseOver={() => onHover(i)}
              onMouseLeave={() => {
                if (hovering !== i) {
                  return;
                }
                onHover(null);
              }}
              style={{
                flex: '1 1 50%',
                minWidth: 400,
              }}
            >
              <b
                style={{
                  background: !selectedSeries || selectedSeries[i] ? x.strokeColor : '#fff',
                  border: `1px solid ${x.strokeColor}`,
                  borderRadius: 2,
                  display: 'inline-block',
                  height: 8,
                  marginRight: 10,
                  width: 8,
                }}
              />
              <span style={{opacity: !selectedSeries || selectedSeries[i] ? 1 : 0.5}}>
                {TYPES_SHOW_TOTAL[type]
                  ? `${x.label} (${numeral(totals.get(x)).format('0,0')})`
                  : x.label}
              </span>
            </div>
          ))}
      </div>
    );
  }
}
