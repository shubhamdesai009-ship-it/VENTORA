
// ==========================================
// VENTORA — Firebase-connected frontend
// ==========================================

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyBPogFnB436OVKtnQixSuE3GQ-h2LBF8bM",
  authDomain: "ventora-814d4.firebaseapp.com",
  projectId: "ventora-814d4",
  storageBucket: "ventora-814d4.firebasestorage.app",
  messagingSenderId: "93488308926",
  appId: "1:93488308926:web:4d62488ba206c9e771b4ef",
  measurementId: "G-1WQDDCHBKM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ==========================================
// 2. GENERAL VARIABLES
// ==========================================

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

const modal = $('#modalBackdrop');
const content = $('#modalContent');

let selectedRole = 'reviewer';
let currentUser = null;

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


// ==========================================
// 3. AUTHENTICATION STATE
// ==========================================

onAuthStateChanged(auth, user => {
  currentUser = user;

  $$('[data-open="login"]').forEach(button => {
    button.textContent = user ? 'Log out' : 'Log in';
  });

  if (user) {
    console.log('VENTORA user signed in:', user.uid);
  } else {
    console.log('No user currently signed in.');
  }
});


// ==========================================
// 4. AUTHENTICATION ERROR MESSAGES
// ==========================================

function getAuthError(error) {
  const errors = {
    'auth/email-already-in-use':
      'This email already has an account. Please log in.',

    'auth/invalid-email':
      'Please enter a valid email address.',

    'auth/weak-password':
      'Your password is too weak. Use at least 8 characters.',

    'auth/user-not-found':
      'No account found with this email address.',

    'auth/wrong-password':
      'Incorrect email or password.',

    'auth/invalid-credential':
      'Incorrect email or password.',

    'auth/too-many-requests':
      'Too many attempts. Please try again later.',

    'auth/network-request-failed':
      'Network error. Check your internet connection.',

    'auth/operation-not-allowed':
      'Email/password login is not enabled in Firebase.'
  };

  return errors[error.code] ||
    'Something went wrong. Please try again.';
}


// ==========================================
// 5. MODAL FUNCTIONS
// ==========================================

function openModal(mode = 'signup', role) {
  if (!modal || !content) return;

  selectedRole = roleInfo[role] ? role : 'reviewer';

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


// ==========================================
// 6. ACCOUNT REGISTRATION AND LOGIN
// ==========================================

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
                <input
                  name="name"
                  type="text"
                  maxlength="80"
                  placeholder="Full name"
                  required
                >
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
              <input
                name="startup"
                maxlength="100"
                placeholder="Your project name"
              >
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
            <p class="form-message">
              Investor identity verification will be a separate step.
            </p>
          `
          : ''
      }

      <button class="btn btn-primary form-submit" type="submit">
        ${login
          ? 'Log in'
          : `Create ${roleInfo[selectedRole].label.toLowerCase()} account`
        } ↗
      </button>

      <div class="form-message" id="formMessage"></div>
    </form>
  `;

  // Role selection
  $$('[data-role-choice]', content).forEach(button => {
    button.addEventListener('click', () => {
      selectedRole = button.dataset.roleChoice;
      renderAccountForm(login);
    });
  });

  const accountForm = $('#accountForm', content);

  accountForm.addEventListener('submit', async event => {
    event.preventDefault();

    const message = $('#formMessage', content);
    const submitButton = $('button[type="submit"]', accountForm);

    const formData = new FormData(accountForm);

    const email = String(formData.get('email') || '')
      .trim()
      .toLowerCase();

    const password = String(formData.get('password') || '');

    const name = String(formData.get('name') || '').trim();

    const startupName = String(formData.get('startup') || '').trim();

    message.style.display = 'block';
    message.textContent = '';

    submitButton.disabled = true;
    submitButton.textContent = 'Please wait...';

    try {

      // LOGIN
      if (login) {

        const result = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userRef = doc(db, 'users', result.user.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const profile = userSnapshot.data();

          message.textContent =
            `Welcome back, ${profile.displayName || 'to VENTORA'}! Your account is connected.`;
        } else {
          message.textContent =
            'You are signed in, but your profile has not been created yet. Please contact support.';
        }

        return;
      }


      // REGISTRATION
      if (!name) {
        throw new Error('Please enter your full name.');
      }

      if (password.length < 8) {
        throw new Error('Password must contain at least 8 characters.');
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save profile in Firestore
      const userRef = doc(db, 'users', result.user.uid);

      await setDoc(userRef, {
        displayName: name,
        email: result.user.email,
        role: selectedRole,
        startupName: startupName,
        createdAt: serverTimestamp()
      });

      message.textContent =
        `Welcome to VENTORA, ${name}! Your account has been created successfully.`;

      console.log('VENTORA profile saved:', result.user.uid);

    } catch (error) {

      console.error('VENTORA authentication error:', error);

      message.textContent =
        error.message && !error.code
          ? error.message
          : getAuthError(error);

    } finally {

      submitButton.disabled = false;

      submitButton.textContent = login
        ? 'Log in'
        : `Create ${roleInfo[selectedRole].label.toLowerCase()} account ↗`;
    }
  });
}


// ==========================================
// 7. OPEN SIGNUP / LOGIN / LOGOUT
// ==========================================

$$('[data-open]').forEach(button => {
  button.addEventListener('click', async () => {

    const mode = button.dataset.open;

    if (mode === 'login' && currentUser) {
      try {
        await signOut(auth);
        closeModal();
        alert('You have logged out of VENTORA.');
      } catch (error) {
        console.error(error);
        alert('Unable to log out. Please try again.');
      }

      return;
    }

    openModal(mode || 'signup', button.dataset.role);
  });
});

$('#modalClose')?.addEventListener('click', closeModal);

modal?.addEventListener('click', event => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});


// ==========================================
// 8. IDEA CATEGORY FILTERS
// ==========================================

$$('.filter').forEach(button => {
  button.addEventListener('click', () => {

    $$('.filter').forEach(item =>
      item.classList.remove('active')
    );

    button.classList.add('active');

    filterIdeas();
  });
});

$('#ideaSearch')?.addEventListener('input', filterIdeas);

function filterIdeas() {
  const searchInput = $('#ideaSearch');

  if (!searchInput) return;

  const activeFilter =
    $('.filter.active')?.dataset.filter || 'all';

  const query = searchInput.value.toLowerCase();

  $$('.idea-card').forEach(card => {

    const matchesCategory =
      activeFilter === 'all' ||
      card.dataset.category === activeFilter;

    const searchContent =
      (card.dataset.search || '') + ' ' + card.innerText;

    const matchesText =
      searchContent.toLowerCase().includes(query);

    card.style.display =
      matchesCategory && matchesText ? '' : 'none';
  });
}


// ==========================================
// 9. IDEA INTERACTION
// ==========================================

$$('[data-idea]').forEach(button => {
  button.addEventListener('click', () => {

    openModal('signup', 'reviewer');

    const intro = $('#modalIntro');

    if (intro) {
      intro.textContent =
        `You selected “${button.dataset.idea}”. Join VENTORA to participate in the community.`;
    }
  });
});


// ==========================================
// 10. MONTHLY / YEARLY PRICING
// ==========================================

$$('.billing').forEach(button => {

  button.addEventListener('click', () => {

    $$('.billing').forEach(item =>
      item.classList.remove('active')
    );

    button.classList.add('active');

    const yearly = button.dataset.billing === 'yearly';

    $$('[data-month]').forEach(element => {

      element.innerHTML =
        (yearly
          ? element.dataset.year
          : element.dataset.month) +
        ` <small>/ ${yearly ? 'year' : 'month'}</small>`;
    });
  });
});


// ==========================================
// 11. SCROLL REVEAL ANIMATION
// ==========================================

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

  $$('.reveal').forEach(element =>
    observer.observe(element)
  );

} else {

  $$('.reveal').forEach(element =>
    element.classList.add('visible')
  );
}


// ==========================================
// 12. CARD POINTER TILT
// ==========================================

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
