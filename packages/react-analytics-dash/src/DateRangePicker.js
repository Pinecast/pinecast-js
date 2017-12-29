import DateTimePicker from 'react-datetime';
import * as React from 'react';

import {gettext} from 'pinecast-i18n';

import './date-range-picker.css';

class ValidDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidState: null,
    };
  }

  render() {
    const {props, state: {invalidState}} = this;
    return (
      <DateTimePicker
        {...props}
        className={`drp-vdp ${props.className || ''}`}
        onChange={val => {
          if (typeof val === 'string') {
            this.setState({invalidState: val});
            return;
          }
          this.setState({invalidState: null});
          props.onChange(val.startOf('day'));
        }}
        timeFormat={false}
        value={invalidState || props.value}
      />
    );
  }
}

export default class DateRangePicker extends React.Component {
  constructor(props) {
    super(props);
    this._start = null;
    this._end = null;
  }
  handleChange = (dateName, value) => {
    const endDate = this.props.endDate.clone().startOf('day');
    if (
      dateName === 'startDate' &&
      value
        .clone()
        .startOf('day')
        .isSameOrAfter(endDate)
    ) {
      value = endDate.clone().add(-1, 'days');
    }
    this.props.onDatesChange({
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      [dateName]: value,
    });
  };

  render() {
    const {endDate, isOutsideRange, startDate} = this.props;
    return (
      <div className="date-range-picker">
        <div className="drp-wrapper">
          <span>{gettext('From')}</span>
          <ValidDatePicker
            isValidDate={date => !isOutsideRange(date) && date.isBefore(endDate.clone().subtract(1, 'days'))}
            onChange={val => this.handleChange('startDate', val.startOf('day'))}
            ref={el => (this._start = el)}
            value={startDate}
          />
        </div>
        <div className="drp-wrapper">
          <span>{gettext('To')}</span>
          <ValidDatePicker
            className="right-on-mobile"
            isValidDate={date => !isOutsideRange(date) && date.isAfter(startDate.clone().add(1, 'days'))}
            onChange={val => this.handleChange('endDate', val.endOf('day'))}
            ref={el => (this._end = el)}
            value={endDate}
          />
        </div>
      </div>
    );
  }
}
