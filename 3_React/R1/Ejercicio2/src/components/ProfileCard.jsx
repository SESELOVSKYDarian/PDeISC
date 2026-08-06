import { memo, useEffect, useRef } from "react";
import "./ProfileCard.css";

const clamp = (value, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

function ProfileCard({
  name,
  title,
  handle,
  status,
  contactText,
  avatarUrl,
  showUserInfo = false,
  enableTilt = true,
  onContactClick,
  behindGlowColor,
  behindGlowEnabled = true,
  innerGradient,
}) {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);
  const frame = useRef(0);
  const target = useRef({ x: 50, y: 50 });
  const current = useRef({ x: 50, y: 50 });
  useEffect(() => {
    const shell = shellRef.current;
    const wrap = wrapRef.current;
    if (!shell || !wrap || !enableTilt) return undefined;
    // El movimiento suave evita que la tarjeta salte cuando se mueve el puntero.
    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.14;
      current.current.y += (target.current.y - current.current.y) * 0.14;
      wrap.style.setProperty("--pointer-x", `${current.current.x}%`);
      wrap.style.setProperty("--pointer-y", `${current.current.y}%`);
      wrap.style.setProperty(
        "--rotate-x",
        `${(50 - current.current.y) / 5}deg`,
      );
      wrap.style.setProperty(
        "--rotate-y",
        `${(current.current.x - 50) / 5}deg`,
      );
      frame.current = requestAnimationFrame(animate);
    };
    const move = (event) => {
      const rect = shell.getBoundingClientRect();
      target.current = {
        x: clamp(((event.clientX - rect.left) / rect.width) * 100),
        y: clamp(((event.clientY - rect.top) / rect.height) * 100),
      };
      shell.classList.add("active");
    };
    const leave = () => {
      target.current = { x: 50, y: 50 };
      shell.classList.remove("active");
    };
    shell.addEventListener("pointermove", move);
    shell.addEventListener("pointerleave", leave);
    frame.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame.current);
      shell.removeEventListener("pointermove", move);
      shell.removeEventListener("pointerleave", leave);
    };
  }, [enableTilt]);
  const style = {
    "--behind-glow-color": behindGlowColor,
    "--inner-gradient": innerGradient,
  };
  return (
    <div ref={wrapRef} className="pc-card-wrapper" style={style}>
      {behindGlowEnabled && <div className="pc-behind" />}
      <div ref={shellRef} className="pc-card-shell">
        <article className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className="pc-avatar-content">
              <img
                className="avatar"
                src={avatarUrl}
                alt={`Retrato de ${name}`}
                onError={(event) => {
                  event.currentTarget.style.opacity = ".2";
                }}
              />
            </div>
            <div className="pc-details">
              <h2>{name}</h2>
              <p>{title}</p>
            </div>
            {showUserInfo && (
              <div className="pc-user-info">
                <span>
                  @{handle} · {status}
                </span>
                <button type="button" onClick={onContactClick}>
                  {contactText}
                </button>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

export default memo(ProfileCard);
