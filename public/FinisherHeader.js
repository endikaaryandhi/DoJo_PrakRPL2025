"use strict";

(function (t) {
  // Utility function: Convert hex color to RGB
  function hexToRgb(hex) {
    let result;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      result = hex.substring(1).split("");
      if (result.length === 3) {
        result = [result[0], result[0], result[1], result[1], result[2], result[2]];
      }
      result = "0x" + result.join("");
      return {
        r: (result >> 16) & 255,
        g: (result >> 8) & 255,
        b: result & 255,
      };
    }
    return { r: 0, g: 0, b: 0 };
  }

  // Utility: Angle to pixel offset
  function angleToOffset(degrees, radius) {
    const radians = 0.017453 * Math.abs(degrees);
    return Math.ceil(radius * Math.tan(radians));
  }

  // Particle class
  class Particle {
    constructor(color, quadrant, options) {
      this.o = options;
      this.r = hexToRgb(color);
      this.d = this.randomDirection();
      this.h = this.randomShape();
      this.s = Math.abs(this.randomFromRange(this.o.size));
      this.setInitialPosition(quadrant);
      this.vx = this.randomFromRange(this.o.speed.x) * this.d;
      this.vy = this.randomFromRange(this.o.speed.y) * this.d;
    }

    setInitialPosition(quadrant) {
      const pos = this.randomInitialCoords();
      switch (quadrant) {
        case 3:
          this.x = pos.x + pos.halfWidth;
          this.y = pos.y;
          break;
        case 2:
          this.x = pos.x;
          this.y = pos.y + pos.halfHeight;
          break;
        case 1:
          this.x = pos.x + pos.halfWidth;
          this.y = pos.y + pos.halfHeight;
          break;
        default:
          this.x = pos.x;
          this.y = pos.y;
      }
    }

    randomInitialCoords() {
      const halfWidth = this.o.c.w / 2;
      const halfHeight = this.o.c.h / 2;
      return {
        x: Math.random() * halfWidth,
        y: Math.random() * halfHeight,
        halfWidth,
        halfHeight
      };
    }

    randomFromRange(range) {
      if (range.min === range.max) return range.min;
      return Math.random() * (range.max - range.min) + range.min;
    }

    randomDirection() {
      return Math.random() > 0.5 ? 1 : -1;
    }

    randomShape() {
      const shapes = this.o.shapes;
      return shapes[Math.floor(Math.random() * shapes.length)];
    }

    rgba(color, alpha) {
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    }

    animate(ctx, width, height) {
      if (this.o.size.pulse) {
        this.s += this.o.size.pulse * this.d;
        if (this.s > this.o.size.max || this.s < this.o.size.min) {
          this.d *= -1;
        }
        this.s = Math.abs(this.s);
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      ctx.beginPath();
      if (this.o.blending && this.o.blending !== "none") {
        ctx.globalCompositeOperation = this.o.blending;
      }

      const centerColor = this.rgba(this.r, this.o.opacity.center);
      const edgeColor = this.rgba(this.r, this.o.opacity.edge);
      let radius = this.s;
      if (this.h === "c") radius /= 2;
      else if (this.h === "t") radius *= 0.577;
      else if (this.h === "s") radius *= 0.707;

      const gradient = ctx.createRadialGradient(this.x, this.y, 0.01, this.x, this.y, radius);
      gradient.addColorStop(0, centerColor);
      gradient.addColorStop(1, edgeColor);
      ctx.fillStyle = gradient;

      const r = Math.abs(this.s / 2);
      if (this.h === "c") {
        ctx.arc(this.x, this.y, r, 0, 2 * Math.PI, false);
      } else if (this.h === "s") {
        const left = this.x - r, right = this.x + r;
        const top = this.y - r, bottom = this.y + r;
        ctx.moveTo(left, bottom);
        ctx.lineTo(right, bottom);
        ctx.lineTo(right, top);
        ctx.lineTo(left, top);
      } else if (this.h === "t") {
        const height = angleToOffset(30, r);
        const bottom = this.y + height;
        ctx.moveTo(this.x - r, bottom);
        ctx.lineTo(this.x + r, bottom);
        ctx.lineTo(this.x, this.y - 2 * height);
      }

      ctx.closePath();
      ctx.fill();
    }
  }

  // FinisherHeader class
  class FinisherHeader {
    constructor(options) {
      this.container = this.getTargetElement(options.className);
      if (!this.container) {
        console.error("No .finisher-header element found");
        return;
      }
      
      this.c = document.createElement("canvas");
      this.x = this.c.getContext("2d");
      this.c.id = "finisher-canvas";
      this.container.appendChild(this.c);

      let resizeTimeout;
      t.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => this.resize(), 150);
      });

      this.init(options);
      t.requestAnimationFrame(this.animate.bind(this));
    }

    getTargetElement(className) {
      const elements = document.getElementsByClassName(className || "finisher-header");
      return elements.length ? elements[0] : null;
    }

    resize() {
  const container = this.getTargetElement(this.o.className);
  if (!container) {
    console.error("Element with class " + this.o.className + " not found.");
    return; // Hentikan eksekusi jika elemen tidak ditemukan
  }

  this.o.c = {
    w: container.clientWidth,
    h: container.clientHeight
  };
  this.c.width = this.o.c.w;
  this.c.height = this.o.c.h;

  const skewOffset = angleToOffset(this.o.skew, this.o.c.w / 2);
  const transform = `skewY(${this.o.skew}deg) translateY(-${skewOffset}px)`;

  this.c.setAttribute("style", `
    position: absolute;
    z-index: -1;
    top: 0; left: 0; right: 0; bottom: 0;
    -webkit-transform: ${transform};
    transform: ${transform};
    outline: 1px solid transparent;
    background-color: rgba(${this.bc.r}, ${this.bc.g}, ${this.bc.b}, 1);
  `);
}


    init(options) {
      this.o = options;
      this.bc = hexToRgb(this.o.colors.background);
      this.ps = [];
      this.resize();
      this.createParticles();
    }

    createParticles() {
      let colorIndex = 0;
      this.ps = [];

      // Adjust particle count for small screens
      this.o.ac = t.innerWidth < 600 && this.o.count > 5
        ? Math.round(this.o.count / 2)
        : this.o.count;

      for (let i = 0; i < this.o.ac; i++) {
        const quadrant = i % 4;
        const particle = new Particle(
          this.o.colors.particles[colorIndex],
          quadrant,
          this.o
        );

        if (++colorIndex >= this.o.colors.particles.length) {
          colorIndex = 0;
        }

        this.ps.push(particle);
      }
    }

    animate() {
      t.requestAnimationFrame(this.animate.bind(this));
      this.x.clearRect(0, 0, this.o.c.w, this.o.c.h);
      for (let i = 0; i < this.o.ac; i++) {
        this.ps[i].animate(this.x, this.o.c.w, this.o.c.h);
      }
    }
  }

  t.FinisherHeader = FinisherHeader;

})(window);
