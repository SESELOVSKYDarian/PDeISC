export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export type Proveedor = "google" | "discord" | "facebook";
