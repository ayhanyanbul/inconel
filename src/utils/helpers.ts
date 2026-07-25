export const isValidVariable = (value: unknown) =>
  value !== null && value !== undefined

export const turkishLowerCase = (value: unknown) =>
  String(value ?? '').toLocaleLowerCase('tr-TR')

export function getFileExtensionFromMimeType(mimeType?: string) {
  return mimeType?.split('/')[1]?.replace(/[^a-z0-9]/gi, '') || 'unknown'
}
