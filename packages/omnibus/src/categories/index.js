import React, {Component} from 'react';

import {gettext} from 'pinecast-i18n';

const allCats = (window.PODCAST_CATEGORIES || []).sort((a, b) => a.localeCompare(b));

export default class Categories extends Component {
  static selector = '.category-placeholder';

  static propExtraction = {
    name: node => node.getAttribute('data-name'),
    defCats: node => (node.getAttribute('data-default-cats') || '').split(',').filter(x => x),
  };

  constructor(props) {
    super(props);
    this.state = {selectedCats: props.defCats};
  }

  renderCategory(category) {
    const isSelected = this.state.selectedCats.includes(category);
    return (
      <button
        className={`category${isSelected ? ' is-selected' : ''}`}
        key={category}
        onClick={e => {
          e.preventDefault();
          if (isSelected) {
            this.doUnselect(category);
          } else {
            this.doSelect(category);
          }
        }}
        type="button"
      >
        {category}
      </button>
    );
  }

  getItems() {
    const {selectedCats} = this.state;
    return allCats.filter(c => !selectedCats.includes(c)).map(c => this.renderCategory(c));
  }

  doSelect(s) {
    this.setState({selectedCats: [s].concat(this.state.selectedCats).sort()});
  }
  doUnselect(s) {
    this.setState({
      selectedCats: this.state.selectedCats.filter(x => x !== s),
    });
  }

  render() {
    return (
      <div className="category-picker">
        {this.state.selectedCats.length > 3 && (
          <div className="category-error">
            {gettext('You have selected too many categories! Some categories may be ignored by Apple and Google.')}
          </div>
        )}
        <div className="category-picker-group">{this.state.selectedCats.map(x => this.renderCategory(x))}</div>
        <div className="category-picker-group">{this.getItems()}</div>
        <input name={this.props.name} type="hidden" value={this.state.selectedCats.join(',')} />
      </div>
    );
  }
}
