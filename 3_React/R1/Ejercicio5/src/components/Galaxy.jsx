import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Galaxy.css";

const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.0,1.0);}`;
const fragment = `precision highp float; uniform vec2 uResolution; uniform float uTime; uniform float uDensity; uniform float uHueShift; uniform float uSpeed; uniform float uGlow; uniform float uSaturation; uniform float uTwinkle; uniform float uRotationSpeed; uniform vec2 uMouse; uniform float uRepulsion; uniform bool uMouseRepulsion; float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);} vec3 hue(float h){return .5+.5*cos(6.28318*(vec3(0.,.33,.67)+h));} void main(){vec2 uv=(gl_FragCoord.xy-.5*uResolution)/uResolution.y; vec2 mouse=(uMouse-.5)*uResolution/uResolution.y; if(uMouseRepulsion){vec2 away=uv-mouse;uv+=normalize(away)*uRepulsion*.025/(length(away)+.12);} float angle=uTime*uRotationSpeed; uv=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*uv; vec3 color=vec3(0.); for(float layer=0.;layer<4.;layer++){float scale=mix(10.,34.,layer/4.)*uDensity; vec2 cell=floor(uv*scale+layer*17.); vec2 local=fract(uv*scale+layer*17.)-.5; float seed=hash(cell); float twinkle=.65+.35*sin(uTime*uSpeed+seed*20.)*uTwinkle; float star=smoothstep(.075,.0,length(local))*step(.72,seed)*twinkle; color+=star*hue(fract(seed+uHueShift/360.))*uGlow;} color=mix(vec3(dot(color,vec3(.299,.587,.114))),color,1.+uSaturation); gl_FragColor=vec4(color,1.);}`;

export default function Galaxy({
  mouseRepulsion = true,
  mouseInteraction = true,
  density = 1,
  glowIntensity = 0.3,
  saturation = 0,
  hueShift = 140,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  repulsionStrength = 2,
  starSpeed = 0.5,
  speed = 1,
}) {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return undefined;
    const renderer = new Renderer({
      alpha: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uResolution: { value: [1, 1] },
        uTime: { value: 0 },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed * starSpeed },
        uGlow: { value: glowIntensity * 3 },
        uSaturation: { value: saturation },
        uTwinkle: { value: twinkleIntensity },
        uRotationSpeed: { value: rotationSpeed },
        uMouse: { value: [0.5, 0.5] },
        uRepulsion: { value: repulsionStrength },
        uMouseRepulsion: { value: mouseRepulsion },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const mouse = program.uniforms.uMouse.value;
    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
    };
    const move = (event) => {
      const rect = container.getBoundingClientRect();
      mouse[0] = (event.clientX - rect.left) / rect.width;
      mouse[1] = 1 - (event.clientY - rect.top) / rect.height;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    if (mouseInteraction) container.addEventListener("pointermove", move);
    let frame = 0;
    const render = (time) => {
      program.uniforms.uTime.value = time * 0.001;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      if (mouseInteraction) container.removeEventListener("pointermove", move);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    density,
    glowIntensity,
    hueShift,
    mouseInteraction,
    mouseRepulsion,
    repulsionStrength,
    rotationSpeed,
    saturation,
    speed,
    starSpeed,
    twinkleIntensity,
  ]);
  return <div ref={ref} className="galaxy-container" aria-hidden="true" />;
}
