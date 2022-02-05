export default function fetchFirstItems() {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve({
        json: () => Promise.resolve(["One", "Two", "Three"])
      });
    }, 1000)
  );
}
