export interface RegisterDTO {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role?: string; // Déterminé par admin, mais par défaut "pme"
}