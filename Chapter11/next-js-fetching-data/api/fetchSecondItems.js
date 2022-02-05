export default function fetchSecondItems() {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve({
        json: () => Promise.resolve(["Four", "Five", "Six"])
      });
    }, 1000)
  );
}
