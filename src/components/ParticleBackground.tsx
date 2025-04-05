
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  const colors = [
    'rgba(123, 97, 255, 0.3)',
    'rgba(173, 216, 230, 0.2)',
    'rgba(147, 112, 219, 0.25)',
    'rgba(138, 43, 226, 0.2)',
    'rgba(221, 160, 221, 0.25)'
  ];

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full window size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Initialize particles
    const particleCount = Math.min(Math.floor(window.innerWidth / 15), 100);
    particles.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1
      });
    }
    
    return () => window.removeEventListener('resize', handleResize);
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
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
      }
      
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.alpha;
      ctx.fill();
      
      // Draw connections
      connectParticles(particle, ctx);
    });
    
    animationFrameId.current = requestAnimationFrame(drawParticles);
  };

  const connectParticles = (particle: Particle, ctx: CanvasRenderingContext2D) => {
    const connectionRadius = 100;
    
    particles.current.forEach(otherParticle => {
      if (particle === otherParticle) return;
      
      const dx = particle.x - otherParticle.x;
      const dy = particle.y - otherParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < connectionRadius) {
        // The closer they are, the more opaque the line
        const opacity = 1 - (distance / connectionRadius);
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(147, 112, 219, ${opacity * 0.2})`;
        ctx.lineWidth = 1;
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
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default ParticleBackground;
