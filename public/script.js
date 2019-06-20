const hostnames = [
  "zws.im",
  "zero-width-shortener.firebaseapp.com",
  "zero-width-shortener.web.app",
  "zws.jonahsnider.ninja"
];

function shorten() {
  const apiURL = "https://us-central1-zero-width-shortener.cloudfunctions.net";

  const result = document.getElementById("result");
  const long = document.getElementById("long");

  if (hostnames.includes(new URL(long.value).hostname)) {
    return result.innerText = "Shortening a URL containing the URL shortener's hostname is disallowed"
  }

  result.innerText = "Shortening…";

  return fetch(`${apiURL}/shortenURL?url=${encodeURIComponent(long.value)}`)
    .then(
      async response => {
        const json = await response.json();
        if (json.error) {
          throw json.error;
        } else if (!((200 <= response.status) && (response.status <= 299))) {
          response.
          throw `${response.status} ${response.statusText} and said ${await response.json()}`
        }

        const url = `https://zws.im/${json.short}`;
        copy(url);
        return result.innerText = `Copied to clipboard: ${url}`;
      }
    )
    .catch(error => {
      console.error(error);
      return result.innerText = `An error occurred: ${error}`;
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
