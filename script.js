const canvas = document.getElementById("tank");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

const mouse = { x: null, y: null };
let bubbles = [];

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// BUBBLES
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 20;
    this.r = 3 + Math.random() * 4;
    this.speed = 0.3 + Math.random() * 0.3;
    this.opacity = 1;
  }
  update() {
    this.y -= this.speed;
    this.opacity -= 0.002;
  }
  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = "#aeefff";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

// FISH
class Fish {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0.6;
    this.size = 18;
  }

  boids(fishes) {
    let ax = 0, ay = 0, count = 0;
    fishes.forEach(f => {
      const d = Math.hypot(this.x - f.x, this.y - f.y);
      if (f !== this && d < 90) {
        ax += Math.cos(f.angle);
        ay += Math.sin(f.angle);
        count++;
      }
    });
    if (count) this.angle = Math.atan2(ay / count, ax / count);
  }

  followMouse() {
    if (!mouse.x) return;
    const d = Math.hypot(mouse.x - this.x, mouse.y - this.y);
    if (d < 120) this.angle += 0.004;
  }

  move(fishes) {
    this.boids(fishes);
    this.followMouse();

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    if (this.x < 20 || this.x > canvas.width - 20)
      this.angle = Math.PI - this.angle;
    if (this.y < 20 || this.y > canvas.height - 20)
      this.angle = -this.angle;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.fillStyle = "#ffa502";
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-this.size, 0);
    ctx.lineTo(-this.size - 10, -8);
    ctx.lineTo(-this.size - 10, 8);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

const fishes = Array.from({ length: 10 }, () => new Fish());

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.04) bubbles.push(new Bubble());
  bubbles = bubbles.filter(b => b.opacity > 0);
  bubbles.forEach(b => { b.update(); b.draw(); });

  fishes.forEach(f => {
    f.move(fishes);
    f.draw();
  });

  requestAnimationFrame(animate);
}

animate();

const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll("[data-page]");

navItems.forEach(item => {
  item.onclick = () => {
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(item.dataset.page).classList.add("active");
  };
});

const roles = [
  "Full Stack Developer",
  "UI / UX Developer",
  "Graphics Designer"
];

let roleIndex = 0;
const roleEl = document.querySelector(".changing-text");

function changeRole() {
  roleEl.style.opacity = 0;
  setTimeout(() => {
    roleEl.textContent = roles[roleIndex];
    roleEl.style.opacity = 1;
    roleIndex = (roleIndex + 1) % roles.length;
  }, 500);
}

changeRole();
setInterval(changeRole, 2500);

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("night");
  document.body.classList.toggle("day");
};
