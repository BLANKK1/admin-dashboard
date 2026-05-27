export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'general';
  department: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}
