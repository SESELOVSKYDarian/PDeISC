import { Github } from "lucide-react";

// Lucide no trae los logos de Google ni de Meta, por eso van como SVG propios
function GoogleLogo(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.51 5.51 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.76c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.1C6.22 6.87 8.87 4.76 12 4.76Z" />
    </svg>
  );
}

// lazo infinito de Meta
function MetaLogo(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#0866FF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 12c-1.6-2.4-3.2-4.4-5.2-4.4C4.7 7.6 3 9.6 3 12s1.7 4.4 3.8 4.4c2 0 3.6-2 5.2-4.4Zm0 0c1.6 2.4 3.2 4.4 5.2 4.4 2.1 0 3.8-2 3.8-4.4s-1.7-4.4-3.8-4.4c-2 0-3.6 2-5.2 4.4Z" />
    </svg>
  );
}

const icons = { google: GoogleLogo, github: Github, meta: MetaLogo };

export function ProviderIcon({ id }) {
  const Icon = icons[id];
  return <Icon className="provider-icon" aria-hidden="true" />;
}
