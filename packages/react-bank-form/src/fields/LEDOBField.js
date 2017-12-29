import * as React from 'react';

import {gettext} from 'pinecast-i18n';

import {BaseFieldComponent} from './FieldComponent';

export default class LEDOBField extends BaseFieldComponent {
  get isValid() {
    return !!this.refs['day-field'].checkValidity() && !!this.refs['year-field'].checkValidity();
  }

  get value() {
    return new Date(this.refs['year-field'].value, this.refs['month-field'].value - 1, this.refs['day-field'].value);
  }

  handleInput = () => {
    const year = parseInt(this.refs['year-field'].value, 10);
    if (this.props.onInput) {
      if (year) {
        this.props.onInput({
          year: year || 0,
          month: parseInt(this.refs['month-field'].value, 10) || 1,
          day: parseInt(this.refs['day-field'].value, 10) || 1,
        });
      } else {
        this.props.onInput(undefined);
      }
    }
  };

  render() {
    return (
      <label className="ledob-label" style={{flex: '1 1 100%'}}>
        <span>{gettext('Date of birth')}</span>
        <div style={{display: 'flex'}}>
          <div className="select" style={{flex: '1 1 45%', marginRight: '15px'}}>
            <select ref="month-field" onInput={this.handleInput}>
              <option value={1}>{gettext('January')}</option>
              <option value={2}>{gettext('February')}</option>
              <option value={3}>{gettext('March')}</option>
              <option value={4}>{gettext('April')}</option>
              <option value={5}>{gettext('May')}</option>
              <option value={6}>{gettext('June')}</option>
              <option value={7}>{gettext('July')}</option>
              <option value={8}>{gettext('August')}</option>
              <option value={9}>{gettext('September')}</option>
              <option value={10}>{gettext('October')}</option>
              <option value={11}>{gettext('November')}</option>
              <option value={12}>{gettext('December')}</option>
            </select>
          </div>

          <input
            type="number"
            className="ledob-day-field is-empty"
            defaultValue="1"
            max={31}
            min={1}
            onInput={this.handleInput}
            ref="day-field"
            required={true}
            style={{flex: '1 1 30%', marginRight: '15px', textAlign: 'center'}}
          />

          <input
            type="text"
            className="ledob-year-field is-empty"
            onInput={e => {
              e.target.className = `
                            ledob-year-field
                            ${e.target.value ? '' : 'is-empty'}
                            ${e.target.checkValidity() ? 'is-valid' : 'is-invalid'}
                        `;
              this.handleInput();
            }}
            pattern="[12][90]\d\d"
            placeholder="1990"
            ref="year-field"
            required={true}
            style={{flex: '1 1 25%', textAlign: 'center'}}
          />
        </div>
      </label>
    );
  }
}
