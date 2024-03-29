export class __User__ {
  id: number
  email: string
  phone: string
  password: string
  firstName: string
  lastName: string
  avatar: string
  isVerified: boolean
  role: string
  createdAt: Date
  updatedAt: Date
}

export class __ChangePassword__ {
  oldPassword: string
  newPassword: string
  id: number
}
