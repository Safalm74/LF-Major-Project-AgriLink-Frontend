export function debounce(callback: Function, delay: number) {
  let timeoutId: number;

  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
