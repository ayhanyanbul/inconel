export interface MediaSelection {
  fileType?: string
  url?: string
  mimeType?: string
  originalName?: string
  data?: {
    isImage?: boolean
    domain?: string
    path?: string
    sizes?: { large?: { fileName?: string } }
    fileName?: string
    type?: string
  }
}

function extensionFromMimeType(mimeType?: string) {
  return mimeType?.split('/')[1]?.replace(/[^a-z0-9]/gi, '') || 'file'
}

export function getMediaContent(selection?: MediaSelection) {
  if (!selection) return ''
  const { fileType, url, mimeType, originalName, data = {} } = selection
  const imageUrl =
    url ??
    (data.domain && data.path && data.sizes?.large?.fileName
      ? `${data.domain}/${data.path}/${data.sizes.large.fileName}`
      : '')
  const fileUrl =
    url ??
    (data.domain && data.path && data.fileName
      ? `${data.domain}/${data.path}/${data.fileName}`
      : '')
  if ((fileType === 'image' || data.isImage) && imageUrl) {
    return `<img class="image" src="${imageUrl}" />`
  }
  const extension = data.type ?? extensionFromMimeType(mimeType)
  return fileUrl
    ? `<a class="download ${extension}" href="${fileUrl}">${originalName ?? fileUrl}</a>`
    : ''
}
