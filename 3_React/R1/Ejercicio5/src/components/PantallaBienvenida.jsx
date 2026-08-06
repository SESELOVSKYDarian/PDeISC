import TextType from "./TextType";

export default function PantallaBienvenida({ message, onBack }) {
  return (
    <section className="welcome-screen" aria-live="polite">
      <div className="welcome-mark">✦</div>
      <p className="welcome-kicker">Tu espacio está listo</p>
      <h1>
        <TextType
          text={[message, "Qué bueno verte por acá."]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor
          cursorCharacter="_"
          deletingSpeed={50}
        />
      </h1>
      <button type="button" className="back-button" onClick={onBack}>
        Volver al formulario
      </button>
    </section>
  );
}
