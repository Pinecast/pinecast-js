import React, {Component} from 'react';
import xhr from 'pinecast-xhr';


export default class SlugField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slugValid: null,
        };

        this.field = null;

        this.timeout = null;
        this.xhr = null;
    }

    get value() {
        return this.field.value;
    }

    get isValid() {
        return this.state.slugValid === true;
    }

    componentDidMount() {
        this.checkValidity();
    }
    componentWillUnmount() {
        if (this.xhr) {
            this.xhr.abort();
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    checkValidity() {
        if (this.xhr) {
            this.xhr.abort();
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if (!this.field.validity.valid) {
            this.setState({slugValid: false});
            return;
        }

        this.setState({slugValid: null});
        this.timeout = setTimeout(() => {
            this.timeout = null;
            this.xhr = xhr({
                method: 'get',
                url: `/dashboard/services/slug_available?slug=${encodeURIComponent(this.field.value)}`,
            }, (err, res, body) => {
                this.xhr = null;
                if (err || res.statusCode !== 200) {
                    this.setState({slugValid: false});
                    return;
                }
                this.setState({slugValid: JSON.parse(body).valid});
            });
        }, 500);
    }

    render() {
        const {slugValid} = this.state;
        return <div>
            <label>
                <span>{gettext('Slug')}</span>
                <input
                    defaultValue={this.props.defaultValue.slice(0, 50)}
                    maxLength={50}
                    ref={e => {
                        this.field = e;
                    }}
                    onChange={() => this.checkValidity()}
                    required
                    type='text'
                />
            </label>
            {slugValid !== null &&
                <div className={`url-availability ${slugValid ? 'is-available' : 'is-unavailable'}`}>
                    {slugValid ?
                        gettext('This slug is available!') :
                        gettext('Please choose a different slug. This one is already in use.')}
                </div>}
        </div>;
    }
};
