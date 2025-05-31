// Main JavaScript File

// Cart functionality with localStorage
class ShoppingCart {
    constructor() {
      this.items = this.getCartFromLocalStorage();
      this.updateCartDisplay();
    }
  
    getCartFromLocalStorage() {
      const cart = localStorage.getItem('rongBaharCart');
      return cart ? JSON.parse(cart) : [];
    }
  
    saveCartToLocalStorage() {
      localStorage.setItem('rongBaharCart', JSON.stringify(this.items));
    }
  
    addItem(product) {
      const existingItem = this.items.find(item => 
        item.id === product.id && item.name === product.name
      );
      
      if (existingItem) {
        existingItem.quantity += product.quantity || 1;
      } else {
        this.items.push({
          ...product,
          quantity: product.quantity || 1
        });
      }
      
      this.saveCartToLocalStorage();
      this.updateCartDisplay();
      return this.items.length;
    }
  
    updateItem(productId, quantity) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        if (quantity > 0) {
          item.quantity = quantity;
        } else {
          this.removeItem(productId);
          return;
        }
      }
      
      this.saveCartToLocalStorage();
      this.updateCartDisplay();
    }
  
    removeItem(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      this.saveCartToLocalStorage();
      this.updateCartDisplay();
    }
  
    getTotal() {
      return this.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
    }
  
    clearCart() {
      this.items = [];
      this.saveCartToLocalStorage();
      this.updateCartDisplay();
    }
    
    getItemCount() {
      return this.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    updateCartDisplay() {
      // Update cart count in the header
      const cartCountElements = document.querySelectorAll('.cart-counter');
      const itemCount = this.getItemCount();
      
      cartCountElements.forEach(element => {
        element.textContent = itemCount;
      });
      
      // Update cart items on the cart page if we're on that page
      if (window.location.href.includes('cart.html')) {
        this.updateCartPage();
      }
    }
    
    updateCartPage() {
      const cartTableBody = document.querySelector('.cart-table tbody');
      const cartSummary = document.querySelector('.cart-summary');
      
      if (!cartTableBody) return;
      
      // Clear current items
      cartTableBody.innerHTML = '';
      
      if (this.items.length === 0) {
        // Show empty cart message
        cartTableBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 2rem;">
              <p>Your cart is empty</p>
              <a href="../pages/shop.html" class="btn" style="display: inline-block; margin-top: 1rem;">Continue Shopping</a>
            </td>
          </tr>
        `;
        
        // Hide or update summary
        if (cartSummary) {
          const summaryItemsElement = cartSummary.querySelector('.summary-total');
          if (summaryItemsElement) {
            summaryItemsElement.querySelector('span:last-child').textContent = 'เงณ0';
          }
        }
        
        return;
      }
      
      // Add items to cart
      this.items.forEach(item => {
        const tr = document.createElement('tr');
        tr.dataset.id = item.id;
        
        tr.innerHTML = `
          <td>
            <div class="cart-product">
              <img src="${item.image}" alt="${item.name}">
              <div class="cart-product-info">
                <h4>${item.name}</h4>
                <p>${item.category || ''}</p>
              </div>
            </div>
          </td>
          <td>เงณ${item.price}</td>
          <td>
            <div class="cart-quantity">
              <button class="decrease">-</button>
              <input type="number" value="${item.quantity}" min="1" max="10">
              <button class="increase">+</button>
            </div>
          </td>
          <td>เงณ${(item.price * item.quantity).toFixed(2)}</td>
          <td>
            <button class="remove-btn"><i class="fas fa-trash"></i></button>
          </td>
        `;
        
        cartTableBody.appendChild(tr);
      });
      
      // Update summary
      if (cartSummary) {
        const subtotal = this.getTotal();
        const shipping = subtotal > 0 ? 100 : 0; // Example shipping cost
        const total = subtotal + shipping;
        
        const subtotalElement = cartSummary.querySelector('.summary-item:nth-child(1) span:last-child');
        const shippingElement = cartSummary.querySelector('.summary-item:nth-child(2) span:last-child');
        const totalElement = cartSummary.querySelector('.summary-total span:last-child');
        
        if (subtotalElement) subtotalElement.textContent = `เงณ${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `เงณ${shipping.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `เงณ${total.toFixed(2)}`;
      }
      
      // Add event listeners to the cart elements
      this.addCartEventListeners();
    }
    
    addCartEventListeners() {
      // Quantity buttons
      document.querySelectorAll('.cart-quantity .decrease').forEach(button => {
        button.addEventListener('click', () => {
          const input = button.nextElementSibling;
          const tr = button.closest('tr');
          const productId = tr.dataset.id;
          const currentValue = parseInt(input.value);
          
          if (currentValue > 1) {
            input.value = currentValue - 1;
            this.updateItem(productId, currentValue - 1);
          }
        });
      });
      
      document.querySelectorAll('.cart-quantity .increase').forEach(button => {
        button.addEventListener('click', () => {
          const input = button.previousElementSibling;
          const tr = button.closest('tr');
          const productId = tr.dataset.id;
          const currentValue = parseInt(input.value);
          
          if (currentValue < 10) {
            input.value = currentValue + 1;
            this.updateItem(productId, currentValue + 1);
          }
        });
      });
      
      document.querySelectorAll('.cart-quantity input').forEach(input => {
        input.addEventListener('change', () => {
          const tr = input.closest('tr');
          const productId = tr.dataset.id;
          const newValue = parseInt(input.value);
          
          if (newValue > 0 && newValue <= 10) {
            this.updateItem(productId, newValue);
          } else if (newValue > 10) {
            input.value = 10;
            this.updateItem(productId, 10);
          } else {
            input.value = 1;
            this.updateItem(productId, 1);
          }
        });
      });
      
      // Remove buttons
      document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
          const tr = button.closest('tr');
          const productId = tr.dataset.id;
          
          this.removeItem(productId);
        });
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
      // Initialize cart
      const cart = new ShoppingCart();
      
      // Mobile Navigation Toggle
      const hamburger = document.querySelector('.hamburger');
      const navLinks = document.querySelector('.nav-links');
  
      if (hamburger && navLinks) {
          hamburger.addEventListener('click', () => {
              hamburger.classList.toggle('active');
              navLinks.classList.toggle('active');
          });
      }
  
      // Close mobile menu when clicking a link
      const navItems = document.querySelectorAll('.nav-links li a');
      navItems.forEach(item => {
          item.addEventListener('click', () => {
              hamburger.classList.remove('active');
              navLinks.classList.remove('active');
          });
      });
  
      // Product Quantity Selector
      const quantityButtons = document.querySelectorAll('.quantity-input button');
      quantityButtons.forEach(button => {
          button.addEventListener('click', function() {
              const input = this.parentElement.querySelector('input');
              const currentValue = parseInt(input.value);
              
              if (this.classList.contains('decrease') && currentValue > 1) {
                  input.value = currentValue - 1;
              } else if (this.classList.contains('increase')) {
                  input.value = currentValue + 1;
              }
          });
      });
  
      // Product Tabs
      const tabButtons = document.querySelectorAll('.tab-button');
      const tabContents = document.querySelectorAll('.tab-content');
  
      tabButtons.forEach(button => {
          button.addEventListener('click', () => {
              // Remove active class from all buttons and contents
              tabButtons.forEach(btn => btn.classList.remove('active'));
              tabContents.forEach(content => content.classList.remove('active'));
              
              // Add active class to clicked button and corresponding content
              button.classList.add('active');
              const targetContent = document.getElementById(button.dataset.tab);
              if (targetContent) {
                  targetContent.classList.add('active');
              }
          });
      });
  
      // Product Gallery
      const mainImage = document.querySelector('.main-image img');
      const thumbnails = document.querySelectorAll('.thumbnail');
  
      thumbnails.forEach(thumb => {
          thumb.addEventListener('click', function() {
              // Update main image source
              if (mainImage) {
                  mainImage.src = this.querySelector('img').src;
                  
                  // Update active thumbnail
                  thumbnails.forEach(t => t.classList.remove('active'));
                  this.classList.add('active');
              }
          });
      });
  
      // Image Zoom Effect
      if (mainImage) {
          mainImage.addEventListener('mousemove', function(e) {
              const { left, top, width, height } = this.getBoundingClientRect();
              const x = (e.clientX - left) / width * 100;
              const y = (e.clientY - top) / height * 100;
              
              this.style.transformOrigin = `${x}% ${y}%`;
              this.style.transform = 'scale(1.5)';
          });
          
          mainImage.addEventListener('mouseleave', function() {
              this.style.transform = 'scale(1)';
          });
      }
  
      // Smooth Scroll for Anchor Links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
              e.preventDefault();
              
              const targetId = this.getAttribute('href');
              if (targetId === '#') return;
              
              const targetElement = document.querySelector(targetId);
              if (targetElement) {
                  window.scrollTo({
                      top: targetElement.offsetTop - 80,
                      behavior: 'smooth'
                  });
              }
          });
      });
  
      // Scroll Animation
      const scrollElements = document.querySelectorAll('.scroll-animation');
      
      const elementInView = (el, percentageScroll = 100) => {
          const elementTop = el.getBoundingClientRect().top;
          return (
              elementTop <= 
              ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
          );
      };
      
      const displayScrollElement = (element) => {
          element.classList.add('scrolled');
      };
      
      const hideScrollElement = (element) => {
          element.classList.remove('scrolled');
      };
      
      const handleScrollAnimation = () => {
          scrollElements.forEach((el) => {
              if (elementInView(el, 80)) {
                  displayScrollElement(el);
              } else {
                  hideScrollElement(el);
              }
          });
      };
      
      window.addEventListener('scroll', () => {
          handleScrollAnimation();
      });
      
      // Initialize scroll animation
      handleScrollAnimation();
  
      // Initialize testimonials slider if Slick is available
      if (typeof $.fn !== 'undefined' && typeof $.fn.slick !== 'undefined' && $('.testimonial-slider').length) {
          $('.testimonial-slider').slick({
              dots: true,
              arrows: false,
              infinite: true,
              speed: 500,
              slidesToShow: 3,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 5000,
              responsive: [
                  {
                      breakpoint: 1024,
                      settings: {
                          slidesToShow: 2,
                          slidesToScroll: 1,
                      }
                  },
                  {
                      breakpoint: 768,
                      settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1
                      }
                  }
              ]
          });
      }
  
      // Add to Cart Button Functionality 
      const addToCartButtons = document.querySelectorAll('.add-to-cart');
      addToCartButtons.forEach(button => {
          button.addEventListener('click', function(e) {
              e.preventDefault();
              
              // Get product info
              const productCard = this.closest('.product-card') || this.closest('.product-details');
              if (!productCard) return;
              
              const productName = productCard.querySelector('h3')?.textContent || 'Product';
              const productPriceText = productCard.querySelector('.price')?.textContent || 
                                      productCard.querySelector('.product-price')?.textContent || 'เงณ0';
              const productPrice = parseFloat(productPriceText.replace('เงณ', ''));
              const productImage = productCard.querySelector('img')?.src || '';
              
              let quantity = 1;
              const quantityInput = productCard.querySelector('.quantity-input input');
              if (quantityInput) {
                  quantity = parseInt(quantityInput.value);
              }
              
              // Create a unique product ID - in real app this would come from the server
              // Here we'll just use a hash of the name and image
              const productId = `${productName.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 10000)}`;
              
              // Add to cart
              cart.addItem({
                  id: productId,
                  name: productName,
                  price: productPrice,
                  image: productImage,
                  quantity: quantity
              });
              
              // Show feedback to user
              const originalText = button.textContent;
              button.textContent = 'Added!';
              button.style.backgroundColor = '#4CAF50';
              
              setTimeout(() => {
                  button.textContent = originalText;
                  button.style.backgroundColor = '';
              }, 1500);
          });
      });
  
      // Payment method selection
      const paymentMethods = document.querySelectorAll('.payment-method');
      paymentMethods.forEach(method => {
          method.addEventListener('click', function() {
              paymentMethods.forEach(m => m.classList.remove('active'));
              this.classList.add('active');
              const radio = this.querySelector('input[type="radio"]');
              if (radio) {
                  radio.checked = true;
              }
          });
      });
  
      // Form validation for checkout
      const checkoutForm = document.getElementById('checkout-form');
      if (checkoutForm) {
          checkoutForm.addEventListener('submit', function(e) {
              e.preventDefault();
              
              // Simple validation example
              const requiredFields = this.querySelectorAll('[required]');
              let isValid = true;
              
              requiredFields.forEach(field => {
                  if (!field.value.trim()) {
                      field.classList.add('error');
                      isValid = false;
                  } else {
                      field.classList.remove('error');
                  }
              });
              
              if (isValid) {
                  alert('Order placed successfully! Thank you for your purchase.');
                  // Here you would typically submit the form or make an AJAX request
                  cart.clearCart();
                  window.location.href = '../index.html';
              } else {
                  alert('Please fill in all required fields.');
              }
          });
      }
  
      // Newsletter form submission
      const newsletterForm = document.querySelector('.newsletter-form');
      if (newsletterForm) {
          newsletterForm.addEventListener('submit', function(e) {
              e.preventDefault();
              const emailInput = this.querySelector('input[type="email"]');
              
              if (emailInput && emailInput.value.trim()) {
                  alert(`Thank you for subscribing with ${emailInput.value}!`);
                  emailInput.value = '';
              }
          });
      }
  
      // Contact form submission
      const contactForm = document.querySelector('.contact-form');
      if (contactForm) {
          contactForm.addEventListener('submit', function(e) {
              e.preventDefault();
              alert('Thank you for your message. We will get back to you soon!');
              this.reset();
          });
      }
  });