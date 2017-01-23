import {Component} from 'react';


export class BaseFieldComponent extends Component {
    setEmpty(className, e) {
        e.target.className = `${className} ${e.target.value ? '' : 'is-empty'} ${this.isValid ? '' : 'is-invalid'}`;
    }
};

export class FieldComponent extends BaseFieldComponent {
    get value() {
        return this.refs.field.value;
    }

    get isValid() {
        return this.refs.field.checkValidity();
    }
};
