import * as React from "react";

function referenceEquality(arr1, arr2) {
  return arr1 === arr2;
}

function valueEquality(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

class MyList extends React.Component {
  state = {
    items: new Array(5000).fill(null).map((v, i) => i),
  };

  shouldComponentUpdate(props, state) {
    if (!referenceEquality(this.state.items, state.items)) {
      return !valueEquality(this.state.items, state.items);
    }

    return false;
  }

  render() {
    return (
      <ul>
        {this.state.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
}

export default MyList;
