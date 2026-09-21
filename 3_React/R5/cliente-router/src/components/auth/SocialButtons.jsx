import { oauthProviders } from "@/utils/oauthProviders";
import { ProviderIcon } from "./ProviderIcon";

// botones para ingresar o crear la cuenta con Google, GitHub o Meta
export function SocialButtons({ isRegister, busy, onSelect }) {
  const action = isRegister ? "Crear cuenta con" : "Ingresar con";

  return (
    <div className="social">
      <div className="social-divider" role="separator">
        <span>{isRegister ? "o registrate con" : "o ingresá con"}</span>
      </div>

      <div className="social-list">
        {oauthProviders.map(({ id, label }) => (
          <button key={id} type="button" className="social-btn" disabled={busy} onClick={() => onSelect(id)} aria-label={`${action} ${label}`}>
            <ProviderIcon id={id} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
