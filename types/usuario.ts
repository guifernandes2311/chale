export type UserRole = 'CUSTOMER' | 'ADMIN'

export interface UserAddress {
  id: string
  userId: string
  label: string
  cep: string
  street: string
  number: string
  complement: string | null
  district: string
  city: string
  state: string
  isDefault: boolean
}

export interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  role: UserRole
  createdAt: Date
}
