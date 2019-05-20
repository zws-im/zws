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
      result.innerText `An error occurred: ${error}`;
    });
}

// Credit: https://stackoverflow.com/a/30810322/2164304
function copy(string) {
  const clipboard = document.createElement("textarea");

  clipboard.classList.add("clipboard");
  clipboard.value = string;
  document.body.appendChild(clipboard);

  clipboard.focus();
  clipboard.select();
  document.execCommand("copy");

  document.body.removeChild(clipboard);
}
