import { useState } from 'react'

import { Input, Select, Textarea } from '../index'
import '../styles/index.css'
import './playground.css'

interface City {
  id: number
  name: string
  countryCode: string
}

const cities: City[] = [
  { id: 34, name: 'İstanbul', countryCode: 'TR' },
  { id: 6, name: 'Ankara', countryCode: 'TR' },
  { id: 35, name: 'İzmir', countryCode: 'TR' },
  { id: 7, name: 'Antalya', countryCode: 'TR' },
  { id: 16, name: 'Bursa', countryCode: 'TR' },
]

function App() {
  const [cityId, setCityId] = useState<string | number | null>(null)

  return (
    <main className="page">
      <section className="card">
        <span className="eyebrow">Inconel</span>
        <h1>Bir şehir seçin</h1>
        <p className="intro">
          Listede arama yapabilir veya klavyenizdeki yön tuşlarını
          kullanabilirsiniz.
        </p>

        <Select
          id="city"
          label="Şehir"
          options={cities}
          optionLabel="name"
          optionValue="id"
          placeholder="Şehir ara veya seç..."
          value={cityId}
          isClearable
          clearButtonLabel="Seçimi temizle"
          openMenuButtonLabel="Seçenekleri aç"
          closeMenuButtonLabel="Seçenekleri kapat"
          loadingMessage="Seçenekler yükleniyor..."
          noOptionsMessage="Sonuç bulunamadı."
          asyncErrorMessage="Seçenekler yüklenemedi."
          menuPortalTarget={
            typeof document !== 'undefined' ? document.body : null
          }
          onChange={(nextValue) => setCityId(nextValue)}
        />

        <Input
          label="E-posta"
          type="email"
          placeholder="ayhan@example.com"
          hint="Size ulaşabileceğimiz e-posta adresi."
          clearButtonLabel="E-posta adresini temizle"
          fullWidth
        />

        <Textarea
          label="Mesaj"
          placeholder="Mesajınızı yazın..."
          rows={4}
          fullWidth
        />

        <div className="result" aria-live="polite">
          {cityId !== null
            ? `Seçiminiz: ${cities.find((item) => item.id === cityId)?.name}`
            : 'Henüz bir seçim yapmadınız.'}
        </div>
      </section>
      <footer className="developer-credit">
        Developed by <span>Ayhan Yanbul</span>
      </footer>
    </main>
  )
}

export default App
