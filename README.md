
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

Inconel ayrıca şu bağımsız ve TypeScript tipli bileşen ailelerini sunar:

`Button`, `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Switch`,
`CustomizableSwitch`, `Modal`, `Tooltip`, `Tabs`, `SlideTabs`, `Loader`,
`LoaderMini`, `DotLoader`, `ReadOnly`, `FileUpload`, `FileUploadText`,
`DragDropUpload`, `DndFileUpload`, `DatePicker`, `CurrencyInput`, `TextInput`,
`InputText`, `Table`, `DataGrid`, `ExcelTable`, `HTMLTable`, `Filter`,
`MultiSelect`, `MultiSelectWithCheckbox`, `HtmlEditor`, `TextEditor`,
`SocketStatus`, `Option` ve `OptionWithIcon`.

Bu bileşenler uygulamaya özel store, servis, i18n veya asset bağımlılığı
taşımaz. Tüm dahili class ve durum class adları `inconel-` ile başlar.

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

### Svg

`Svg`, harici bir SVG dosyasını sayfaya inline olarak yükler:

```tsx
import { Svg } from 'inconel'

<Svg
  src="/icons/check.svg"
  title="Onaylandı"
  className="my-icon"
  onClick={() => console.log('clicked')}
/>
```

`render={false}` verildiğinde veya `src` belirtilmediğinde bileşen render
edilmez. Ana wrapper her zaman `inconel-svg` sınıfını taşır.

## Sizes

`Button`, `Input` (ve `TextInput`/`InputText`/`CurrencyInput`), `Select`,
`Textarea` ve `DatePicker` ortak bir `size` prop'unu destekler:

```tsx
<Button size="lg">Kaydet</Button>
<Input size="sm" label="E-posta" />
```

`size`, `'xs' | 'sm' | 'md' | 'lg' | 'xl'` değerlerini alır (varsayılan
`'md'`) ve tüm bileşenlerde aynı yükseklik/font-size ölçeğini uygular:

| size | height | font-size |
| ---- | ------ | --------- |
| xs   | 28px   | 12px      |
| sm   | 32px   | 13px      |
| md   | 40px   | 14px      |
| lg   | 48px   | 16px      |
| xl   | 56px   | 18px      |

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

### Dark mode

Inconel ships a dark palette out of the box, applied automatically when the
OS/browser prefers dark (`prefers-color-scheme: dark`). Applications can also
switch themes manually, regardless of OS preference, by setting `data-theme`
on `<html>` (or any ancestor of the components):

```html
<html data-theme="dark">
  <!-- forces dark, even if the OS prefers light -->
</html>
```

```html
<html data-theme="light">
  <!-- forces light, even if the OS prefers dark -->
</html>
```

Omitting `data-theme` falls back to the OS preference. Override individual
dark-mode tokens the same way as light ones, scoped under your own
`[data-theme="dark"]` selector.

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
