const hamburger = document.querySelector('.navigation__hamburger');
const menu = document.querySelector('.navigation__menu');

hamburger.addEventListener('click', function() {
  hamburger.classList.toggle('active');
  menu.classList.toggle('active');
});

const currentYear = new Date().getFullYear();
const yearElement = document.getElementById('current-year');
yearElement.textContent = currentYear;

document.getElementById("contact-form").addEventListener("submit", function(event) {
  event.preventDefault();
  var form = event.target;
  var formData = new FormData(form);

  fetch(form.action, {
      method: form.method,
      body: formData
  })
  .then(function(response) {
      if (response.ok) {
          return response.text();
      } else {
          throw new Error("Error");
      }
  })
  .then(function(result) {
      if (result === "success") {
          document.getElementById("message-container").textContent = "Success!";
      } else {
          document.getElementById("message-container").textContent = "Error";
      }
  })
  .catch(function(error) {
      document.getElementById("message-container").textContent = "Error";
  });
});