function shorten() {
  const apiURL = "https://us-central1-zero-width-shortener.cloudfunctions.net";

  const result = document.getElementById("result");
  const long = document.getElementById("long");
  result.innerText = "Shortening…";

  fetch(`${apiURL}/shortenURL?url=${encodeURIComponent(long.value)}`)
    .then(
      async response => {
        const url = `https://zws.im/${(await response.json()).short}`;
        copy(url);
        result.innerText = `Copied to clipboard: ${url}`;
      }
    )
    .catch(error => {
      console.error(error);
      result.innerText = `An error occurred: ${error}`;
    });
}

function copy(str) {
  const el = document.createElement('textarea');
  el.classList.add("clipboard");
  el.value = str;
  document.body.appendChild(el);

  el.select();
  document.execCommand('copy');

  document.body.removeChild(el);
}
