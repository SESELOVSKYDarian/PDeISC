export interface AdminSession {
  id: number;
  nombre: string;
  email: string;
}

export type FieldType = 'text' | 'email' | 'url' | 'number' | 'textarea' | 'select' | 'checkbox' | 'imagen' | 'favicon' | 'cv';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  optional?: boolean;
  min?: number;
  max?: number;
  optionsFrom?: string;
}

export interface FieldOption {
  value: number | string;
  label: string;
}

export type FieldOptionsMap = Record<string, FieldOption[]>;

export interface ResourceItem {
  id: number;
  [key: string]: unknown;
}

export interface ResourceConfig {
  label: string;
  singular: string;
  empty: Record<string, unknown>;
  fields: Field[];
  groupBy?: string;
  needs?: string;
  subtitle?: (item: ResourceItem) => string;
}
