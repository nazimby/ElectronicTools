// Ana səhifə JavaScript kodları
document.addEventListener('DOMContentLoaded', function() {
  // Hero Slider funksionallığı
  initHeroSlider();
  
  // Wishlist funksionallığı
  initWishlist();
  
  // Səbət funksionallığı
  initCart();
  
  // Mobil menyu
  initMobileMenu();
});

// Hero slayderi üçün funksiyalar
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dots = document.querySelectorAll('.hero-slider .dot');
  const prevBtn = document.querySelector('.hero-slider .prev-btn');
  const nextBtn = document.querySelector('.hero-slider .next-btn');
  
  let currentSlide = 0;
  let slideInterval;
  
  // Avtomatik slayd dəyişməsini başlat
  function startSlideInterval() {
    slideInterval = setInterval(() => {
      changeSlide(currentSlide + 1);
    }, 5000); // 5 saniyə
  }
  
  // Slaydı dəyişdirmə funksiyası
  function changeSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  
  // Düymələrə hadisə dinləyiciləri əlavə et
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      clearInterval(slideInterval);
      changeSlide(currentSlide - 1);
      startSlideInterval();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      clearInterval(slideInterval);
      changeSlide(currentSlide + 1);
      startSlideInterval();
    });
  }
  
  // Nöqtələrə hadisə dinləyiciləri əlavə et
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      changeSlide(index);
      startSlideInterval();
    });
  });
  
  // Avtomatik slayd dəyişməsini başlat
  if (slides.length > 1) {
    startSlideInterval();
  }
}

// Sevimlilər funksionallığı
function initWishlist() {
  const wishlistButtons = document.querySelectorAll('.wishlist-button');
  
  wishlistButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const icon = this.querySelector('i');
      
      if (icon.classList.contains('far')) {
        // Sevimlilərə əlavə et
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('Məhsul sevimlilərə əlavə edildi');
      } else {
        // Sevimlilərdən çıxar
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('Məhsul sevimlilərdən çıxarıldı');
      }
    });
  });
}

// Səbət funksionallığı
function initCart() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartCount = document.querySelector('.cart-count');
  
  let count = parseInt(cartCount.textContent || '0');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      count++;
      cartCount.textContent = count;
      
      const productName = this.closest('.product-card').querySelector('h3').textContent;
      showNotification(`"${productName}" səbətə əlavə edildi`);
    });
  });
}

// Bildiriş göstər
function showNotification(message) {
  // Əgər artıq bildiriş varsa, onu sil
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Yeni bildiriş yarat
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Bildirişi sənədə əlavə et
  document.body.appendChild(notification);
  
  // Bildirişi göstər
  setTimeout(() => {
    notification.classList.add('show');
    
    // 3 saniyə sonra bildirişi gizlət
    setTimeout(() => {
      notification.classList.remove('show');
      
      // Animasiya bitdikdən sonra bildirişi sil
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }, 100);
}

// Mobil menyu
function initMobileMenu() {
  const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
      const navContainer = document.querySelector('.main-nav');
      
      if (!document.querySelector('.mobile-menu-toggle')) {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        navContainer.prepend(toggle);
        
        toggle.addEventListener('click', function() {
          navContainer.querySelector('ul').classList.toggle('show');
          this.querySelector('i').classList.toggle('fa-bars');
          this.querySelector('i').classList.toggle('fa-times');
        });
      }
    }
  };
  
  // İlkin çağırış və ölçü dəyişdikdə yenidən yoxla
  createMobileMenu();
  window.addEventListener('resize', createMobileMenu);
}

// Product details button
document.querySelectorAll('.details').forEach(button => {
  button.addEventListener('click', function() {
    const productCard = this.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    
    // Product details page or show modal
    alert(`${productName} haqqında ətraflı məlumat göstəriləcək`);
  });
});
