import * as React from 'react';

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
      return (this.windowURL = URL.createObjectURL(source));
    }
    const type = source.type ? {type: source.type} : undefined;
    return (this.windowURL = URL.createObjectURL(new Blob([source], type)));
  }

  render() {
    const {props: {source, ...props}, state: {url}} = this;
    void source;
    return <img alt="" {...props} src={url} />;
  }
}
