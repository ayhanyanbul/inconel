
# inconel


Accessible, type-safe and customizable React UI components.

Inconel is structured as a publishable component library. React stays a peer
dependency, components are tree-shakeable, TypeScript declarations are
included, and styles can be customized through CSS variables.

## Installation

```bash
npm install inconel
```

Import the library styles once in the application entry:

```tsx
import 'inconel/styles.css'
```

## Components

### Select

```tsx
import { Select, type OptionValue } from 'inconel'

interface City {
  id: number
  name: string
  countryCode: string
}

const [cityId, setCityId] = useState<OptionValue | null>(null)

<Select
  name="cityId"
  label="City"
  options={cities}
  optionLabel="name"
  optionValue="id"
  value={cityId}
  isClearable
  isRequired
  menuPortalTarget={
    typeof document !== 'undefined' ? document.body : null
  }
  onChange={(nextValue, selectedCity) => {
    setCityId(nextValue)
  }}
/>
```

`optionLabel` and `optionValue` also accept functions:

```tsx
<Select
  optionLabel={(city) => `${city.name} (${city.countryCode})`}
  optionValue={(city) => city.id}
  getOptionSearchText={(city) => `${city.name} ${city.countryCode}`}
  // ...
/>
```

Async loading supports debounce and request cancellation:

```tsx
<Select
  options={[]}
  loadOptions={async (query, signal) => {
    const response = await fetch(`/api/cities?q=${query}`, { signal })
    return response.json()
  }}
  loadOptionsDebounceMs={300}
  optionLabel="name"
  optionValue="id"
  // ...
/>
```

Large lists are automatically virtualized at `virtualizationThreshold`.
Virtualization can also be forced with the `virtualize` prop.

### Input

```tsx
import { Input, type InputPayload } from 'inconel'

<Input
  name="email"
  label="Email"
  type="email"
  hint="We will never share your email."
  placeholder="name@example.com"
  fullWidth
/>
```

Input additionally supports locale-aware number, currency and percentage
formatting, phone masks, validation, rounding, debounce, limits, clearable and
read-only states:

```tsx
const [amount, setAmount] = useState<number | null>(null)

<Input
  label="Amount"
  type="currency"
  value={amount}
  locale="en-US"
  currency="USD"
  decimalScale={2}
  min={0}
  max={100_000}
  roundOnBlur
  roundMode="round"
  isClearable
  clearButtonLabel="Clear amount"
  validationMessages={{
    required: 'Amount is required.',
    invalidNumber: 'Enter a valid amount.',
    minNumber: 'Amount must be at least {min}.',
    maxNumber: 'Amount must be at most {max}.',
  }}
  onChange={({ rawValue }: InputPayload) => {
    setAmount(typeof rawValue === 'number' ? rawValue : null)
  }}
/>

<Input
  label="Phone"
  type="phone"
  mask="(XXX) XXX XX XX"
  limit={10}
  required
  validationMessages={{
    required: 'Phone number is required.',
    invalidPhone: 'Enter a valid phone number.',
  }}
/>
```

Event callbacks receive an `InputPayload` containing `rawValue`,
`formattedValue`, validation state, the last character/key and the event type.
Inconel does not contain default user-facing validation copy. Applications
provide localized messages through `validationMessages`.

### Textarea

```tsx
import { Textarea } from 'inconel'

<Textarea
  name="message"
  label="Message"
  rows={5}
  resize="vertical"
  fullWidth
/>
```

## Theming

Override Inconel design tokens in your application:

```css
:root {
  --inconel-color-primary: #7c3aed;
  --inconel-color-primary-hover: #6d28d9;
  --inconel-radius-md: 10px;
  --inconel-font-family: Inter, sans-serif;
}
```

Select additionally supports part-based `classNames` and `styles` props.

## Select ref API

```tsx
const selectRef = useRef<SelectHandle>(null)

selectRef.current?.focus()
selectRef.current?.blur()
selectRef.current?.clear()
```

## Development

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
npm run build:playground
npm run pack:check
```

The playground is intentionally separate from the package entry. Only
`dist`, `README.md`, and `LICENSE` are included in the published package.

## Publishing

1. Update `version` in `package.json`.
2. Run `npm run prepublishOnly`.
3. Inspect the package with `npm run pack:check`.
4. Sign in with `npm login`.
5. Publish with `npm publish`.

The unscoped `inconel` package name must be available on npm. If it is not,
use a scoped name such as `@ayhanyanbul/inconel`.

## License

MIT © Ayhan Yanbul
