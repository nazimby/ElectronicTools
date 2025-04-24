// Demo products data
const products = [
  {
    id: 1,
    name: 'iPhone 14 Pro 256GB Space Black',
    price: 2499.99,
    oldPrice: 2799.99,
    discount: 21,
    image: 'images/iphone-14-pro.jpg',
    category: 'Smartfonlar'
  },
  // Add more demo products here
];

// Shopping cart functionality (Demo)
let cart = [];

function addToCart(product) {
  cart.push(product);
  updateCartCount();
  showNotification('Məhsul səbətə əlavə edildi');
}

function updateCartCount() {
  const cartIcon = document.querySelector('.header-actions a:last-child');
  if (cartIcon) {
    const count = document.createElement('span');
    count.className = 'cart-count';
    count.textContent = cart.length;
    
    const existingCount = cartIcon.querySelector('.cart-count');
    if (existingCount) {
      existingCount.remove();
    }
    
    if (cart.length > 0) {
      cartIcon.appendChild(count);
    }
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }, 100);
}

// Search functionality
function initializeSearch() {
  const searchInput = document.querySelector('.search-bar input');
  const searchButton = document.querySelector('.search-bar button');
  
  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const category = card.getAttribute('data-category').toLowerCase();

      if (title.includes(query) || category.includes(query)) {
        card.style.display = 'block'; // Düzgün göstərmək üçün 'block' istifadə edin
      } else {
        card.style.display = 'none';
      }
    });
  }

  searchInput.addEventListener('input', performSearch);
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  searchButton.addEventListener('click', performSearch);
}

// Catalog menu functionality
function initializeCatalog() {
  const catalogItems = document.querySelectorAll('.catalog-menu > li');
  
  catalogItems.forEach(item => {
    const link = item.querySelector('a');
    const submenu = item.querySelector('.submenu');
    
    if (submenu) {
      // Add arrow indicator
      const arrow = document.createElement('span');
      arrow.className = 'menu-arrow';
      arrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
      link.appendChild(arrow);
      
      // Handle click events for mobile
      if ('ontouchstart' in window) {
        link.addEventListener('click', (e) => {
          if (!submenu.classList.contains('active')) {
            e.preventDefault();
            // Close other open submenus
            document.querySelectorAll('.submenu.active').forEach(menu => {
              if (menu !== submenu) {
                menu.classList.remove('active');
                menu.style.display = 'none';
              }
            });
            // Toggle current submenu
            submenu.classList.add('active');
            submenu.style.display = 'block';
          }
        });
      }
    }
  });

  // Category filtering
  const categoryLinks = document.querySelectorAll('.catalog-menu a');
  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const category = link.textContent.trim().toLowerCase();
      const productCards = document.querySelectorAll('.product-card');
      
      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category').toLowerCase();
        if (category === 'bütün məhsullar' || cardCategory.includes(category)) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// Initialize price range slider
function initializePriceRangeSlider() {
  const minRangeInput = document.getElementById('min-price-range');
  const maxRangeInput = document.getElementById('max-price-range');
  const minPriceDisplay = document.querySelector('.min-price');
  const maxPriceDisplay = document.querySelector('.max-price');
  const sliderTrack = document.querySelector('.slider-track');
  
  // Find min and max prices from all products
  let minPrice = Infinity;
  let maxPrice = 0;
  
  document.querySelectorAll('.product-card').forEach(product => {
    const price = parseFloat(product.dataset.price);
    minPrice = Math.min(minPrice, price);
    maxPrice = Math.max(maxPrice, price);
  });
  
  // Round to nearest 100
  minPrice = Math.floor(minPrice / 100) * 100;
  maxPrice = Math.ceil(maxPrice / 100) * 100;
  
  // Set initial values and ranges
  minRangeInput.min = minPrice;
  minRangeInput.max = maxPrice;
  minRangeInput.value = minPrice;
  
  maxRangeInput.min = minPrice;
  maxRangeInput.max = maxPrice;
  maxRangeInput.value = maxPrice;
  
  minPriceDisplay.textContent = minPrice + ' ₼';
  maxPriceDisplay.textContent = maxPrice + ' ₼';
  
  // Update slider displays
  function updateSlider() {
    const minVal = parseInt(minRangeInput.value);
    const maxVal = parseInt(maxRangeInput.value);

    if (minVal > maxVal) {
      minRangeInput.value = maxVal;
      return;
    }

    minPriceDisplay.textContent = minVal + ' ₼';
    maxPriceDisplay.textContent = maxVal + ' ₼';

    sliderTrack.style.setProperty('--left', ((minVal - minPrice) / (maxPrice - minPrice)) * 100 + '%');
    sliderTrack.style.setProperty('--right', (100 - ((maxVal - minPrice) / (maxPrice - minPrice)) * 100) + '%');

    applyFilters(); // Filtrləri yenidən tətbiq edin
  }
  
  minRangeInput.addEventListener('input', updateSlider);
  maxRangeInput.addEventListener('input', updateSlider);
  
  // Initial update
  updateSlider();
}

// Product filtering functionality
function initializeFilters() {
  const filterBrand = document.querySelector('.filter-brand');
  const filterPrice = document.querySelector('.filter-price');
  const filterCategory = document.querySelector('.filter-category');
  const filterSort = document.querySelector('.filter-sort');
  const filterDiscount = document.querySelector('.filter-discount');
  
  // Add event listeners to all filters
  filterBrand.addEventListener('change', applyFilters);
  filterPrice.addEventListener('change', applyFilters);
  filterCategory.addEventListener('change', applyFilters);
  filterSort.addEventListener('change', applyFilters);
  filterDiscount.addEventListener('change', applyFilters);
}

// Filter products
function applyFilters() {
  const brandFilter = document.querySelector('.filter-brand').value;
  const priceFilter = document.querySelector('.filter-price').value;
  const categoryFilter = document.querySelector('.filter-category').value;
  const sortOption = document.querySelector('.filter-sort').value;
  const discountFilter = document.querySelector('.filter-discount').checked;
  
  // Price range values
  const minPriceRange = parseInt(document.getElementById('min-price-range').value);
  const maxPriceRange = parseInt(document.getElementById('max-price-range').value);
  
  let products = document.querySelectorAll('.product-card');
  let noResultsMessage = document.querySelector('.no-results-message');
  
  if (!noResultsMessage) {
    noResultsMessage = document.createElement('p');
    noResultsMessage.className = 'no-results-message';
    noResultsMessage.textContent = 'Seçilmiş filtrə üzrə məhsul tapılmadı.';
    noResultsMessage.style.display = 'none';
    document.querySelector('.product-grid').appendChild(noResultsMessage);
  }
  
  // Reset visibility
  products.forEach(product => {
    product.classList.remove('hidden');
  });
  
  // Apply filters
  products.forEach(product => {
    const productBrand = product.dataset.brand;
    const productPrice = parseFloat(product.dataset.price);
    const productCategory = product.dataset.category;
    const productDiscount = product.dataset.discount === 'true';
    
    // Brand filter
    if (brandFilter !== 'all' && productBrand !== brandFilter) {
      product.classList.add('hidden');
      return;
    }
    
    // Category filter
    if (categoryFilter !== 'all' && productCategory !== categoryFilter) {
      product.classList.add('hidden');
      return;
    }
    
    // Discount filter
    if (discountFilter && !productDiscount) {
      product.classList.add('hidden');
      return;
    }
    
    // Price dropdown filter
    if (priceFilter !== 'all') {
      const [minPrice, maxPrice] = priceFilter.split('-').map(p => p === '+' ? Infinity : Number(p));
      
      if (productPrice < minPrice || (maxPrice !== Infinity && productPrice > maxPrice)) {
        product.classList.add('hidden');
        return;
      }
    }
    
    // Price range filter
    if (productPrice < minPriceRange || productPrice > maxPriceRange) {
      product.classList.add('hidden');
      return;
    }
  });
  
  // Check if any products are visible
  const visibleProducts = document.querySelectorAll('.product-card:not(.hidden)');
  if (visibleProducts.length === 0) {
    noResultsMessage.style.display = 'block';
  } else {
    noResultsMessage.style.display = 'none';
    
    // Apply sorting
    const sortedProducts = Array.from(visibleProducts);
    
    switch(sortOption) {
      case 'price-asc':
        sortedProducts.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
        break;
      case 'name-asc':
        sortedProducts.sort((a, b) => a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));
        break;
      case 'name-desc':
        sortedProducts.sort((a, b) => b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent));
        break;
    }
    
    // Reorder products
    const productGrid = document.querySelector('.product-grid');
    sortedProducts.forEach(product => {
      productGrid.appendChild(product);
    });
  }
}

// Səbət funksionallığı
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.modal = document.getElementById('cartModal');
    this.cartItems = document.querySelector('.cart-items');
    this.totalAmount = document.querySelector('.total-amount');
    this.cartBadge = this.createCartBadge();
    this.bindEvents();
    this.updateCartDisplay();
  }

  createCartBadge() {
    const cartIcon = document.querySelector('.header-actions a[title="Səbət"]');
    const badge = document.createElement('span');
    badge.className = 'cart-badge';
    cartIcon.appendChild(badge);
    return badge;
  }

  bindEvents() {
    // Səbət ikonuna klik
    document.querySelector('.header-actions a[title="Səbət"]').addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleCart();
    });

    // Səbətə əlavə et düyməsi üçün tək hadisə dinləyicisi
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        e.preventDefault();
        e.stopPropagation(); // Hadisənin təkrarlanmasının qarşısını alır
        
        const card = e.target.closest('.product-card');
        if (card) {
          this.addToCart({
            id: Date.now(),
            image: card.querySelector('img').src,
            title: card.querySelector('h3').textContent,
            price: parseFloat(card.querySelector('.current-price').textContent),
            quantity: 1
          });
        }
      }
    });

    // Modal içindəki bağla düyməsi
    document.querySelector('.close-cart').addEventListener('click', () => {
      this.toggleCart();
    });

    // Sifarişi rəsmiləşdir düyməsinə klik
    document.querySelector('.checkout-btn').addEventListener('click', () => {
      if (this.items.length === 0) {
        alert('Səbətiniz boşdur!');
        return;
      }
      alert('Sifarişiniz qəbul edildi!');
      this.clearCart();
    });
  }

  toggleCart() {
    this.modal.classList.toggle('active');
  }

  addToCart(item) {
    const existingItem = this.items.find(i => i.title === item.title);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push(item);
    }

    this.updateCartDisplay();
    this.saveToLocalStorage();
    showNotification('Məhsul səbətə əlavə edildi');
  }

  removeFromCart(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.updateCartDisplay();
    this.saveToLocalStorage();
  }

  updateQuantity(id, change) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change);
      this.updateCartDisplay();
      this.saveToLocalStorage();
    }
  }

  updateCartDisplay() {
    // Səbət badge-ini yenilə
    this.cartBadge.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Səbət elementlərini yenilə
    this.cartItems.innerHTML = this.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <div class="cart-item-price">${item.price.toFixed(2)} ₼</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn plus">+</button>
          </div>
        </div>
        <button class="remove-item">&times;</button>
      </div>
    `).join('');

    // Ümumi məbləği yenilə
    const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.totalAmount.textContent = total.toFixed(2) + ' ₼';

    // Səbət elementləri üçün hadisə dinləyicilərini əlavə et
    this.cartItems.querySelectorAll('.cart-item').forEach(item => {
      const id = parseInt(item.dataset.id);
      
      item.querySelector('.minus').addEventListener('click', () => 
        this.updateQuantity(id, -1)
      );
      
      item.querySelector('.plus').addEventListener('click', () => 
        this.updateQuantity(id, 1)
      );
      
      item.querySelector('.remove-item').addEventListener('click', () => 
        this.removeFromCart(id)
      );
    });
  }

  saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  clearCart() {
    this.items = [];
    this.updateCartDisplay();
    this.saveToLocalStorage();
    this.toggleCart();
  }
}

// Sevimlilər funksionallığı
class Favorites {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('favorites')) || [];
    this.modal = document.getElementById('favoritesModal');
    this.favoritesItems = document.querySelector('.favorites-items');
    this.favoriteBadge = this.createFavoriteBadge();
    this.bindEvents();
    this.updateFavoritesDisplay();
  }

  createFavoriteBadge() {
    const favIcon = document.querySelector('.header-actions a[title="Sevimlilər"]');
    const badge = document.createElement('span');
    badge.className = 'cart-badge';
    favIcon.appendChild(badge);
    return badge;
  }

  bindEvents() {
    // Sevimlilər ikonuna klik
    document.getElementById('favoritesButton').addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleFavorites();
    });

    // Məhsul kartlarındakı sevimlilər düymələrinə klik
    document.querySelectorAll('.favorite-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const btn = e.target.closest('.favorite-btn');
        const card = btn.closest('.product-card');
        const isFavorited = btn.classList.contains('active');
        
        if (isFavorited) {
          this.removeFromFavorites(card.querySelector('h3').textContent);
          btn.classList.remove('active');
        } else {
          this.addToFavorites({
            id: Date.now(),
            image: card.querySelector('img').src,
            title: card.querySelector('h3').textContent,
            price: parseFloat(card.querySelector('.current-price').textContent)
          });
          btn.classList.add('active');
        }
      });
    });

    // Handle clicks on dynamically added favorite buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('fa-heart') || e.target.classList.contains('favorite-btn')) {
        const btn = e.target.closest('.favorite-btn');
        if (btn) {
          e.preventDefault();
          const card = btn.closest('.product-card');
          const isFavorited = btn.classList.contains('active');
          
          if (isFavorited) {
            this.removeFromFavorites(card.querySelector('h3').textContent);
            btn.classList.remove('active');
          } else {
            this.addToFavorites({
              id: Date.now(),
              image: card.querySelector('img').src,
              title: card.querySelector('h3').textContent,
              price: parseFloat(card.querySelector('.current-price').textContent)
            });
            btn.classList.add('active');
          }
        }
      }
    });

    // Modal içindəki bağla düyməsi
    document.querySelector('.close-favorites').addEventListener('click', () => {
      this.toggleFavorites();
    });

    // Sevilmiləri təmizlə düyməsinə klik
    document.querySelector('.clear-favorites').addEventListener('click', () => {
      this.clearFavorites();
    });
  }

  toggleFavorites() {
    this.modal.classList.toggle('active');
  }

  addToFavorites(item) {
    const existingItem = this.items.find(i => i.title === item.title);

    if (!existingItem) {
      this.items.push(item);
      this.updateFavoritesDisplay();
      this.saveToLocalStorage();
      alert('Məhsul sevimlilərə əlavə edildi!');
    }
  }

  removeFromFavorites(title) {
    this.items = this.items.filter(item => item.title !== title);
    this.updateFavoritesDisplay();
    this.saveToLocalStorage();
    
    // Məhsul kartlarındakı aktiv düymələri yenilə
    document.querySelectorAll('.product-card').forEach(card => {
      const cardTitle = card.querySelector('h3').textContent;
      const favBtn = card.querySelector('.favorite-btn');
      
      if (cardTitle === title && favBtn.classList.contains('active')) {
        favBtn.classList.remove('active');
      }
    });
  }

  updateFavoritesDisplay() {
    // Səbət obyektini yaradın
    let cart = [];
    
    // Səbətə məhsul əlavə etmək funksiyası
    function addToCart(productId) {
      // Məhsulu səbətə əlavə edin
      const product = cart.find(item => item.id === productId);
      if (product) {
        product.quantity += 1; // Əgər məhsul artıq səbətdədirsə, miqdarı artırın
      } else {
        cart.push({ id: productId, quantity: 1 }); // Yeni məhsulu səbətə əlavə edin
      }
      updateCartUI();
    }
    
    // Səbət UI-ni yeniləyən funksiyanı yaradın
    function updateCartUI() {
      const cartItemsContainer = document.querySelector('.cart-items');
      const totalAmountElement = document.querySelector('.total-amount');
    
      // Səbət elementlərini təmizləyin
      cartItemsContainer.innerHTML = '';
    
      // Səbət boşdursa, mesaj göstərin
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Səbət boşdur.</p>';
        totalAmountElement.textContent = '0.00 ₼';
        return;
      }
    
      // Məhsulları səbətə əlavə edin
      let totalAmount = 0;
      cart.forEach(item => {
        const productElement = document.createElement('div');
        productElement.classList.add('cart-item');
        productElement.textContent = `Məhsul ID: ${item.id}, Miqdar: ${item.quantity}`;
        cartItemsContainer.appendChild(productElement);
    
        // Məbləği hesablayın (məsələn, hər məhsulun qiyməti 100 ₼ olaraq təyin edilib)
        totalAmount += item.quantity * 100;
      });
    
      // Ümumi məbləği yeniləyin
      totalAmountElement.textContent = `${totalAmount.toFixed(2)} ₼`;
    }
    
    // Səbətə əlavə et düymələrinə klik hadisəsini əlavə edin
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.closest('.product-card').getAttribute('data-id');
        addToCart(productId);
      });
    });
    
    // Sayt yüklənəndə səbəti boş saxlayın
    document.addEventListener('DOMContentLoaded', () => {
      cart = [];
      updateCartUI();
    });    // Sevimlilər badge-ini yenilə
    this.favoriteBadge.textContent = this.items.length;
    this.favoriteBadge.style.display = this.items.length > 0 ? 'block' : 'none';
    
    // Sevimlilər elementlərini yenilə
    this.favoritesItems.innerHTML = this.items.length > 0 ? 
      this.items.map(item => `
        <div class="favorite-item" data-title="${item.title}">
          <img src="${item.image}" alt="${item.title}">
          <div class="favorite-item-details">
            <h4 class="favorite-item-title">${item.title}</h4>
            <div class="favorite-item-price">${item.price.toFixed(2)} ₼</div>
            <div class="favorite-item-actions">
              <button class="add-to-cart-from-favorites">Səbətə at</button>
              <button class="remove-favorite">Sil</button>
            </div>
          </div>
        </div>
      `).join('') : '<p class="empty-favorites">Sevimlilər siyahınız boşdur.</p>';

    // Hadisə dinləyiciləri əlavə et
    this.favoritesItems.querySelectorAll('.favorite-item').forEach(item => {
      const title = item.dataset.title;
      
      // Səbətə əlavə et
      item.querySelector('.add-to-cart-from-favorites').addEventListener('click', () => {
        const favItem = this.items.find(i => i.title === title);
        window.cart.addToCart({
          id: Date.now(),
          image: favItem.image,
          title: favItem.title,
          price: favItem.price,
          quantity: 1
        });
      });
      
      // Sil
      item.querySelector('.remove-favorite').addEventListener('click', () => {
        this.removeFromFavorites(title);
      });
    });
  }

  saveToLocalStorage() {
    localStorage.setItem('favorites', JSON.stringify(this.items));
  }

  clearFavorites() {
    this.items = [];
    this.updateFavoritesDisplay();
    this.saveToLocalStorage();
    
    // Bütün aktiv sevimlilər düymələrini sıfırla
    document.querySelectorAll('.favorite-btn.active').forEach(btn => {
      btn.classList.remove('active');
    });
  }
}

// Auth funksionallığı
class Auth {
  constructor() {
    this.user = JSON.parse(localStorage.getItem('user')) || null;
    this.registerModal = document.getElementById('registerModal');
    this.loginModal = document.getElementById('loginModal');
    this.contactModal = document.getElementById('contactModal');
    this.bindEvents();
    this.updateUserState();
  }

  bindEvents() {
    // Auth düyməsinə klik
    document.getElementById('authButton').addEventListener('click', (e) => {
      e.preventDefault();
      if (this.user) {
        this.logout();
      } else {
        this.showLoginModal();
      }
    });

    // Qeydiyyat formu göndərmə
    document.getElementById('registerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.register();
    });

    // Giriş formu göndərmə
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.login();
    });

    // Modal bağla düymələri
    document.querySelectorAll('.close-auth').forEach(btn => {
      btn.addEventListener('click', () => {
        this.registerModal.classList.remove('active');
        this.loginModal.classList.remove('active');
      });
    });

    // Qeydiyyat və giriş arasında keçid
    document.getElementById('showLogin').addEventListener('click', (e) => {
      e.preventDefault();
      this.registerModal.classList.remove('active');
      this.showLoginModal();
    });

    document.getElementById('showRegister').addEventListener('click', (e) => {
      e.preventDefault();
      this.loginModal.classList.remove('active');
      this.showRegisterModal();
    });

    // Mesaj göndər
    document.getElementById('contactButton').addEventListener('click', (e) => {
      e.preventDefault();
      if (this.user) {
        this.showContactModal();
      } else {
        alert('Mesaj göndərmək üçün əvvəlcə daxil olmalısınız.');
        this.showLoginModal();
      }
    });

    // Mesaj formu
    document.getElementById('contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendMessage();
    });

    // Mesaj modalını bağla
    document.querySelector('.close-contact').addEventListener('click', () => {
      this.contactModal.classList.remove('active');
    });
  }

  showRegisterModal() {
    this.registerModal.classList.add('active');
  }

  showLoginModal() {
    this.loginModal.classList.add('active');
  }

  showContactModal() {
    this.contactModal.classList.add('active');
  }

  register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
      alert('Şifrələr uyğun gəlmir.');
      return;
    }

    // Simulyasiya: Burada əslində API-yə sorğu göndəriləcək
    this.user = { name, email };
    localStorage.setItem('user', JSON.stringify(this.user));
    this.updateUserState();
    this.registerModal.classList.remove('active');
    alert('Qeydiyyat uğurla tamamlandı!');
  }

  login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simulyasiya: Burada əslində API-yə sorğu göndəriləcək
    this.user = { name: 'İstifadəçi', email };
    localStorage.setItem('user', JSON.stringify(this.user));
    this.updateUserState();
    this.loginModal.classList.remove('active');
    alert('Uğurla daxil oldunuz!');
  }

  logout() {
    if (confirm('Hesabınızdan çıxmaq istədiyinizə əminsiniz?')) {
      this.user = null;
      localStorage.removeItem('user');
      this.updateUserState();
      alert('Hesabınızdan çıxdınız.');
    }
  }

  updateUserState() {
    if (this.user) {
      document.body.classList.add('logged-in');
      const authIcon = document.getElementById('authButton');
      authIcon.title = `${this.user.name} (Çıxış)`;
      
      // Login vəziyyətini göstər
      let loggedInText = document.querySelector('.logged-in-text');
      if (!loggedInText) {
        loggedInText = document.createElement('span');
        loggedInText.className = 'logged-in-text';
        authIcon.parentNode.insertBefore(loggedInText, authIcon.nextSibling);
      }
      loggedInText.textContent = this.user.name;
    } else {
      document.body.classList.remove('logged-in');
      document.getElementById('authButton').title = 'Hesabım';
      
      const loggedInText = document.querySelector('.logged-in-text');
      if (loggedInText) {
        loggedInText.remove();
      }
    }
  }

  sendMessage() {
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    // Simulyasiya: Burada əslində API-yə sorğu göndəriləcək
    alert('Mesajınız göndərildi!');
    document.getElementById('contactForm').reset();
    this.contactModal.classList.remove('active');
  }
}

// Məhsul detalları funksionallığı
class ProductDetails {
  constructor() {
    this.modal = document.getElementById('productModal');
    this.currentProduct = null;
    this.productData = {
      // Önündən yazılmış məhsul məlumatları
      "Bosch GSB 18V-50 Professional Elektrik Burğu": {
        description: "Bosch GSB 18V-50 Professional, yüksək performanslı dəlmə və bərkitmə əməliyyatları üçün nəzərdə tutulmuş peşəkar elektrik burğusudur. Güclü 18V motor və dayanıqlı dizaynı sayəsində ən çətin tikinti və təmir işlərinin öhdəsindən asanlıqla gəlir.",
        specs: [
          { name: "Gərginlik", value: "18V" },
          { name: "Yüksüz sürət", value: "0-500/0-1900 rpm" },
          { name: "Maks. fırlanma momenti", value: "50 Nm" },
          { name: "Maks. dəlmə diametri (taxta)", value: "35 mm" },
          { name: "Maks. dəlmə diametri (metal)", value: "13 mm" },
          { name: "Batareya növü", value: "Li-ion" },
          { name: "Çəki", value: "1.5 kg" }
        ],
        reviews: [
          { author: "Elşən Quliyev", date: "12.03.2024", rating: 5, text: "İşlərimi çox sürətləndirir. Batareyası uzun müddət davam gətirir və güclü motoru dəmir səthlərə belə asanlıqla nüfuz edir. Çox məmnunam." },
          { author: "Anar Məmmədli", date: "26.02.2024", rating: 4, text: "Keyfiyyətli və dayanıqlı alət. Ağır istifadə üçün idealdır. Tək çatışmayan cəhəti bir az ağır olmasıdır." }
        ]
      },
      "Makita GA5030 Bucaqölçən Cilalayıcı 720W": {
        description: "Makita GA5030 bucaqölçən cilalayıcı, 720W gücü və ergonomik dizaynı ilə metal kəsmə və cilalama işləri üçün ideal bir alətdir. Yüngül çəkisi və kompakt ölçüsü sayəsində uzun müddətli istifadə zamanı yorğunluğu azaldır.",
        specs: [
          { name: "Güc", value: "720W" },
          { name: "Yüksüz sürət", value: "11000 rpm" },
          { name: "Disk diametri", value: "125 mm" },
          { name: "Mil yivi", value: "M14" },
          { name: "Çəki", value: "1.8 kg" },
          { name: "Kabel uzunluğu", value: "2.5 m" }
        ],
        reviews: [
          { author: "Vüqar Əhmədov", date: "05.04.2024", rating: 5, text: "Çox məmnunam. Kompakt və güclü. Əsasən metal işləmələrində istifadə edirəm və məhz həcmi kiçik olduğu üçün seçdim." },
          { author: "Səbinə Rüstəmova", date: "18.03.2024", rating: 3, text: "Orta performans göstərir. Uzun müddət istifadə etdikdə qızır. Daha çox kiçik işlər üçün münasibdir." }
        ]
      },
      "DeWalt DCS391 20V Dairəvi Mişar": {
        description: "DeWalt DCS391 20V dairəvi mişar, 165mm kəsmə gücü və kordinatsız dizaynı ilə inşaat və ağac emalı işləri üçün mükəmməl seçimdir. Dəqiq kəsmə qabiliyyəti və güclü 20V batareyası sayəsində ən çətin materialların öhdəsindən asanlıqla gəlir.",
        specs: [
          { name: "Gərginlik", value: "20V" },
          { name: "Yüksüz sürət", value: "5150 rpm" },
          { name: "Bıçaq diametri", value: "165 mm" },
          { name: "Maks. kəsmə dərinliyi (90°)", value: "57 mm" },
          { name: "Maks. kəsmə dərinliyi (45°)", value: "40 mm" },
          { name: "Batareya növü", value: "Li-ion" },
          { name: "Çəki", value: "3.8 kg" }
        ],
        reviews: [
          { author: "Ramin Həsənov", date: "02.04.2024", rating: 5, text: "Peşəkar səviyyədə bir alət. Taxta kəsmək işləri üçün ideal performans göstərir. DeWalt keyfiyyətini bir daha sübut edir." },
          { author: "Elnur Məmmədzadə", date: "15.02.2024", rating: 4, text: "Batareyası uzun müddət davam gətirir və çox güclüdür. Yeganə problemi səsli işləməsidir." }
        ]
      }
    };
    
    this.bindEvents();
  }

  bindEvents() {
    // Ətraflı düymələrinə klik
    document.querySelectorAll('.view-details').forEach(button => {
      button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const title = card.querySelector('h3').textContent;
        const image = card.querySelector('img').src;
        const price = card.querySelector('.current-price').textContent;
        const oldPrice = card.querySelector('.old-price')?.textContent || null;
        const hasDiscount = card.dataset.discount === 'true';
        
        this.showProductDetails(title, image, price, oldPrice, hasDiscount);
      });
    });

    // Button click for dynamically added products
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('view-details')) {
        const card = e.target.closest('.product-card');
        if (card) {
          const title = card.querySelector('h3').textContent;
          const image = card.querySelector('img').src;
          const price = card.querySelector('.current-price').textContent;
          const oldPrice = card.querySelector('.old-price')?.textContent || null;
          const hasDiscount = card.dataset.discount === 'true';
          
          this.showProductDetails(title, image, price, oldPrice, hasDiscount);
        }
      }
    });

    // Modal bağla düyməsi
    document.querySelector('.close-product-modal').addEventListener('click', () => {
      this.closeProductDetails();
    });

    // Modal içindəki səbətə əlavə et düyməsi
    document.querySelector('.add-to-cart-modal').addEventListener('click', () => {
      if (this.currentProduct) {
        window.cart.addToCart({
          id: Date.now(),
          image: document.getElementById('productModalImage').src,
          title: document.getElementById('productModalTitle').textContent,
          price: parseFloat(document.getElementById('productModalPrice').textContent),
          quantity: 1
        });
      }
    });

    // Modal içindəki sevimlilərə əlavə et düyməsi
    document.querySelector('.add-to-favorites-modal').addEventListener('click', (e) => {
      if (this.currentProduct) {
        const btn = e.target.closest('.add-to-favorites-modal');
        const isFavorited = btn.classList.contains('active');
        
        if (isFavorited) {
          window.favorites.removeFromFavorites(document.getElementById('productModalTitle').textContent);
          btn.classList.remove('active');
          btn.innerHTML = '<i class="fas fa-heart"></i> Sevimlilərə əlavə et';
        } else {
          window.favorites.addToFavorites({
            id: Date.now(),
            image: document.getElementById('productModalImage').src,
            title: document.getElementById('productModalTitle').textContent,
            price: parseFloat(document.getElementById('productModalPrice').textContent)
          });
          btn.classList.add('active');
          btn.innerHTML = '<i class="fas fa-heart"></i> Sevimlilərdən çıxar';
        }
      }
    });

    // Rəy ulduzları
    document.querySelectorAll('.star-selector i').forEach(star => {
      star.addEventListener('click', (e) => {
        const rating = parseInt(e.target.dataset.rating);
        this.selectRating(rating);
      });
    });

    // Rəy göndər
    document.querySelector('.submit-review').addEventListener('click', () => {
      this.submitReview();
    });
  }

  showProductDetails(title, image, price, oldPrice, hasDiscount) {
    this.currentProduct = title;
    
    // Əsas məlumatları doldur
    document.getElementById('productModalTitle').textContent = title;
    document.getElementById('productModalImage').src = image;
    document.getElementById('productModalPrice').textContent = price;
    
    // Köhnə qiyməti əgər varsa göstər
    const oldPriceElement = document.getElementById('productModalOldPrice');
    if (hasDiscount && oldPrice) {
      oldPriceElement.textContent = oldPrice;
      oldPriceElement.style.display = 'inline';
    } else {
      oldPriceElement.style.display = 'none';
    }
    
    // Əgər məhsul haqqında detallı məlumat varsa, onu əlavə et
    const productInfo = this.productData[title];
    if (productInfo) {
      // Təsvir
      document.getElementById('productModalDescription').textContent = productInfo.description;
      
      // Xüsusiyyətlər
      const specsList = document.getElementById('productModalSpecs');
      specsList.innerHTML = productInfo.specs.map(spec => 
        `<li><span>${spec.name}:</span> <span>${spec.value}</span></li>`
      ).join('');
      
      // Rəylər
      const reviewsList = document.getElementById('reviewsList');
      reviewsList.innerHTML = productInfo.reviews.map(review => `
        <div class="review-item">
          <div class="review-header">
            <span class="review-author">${review.author}</span>
            <span class="review-date">${review.date}</span>
          </div>
          <div class="review-rating">
            ${this.renderStars(review.rating)}
          </div>
          <div class="review-content">
            ${review.text}
          </div>
        </div>
      `).join('');
    } else {
      // Default məlumatlar
      document.getElementById('productModalDescription').textContent = 'Bu məhsul haqqında ətraflı məlumat hazırlanır.';
      document.getElementById('productModalSpecs').innerHTML = '<li>Məlumat yoxdur</li>';
      document.getElementById('reviewsList').innerHTML = '<p>Bu məhsula hələ rəy yazılmayıb.</p>';
    }
    
    // Modeli göstər
    this.modal.classList.add('active');
    
    // Sevimlilər düyməsinin vəziyyətini yoxla
    const favBtn = document.querySelector('.add-to-favorites-modal');
    const isFavorited = window.favorites.items.some(item => item.title === title);
    
    if (isFavorited) {
      favBtn.classList.add('active');
      favBtn.innerHTML = '<i class="fas fa-heart"></i> Sevimlilərdən çıxar';
    } else {
      favBtn.classList.remove('active');
      favBtn.innerHTML = '<i class="fas fa-heart"></i> Sevimlilərə əlavə et';
    }
  }

  closeProductDetails() {
    this.modal.classList.remove('active');
    this.currentProduct = null;
  }

  renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<i class="fas fa-star"></i>';
      } else if (i - 0.5 <= rating) {
        stars += '<i class="fas fa-star-half-alt"></i>';
      } else {
        stars += '<i class="far fa-star"></i>';
      }
    }
    return stars;
  }

  selectRating(rating) {
    const stars = document.querySelectorAll('.star-selector i');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.className = 'fas fa-star active';
      } else {
        star.className = 'far fa-star';
      }
    });
  }

  submitReview() {
    const activeStars = document.querySelectorAll('.star-selector i.active').length;
    const reviewText = document.querySelector('.review-text').value.trim();
    
    if (activeStars === 0) {
      alert('Zəhmət olmasa, məhsulu qiymətləndirin.');
      return;
    }
    
    if (reviewText.length < 10) {
      alert('Zəhmət olmasa, daha ətraflı rəy yazın (ən azı 10 simvol).');
      return;
    }
    
    // Simulyasiya: Burada əslində API-yə sorğu göndəriləcək
    alert('Rəyiniz uğurla göndərildi!');
    document.querySelector('.review-text').value = '';
    this.selectRating(0);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeSearch();
  initializeCatalog();
  initializeFilters();
  initializePriceRangeSlider();
  
  // Initialize cart
  window.cart = new ShoppingCart();
  
  // Initialize favorites
  window.favorites = new Favorites();
  
  // Initialize auth
  window.auth = new Auth();
  
  // Initialize product details
  window.productDetails = new ProductDetails();

  // Filter toggle funksionallığı
  const filterToggle = document.querySelector('.filter-toggle');
  const filterSection = document.querySelector('.filter-section');

  filterToggle.addEventListener('click', () => {
    filterSection.classList.toggle('active');
    filterToggle.classList.toggle('active');
  });
});
