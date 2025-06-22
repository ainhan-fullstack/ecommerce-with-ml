export interface AuthFormInputs {
  username?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface SignupInputs {
  username: string;
  email: string;
  password: string;
}

export interface LoginInputs {
  email: string;
  password: string;
}
