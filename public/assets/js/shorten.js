/* global ga */
import { apiURL, hostnames } from "/assets/js/constants.js";
import copy from "/assets/js/copy.js";

export default () => {
  const result = document.getElementById("result");
  const long = document.getElementById("long");

  if (hostnames.includes(new URL(long.value).hostname)) {
    return (result.innerText = "Shortening a URL containing the URL shortener's hostname is disallowed");
  }

  if (!navigator.onLine) {
    return (result.innerText = "You are offline");
  }

  result.innerText = "Shortening…";

  try {
    ga("send", "event", "URLs", "shorten");
  } catch(error) {
    console.error("Error sending statistics to Google Analytics", error);
  }

  return fetch(`${apiURL}/shortenURL?url=${encodeURIComponent(long.value)}`)
    .then(async response => {
      const json = await response.json();
      if (json.error) {
        throw json.error;
      } else if (!(200 <= response.status && response.status <= 299)) {
        throw `${response.status} ${response.statusText} and said ${await response.json()}`;
      }

      const url = `https://zws.im/${json.short}`;
      copy(url);
      return (result.innerText = `Copied to clipboard: ${url}`);
    })
    .catch(error => {
      console.error(error);
      return (result.innerText = `An error occurred: ${error}`);
    });
};
