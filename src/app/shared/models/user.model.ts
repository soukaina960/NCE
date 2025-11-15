export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'client' | 'admin';
  adresse?: Adresse;
  dateInscription?: Date;
  clientInfo?: ClientInfo;
}

export interface Adresse {
  rue: string;
  ville: string;
  codePostal: string;
  pays: string;
}

export interface ClientInfo {
  typeClient: 'particulier' | 'professionnel' | 'entreprise';
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
  projets?: any[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone: string;
  adresse?: Adresse;
  typeClient?: string;
  newsletter?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  errors?: any[];
}