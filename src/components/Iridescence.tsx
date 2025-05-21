import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  // Add a subtle offset based on the mouse position
  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

interface IridescenceProps {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
}

export default function Iridescence({
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  ...rest
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  // Define a custom type for our extended renderer
  type ExtendedRenderer = Renderer & {
    program?: Program;
    mesh?: Mesh;
    resizeHandler?: (e: UIEvent) => void;
    mouseMoveHandler?: (e: MouseEvent) => void;
  };
  
  const rendererRef = useRef<ExtendedRenderer | null>(null);
  const animateIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef(false);

  // Use IntersectionObserver to only render when in viewport
  useEffect(() => {
    if (!ctnDom.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisibleRef.current = entry.isIntersecting;
        
        if (entry.isIntersecting) {
          // Initialize or resume animation when visible
          if (!rendererRef.current) {
            initRenderer();
          } else if (animateIdRef.current === null) {
            animateIdRef.current = requestAnimationFrame(update);
          }
        } else if (animateIdRef.current !== null) {
          // Pause animation when not visible
          cancelAnimationFrame(animateIdRef.current);
          animateIdRef.current = null;
        }
      },
      { threshold: 0.1 } // Start rendering when 10% visible
    );
    
    observer.observe(ctnDom.current);
    return () => observer.disconnect();
  }, []);

  // Initialize renderer only when needed
  const initRenderer = () => {
    if (!ctnDom.current || rendererRef.current) return;
    
    const ctn = ctnDom.current;
    const renderer = new Renderer({
      powerPreference: 'low-power', // Optimize for battery life
      antialias: false, // Disable antialiasing for performance
    });
    rendererRef.current = renderer;
    
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    // Ensure canvas fills the entire container
    const scale = window.devicePixelRatio > 1 ? 0.5 : 0.75; // Lower resolution for better performance
    renderer.setSize(ctn.offsetWidth * scale, ctn.offsetHeight * scale);
    
    // Make sure the canvas element fills the container
    const canvas = gl.canvas;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          ),
        },
        uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    // Properly assign properties to our extended renderer
    (renderer as ExtendedRenderer).program = program;
    (renderer as ExtendedRenderer).mesh = mesh;
    
    // Throttled resize handler
    let resizeTimeout: any;
    function handleResize() {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!ctn || !renderer || !gl) return;
        
        // Update canvas size
        renderer.setSize(ctn.offsetWidth * scale, ctn.offsetHeight * scale);
        
        // Ensure canvas still fills container
        const canvas = gl.canvas;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        
        // Update resolution uniform
        if (program) {
          program.uniforms.uResolution.value = new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          );
        }
      }, 200); // Debounce resize events
    }
    
    window.addEventListener("resize", handleResize, false);
    // Properly assign the resize handler to our extended renderer
    (renderer as ExtendedRenderer).resizeHandler = handleResize;
    
    // Throttled mouse move handler
    let lastMoveTime = 0;
    function handleMouseMove(e: MouseEvent) {
      const now = performance.now();
      if (now - lastMoveTime < 50) return; // Limit to 20 updates per second
      lastMoveTime = now;
      
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
      program.uniforms.uMouse.value[0] = x;
      program.uniforms.uMouse.value[1] = y;
    }
    
    if (mouseReact) {
      ctn.addEventListener("mousemove", handleMouseMove);
      // Properly assign the mouse move handler to our extended renderer
      (renderer as ExtendedRenderer).mouseMoveHandler = handleMouseMove;
    }
    
    ctn.appendChild(gl.canvas);
    
    // Start animation loop
    if (isVisibleRef.current) {
      animateIdRef.current = requestAnimationFrame(update);
    }
  };

  // Optimized update function with frame skipping
  const update = (t: number) => {
    if (!rendererRef.current || !isVisibleRef.current) return;
    
    const renderer = rendererRef.current;
    const program = renderer.program;
    const mesh = renderer.mesh;
    
    // Only update if we have all required objects
    if (program && mesh) {
      // Update time uniform
      program.uniforms.uTime.value = t * 0.001;
      
      // Render the scene
      renderer.render({ scene: mesh });
    }
    
    // Schedule next frame
    animateIdRef.current = requestAnimationFrame(update);
  };

  // Clean up resources
  useEffect(() => {
    return () => {
      if (animateIdRef.current) {
        cancelAnimationFrame(animateIdRef.current);
        animateIdRef.current = null;
      }
      
      if (rendererRef.current) {
        const renderer = rendererRef.current;
        const gl = renderer.gl;
        
        // Type-safe event listener removal
        if (renderer.resizeHandler) {
          window.removeEventListener("resize", renderer.resizeHandler);
        }
        
        if (mouseReact && renderer.mouseMoveHandler && ctnDom.current) {
          ctnDom.current.removeEventListener("mousemove", renderer.mouseMoveHandler);
        }
        
        if (ctnDom.current && gl.canvas.parentNode === ctnDom.current) {
          ctnDom.current.removeChild(gl.canvas);
        }
        
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        rendererRef.current = null;
      }
    };
  }, [mouseReact]);

  return (
    <div
      ref={ctnDom}
      className="w-full h-full"
      {...rest}
    />
  );
}
