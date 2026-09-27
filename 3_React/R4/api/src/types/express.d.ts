export interface AdminSession {
  id: number;
  email: string;
  nombre: string;
}

// requireAuth carga la sesión del administrador (id, email, nombre) en cada pedido protegido
declare global {
  namespace Express {
    interface Request {
      admin?: AdminSession;
    }
  }
}

export {};
