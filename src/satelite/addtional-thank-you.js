(function () {
  window.isThankYouPage = true;

  var head = document.getElementsByTagName('head')[0];

  loadCss("https://chmurson.github.io/shopify/extra.css?_h=1");
  loadScript("https://chmurson.github.io/shopify/hotjar.js?_h=2");
  loadScript("https://chmurson.github.io/shopify/init.bundle.js?_h=10");
  loadScript("https://chmurson.github.io/shopify/thank-you.bundle.js?_h=10");

  function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
  }

  function loadCss(filename) {
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    head.appendChild(fileref);
  }

})();