document.addEventListener("DOMContentLoaded", () => {
//AOS Initialized
AOS.init();

// FastClick Initialized
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize FastClick
    FastClick.attach(document.body);

    // Initialize LazyLoad
    var lazyLoadInstance = new LazyLoad({
      elements_selector: ".lazy", // LazyLoad class
      threshold: 300 // Load images 300px before they appear on the screen
    });
  }, false);
}
});