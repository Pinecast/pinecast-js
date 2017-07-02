import {Buffer} from 'buffer';
import React from 'react';


export default class ImageViewer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            url: this.getURL(props),
        };
        this.windowURL = null;
    }

    componentWillReceiveProps(newProps) {
        this.setState({url: this.getURL(newProps)});
    }

    componentWillUnmount() {
        if (this.windowURL) {
            URL.revokeObjectURL(this.windowURL);
            this.windowURL = null;
        }
    }

    getURL({source}) {
        if (typeof source === 'string') {
            return source;
        }
        if (typeof File !== 'undefined' && source instanceof File) {
            return this.windowURL = URL.createObjectURL(source);
        }
        return this.windowURL = URL.createObjectURL(new Blob([source]));
    }

    render() {
        const {props: {source, ...props}, state: {url}} = this;
        return <img alt='' {...props} src={url} />;
    }
};
