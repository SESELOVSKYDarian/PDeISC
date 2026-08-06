import { useEffect, useState } from "react";
import ProfileCard from "./components/ProfileCard";
import SplitText from "./components/SplitText";
import ThemeToggle from "./components/ThemeToggle";
import darianAvatar from "./assets/darian.png";
import "./global.css";

export default function App() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  return (
    <main>
      <ThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
      <section className="wrap">
        <SplitText
          text="Ejercicio 2 · Props"
          className="exercise-heading"
          delay={50}
          duration={1.25}
          ease="power3.out"
          threshold={0.1}
          rootMargin="-100px"
        />
        <div className="profile-cards">
          <ProfileCard
            name="Darian Seselovsky"
            title="Desarrollador"
            handle="darian"
            status="Online"
            contactText="Contact Me"
            avatarUrl={darianAvatar}
            showUserInfo={false}
            enableTilt
            behindGlowColor="rgba(125, 190, 255, 0.67)"
            behindGlowEnabled
            innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
          />
        </div>
      </section>
    </main>
  );
}
