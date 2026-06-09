(function () {
  var navButton = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (navButton && mobileNav) {
    navButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    }

    function startTimer() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var index = Number(dot.getAttribute("data-slide"));
        showSlide(index);
        startTimer();
      });
    });

    if (slides.length > 1) {
      startTimer();
    }
  }

  var movieLists = Array.prototype.slice.call(document.querySelectorAll("[data-movie-list]"));

  movieLists.forEach(function (list) {
    var scope = list.closest("section") || document;
    var searchInput = scope.querySelector(".movie-search");
    var yearFilter = scope.querySelector(".year-filter");
    var typeFilter = scope.querySelector(".type-filter");
    var genreFilter = scope.querySelector(".genre-filter");
    var categoryName = list.getAttribute("data-category") || "";
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";

    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : "");
      var year = yearFilter ? yearFilter.value : "";
      var type = typeFilter ? typeFilter.value : "";
      var genre = genreFilter ? genreFilter.value : "";

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search"));
        var cardYear = card.getAttribute("data-year") || "";
        var cardType = card.getAttribute("data-type") || "";
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchYear = !year || cardYear === year;
        var matchType = !type || cardType.indexOf(type) !== -1;
        var matchGenre = !genre || genre === categoryName || text.indexOf(normalize(genre)) !== -1;
        card.classList.toggle("is-hidden-card", !(matchQuery && matchYear && matchType && matchGenre));
      });
    }

    [searchInput, yearFilter, typeFilter, genreFilter].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });

    applyFilters();
  });
})();
