export interface Currency {
  id?: string;
  active: boolean;
  code: string;
  lastRate?: number;
  updatedBy?: string;
}