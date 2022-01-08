function* genItems() {
  let cnt = 0;

  while (true) {
    yield `Item ${cnt++}`;
  }
}

const items = genItems();

export function fetchItems() {
  return Promise.resolve({
    json: () =>
      Promise.resolve({
        items: new Array(30).fill(null).map(() => items.next().value),
      }),
  });
}
