// @flow

const debounce = (func: Function, time: number) => {
  let debounceTimer: ?TimeoutID = null;

  return (...args: any) => {
    const context = this;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(func.bind(context || func, ...args), time);
  };
};

export default debounce;
