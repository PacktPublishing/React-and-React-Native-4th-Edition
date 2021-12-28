const id = (function* () {
  let i = 1;
  while (true) {
    yield i;
    i += 1;
  }
})();

class MyUser {
  constructor(first, last) {
    this.id = id.next().value;
    this.first = first;
    this.last = last;
  }

  get name() {
    return `${this.first} ${this.last}`;
  }
}

export default MyUser;
