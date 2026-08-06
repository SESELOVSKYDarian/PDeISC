import { useEffect, useRef } from "react";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";
import "./Particles.css";

const vertex = `attribute vec3 position; attribute vec4 random; attribute vec3 color; uniform mat4 modelMatrix; uniform mat4 viewMatrix; uniform mat4 projectionMatrix; uniform float uTime; uniform float uSpread; uniform float uBaseSize; varying vec3 vColor; varying vec4 vRandom; void main(){vColor=color;vRandom=random;vec3 pos=position*uSpread;pos.z*=10.0;vec4 modelPos=modelMatrix*vec4(pos,1.0);modelPos.x+=sin(uTime*random.z+6.28*random.w)*mix(.1,1.5,random.x);modelPos.y+=sin(uTime*random.y+6.28*random.x)*mix(.1,1.5,random.w);modelPos.z+=sin(uTime*random.w+6.28*random.y)*mix(.1,1.5,random.z);vec4 viewPos=viewMatrix*modelPos;gl_PointSize=uBaseSize/length(viewPos.xyz);gl_Position=projectionMatrix*viewPos;}`;
const fragment = `precision highp float; uniform float uTime; varying vec3 vColor; varying vec4 vRandom; void main(){vec2 uv=gl_PointCoord.xy;float d=length(uv-.5);if(d>.5)discard;gl_FragColor=vec4(vColor+.2*sin(uv.yxx+uTime+vRandom.y*6.28),1.0);}`;

const rgb = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export default function Particles({
  particleColors = ["#ffffff"],
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 100,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  disableRotation = false,
  pixelRatio = 1,
}) {
  const ref = useRef(null);
  useEffect(() => {
    // El canvas vive dentro del componente y se libera al salir de la pantalla.
    const container = ref.current;
    if (!container) return undefined;
    const renderer = new Renderer({
      webgl: 1,
      dpr: pixelRatio,
      depth: false,
      alpha: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);
    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, 20);
    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount * 4);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      let x, y, z, length;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        length = x * x + y * y + z * z;
      } while (length > 1 || length === 0);
      const radius = Math.cbrt(Math.random());
      positions.set([x * radius, y * radius, z * radius], i * 3);
      randoms.set(
        [Math.random(), Math.random(), Math.random(), Math.random()],
        i * 4,
      );
      colors.set(rgb(particleColors[i % particleColors.length]), i * 3);
    }
    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * pixelRatio },
      },
      transparent: true,
      depthTest: false,
    });
    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });
    const mouse = { x: 0, y: 0 };
    let frame = 0;
    let elapsed = 0;
    let previous = performance.now();
    const move = (event) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const render = (time) => {
      const delta = time - previous;
      previous = time;
      elapsed += delta * speed;
      program.uniforms.uTime.value = elapsed * 0.001;
      particles.position.x = moveParticlesOnHover
        ? -mouse.x * particleHoverFactor
        : 0;
      particles.position.y = moveParticlesOnHover
        ? -mouse.y * particleHoverFactor
        : 0;
      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed;
      }
      renderer.render({ scene: particles, camera });
      frame = requestAnimationFrame(render);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    if (moveParticlesOnHover) container.addEventListener("pointermove", move);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      if (moveParticlesOnHover)
        container.removeEventListener("pointermove", move);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    disableRotation,
    moveParticlesOnHover,
    particleBaseSize,
    particleColors,
    particleCount,
    particleHoverFactor,
    particleSpread,
    pixelRatio,
    speed,
  ]);
  return <div ref={ref} className="particles-container" aria-hidden="true" />;
}
