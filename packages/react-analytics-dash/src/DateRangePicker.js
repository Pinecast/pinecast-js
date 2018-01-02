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

  handleDateChange = val => {
    if (typeof val === 'string') {
      this.setState({invalidState: val});
      return;
    }
    this.setState({invalidState: null});
    this.props.onChange(val.startOf('day'));
  };

  render() {
    const {props, state: {invalidState}} = this;
    return (
      <DateTimePicker
        {...props}
        className={`drp-vdp ${props.className || ''}`}
        onChange={this.handleDateChange}
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

  handleStartDateRef = el => (this._start = el);
  isValidStartDate = date =>
    !this.props.isOutsideRange(date) && date.isBefore(this.props.endDate.clone().startOf('day'));
  handleStartDateChange = val => this.handleChange('startDate', val.startOf('day'));

  handleEndDateRef = el => (this._end = el);
  isValidEndDate = date => !this.props.isOutsideRange(date) && date.isAfter(this.props.startDate);
  handleEndDateChange = val => this.handleChange('endDate', val.endOf('day'));

  render() {
    const {endDate, startDate} = this.props;
    return (
      <div className="date-range-picker">
        <div className="drp-wrapper">
          <span>{gettext('From')}</span>
          <ValidDatePicker
            isValidDate={this.isValidStartDate}
            onChange={this.handleStartDateChange}
            ref={this.handleStartDateRef}
            value={startDate}
          />
        </div>
        <div className="drp-wrapper">
          <span>{gettext('To')}</span>
          <ValidDatePicker
            className="right-on-mobile"
            isValidDate={this.isValidEndDate}
            onChange={this.handleEndDateChange}
            ref={this.handleEndDateRef}
            value={endDate}
          />
        </div>
      </div>
    );
  }
}
