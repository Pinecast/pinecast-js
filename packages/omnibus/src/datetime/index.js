import DateTimePicker from 'react-datetime';
import moment from 'moment';
import React, {Component} from 'react';

import './dateTimePicker.css';

export default class DateTime extends Component {
  static selector = '.input-datetime';

  static propExtraction = {
    defaultValue: e => e.getAttribute('data-default-value'),
    name: e => e.getAttribute('data-name'),
    labelNow: e => e.getAttribute('data-label-now'),
    labelDateTime: e => e.getAttribute('data-label-datetime'),
  };

  constructor(props) {
    super(props);

    this.state = {
      option: props.defaultValue ? 'datetime' : 'now',
      selection: props.defaultValue ? new Date(props.defaultValue) : null,

      invalidState: false,
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
    const {props: {labelNow, labelDateTime, name}, state: {invalidState, option, selection}} = this;

    return (
      <div className="radio-group half-flush">
        <label className="radio">
          <input
            checked={option === 'now'}
            onChange={e => {
              if (!e.target.checked) {
                return;
              }
              this.setState({option: 'now', selection: null});
            }}
            type="radio"
          />
          <span>{labelNow}</span>
        </label>
        <label className="radio">
          <input
            checked={option === 'datetime'}
            onChange={e => {
              if (!e.target.checked) {
                return;
              }
              this.setState({option: 'datetime', selection: new Date()});
            }}
            type="radio"
          />
          <span>{labelDateTime}</span>
        </label>
        {option === 'datetime' && (
          <div className="omnibus-date-picker">
            <DateTimePicker
              inputProps={{
                style: {
                  border: '2px solid #222',
                  borderColor: invalidState ? '#b00' : null,
                },
              }}
              onChange={val => {
                if (typeof val === 'string') {
                  this.setState({invalidState: val});
                  return;
                }
                this.setState({invalidState: false, selection: val.toDate()});
              }}
              open
              value={invalidState || moment(selection)}
            />
          </div>
        )}
        <input type="hidden" name={name} value={(selection || new Date()).toISOString()} />
      </div>
    );
  }
}
