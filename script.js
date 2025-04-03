// DOM Elements
const header = document.querySelector(".header")
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
const mobileMenu = document.querySelector(".mobile-menu")
const themeToggle = document.querySelector(".theme-toggle")
const drawingCanvas = document.getElementById("drawing-canvas")
const gameCanvas = document.getElementById("game-canvas")
const colorButtons = document.querySelectorAll(".color-button")
const brushSizeInput = document.getElementById("brush-size")
const clearCanvasButton = document.getElementById("clear-canvas")
const resetGameButton = document.getElementById("reset-game")
const playAgainButton = document.getElementById("play-again")
const gameScore = document.getElementById("game-score")
const gameOver = document.getElementById("game-over")
const tabButtons = document.querySelectorAll(".tab-button")
const tabContents = document.querySelectorAll(".tab-content")
const heroCanvas = document.getElementById("hero-canvas")
const particleCanvas = document.getElementById("particle-canvas")
const featuredSlides = document.getElementById("featured-slides")
const sliderDots = document.getElementById("slider-dots")
const prevSlideButton = document.getElementById("prev-slide")
const nextSlideButton = document.getElementById("next-slide")
const currentYearElement = document.getElementById("current-year")

// Set current year in footer
currentYearElement.textContent = new Date().getFullYear()

// Theme Toggle
let isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches

function updateTheme() {
  if (isDarkMode) {
    document.body.classList.add("dark")
  } else {
    document.body.classList.remove("dark")
  }
}

updateTheme()

themeToggle.addEventListener("click", () => {
  isDarkMode = !isDarkMode
  updateTheme()
})

// Mobile Menu Toggle
mobileMenuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("open")
  document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "auto"
})

// Header Scroll Effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
})

// Tab Switching
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabId = button.getAttribute("data-tab")

    // Update active tab button
    tabButtons.forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")

    // Show active tab content
    tabContents.forEach((content) => {
      content.classList.remove("active")
      if (content.id === `${tabId}-tab`) {
        content.classList.add("active")
      }
    })

    // Initialize the appropriate canvas
    if (tabId === "canvas") {
      initDrawingCanvas()
    } else if (tabId === "game") {
      initGameCanvas()
    }
  })
})

// Drawing Canvas
let isDrawing = false
let lastX = 0
let lastY = 0
let brushColor = "#ec4899"
let brushSize = 5

function initDrawingCanvas() {
  if (!drawingCanvas) return

  const ctx = drawingCanvas.getContext("2d")
  const container = drawingCanvas.parentElement

  // Set canvas dimensions
  drawingCanvas.width = container.offsetWidth
  drawingCanvas.height = 300

  // Fill with white background
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height)

  // Event listeners
  drawingCanvas.addEventListener("mousedown", startDrawing)
  drawingCanvas.addEventListener("mousemove", draw)
  drawingCanvas.addEventListener("mouseup", stopDrawing)
  drawingCanvas.addEventListener("mouseout", stopDrawing)

  drawingCanvas.addEventListener("touchstart", handleTouchStart)
  drawingCanvas.addEventListener("touchmove", handleTouchMove)
  drawingCanvas.addEventListener("touchend", stopDrawing)
}

function startDrawing(e) {
  isDrawing = true

  const rect = drawingCanvas.getBoundingClientRect()
  lastX = e.clientX - rect.left
  lastY = e.clientY - rect.top
}

function draw(e) {
  if (!isDrawing) return

  const ctx = drawingCanvas.getContext("2d")
  const rect = drawingCanvas.getBoundingClientRect()
  const currentX = e.clientX - rect.left
  const currentY = e.clientY - rect.top

  ctx.beginPath()
  ctx.strokeStyle = brushColor
  ctx.lineWidth = brushSize
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(currentX, currentY)
  ctx.stroke()

  lastX = currentX
  lastY = currentY
}

function handleTouchStart(e) {
  e.preventDefault()

  const touch = e.touches[0]
  const mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  })

  startDrawing(mouseEvent)
}

function handleTouchMove(e) {
  e.preventDefault()

  const touch = e.touches[0]
  const mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  })

  draw(mouseEvent)
}

function stopDrawing() {
  isDrawing = false
}

// Color buttons
colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    brushColor = button.getAttribute("data-color")
  })
})

// Brush size
brushSizeInput.addEventListener("input", () => {
  brushSize = brushSizeInput.value
})

// Clear canvas
clearCanvasButton.addEventListener("click", () => {
  const ctx = drawingCanvas.getContext("2d")
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height)
})

// Game Canvas
let score = 0
let targets = []

function initGameCanvas() {
  if (!gameCanvas) return

  const ctx = gameCanvas.getContext("2d")
  const container = gameCanvas.parentElement

  // Set canvas dimensions
  gameCanvas.width = container.offsetWidth
  gameCanvas.height = 300

  // Reset game
  score = 0
  gameScore.textContent = score
  gameOver.style.display = "none"

  // Generate targets
  generateTargets()

  // Start game loop
  requestAnimationFrame(gameLoop)

  // Event listener
  gameCanvas.addEventListener("click", handleGameClick)
}

function generateTargets() {
  targets = []
  const colors = ["#ec4899", "#8b5cf6", "#06b6d4", "#f59e0b"]

  for (let i = 0; i < 5; i++) {
    targets.push({
      x: Math.random() * (gameCanvas.width - 50) + 25,
      y: Math.random() * (gameCanvas.height - 50) + 25,
      size: Math.random() * 20 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }
}

function gameLoop() {
  if (!gameCanvas) return

  const ctx = gameCanvas.getContext("2d")
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height)

  // Draw targets
  for (const target of targets) {
    // Fill circle
    ctx.fillStyle = target.color
    ctx.beginPath()
    ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2)
    ctx.fill()

    // Add pulsing effect
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(target.x, target.y, target.size + Math.sin(Date.now() / 200) * 5, 0, Math.PI * 2)
    \
    ctx.stroke  target.y, target.size + Math.sin(Date.now() / 200) * 5, 0, Math.PI * 2)
    ctx.stroke()
  }

  requestAnimationFrame(gameLoop)
}

function handleGameClick(e) {
  const rect = gameCanvas.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top

  // Check if click hit any target
  let targetHit = false

  targets = targets.filter((target) => {
    const dx = clickX - target.x
    const dy = clickY - target.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= target.size) {
      targetHit = true
      return false // Remove this target
    }

    return true // Keep this target
  })

  if (targetHit) {
    score += 10
    gameScore.textContent = score

    // Generate new targets if all are gone
    if (targets.length === 0) {
      gameOver.style.display = "flex"
    }
  }
}

// Reset game
resetGameButton.addEventListener("click", () => {
  score = 0
  gameScore.textContent = score
  gameOver.style.display = "none"
  generateTargets()
})

// Play again
playAgainButton.addEventListener("click", () => {
  score = 0
  gameScore.textContent = score
  gameOver.style.display = "none"
  generateTargets()
})

// Hero Canvas Particles
function initHeroCanvas() {
  if (!heroCanvas) return

  const ctx = heroCanvas.getContext("2d")

  // Set canvas dimensions
  heroCanvas.width = window.innerWidth
  heroCanvas.height = window.innerHeight * 0.8

  const particles = []
  const numberOfParticles = 100
  const mousePosition = { x: 0, y: 0 }

  // Track mouse position
  window.addEventListener("mousemove", (e) => {
    mousePosition.x = e.clientX
    mousePosition.y = e.clientY
  })

  class Particle {
    constructor() {
      this.x = Math.random() * heroCanvas.width
      this.y = Math.random() * heroCanvas.height
      this.size = Math.random() * 5 + 1
      this.speedX = Math.random() * 3 - 1.5
      this.speedY = Math.random() * 3 - 1.5

      // Generate a random color from a modern palette
      const colors = [
        "rgba(255, 105, 180, 0.7)", // pink
        "rgba(147, 112, 219, 0.7)", // purple
        "rgba(64, 224, 208, 0.7)", // turquoise
        "rgba(255, 165, 0, 0.7)", // orange
        "rgba(50, 205, 50, 0.7)", // lime green
      ]
      this.color = colors[Math.floor(Math.random() * colors.length)]
    }

    update() {
      this.x += this.speedX
      this.y += this.speedY

      // Boundary check
      if (this.x > heroCanvas.width || this.x < 0) {
        this.speedX = -this.speedX
      }
      if (this.y > heroCanvas.height || this.y < 0) {
        this.speedY = -this.speedY
      }

      // Mouse interaction
      const dx = mousePosition.x - this.x
      const dy = mousePosition.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        const angle = Math.atan2(dy, dx)
        const force = -5 / distance

        this.speedX += Math.cos(angle) * force
        this.speedY += Math.sin(angle) * force
      }

      // Apply some drag
      this.speedX *= 0.99
      this.speedY *= 0.99
    }

    draw() {
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Initialize particles
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(new Particle())
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x
        const dy = particles[a].y - particles[b].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(particles[a].x, particles[a].y)
          ctx.lineTo(particles[b].x, particles[b].y)
          ctx.stroke()
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height)

    for (const particle of particles) {
      particle.update()
      particle.draw()
    }

    connectParticles()

    requestAnimationFrame(animate)
  }

  animate()
}

// Background Particles
function initParticleCanvas() {
  if (!particleCanvas) return

  const ctx = particleCanvas.getContext("2d")

  // Set canvas dimensions
  particleCanvas.width = particleCanvas.offsetWidth
  particleCanvas.height = particleCanvas.offsetHeight

  const particles = []
  const particleCount = Math.min(Math.floor((particleCanvas.width * particleCanvas.height) / 10000), 100)

  class Particle {
    constructor() {
      this.x = Math.random() * particleCanvas.width
      this.y = Math.random() * particleCanvas.height
      this.size = Math.random() * 3 + 1
      this.speedX = Math.random() * 0.5 - 0.25
      this.speedY = Math.random() * 0.5 - 0.25

      // Generate a random color with low opacity
      const hue = Math.floor(Math.random() * 360)
      this.color = `hsla(${hue}, 70%, 60%, 0.3)`
    }

    update() {
      this.x += this.speedX
      this.y += this.speedY

      // Wrap around edges
      if (this.x < 0) this.x = particleCanvas.width
      if (this.x > particleCanvas.width) this.x = 0
      if (this.y < 0) this.y = particleCanvas.height
      if (this.y > particleCanvas.height) this.y = 0
    }

    draw() {
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle())
  }

  function connectParticles() {
    const maxDistance = 150

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height)

    for (const particle of particles) {
      particle.update()
      particle.draw()
    }

    connectParticles()

    requestAnimationFrame(animate)
  }

  animate()
}

// Featured Slider
const featuredData = [
  {
    id: 1,
    title: "Interactive Puzzle Challenge",
    description: "Test your problem-solving skills with our interactive puzzle that adapts to your skill level.",
    image: "https://via.placeholder.com/800x600",
    color: "from-pink-500 to-rose-500",
    href: "/activities/puzzle",
  },
  {
    id: 2,
    title: "Virtual Art Studio",
    description: "Express your creativity with our digital canvas featuring advanced drawing tools and effects.",
    image: "https://via.placeholder.com/800x600",
    color: "from-violet-500 to-purple-600",
    href: "/activities/art",
  },
  {
    id: 3,
    title: "Knowledge Quest",
    description: "Embark on an interactive learning journey through various subjects with our gamified quizzes.",
    image: "https://via.placeholder.com/800x600",
    color: "from-cyan-400 to-blue-500",
    href: "/activities/quest",
  },
]

let currentSlide = 0

function initFeaturedSlider() {
  if (!featuredSlides || !sliderDots) return

  // Create slides
  featuredData.forEach((slide, index) => {
    const slideElement = document.createElement("div")
    slideElement.className = "featured-slide"
    slideElement.innerHTML = `
      <div class="slide-image">
        <img src="${slide.image}" alt="${slide.title}">
      </div>
      <div class="slide-content">
        <h3>${slide.title}</h3>
        <p>${slide.description}</p>
        <a href="${slide.href}" class="button primary-button">
          <span>Try This Experience</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    `
    featuredSlides.appendChild(slideElement)

    // Create dot
    const dot = document.createElement("button")
    dot.className = "slider-dot"
    if (index === 0) dot.classList.add("active")
    dot.addEventListener("click", () => goToSlide(index))
    sliderDots.appendChild(dot)
  })

  // Set initial slide
  updateSlider()

  // Event listeners
  prevSlideButton.addEventListener("click", prevSlide)
  nextSlideButton.addEventListener("click", nextSlide)

  // Auto slide
  setInterval(nextSlide, 5000)
}

function updateSlider() {
  featuredSlides.style.transform = `translateX(-${currentSlide * 100}%)`

  // Update dots
  const dots = sliderDots.querySelectorAll(".slider-dot")
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide)
  })
}

function goToSlide(index) {
  currentSlide = index
  updateSlider()
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + featuredData.length) % featuredData.length
  updateSlider()
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % featuredData.length
  updateSlider()
}

// Initialize everything
window.addEventListener("load", () => {
  initDrawingCanvas()
  initGameCanvas()
  initHeroCanvas()
  initParticleCanvas()
  initFeaturedSlider()

  // Resize event
  window.addEventListener("resize", () => {
    initDrawingCanvas()
    initGameCanvas()
    initHeroCanvas()
    initParticleCanvas()
  })
})

// Feature card hover effects
const featureCards = document.querySelectorAll(".feature-card")
featureCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    const color = card.getAttribute("data-color")
    card.style.boxShadow = `0 10px 25px -5px ${color}20`
  })

  card.addEventListener("mouseleave", () => {
    card.style.boxShadow = ""
  })
})

// Activity card hover effects
const activityCards = document.querySelectorAll(".activity-card")
activityCards.forEach((card) => {
  const image = card.querySelector(".activity-image img")
  const link = card.querySelector(".activity-link svg")

  card.addEventListener("mouseenter", () => {
    image.style.transform = "scale(1.05)"
    link.style.transform = "translateX(4px)"
  })

  card.addEventListener("mouseleave", () => {
    image.style.transform = ""
    link.style.transform = ""
  })
})

