import moment from 'moment';
import React, {Component} from 'react';
import {SingleDatePicker} from 'react-dates';
import TimeInput from '@mattbasta/time-input';


export default class DateTime extends Component {
    static selector = '.input-datetime';

    static propExtraction = {
        defaultValue: e => e.getAttribute('data-default-value'),
        name: e => e.getAttribute('data-name'),
        labelNow: e => e.getAttribute('data-label-now'),
        labelDateTime: e => e.getAttribute('data-label-datetime'),

        labelDate: e => e.getAttribute('data-label-date'),
        labelTime: e => e.getAttribute('data-label-time'),
    };

    constructor(props) {
        super(props);

        this.state = {
            dateFocused: false,

            option: props.defaultValue ? 'datetime' : 'now',
            selection: props.defaultValue ? new Date(props.defaultValue) : null,
        };
    }

    getSelectionTime() {
        const selection = this.state.selection;
        return (
            String('0' + (selection.getHours() % 12 || 12)).substr(-2) +
            ':' +
            ('0' + selection.getMinutes()).substr(-2) +
            ' ' +
            (selection.getHours() < 12 ? 'AM' : 'PM')
        );
    }

    render() {
        const {
            props: {
                labelNow,
                labelDate,
                labelDateTime,
                labelTime,
                name,
            },
            state: {dateFocused, option, selection},
        } = this;

        return <div className='radio-group half-flush'>
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
                        <span>{labelDate}</span>
                        <SingleDatePicker
                            date={moment(selection)}
                            focused={dateFocused}
                            isDayBlocked={() => false}
                            isOutsideRange={() => false}
                            onDateChange={d => {
                                this.setState({
                                    selection: new Date(
                                        d.year(),
                                        d.month(),
                                        d.date(),
                                        selection.getHours(),
                                        selection.getMinutes()
                                    ),
                                });
                            }}
                            onFocusChange={({focused}) => this.setState({dateFocused: focused})}
                            required
                        />
                    </label>
                    <label>
                        <span>{labelTime}</span>
                        <TimeInput
                            defaultValue='12:00 AM'
                            onChange={newVal => {
                                const parts = /(\d+):(\d+) (AM|PM)/.exec(newVal);
                                if (!parts) {
                                    return;
                                }
                                const hours = parts[1] | 0;
                                const minutes = parts[2] | 0;
                                const isPM = parts[3] === 'PM';
                                const hours24 = hours === 12 ?
                                    (isPM ? 12 : 0) :
                                    hours + (isPM ? 12 : 0);

                                const newDate = new Date(
                                    selection.getFullYear(),
                                    selection.getMonth(),
                                    selection.getDate(),
                                    hours24,
                                    minutes
                                );

                                // Reset the date in case it rolled over
                                newDate.setDate(selection.getDate());
                                newDate.setMonth(selection.getMonth());
                                newDate.setFullYear(selection.getFullYear());

                                this.setState({selection: newDate});
                            }}
                            validate={v => /(1[0-2]|[1-9]):[0-5][0-9] (AM|PM)/i.test(v)}
                            value={this.getSelectionTime()}
                        />
                    </label>
                </div>}
            <input
                type='hidden'
                name={name}
                value={(selection || new Date()).toISOString()}
            />
        </div>;
    }
};
