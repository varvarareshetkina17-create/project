(function () {
  var modal = document.getElementById("auth-modal");
  var openBtn = document.getElementById("auth-open");
  var form = document.getElementById("auth-form");

  var closeBtn = document.getElementById("auth-close");

  if (!modal || !openBtn || !form) {
    return;
  }

  function openModal() {
    modal.classList.add("auth-modal--open");
    modal.setAttribute("aria-hidden", "false");
    var loginInput = form.querySelector('input[name="login"]');
    if (loginInput) {
      loginInput.focus();
    }
  }

  function closeModal() {
    modal.classList.remove("auth-modal--open");
    modal.setAttribute("aria-hidden", "true");
    form.reset();
  }

  openBtn.addEventListener("click", openModal);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    closeModal();
  });
})();
