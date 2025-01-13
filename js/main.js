const logoLink = document.querySelector(".logo-link");
const backToTopButton = document.querySelector(".back-to-top-button");

function backToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });

  setTimeout(() => {
    logoLink.focus();
  }, 1000);
}

backToTopButton.addEventListener("click", backToTop);