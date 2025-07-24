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

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  tenantId: number;
};

export type CreateTenantData = {
  name: string;
  address: string;
};

export type Tenant = {
  id: number;
  address: string;
  name: string;
};
