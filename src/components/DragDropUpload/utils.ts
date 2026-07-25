import type { ReactNode } from 'react'

export function fileMatchesAccept(file: File, accept = '*') {
  const rules = accept
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
  if (accept === '*' || rules.length === 0) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return rules.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule)
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1))
    return type === rule
  })
}

export function filterAcceptedFiles(files: File[], accept = '*') {
  return files.filter((file) => fileMatchesAccept(file, accept))
}

export function getSelectedFileText(files: File[], emptyText: ReactNode) {
  if (files.length === 0) return emptyText
  if (files.length === 1) return files[0]?.name
  return `${files.length} tane dosya seçildi`
}
