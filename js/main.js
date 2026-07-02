// Auth Modal with Registration + Email Validation
const authModal = document.getElementById('auth-modal');
const authOpen = document.getElementById('auth-open');
const authClose = document.getElementById('auth-close');
const authForm = document.getElementById('auth-form');

let isLoginMode = true;

// Простая валидация email
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function createAuthTabs() {
  const title = document.getElementById('auth-modal-title');
  const container = authForm.parentElement;
  
  const tabs = document.createElement('div');
  tabs.className = 'auth-tabs';
  tabs.innerHTML = `
    <button class="auth-tab active" data-mode="login">Вход</button>
    <button class="auth-tab" data-mode="register">Регистрация</button>
  `;
  container.insertBefore(tabs, title.nextSibling);

  tabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('auth-tab')) {
      document.querySelectorAll('.auth-tab').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      
      isLoginMode = e.target.dataset.mode === 'login';
      authForm.querySelector('button').textContent = isLoginMode ? 'Войти' : 'Зарегистрироваться';
    }
  });
}

authOpen.addEventListener('click', () => {
  authModal.classList.add('auth-modal--open');
});

authClose.addEventListener('click', () => {
  authModal.classList.remove('auth-modal--open');
});

authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const emailInput = authForm.querySelector('[name="login"]');
  const passwordInput = authForm.querySelector('[name="password"]');
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert('Заполните все поля!');
    return;
  }

  if (!isValidEmail(email)) {
    alert('Введите корректный email адрес!');
    emailInput.focus();
    return;
  }

  if (isLoginMode) {
    // Вход
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      alert(`Добро пожаловать, ${email}!`);
      authModal.classList.remove('auth-modal--open');
      authForm.reset();
    } else {
      alert('Неверный email или пароль!');
    }
  } else {
    // Регистрация
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.email === email)) {
      alert('Пользователь с таким email уже существует!');
      return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Регистрация прошла успешно! Теперь вы можете войти.');
    // Переключаем на вкладку входа
    document.querySelector('[data-mode="login"]').click();
    authForm.reset();
  }
});

// ==================== КОРЗИНА ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartModal = document.getElementById('cart-modal');
const cartOpen = document.getElementById('cart-open');
const cartClose = document.getElementById('cart-close');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

const successModal = document.getElementById('success-modal');
const successClose = document.getElementById('success-close');

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image || 'images/placeholder.jpg'}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Rp ${item.price.toLocaleString('id-ID')}</p>
        <div class="cart-item-quantity">
          <button class="qty-btn minus" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn plus" data-index="${index}">+</button>
          <button class="remove-item" data-index="${index}">Удалить</button>
        </div>
      </div>
      <div class="item-total">Rp ${itemTotal.toLocaleString('id-ID')}</div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  cartTotalPrice.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

cartOpen.addEventListener('click', () => {
  renderCart();
  cartModal.classList.add('cart-modal--open');
});

cartClose.addEventListener('click', () => {
  cartModal.classList.remove('cart-modal--open');
});

cartItemsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('qty-btn')) {
    const index = parseInt(e.target.dataset.index);
    if (e.target.classList.contains('plus')) {
      cart[index].quantity++;
    } else if (e.target.classList.contains('minus') && cart[index].quantity > 1) {
      cart[index].quantity--;
    }
    saveCart();
    renderCart();
  } else if (e.target.classList.contains('remove-item')) {
    const index = parseInt(e.target.dataset.index);
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }
});

clearCartBtn.addEventListener('click', () => {
  if (confirm('Очистить корзину?')) {
    cart = [];
    saveCart();
    renderCart();
  }
});

checkoutBtn.addEventListener('click', () => {
  if (cart.length > 0) {
    cartModal.classList.remove('cart-modal--open');
    successModal.classList.add('success-modal--open');
    cart = [];
    saveCart();
    renderCart();
  }
});

successClose.addEventListener('click', () => {
  successModal.classList.remove('success-modal--open');
});

// Add to cart
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    const id = parseInt(card.dataset.id);
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    const image = card.querySelector('img').src;

    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ id, name, price, quantity: 1, image });
    }

    saveCart();
    
    const originalText = btn.textContent;
    btn.textContent = 'Добавлено!';
    setTimeout(() => btn.textContent = originalText, 1500);
  });
});

// Инициализация
createAuthTabs();
updateCartCount();