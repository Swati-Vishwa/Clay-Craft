const hamburger = document.getElementById('hamburgerMenu');
const navbar = document.querySelector('.navbar');
const overlay = document.getElementById('navOverlay');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navbar.classList.toggle('active');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navbar.classList.remove('active');
  overlay.classList.remove('active');
});

// Close menu when clicking nav links
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navbar.classList.remove('active');
    overlay.classList.remove('active');
  });
});

// Initialize GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation settings for image slider
const animationDuration = 1;
const slideDuration = 2;
const initialDelay = 0.5;

// Store original positions for each direction
const positions = {
  left: { x: -400, y: 0 },
  top: { x: 0, y: -460 },
  bottom: { x: 0, y: 460 }
};

// Initial page load animations
function initPageLoadAnimations() {
  // Set initial states
  gsap.set('.navbar', { x: -200, opacity: 0 });
  gsap.set('.abstract-container', { 
    scale: 0,
    opacity: 0,
    transformOrigin: 'center center'
  });
  gsap.set(['.rect-box1', '.rect-box2'], { 
    opacity: 0,
  });
  gsap.set('.img-shuffler', {     
    scale: 0, 
    opacity: 0 
  });
  gsap.set('.hero-text-content', { 
    y: 50, 
    opacity: 0 
  });
  // Add menu bubble initial state
  gsap.set('.carousal-menu', {
    scale: 0,
    opacity: 0,
    transformOrigin: 'center center'
  });

  // Create timeline for page load animations
  const tl = gsap.timeline();

  // Navbar animation
  tl.to('.navbar', {
    x: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
  });

  // Abstract container and rectangles animation
  tl.to('.abstract-container', {
    scale: 1,
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
  }, '<');

  tl.to(['.rect-box1', '.rect-box2'], {
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    stagger: 0.1
  }, '<+=0.2');

  // Menu bubble animation with abstract container
  tl.to('.carousal-menu', {
    scale: 1,
    opacity: 1,
    duration: 1,
    ease: 'elastic.out(1, 0.5)'
  }, '<+=0.3');

  // Image shuffler animation
  tl.to('.img-shuffler', {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: 'power2.out'
  }, '<');

  // Hero text content animation
  tl.to('.hero-text-content', {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
  }, '<+=0.3');

  return tl;
}

// Animation sequence for each slide
function createSlideAnimation(slide, direction) {
  const timeline = gsap.timeline();
  
  // Set initial position
  timeline.set(slide, {
    x: positions[direction].x,
    y: positions[direction].y,
    opacity: 0
  });

  // Slide in
  timeline.to(slide, {
    x: 0,
    y: 0,
    opacity: 1,
    duration: animationDuration,
    ease: "power2.out"
  });

  // Hold
  timeline.to(slide, {
    duration: slideDuration
  });

  // Slide out
  timeline.to(slide, {
    x: positions[direction].x,
    y: positions[direction].y,
    opacity: 0,
    duration: animationDuration,
    ease: "power2.in"
  });

  return timeline;
}

// Create master timeline for image slider
function createMasterTimeline() {
  const masterTimeline = gsap.timeline({
    repeat: -1,
    onRepeat: () => {
      // Reset all slides to their initial state
      document.querySelectorAll('.swiper-slide').forEach(slide => {
        gsap.set(slide, {
          clearProps: 'transform,opacity',
          opacity: 0
        });
      });
    }
  });

  // Get all slides
  const slides = document.querySelectorAll('.swiper-slide');
  
  // Animation sequence
  const directions = ['left', 'top', 'bottom'];
  
  slides.forEach((slide, index) => {
    const direction = directions[index % directions.length];
    const slideAnimation = createSlideAnimation(slide, direction);
    
    if (index === 0) {
      masterTimeline.add(slideAnimation, initialDelay);
    } else {
      masterTimeline.add(slideAnimation, '>');
    }
  });

  return masterTimeline;
}

// Carousel Menu Animation
function initCarouselMenu() {
  const menuTrigger = document.querySelector('.menu-trigger');
  const menuItems = document.querySelectorAll('.menu-item');
  let isOpen = false;
  let menuTimeline;

  // Calculate positions for menu items
  function calculatePosition(index, total) {
    const radius = 100; // Distance from center to menu items
    const angle = (index * (360 / total) - 90) * (Math.PI / 180);
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    };
  }

  // Create timeline for menu animation
  function createMenuTimeline() {
    const tl = gsap.timeline({ paused: true });

    // Add rotation animation for trigger
    tl.to('.menu-trigger i', {
      rotation: 180,
      duration: 0.5,
      ease: 'power2.inOut'
    });

    // Animate each menu item
    menuItems.forEach((item, index) => {
      const position = calculatePosition(index, menuItems.length);
      
      // Set initial position
      gsap.set(item, {
        x: 0,
        y: 0,
        opacity: 0,
        visibility: 'hidden'
      });

      // Add to timeline
      tl.to(item, {
        x: position.x,
        y: position.y,
        opacity: 1,
        visibility: 'visible',
        duration: 0.5,
        ease: 'back.out(1.7)'
      }, `<+=${index * 0.05}`);
    });

    return tl;
  }

  // Initialize menu timeline
  menuTimeline = createMenuTimeline();

  // Toggle menu function
  function toggleMenu(open) {
    isOpen = open;
    if (open) {
      menuTimeline.play();
    } else {
      menuTimeline.reverse();
    }
  }

  // Click handler
  menuTrigger.addEventListener('click', () => {
    toggleMenu(!isOpen);
  });

  // Hover handlers
  const carousalMenu = document.querySelector('.carousal-menu');
  carousalMenu.addEventListener('mouseenter', () => {
    toggleMenu(true);
  });

  carousalMenu.addEventListener('mouseleave', () => {
    toggleMenu(false);
  });
}

// Wait for page load
window.addEventListener('load', () => {
  // Make sure all slides are visible initially
  document.querySelectorAll('.swiper-slide').forEach(slide => {
    gsap.set(slide, {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0
    });
  });

  // Remove Swiper initialization
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  if (swiperWrapper) {
    swiperWrapper.style.transform = 'none';
  }

  // Add necessary styles to container
  const swiperContainer = document.querySelector('.img-shuffler');
  if (swiperContainer) {
    swiperContainer.style.position = 'relative';
  }

  // Start page load animations
  const pageLoadTimeline = initPageLoadAnimations();
  
  // Initialize carousel menu and start image slider after page load animations
  pageLoadTimeline.then(() => {
    initCarouselMenu();
    const masterTimeline = createMasterTimeline();
    masterTimeline.play();
  });
});

// Store Section Scroll Animations
gsap.registerPlugin(ScrollTrigger);

gsap.from(".store-title", {
  y: 30,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".store-title",
    start: "top 80%",
    toggleActions: "play none none none"
  }
});

document.querySelectorAll(".category-section").forEach((section) => {
  gsap.from(section, {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      toggleActions: "play none none none"
    }
  });

  gsap.from(section.querySelectorAll(".product-card"), {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 70%",
      toggleActions: "play none none none"
    }
  });
});

gsap.from(".custom-orders-container", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".custom-orders-container",
    start: "top 75%",
    toggleActions: "play none none none"
  }
});

gsap.from(".cus-img1, .cus-img2, .cus-img3", {
  scale: 0.8,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".custom-orders-container",
    start: "top 70%",
    toggleActions: "play none none none"
  }
});

gsap.from(".custom-orders h1, .custom-orders p, .custom-orders button", {
  y: 30,
  opacity: 0,
  duration: 1,
  stagger: 0.3,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".custom-orders",
    start: "top 65%",
    toggleActions: "play none none none"
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const modalOverlay = document.getElementById("modalOverlay");
  const signInForm = document.querySelector(".sign-in");
  const signUpForm = document.querySelector(".sign-up");
  const authSwitchBtn = document.getElementById("authSwitchBtn");
  const authHeader = document.getElementById("authHeader");
  const authDesc = document.getElementById("authDesc");
  const exploreButton = document.querySelector(".hero-btn");
  const closeModalBtn = document.getElementById("closeModal");

  let isSignInView = true;

  function toggleAuth() {
      if (isSignInView) {
          // Switch to Sign Up
          signInForm.classList.remove("active");
          signUpForm.classList.add("active");
          authHeader.textContent = "Welcome!";
          authDesc.textContent = "Register now and don't miss out on the charm your heart truly wants.";
          authSwitchBtn.textContent = "Sign In";
      } else {
          // Switch to Sign In
          signUpForm.classList.remove("active");
          signInForm.classList.add("active");
          authHeader.textContent = "Welcome Back!";
          authDesc.textContent = "It's wonderful to see you again!";
          authSwitchBtn.textContent = "Sign Up";
      }
      isSignInView = !isSignInView;
  }

  function openModal() {
      modalOverlay.style.opacity = "1";
      modalOverlay.style.visibility = "visible";
      document.querySelector(".auth-modal").style.transform = "scale(1)";
  }

  function closeModal() {
      modalOverlay.style.opacity = "0";
      modalOverlay.style.visibility = "hidden";
      document.querySelector(".auth-modal").style.transform = "scale(0.9)";
      // Reset to sign in view when closing
      if (!isSignInView) {
          toggleAuth();
      }
  }

  authSwitchBtn.addEventListener("click", toggleAuth);
  exploreButton.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);
});

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
  });
});