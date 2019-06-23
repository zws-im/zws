const scripts = ["constants.js", "copy.js", "registerServiceWorker.js", "shorten.js", "stats.js"].map(
  fileName => `/assets/js/${fileName}`
);
const styles = ["overrides.css"].map(fileName => `/assets/${fileName}`);
const images = [
  "logo-512.png",
  "logo-type.png",
  "undraw_browser_stats.svg",
  "undraw_page_not_found.svg",
  "undraw_portfolio.svg"
].map(fileName => `/assets/image/${fileName}`);

const pages = ["index", "404", "stats"].map(fileName => `/${fileName}`);
pages.push("./");

const toCache = [...images, ...pages, ...scripts, ...styles];

// Here comes the install event! This only happens once, when the browser sees this version of the ServiceWorker for the first time.
self.addEventListener("install", event => {
  // We pass a promise to event.waitUntil to signal how long install takes, and if it failed
  event.waitUntil(
    // We open a cache…
    caches.open("zws").then(cache =>
      // And add resources to it
      cache.addAll(toCache).catch(console.error)
    )
  );
});

// The fetch event happens for the page request with the ServiceWorker's scope, and any request made within that page
self.addEventListener("fetch", function(event) {
  // Calling event.respondWith means we're in charge of providing the response. We pass in a promise that resolves with a response object
  event.respondWith(
    // First we look for something in the caches that matches the request
    caches.match(event.request).then(function(response) {
      // If we get something, we return it, otherwise it's null, and we'll pass the request to fetch, which will use the network.
      return response || fetch(event.request);
    })
  );
});
