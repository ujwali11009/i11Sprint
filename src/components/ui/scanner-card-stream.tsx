import { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

export interface TeamMemberCardItem {
  name: string;
  role?: string;
  image: string;
}

// --- Default Images ---
const defaultCardImages = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
];

// --- Component Props Type Definition ---
type ScannerCardStreamProps = {
  showControls?: boolean;
  showSpeed?: boolean;
  initialSpeed?: number;
  direction?: -1 | 1;
  cardImages?: string[];
  teamMembers?: TeamMemberCardItem[];
  repeat?: number;
  cardGap?: number;
  friction?: number;
  scanEffect?: 'clip' | 'scramble';
};

// --- The Main Component ---
const ScannerCardStream = ({
  initialSpeed = 140,
  direction = -1,
  cardImages = defaultCardImages,
  teamMembers,
  repeat = 6,
  cardGap = 50,
  friction = 0.95,
}: ScannerCardStreamProps) => {

  const [isPaused] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const cards = useMemo(() => {
    const list: TeamMemberCardItem[] = teamMembers && teamMembers.length > 0 
      ? teamMembers 
      : cardImages.map((img, idx) => ({
          name: `Team Member #${idx + 1}`,
          role: 'Sprint Specialist',
          image: img,
        }));

    const totalCards = list.length * repeat;
    return Array.from({ length: totalCards }, (_, i) => {
      const item = list[i % list.length];
      return {
        id: i,
        name: item.name,
        role: item.role || 'Sprint Specialist',
        image: item.image,
      };
    });
  }, [teamMembers, cardImages, repeat]);

  const cardLineRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);

  const cardStreamState = useRef({
    position: 0,
    velocity: initialSpeed,
    direction: direction,
    isDragging: false,
    lastMouseX: 0,
    lastTime: performance.now(),
    cardLineWidth: (400 + cardGap) * cards.length,
    friction: friction,
    minVelocity: 30,
  });

  const scannerState = useRef({ isScanning: false });

  useEffect(() => {
    const cardLine = cardLineRef.current;
    const particleCanvas = particleCanvasRef.current;
    const scannerCanvas = scannerCanvasRef.current;

    if (!cardLine || !particleCanvas || !scannerCanvas) return;
    
    let animationFrameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, 125, -125, 1, 1000);
    camera.position.z = 100;
    const renderer = new THREE.WebGLRenderer({ canvas: particleCanvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, 250);
    renderer.setClearColor(0x000000, 0);
    const particleCount = 0; // Disabled black bubble background particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    const texCanvas = document.createElement("canvas");
    texCanvas.width = 100; texCanvas.height = 100;
    const texCtx = texCanvas.getContext("2d")!;
    const half = 50;
    const gradient = texCtx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0.025, "#6366f1");
    gradient.addColorStop(0.2, "transparent");
    texCtx.fillStyle = gradient;
    texCtx.arc(half, half, half, 0, Math.PI * 2);
    texCtx.fill();
    const texture = new THREE.CanvasTexture(texCanvas);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    const material = new THREE.ShaderMaterial({
      uniforms: { pointTexture: { value: texture } },
      vertexShader: `attribute float alpha; varying float vAlpha; void main() { vAlpha = alpha; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_PointSize = 15.0; gl_Position = projectionMatrix * mvPosition; }`,
      fragmentShader: `uniform sampler2D pointTexture; varying float vAlpha; void main() { gl_FragColor = vec4(0.39, 0.4, 0.95, vAlpha) * texture2D(pointTexture, gl_PointCoord); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: false,
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    const ctx = scannerCanvas.getContext('2d')!;
    scannerCanvas.width = window.innerWidth;
    scannerCanvas.height = 300;
    let scannerParticles: any[] = [];
    const baseMaxParticles = 300;
    let currentMaxParticles = baseMaxParticles;
    const scanTargetMaxParticles = 1000;
    const createScannerParticle = () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 3, y: Math.random() * 300, vx: Math.random() * 0.8 + 0.2, vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 0.6 + 0.4, alpha: Math.random() * 0.4 + 0.6, life: 1.0, decay: Math.random() * 0.02 + 0.005,
    });
    for (let i = 0; i < baseMaxParticles; i++) scannerParticles.push(createScannerParticle());

    const updateCardEffects = () => {
      const scannerX = window.innerWidth / 2;
      const scannerWidth = 8;
      const scannerLeft = scannerX - scannerWidth / 2;
      const scannerRight = scannerX + scannerWidth / 2;
      let anyCardIsScanning = false;
      cardLine.querySelectorAll<HTMLElement>(".card-wrapper").forEach((wrapper) => {
        const rect = wrapper.getBoundingClientRect();
        const normalCard = wrapper.querySelector<HTMLElement>(".card-normal")!;
        const asciiCard = wrapper.querySelector<HTMLElement>(".card-ascii")!;
        if (rect.left < scannerRight && rect.right > scannerLeft) {
          anyCardIsScanning = true;
          wrapper.dataset.scanned = 'true';
          const intersectLeft = Math.max(scannerLeft - rect.left, 0);
          const intersectRight = Math.min(scannerRight - rect.left, rect.width);
          normalCard.style.setProperty("--clip-right", `${(intersectLeft / rect.width) * 100}%`);
          asciiCard.style.setProperty("--clip-left", `${(intersectRight / rect.width) * 100}%`);
        } else {
          delete wrapper.dataset.scanned;
          if (rect.right < scannerLeft) {
            normalCard.style.setProperty("--clip-right", "100%");
            asciiCard.style.setProperty("--clip-left", "100%");
          } else {
            normalCard.style.setProperty("--clip-right", "0%");
            asciiCard.style.setProperty("--clip-left", "0%");
          }
        }
      });
      setIsScanning(anyCardIsScanning);
      scannerState.current.isScanning = anyCardIsScanning;
    };
    
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - cardStreamState.current.lastTime) / 1000;
      cardStreamState.current.lastTime = currentTime;
      if (!isPaused && !cardStreamState.current.isDragging) {
        if (cardStreamState.current.velocity > cardStreamState.current.minVelocity) {
            cardStreamState.current.velocity *= cardStreamState.current.friction;
        }
        cardStreamState.current.position += cardStreamState.current.velocity * cardStreamState.current.direction * deltaTime;
      }
      const { position, cardLineWidth } = cardStreamState.current;
      const containerWidth = cardLine.parentElement?.offsetWidth || 0;
      if (position < -cardLineWidth) cardStreamState.current.position = containerWidth;
      else if (position > containerWidth) cardStreamState.current.position = -cardLineWidth;
      cardLine.style.transform = `translateX(${cardStreamState.current.position}px)`;
      updateCardEffects();
      const time = currentTime * 0.001;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i] * 0.016;
        if (positions[i * 3] > window.innerWidth / 2 + 100) positions[i * 3] = -window.innerWidth / 2 - 100;
        positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;
        alphas[i] = Math.max(0.1, Math.min(1, alphas[i] + (Math.random() - 0.5) * 0.05));
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.alpha.needsUpdate = true;
      renderer.render(scene, camera);
      ctx.clearRect(0, 0, window.innerWidth, 300);
      const targetCount = scannerState.current.isScanning ? scanTargetMaxParticles : baseMaxParticles;
      currentMaxParticles += (targetCount - currentMaxParticles) * 0.05;
      while (scannerParticles.length < currentMaxParticles) scannerParticles.push(createScannerParticle());
      while (scannerParticles.length > currentMaxParticles) scannerParticles.pop();
      scannerParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0 || p.x > window.innerWidth) Object.assign(p, createScannerParticle());
        ctx.globalAlpha = p.alpha * p.life; ctx.fillStyle = "#818cf8";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [isPaused, cards, cardGap, friction]);

  return (
    <div className="relative w-full h-[280px] flex items-center justify-center overflow-hidden font-sans select-none">
      <style>{`
        @keyframes scanPulse {
          0% { opacity: 0.75; transform: scaleY(1); }
          100% { opacity: 1; transform: scaleY(1.03); }
        }
        .animate-scan-pulse {
          animation: scanPulse 1.5s infinite alternate ease-in-out;
        }
      `}</style>

      <canvas ref={particleCanvasRef} className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[250px] z-0 pointer-events-none" />
      <canvas ref={scannerCanvasRef} className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[300px] z-10 pointer-events-none" />
      
      {/* Central Scanner Laser Line */}
      <div
        className={`
          scanner-line absolute top-1/2 left-1/2 h-[260px] w-0.5 -translate-x-1/2 -translate-y-1/2 
          bg-gradient-to-b from-transparent via-indigo-500 to-transparent rounded-full
          transition-opacity duration-300 z-20 pointer-events-none animate-scan-pulse
          ${isScanning ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          boxShadow: `
            0 0 10px #a78bfa, 0 0 20px #a78bfa, 
            0 0 30px #8b5cf6, 0 0 50px #6366f1`
        }}
      />

      {/* Stream Cards Track */}
      <div className="absolute w-full h-[250px] flex items-center">
        <div ref={cardLineRef} className="flex items-center whitespace-nowrap cursor-grab select-none will-change-transform" style={{ gap: `${cardGap}px` }}>
          {cards.map(card => (
            <div key={card.id} className="card-wrapper relative w-[360px] sm:w-[400px] h-[220px] sm:h-[240px] shrink-0">
              
              {/* Unscanned Photo Card */}
              <div className="card-normal card absolute top-0 left-0 w-full h-full rounded-[15px] overflow-hidden bg-transparent shadow-[0_15px_40px_rgba(0,0,0,0.4)] z-[2] [clip-path:inset(0_0_0_var(--clip-right,0%))]">
                <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-[15px] transition-all duration-300 ease-in-out brightness-110 contrast-110 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] hover:brightness-125 hover:contrast-125" />
                <div className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent">
                  <p className="text-white font-semibold text-sm tracking-tight leading-tight">{card.name}</p>
                  <p className="text-indigo-200/90 text-xs font-medium">{card.role}</p>
                </div>
              </div>

              {/* Scanned Card Layer: Displays Clean Team Member Name & Profile Details */}
              <div className="card-ascii card absolute top-0 left-0 w-full h-full rounded-[15px] overflow-hidden bg-gradient-to-br from-white via-indigo-50/90 to-slate-50 border border-indigo-200/90 p-6 flex flex-col items-center justify-center text-center shadow-lg z-[1] [clip-path:inset(0_calc(100%-var(--clip-left,0%))_0_0)]">
                <div className="relative mb-3">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shadow-md shadow-indigo-500/20"
                  />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0 shadow-xs" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-1">
                  {card.name}
                </h3>

                <span className="text-xs font-normal text-indigo-700 bg-indigo-100/90 border border-indigo-200 px-3 py-1 rounded-full mb-2">
                  {card.role}
                </span>

                <span className="text-[10px] font-normal uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  VERIFIED MEMBER
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ScannerCardStream };
