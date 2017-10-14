import React, {Component} from 'react';

const allCats = (window.PODCAST_CATEGORIES || []).sort((a, b) => a.localeCompare(b));

export default class Categories extends Component {
  static selector = '.category-placeholder';

  static propExtraction = {
    name: node => node.getAttribute('data-name'),
    defCats: node => (node.getAttribute('data-default-cats') || '').split(',').filter(x => x),
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedCats: props.defCats,
      cats: allCats.sort((a, b) => {
        const leftSelected = props.defCats.indexOf(a) > -1;
        const rightSelected = props.defCats.indexOf(a) > -1;
        if (leftSelected && !rightSelected) {
          return -1;
        }
        if (!leftSelected && rightSelected) {
          return 1;
        }
        return a.localeCompare(b);
      }),
    };
  }

  getItems() {
    return allCats.map(s => {
      const isSelected = this.state.selectedCats.indexOf(s) > -1;
      return (
        <button
          className={`category${isSelected ? ' is-selected' : ''}`}
          key={s}
          onClick={e => {
            e.preventDefault();
            if (isSelected) {
              this.doUnselect(s);
            } else {
              this.doSelect(s);
            }
          }}
          type="button"
        >
          {s}
        </button>
      );
    });
  }

  doSelect(s) {
    this.setState({selectedCats: [s].concat(this.state.selectedCats).sort()});
  }
  doUnselect(s) {
    this.setState({selectedCats: this.state.selectedCats.filter(x => x !== s)});
  }

  render() {
    return (
      <div className="category-picker">
        {this.getItems()}
        <input name={this.props.name} type="hidden" value={this.state.selectedCats.join(',')} />
      </div>
    );
  }
}
