export type Credentials = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  updatedAt: string;
};

export type Tenant = {
  id: number;
  address: string;
  name: string; 
};
