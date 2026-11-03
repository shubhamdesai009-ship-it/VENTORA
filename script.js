
// VENTORA launch frontend.
// This static build is a visual prototype. Connect a secure backend
// before accepting real accounts, storing user data, or processing payments.

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const modal = $('#modalBackdrop');
const content = $('#modalContent');

let selectedRole = 'reviewer';

const roleInfo = {
  founder: {
    label: 'Startup founder',
    icon: '✳',
    intro: 'Showcase your concept and get useful market feedback.'
  },
  reviewer: {
    label: 'Community reviewer',
    icon: '◎',
    intro: 'Explore new ideas and help founders improve them.'
  },
  investor: {
    label: 'Investor',
    icon: '↗',
    intro: 'Discover early-stage concepts and request founder introductions.'
  }
};

function openModal(mode = 'signup', role) {
  if (!modal || !content) return;

  selectedRole = role || 'reviewer';

  const login = mode === 'login';

  $('#modalTitle').textContent = login
    ? 'Welcome back'
    : 'Create your account';

  $('#modalIntro').textContent = login
    ? 'Log in to continue to your VENTORA workspace.'
    : 'Choose the account that best describes how you want to take part.';

  renderAccountForm(login);

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function renderAccountForm(login = false) {
  if (!content) return;

  content.innerHTML = `
    ${
      login
        ? ''
        : `
          <div class="role-picker">
            ${Object.entries(roleInfo)
              .map(([key, value]) => `
                <button
                  type="button"
                  class="role-option ${selectedRole === key ? 'selected' : ''}"
                  data-role-choice="${key}"
                >
                  <b>${value.icon}</b>${value.label}
                </button>
              `)
              .join('')}
          </div>

          <p class="modal-intro">${roleInfo[selectedRole].intro}</p>
        `
    }

    <form id="accountForm">
      <div class="form-row">
        ${
          login
            ? ''
            : `
              <div class="form-field">
                <label>YOUR NAME</label>
                <input name="name" placeholder="Full name" required>
              </div>
            `
        }

        <div class="form-field">
          <label>EMAIL ADDRESS</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          >
        </div>
      </div>

      <div class="form-field">
        <label>PASSWORD</label>
        <input
          name="password"
          type="password"
          minlength="8"
          placeholder="At least 8 characters"
          required
        >
      </div>

      ${
        !login && selectedRole === 'founder'
          ? `
            <div class="form-field">
              <label>STARTUP / PROJECT NAME (OPTIONAL)</label>
              <input name="startup" placeholder="Your project name">
            </div>
          `
          : ''
      }

      ${
        !login && selectedRole === 'investor'
          ? `
            <div class="form-field">
              <label>INVESTOR TYPE</label>
              <select name="investorType">
                <option>Angel investor</option>
                <option>Venture capital firm</option>
                <option>Investment group</option>
                <option>Other / exploring</option>
              </select>
            </div>
          `
          : ''
      }

      <button class="btn btn-primary form-submit" type="submit">
        ${login ? 'Log in' : `Create ${roleInfo[selectedRole].label.toLowerCase()} account`} ↗
      </button>

      <div class="form-message" id="formMessage"></div>
    </form>
  `;

  $$('[data-role-choice]', content).forEach(button => {
    button.addEventListener('click', () => {
      selectedRole = button.dataset.roleChoice;
      renderAccountForm(login);
    });
  });

  const accountForm = $('#accountForm', content);

  accountForm.addEventListener('submit', event => {
    event.preventDefault();

    const message = $('#formMessage', content);

    message.style.display = 'block';
    message.textContent =
      'VENTORA account access is not active yet. This is a frontend preview. Connect Supabase Auth and a database before accepting real registrations. No information has been sent or stored.';
  });
}

// Open signup/login modal.
$$('[data-open]').forEach(button => {
  button.addEventListener('click', () => {
    openModal(button.dataset.open || 'signup', button.dataset.role);
  });
});

// Modal controls.
$('#modalClose')?.addEventListener('click', closeModal);

modal?.addEventListener('click', event => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});

// Idea category filters.
$$('.filter').forEach(button => {
  button.addEventListener('click', () => {
    $$('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    filterIdeas();
  });
});

// Idea search.
$('#ideaSearch')?.addEventListener('input', filterIdeas);

function filterIdeas() {
  const searchInput = $('#ideaSearch');
  if (!searchInput) return;

  const activeFilter = $('.filter.active')?.dataset.filter || 'all';
  const query = searchInput.value.toLowerCase();

  $$('.idea-card').forEach(card => {
    const matchesCategory =
      activeFilter === 'all' ||
      card.dataset.category === activeFilter;

    const searchContent =
      (card.dataset.search || '') + ' ' + card.innerText;

    const matchesText = searchContent.toLowerCase().includes(query);

    card.style.display =
      matchesCategory && matchesText ? '' : 'none';
  });
}

// Idea interaction.
$$('[data-idea]').forEach(button => {
  button.addEventListener('click', () => {
    openModal('signup', 'reviewer');

    const intro = $('#modalIntro');

    if (intro) {
      intro.textContent =
        `You selected “${button.dataset.idea}”. Create a free VENTORA reviewer account to rate and comment when the community backend is connected.`;
    }
  });
});

// Monthly/yearly pricing switch.
$$('.billing').forEach(button => {
  button.addEventListener('click', () => {
    $$('.billing').forEach(item => item.classList.remove('active'));
    button.classList.add('active');

    const yearly = button.dataset.billing === 'yearly';

    $$('[data-month]').forEach(element => {
      element.innerHTML =
        (yearly ? element.dataset.year : element.dataset.month) +
        ` <small>/ ${yearly ? 'year' : 'month'}</small>`;
    });
  });
});

// Scroll reveal animation.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  $$('.reveal').forEach(element => observer.observe(element));
} else {
  $$('.reveal').forEach(element => element.classList.add('visible'));
}

// Subtle pointer tilt on desktop cards.
// Disabled for touch devices and reduced-motion preferences.
if (
  window.matchMedia('(hover:hover) and (pointer:fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  $$('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform =
        `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-3px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
