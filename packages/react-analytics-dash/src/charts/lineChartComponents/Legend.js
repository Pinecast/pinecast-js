import React, {Component} from 'react';

import {TYPES_SHOW_TOTAL} from '../../constants';


export default class Legend extends Component {
    render() {
        const {data, hovering, onHover, onToggle, selectedSeries, type} = this.props;
        function getTotal() {
            return gettext('Total: ') + data.datasets.reduce(
                (acc, cur, i) => {
                    if (selectedSeries && !selectedSeries[i]) {
                        return acc;
                    }
                    return acc + cur.data.reduce((acc2, cur2) => acc2 + cur2, 0);
                },
                0
            );
        }

        if (!data || data.datasets.length < 2) {
            if (TYPES_SHOW_TOTAL[type]) {
                return <span>{getTotal()}</span>;
            } else {
                return null;
            }
        }

        return <div>
            <div>{getTotal()}</div>
            {data.datasets.map((x, i) =>
                <div
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
                        {`${x.label} (${x.data.reduce((acc, cur) => acc + cur, 0)})`}
                    </span>
                </div>)}
        </div>;
    }
};
