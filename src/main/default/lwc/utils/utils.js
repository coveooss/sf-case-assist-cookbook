export function debounce(fn, wait) {
  let timeout;
  return function () {
    const functionCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, wait); // eslint-disable-line @lwc/lwc/no-async-operation
  };
}
