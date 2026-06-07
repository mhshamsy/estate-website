// lib/types.ts

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum PropertyStatus {
  DRAFT = 'draft',
  FOR_SALE = 'for_sale',
  WITHDRAWN = 'withdrawn',
  SOLD = 'sold',
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  emailVerified: string | null;
  password: string | null;
  userAccessToken: string | null;
  userRefreshToken: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: string;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: string;
}

export interface Property {
  id: string;
  address1: string;
  address2: string | null;
  city: string;
  postcode: string;
  description: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  status: PropertyStatus;
  primaryImageId: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  url: string;
  propertyId: string;
  createdAt: string;
}

// Types for creating new records
export interface CreateUserInput {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  role?: Role;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  role?: Role;
}

export interface CreatePropertyInput {
  address1: string;
  address2?: string;
  city: string;
  postcode: string;
  description?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  status?: PropertyStatus;
  primaryImageId?: string;
  ownerId: string;
}

export interface UpdatePropertyInput {
  address1?: string;
  address2?: string;
  city?: string;
  postcode?: string;
  description?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: PropertyStatus;
  primaryImageId?: string;
}

export interface CreateImageInput {
  url: string;
  propertyId: string;
}

// API Response types
export interface ApiError {
  error: string;
}

export interface ApiSuccess<T> {
  data: T;
  message?: string;
}
