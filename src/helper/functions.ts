const chars: string = '0123456789'

export const generateRandomString = (
  length: number,
  initialChars: string
): string => {
  let result = ''
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)]
  return `${initialChars}-${result}`
}

export const sanitizePhone = (phone: string): string => {
  let cleanPhone = ''
  cleanPhone = phone.replace(' ', '')
  cleanPhone = cleanPhone.replace('-', '')
  cleanPhone = cleanPhone.replace('+', '')

  if (cleanPhone.substr(0, 1) === '0' && cleanPhone.length === 10) {
    return cleanPhone.replace(cleanPhone.substr(0, 1), '233')
  } else if (cleanPhone.substr(0, 1) !== '0' && cleanPhone.length === 9) {
    return `233${cleanPhone}`
  } else if (cleanPhone.substr(0, 3) === '233' && cleanPhone.length === 12) {
    return cleanPhone
  } else if (cleanPhone.substr(0, 5) === '00233' && cleanPhone.length === 14) {
    return cleanPhone.replace(cleanPhone.substr(0, 5), '233')
  } else {
    return cleanPhone
  }
}
