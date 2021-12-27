import * as React from "react";
import * as ReactDOM from "react-dom";
import MyList from "./MyList";

const root = ReactDOM.createRoot(document.getElementById("root"));
const myList = React.createRef();

ReactDOM.flushSync(() => {
  root.render(<MyList ref={myList} />);
});

for (let i = 0; i < 100; i++) {
  ReactDOM.flushSync(() => {
    myList.current.setState((state) => ({
      items: [0, ...state.items.slice(1)],
    }));
  });
}
