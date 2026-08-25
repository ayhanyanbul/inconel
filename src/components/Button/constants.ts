export const BUTTON_TYPES = [
  'default',
  'primary',
  'danger',
  'warning',
  'secondary',
  'success',
  'light',
  'dark',
  'calendar',
  'circleDanger',
  'circleSuccess',
  'circlePrimary',
  'circleWarning',
  'circleDark',
  'circleSecondary',
  'squareDanger',
  'squareSuccess',
  'squarePrimary',
  'squareWarning',
  'squareDark',
  'squareSecondary',
  'ghost',
  'outlinePrimary',
  'outlineSecondary',
  'outlineDanger',
  'outlineWarning',
  'outlineSuccess',
  'outlineDark',
] as const

export type ButtonType = (typeof BUTTON_TYPES)[number]

export const BUTTON_TYPE_CLASS_NAMES: Record<ButtonType, string> =
  Object.fromEntries(
    BUTTON_TYPES.map((type) => [
      type,
      `inconel-button--${type.replace(
        /[A-Z]/g,
        (letter) => `-${letter.toLowerCase()}`,
      )}`,
    ]),
  ) as Record<ButtonType, string>
