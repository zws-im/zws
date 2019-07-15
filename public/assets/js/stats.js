/* global ga */

import { apiURL, hostnames } from "/assets/js/constants.js";

export default () => {
  const result = document.getElementById("result");
  const long = document.getElementById("long");

  if (hostnames.includes(new URL(long.value).hostname)) {
    return (result.innerText =
      "Shortening a URL containing the URL shortener's hostname is disallowed so there won't be any results");
  }

  if (!navigator.onLine) {
    return (result.innerText = "You are offline");
  }

  result.innerText = "Loading...";

  ga ? ga("send", "event", "URLs", "stats") : console.error("Unable to log URL stats event to Google Analytics");

  return fetch(`${apiURL}/getURLStats?url=${encodeURIComponent(long.value)}`)
    .then(async response => {
      const json = await response.json();
      if (json.error) {
        throw json.error;
      } else if (!(200 <= response.status && response.status <= 299)) {
        throw `${response.status} ${response.statusText} and said ${await response.json()}`;
      }

      return (result.innerText = `Shortened ${json.shorten} times and visited ${json.get} times`);
    })
    .catch(error => {
      console.error(error);
      return (result.innerText = `An error occurred: ${error}`);
    });
};
