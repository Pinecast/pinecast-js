import DatePicker from 'react-datepicker';
import TimeInput from 'time-input';
import React from 'react';


export default class Importer extends React.Component {
    static selector = '.input-datetime';

    static propExtraction = {
        defaultValue: e => e.getAttribute('data-default-value'),
        labelNow: e => e.getAttribute('data-label-now'),
        labelDateTime: e => e.getAttribute('data-label-datetime'),
    };

    constructor(props) {
        super(props);

        this.state = {
            option: props.defaultValue ? 'now' : 'datetime',
            selection: props.defaultValue ? new Date(props.defaultValue) : null,
        };
    }

    render() {
        const {
            props: {
                labelNow,
                labelDateTime,
            },
            state: {option, selection},
        } = this;

        return <div className='radio-group'>
            <label className='radio'>
                <input
                    checked={option === 'now'}
                    onChange={e => {
                        if (!e.target.checked) {
                            return;
                        }
                        this.setState({option: 'now', selection: null});
                    }}
                    type='radio'
                />
                <span>{labelNow}</span>
            </label>
            <label className='radio'>
                <input
                    checked={option === 'datetime'}
                    onChange={e => {
                        if (!e.target.checked) {
                            return;
                        }
                        this.setState({option: 'datetime', selection: new Date()});
                    }}
                    type='radio'
                />
                <span>{labelDateTime}</span>
            </label>
            {option === 'datetime' &&
                <div>
                    <label>
                        <span>{gettext('Date')}</span>
                        <DatePicker />
                    </label>
                    <label>
                        <span>{gettext('Time')}</span>
                        <TimeInput />
                    </label>
                </div>}
        </div>;
    }
};
