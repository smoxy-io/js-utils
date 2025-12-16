
export const addGlobalStyle = (css) => {
  if (!document || !document.head) {
    return;
  }

  const head = document.head;
  const style = document.createElement('style');

  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));

  head.appendChild(style);
}