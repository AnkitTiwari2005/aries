import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  growth: number; // Control particle size animation
  rotation: number; // For rotating particles
}

interface ParticleBackgroundProps {
  theme: 'default' | 'dark';
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Theme-based color palettes
  const colorSchemes = {
    default: [
      'rgba(123, 97, 255, 0.4)', // Purple
      'rgba(173, 216, 230, 0.3)', // Light blue
      'rgba(147, 112, 219, 0.35)', // Medium purple
      'rgba(138, 43, 226, 0.3)', // Blue violet
      'rgba(221, 160, 221, 0.35)' // Plum
    ],
    dark: [
      'rgba(32, 87, 146, 0.4)', // Deep blue
      'rgba(44, 62, 80, 0.3)', // Dark slate
      'rgba(61, 90, 128, 0.35)', // Slate blue
      'rgba(0, 18, 51, 0.3)', // Dark navy
      'rgba(25, 42, 86, 0.35)' // Midnight blue
    ]
  };

  const getColors = () => colorSchemes[theme];

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full window size with device pixel ratio for sharp visuals
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Track mouse position for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initialize particles
    const particleCount = Math.min(Math.floor(window.innerWidth / 8), 180); // Increased particle count
    particles.current = [];
    
    const colors = getColors();
    
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 6 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.1,
        growth: Math.random() * 0.02 - 0.01, // Random growth/shrink rate
        rotation: Math.random() * 360 // Random initial rotation
      });
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  };

  const drawParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.current.forEach(particle => {
      // Move particles
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges with slight randomness for more natural movement
      if (particle.x < 0 || particle.x > window.innerWidth) {
        particle.speedX *= -1;
        particle.speedX += (Math.random() - 0.5) * 0.04; // Add slight randomness
      }
      
      if (particle.y < 0 || particle.y > window.innerHeight) {
        particle.speedY *= -1;
        particle.speedY += (Math.random() - 0.5) * 0.04; // Add slight randomness
      }
      
      // Size animation
      particle.size += particle.growth;
      if (particle.size < 1 || particle.size > 7) {
        particle.growth *= -1; // Reverse growth direction
      }
      
      // Interactive speed based on mouse proximity
      const dx = mousePosition.current.x - particle.x;
      const dy = mousePosition.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const interactRadius = 150;
      
      if (distance < interactRadius) {
        const force = (interactRadius - distance) / interactRadius;
        particle.speedX -= (dx / distance) * force * 0.02;
        particle.speedY -= (dy / distance) * force * 0.02;
      }
      
      // Draw particle
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation + Date.now() * 0.0001) % 360 * Math.PI / 180);
      
      ctx.beginPath();
      
      // Mix of shapes for variety
      if (Math.random() > 0.7) {
        // Draw circle
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      } else {
        // Draw polygon
        const sides = Math.floor(Math.random() * 3) + 3; // 3 to 5 sides
        const radius = particle.size;
        
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        
        for (let i = 1; i < sides; i++) {
          const angle = (i * 2 * Math.PI / sides);
          ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
        }
        
        ctx.closePath();
      }
      
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.alpha;
      ctx.fill();
      ctx.restore();
      
      // Draw connections
      connectParticles(particle, ctx);
    });
    
    // Add occasional new particle
    if (Math.random() > 0.98) {
      const colors = getColors();
      particles.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 5 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1,
        growth: Math.random() * 0.02 - 0.01,
        rotation: Math.random() * 360
      });
      
      // Keep particle count reasonable
      if (particles.current.length > 220) { // Increased maximum particles
        particles.current.shift();
      }
    }
    
    animationFrameId.current = requestAnimationFrame(drawParticles);
  };

  const connectParticles = (particle: Particle, ctx: CanvasRenderingContext2D) => {
    const connectionRadius = 130; // Increased connection radius
    
    particles.current.forEach(otherParticle => {
      if (particle === otherParticle) return;
      
      const dx = particle.x - otherParticle.x;
      const dy = particle.y - otherParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < connectionRadius) {
        // The closer they are, the more opaque the line
        const opacity = 1 - (distance / connectionRadius);
        
        // Theme-based connection colors
        let connectionColor = 'rgba(147, 112, 219,';
        if (theme === 'dark') {
          connectionColor = 'rgba(61, 90, 128,';
        }
        
        ctx.beginPath();
        ctx.strokeStyle = `${connectionColor} ${opacity * 0.35})`;
        ctx.lineWidth = opacity * 1.8;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(otherParticle.x, otherParticle.y);
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    const cleanup = initializeCanvas();
    drawParticles();
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (cleanup) cleanup();
    };
  }, [theme]); // Reinitialize when theme changes

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: theme === 'dark' ? 0.8 : 0.7 }}
    />
  );
};

export default ParticleBackground;
