export default str => {
  const el = document.createElement("textarea");
  el.classList.add("clipboard");
  el.value = str;
  document.body.appendChild(el);

  el.select();
  document.execCommand("copy");

  document.body.removeChild(el);
};
