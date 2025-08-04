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
  tenant: Tenant | null;
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

export type FieldData = {
  name: string[];
  value?: string;
};

export type Category = {
  _id: string;
  name: string;
};

export type Product = {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: Category;
  isPublish: boolean;
  createdAt: string;
};
