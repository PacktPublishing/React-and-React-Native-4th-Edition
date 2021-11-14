import * as React from 'react';
import * as ReactDOM from 'react-dom';

const enabled = false;
const text = 'A Button';
const placeholder = 'input value...';
const size = 50;

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <section>
    <button disabled={!enabled}>{text}</button>
    <input placeholder={placeholder} size={size} />
  </section>
);
