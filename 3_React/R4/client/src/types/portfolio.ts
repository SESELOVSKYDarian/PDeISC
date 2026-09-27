export interface Profile {
  id: number;
  nombre: string;
  rol: string;
  saludo: string;
  presentacion: string;
  descripcion: string;
  ubicacion: string;
  email: string;
  disponibilidad: string;
  retrato_url: string;
  cv_url: string;
  favicon_url: string;
  [key: string]: unknown;
}

export interface SocialLink {
  id: number;
  nombre: string;
  url: string;
  orden: number;
}

export interface Skill {
  id: number;
  nombre: string;
  categoria_id: number;
  categoria: string;
  nivel: number;
  orden: number;
}

export interface SkillCategory {
  id: number;
  nombre: string;
  imagen_url: string;
  orden: number;
  habilidades: Skill[];
}

export interface Experience {
  id: number;
  titulo: string;
  organizacion: string;
  periodo: string;
  descripcion: string;
  orden: number;
}

export interface Achievement {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  orden: number;
}

export interface Project {
  id: number;
  titulo: string;
  resumen: string;
  descripcion: string;
  imagen_url: string;
  demo_url: string;
  repo_url: string;
  destacado: boolean;
  orden: number;
  tecnologias: string[];
}

export interface PortfolioData {
  profile: Profile;
  socialLinks: SocialLink[];
  skills: Skill[];
  skillCategories: SkillCategory[];
  experiences: Experience[];
  achievements: Achievement[];
  projects: Project[];
}
