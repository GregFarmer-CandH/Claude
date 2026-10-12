(function () {
	"use strict";
	var header = document.getElementById("fc-header");
	var toggle = document.getElementById("fc-nav-toggle");
	if (!header || !toggle) {
		return;
	}
	toggle.addEventListener("click", function () {
		var isOpen = header.classList.toggle("is-open");
		toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
	});
})();
