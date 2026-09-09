document.addEventListener('DOMContentLoaded', function () {

  // ---- Skill-based project filter ----
  var filterBar = document.getElementById('skill-filter');
  var projects = document.querySelectorAll('.project');
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var chip = e.target.closest('.filter-chip');
      if (!chip) return;

      filterBar.querySelectorAll('.filter-chip').forEach(function (c) {
        c.classList.remove('active');
      });
      chip.classList.add('active');

      var cat = chip.getAttribute('data-filter');
      projects.forEach(function (p) {
        p.style.display = (cat === 'all' || p.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  }

  // ---- Contact form ----
  // To make this send straight to your Gmail inbox (no email app popup):
  // 1. Go to formspree.io, sign up free with kel.kabucye@gmail.com
  // 2. Create a form, copy the endpoint URL (looks like https://formspree.io/f/xxxxxxxx)
  // 3. Paste it below, replacing the placeholder string.
  // Until you do that, the form falls back to opening the visitor's email app instead.
  var FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = document.getElementById('cf-name');
      var emailEl = document.getElementById('cf-email');
      var messageEl = document.getElementById('cf-message');
      var errorEl = document.getElementById('cf-error');
      var successEl = document.getElementById('cf-success');
      var submitBtn = document.getElementById('cf-submit');

      var name = nameEl.value.trim();
      var email = emailEl.value.trim();
      var message = messageEl.value.trim();

      successEl.hidden = true;
      errorEl.hidden = true;

      if (!name || !email || !message) {
        errorEl.textContent = 'Fill in your name, email, and a message first.';
        errorEl.hidden = false;
        return;
      }
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        errorEl.textContent = 'That email address doesn\'t look right.';
        errorEl.hidden = false;
        return;
      }

      var usingFormspree = FORM_ENDPOINT.indexOf('YOUR_FORM_ID') === -1;

      if (!usingFormspree) {
        // Fallback: open the visitor's email app instead.
        var subject = encodeURIComponent('Portfolio contact from ' + name);
        var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
        window.location.href = 'mailto:kel.kabucye@gmail.com?subject=' + subject + '&body=' + body;
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (response) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
        if (response.ok) {
          successEl.hidden = false;
          form.reset();
        } else {
          errorEl.textContent = 'Something went wrong — try again, or email me directly.';
          errorEl.hidden = false;
        }
      }).catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
        errorEl.textContent = 'Something went wrong — try again, or email me directly.';
        errorEl.hidden = false;
      });
    });

    ['cf-name', 'cf-email', 'cf-message'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', function () {
        var errorEl = document.getElementById('cf-error');
        if (!errorEl.hidden) errorEl.hidden = true;
      });
    });
  }
});
