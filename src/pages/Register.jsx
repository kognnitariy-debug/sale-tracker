import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'

const CATEGORIES = [
  'Молочная продукция', 'Мясо и птица', 'Рыба и морепродукты',
  'Бакалея и крупы', 'Хлеб и выпечка', 'Напитки', 'Кондитерские изделия',
  'Замороженные продукты', 'Консервы', 'Алкоголь', 'Снеки', 'Детское питание',
  'Органика и ЗОЖ', 'Соусы и приправы', 'Другое',
]

const REVENUES = [
  'до 10 млн ₽/год', '10–50 млн ₽/год', '50–150 млн ₽/год',
  '150–500 млн ₽/год', 'более 500 млн ₽/год',
]

const REGIONS = [
  'Москва', 'Санкт-Петербург', 'Московская область', 'Ленинградская область',
  'Краснодарский край', 'Свердловская область', 'Татарстан',
  'Ростовская область', 'Нижегородская область', 'Другой регион',
]

const SOURCES = [
  'ЦЗС (живая сессия)', 'Рекомендация партнёра', 'Социальные сети',
  'Поиск в интернете', 'Выставка/мероприятие', 'Другое',
]

const CERTS = ['ГОСТ', 'ТУ', 'Органик', 'Халяль', 'Кошер', 'ISO 9001', 'HACCP']

const UNITS = ['кг', 'шт', 'л', 'упак', 'поддон']

const STEP_TITLES = ['Компания', 'Представитель', 'Товар']

function Stepper({ current }) {
  return (
    <div style={s.stepper}>
      {STEP_TITLES.map((t, i) => (
        <div key={t} style={s.stepWrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              ...s.stepBubble,
              background: i < current ? 'var(--primary)' : i === current ? 'var(--primary)' : 'var(--bg-3)',
              color: i <= current ? '#fff' : 'var(--text-4)',
              boxShadow: i === current ? '0 0 0 4px var(--primary-light)' : 'none',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 500 }}>Шаг {i + 1}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: i <= current ? 'var(--text)' : 'var(--text-4)' }}>{t}</div>
            </div>
          </div>
          {i < STEP_TITLES.length - 1 && (
            <div style={{ ...s.stepLine, background: i < current ? 'var(--primary)' : 'var(--border)' }} />
          )}
        </div>
      ))}
    </div>
  )
}

function Field({ label, required, optional, hint, children }) {
  return (
    <div className="form-group">
      <label className="label">
        {label}
        {required && <span className="req"> *</span>}
        {optional && <span className="opt">(необязательно)</span>}
      </label>
      {children}
      {hint && <div className="hint">{hint}</div>}
    </div>
  )
}

function InnField({ value, onChange }) {
  const valid = value.length === 10 || value.length === 12

  return (
    <div style={{ position: 'relative' }}>
      <input
        className="input"
        placeholder="7700000000"
        maxLength={12}
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
        style={{ paddingRight: valid ? 44 : 14 }}
      />
      {valid && (
        <div style={s.innBadge}>
          <span style={{ color: 'var(--primary)', fontSize: 14 }}>✓</span>
        </div>
      )}
      {valid && (
        <div style={s.innDadata}>
          ✓ ИНН проверен через Дадата
        </div>
      )}
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const { setUser } = useUser()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})

  const [company, setCompany] = useState({
    name: '', inn: '', region: '', city: '', category: '', site: '', revenue: '',
  })

  const [person, setPerson] = useState({
    fullName: '', position: '', phone: '', email: '', telegram: '', whatsapp: '', source: '',
  })

  const [product, setProduct] = useState({
    name: '', category: '', description: '', priceFrom: '', unit: '', volume: '', utp: '', certs: [],
  })

  function validateStep0() {
    const e = {}
    if (!company.name.trim()) e.name = 'Введите название'
    if (company.inn.length !== 10 && company.inn.length !== 12) e.inn = 'ИНН должен содержать 10 или 12 цифр'
    if (!company.region) e.region = 'Выберите регион'
    if (!company.city.trim()) e.city = 'Введите город'
    if (!company.category) e.category = 'Выберите категорию'
    return e
  }

  function validateStep1() {
    const e = {}
    if (!person.fullName.trim()) e.fullName = 'Введите ФИО'
    if (!person.position.trim()) e.position = 'Введите должность'
    if (!person.phone.replace(/\D/g, '') || person.phone.replace(/\D/g, '').length < 10) e.phone = 'Введите корректный телефон'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) e.email = 'Введите корректный email'
    return e
  }

  function validateStep2() {
    const e = {}
    if (!product.name.trim()) e.name = 'Введите название товара'
    if (!product.category) e.category = 'Выберите категорию'
    if (!product.description.trim()) e.description = 'Добавьте описание'
    if (!product.priceFrom) e.priceFrom = 'Укажите цену'
    if (!product.unit) e.unit = 'Выберите единицу'
    if (!product.volume.trim()) e.volume = 'Укажите объём'
    return e
  }

  function handleNext() {
    let e = {}
    if (step === 0) e = validateStep0()
    if (step === 1) e = validateStep1()
    if (step === 2) e = validateStep2()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    if (step < 2) {
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setUser({ companyName: company.name, inn: company.inn, region: company.region, city: company.city, category: company.category, contact: person, product })
      navigate('/dashboard')
    }
  }

  function F(obj, set, key, label, required, hint, type = 'text', options = null, optional = false) {
    const err = errors[key]
    if (options) {
      return (
        <Field label={label} required={required} optional={optional} hint={hint}>
          <select
            className={`input${err ? ' err' : ''}`}
            value={obj[key]}
            onChange={e => { set({ ...obj, [key]: e.target.value }); setErrors(p => ({ ...p, [key]: undefined })) }}
          >
            <option value="">Выберите...</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {err && <div className="err-msg">{err}</div>}
        </Field>
      )
    }
    return (
      <Field label={label} required={required} optional={optional} hint={hint}>
        <input
          className={`input${err ? ' err' : ''}`}
          type={type}
          value={obj[key]}
          onChange={e => { set({ ...obj, [key]: e.target.value }); setErrors(p => ({ ...p, [key]: undefined })) }}
        />
        {err && <div className="err-msg">{err}</div>}
      </Field>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-2)' }}>
      <Header minimal />

      <div className="wrap-sm" style={{ padding: '32px 24px 64px' }}>
        <Stepper current={step} />

        <div className="card" style={{ marginTop: 28 }}>
          {/* Step 0 — Company */}
          {step === 0 && (
            <>
              <h2 style={s.stepTitle}>🏢 Информация о компании</h2>
              <p style={s.stepSub}>Данные автоматически проверяются через Дадата по ИНН</p>

              <Field label="Название организации" required>
                <input
                  className={`input${errors.name ? ' err' : ''}`}
                  placeholder="ООО Ромашка"
                  value={company.name}
                  onChange={e => { setCompany({ ...company, name: e.target.value }); setErrors(p => ({ ...p, name: undefined })) }}
                />
                {errors.name && <div className="err-msg">{errors.name}</div>}
              </Field>

              <Field label="ИНН" required hint="10 цифр для ООО/ИП, 12 цифр для физлица">
                <InnField value={company.inn} onChange={v => { setCompany({ ...company, inn: v }); setErrors(p => ({ ...p, inn: undefined })) }} />
                {errors.inn && <div className="err-msg">{errors.inn}</div>}
              </Field>

              <div className="form-row">
                {F(company, setCompany, 'region', 'Регион', true, null, 'text', REGIONS)}
                <Field label="Город" required>
                  <input className={`input${errors.city ? ' err' : ''}`} value={company.city} onChange={e => { setCompany({ ...company, city: e.target.value }); setErrors(p => ({ ...p, city: undefined })) }} />
                  {errors.city && <div className="err-msg">{errors.city}</div>}
                </Field>
              </div>

              {F(company, setCompany, 'category', 'Основная категория продукции', true, null, 'text', CATEGORIES)}
              {F(company, setCompany, 'site', 'Сайт компании', false, 'https://...', 'url', null, true)}
              {F(company, setCompany, 'revenue', 'Годовой оборот', false, null, 'text', REVENUES, true)}
            </>
          )}

          {/* Step 1 — Person */}
          {step === 1 && (
            <>
              <h2 style={s.stepTitle}>👤 Представитель компании</h2>
              <p style={s.stepSub}>Контактные данные для верификации и дальнейшей работы</p>

              {F(person, setPerson, 'fullName', 'Фамилия, Имя, Отчество', true)}
              {F(person, setPerson, 'position', 'Должность', true, 'Директор по продажам, менеджер по работе с сетями...')}

              <div className="form-row">
                <Field label="Рабочий телефон" required>
                  <input
                    className={`input${errors.phone ? ' err' : ''}`}
                    type="tel"
                    placeholder="+7 (900) 000-00-00"
                    value={person.phone}
                    onChange={e => { setPerson({ ...person, phone: e.target.value }); setErrors(p => ({ ...p, phone: undefined })) }}
                  />
                  {errors.phone && <div className="err-msg">{errors.phone}</div>}
                </Field>
                <Field label="Рабочий email" required>
                  <input
                    className={`input${errors.email ? ' err' : ''}`}
                    type="email"
                    placeholder="name@company.ru"
                    value={person.email}
                    onChange={e => { setPerson({ ...person, email: e.target.value }); setErrors(p => ({ ...p, email: undefined })) }}
                  />
                  {errors.email && <div className="err-msg">{errors.email}</div>}
                </Field>
              </div>

              <div className="form-row">
                <Field label="Telegram" optional>
                  <input className="input" placeholder="@username" value={person.telegram} onChange={e => setPerson({ ...person, telegram: e.target.value })} />
                </Field>
                <Field label="WhatsApp" optional>
                  <input className="input" placeholder="+7 900 000-00-00" type="tel" value={person.whatsapp} onChange={e => setPerson({ ...person, whatsapp: e.target.value })} />
                </Field>
              </div>

              {F(person, setPerson, 'source', 'Откуда узнали о платформе', false, null, 'text', SOURCES, true)}

              <div className="alert alert-info" style={{ marginTop: 8 }}>
                <span className="alert-icon">📱</span>
                <span>После регистрации на указанный телефон и email придут коды для верификации аккаунта</span>
              </div>
            </>
          )}

          {/* Step 2 — Product */}
          {step === 2 && (
            <>
              <h2 style={s.stepTitle}>📦 Карточка товара</h2>
              <p style={s.stepSub}>На основе этой карточки создаётся лайт-версия коммерческого предложения</p>

              {F(product, setProduct, 'name', 'Название товара', true, 'Молоко пастеризованное 2,5%, 1 л')}
              {F(product, setProduct, 'category', 'Категория товара', true, null, 'text', CATEGORIES)}

              <Field label="Описание товара" required hint="Состав, особенности, целевая аудитория">
                <textarea
                  className={`input${errors.description ? ' err' : ''}`}
                  value={product.description}
                  onChange={e => { setProduct({ ...product, description: e.target.value }); setErrors(p => ({ ...p, description: undefined })) }}
                  placeholder="Опишите ваш товар: из чего сделан, для кого, в чём уникальность..."
                />
                {errors.description && <div className="err-msg">{errors.description}</div>}
              </Field>

              <div className="form-row">
                <Field label="Цена от" required hint="Оптовая цена">
                  <input
                    className={`input${errors.priceFrom ? ' err' : ''}`}
                    type="number"
                    placeholder="150"
                    value={product.priceFrom}
                    onChange={e => { setProduct({ ...product, priceFrom: e.target.value }); setErrors(p => ({ ...p, priceFrom: undefined })) }}
                  />
                  {errors.priceFrom && <div className="err-msg">{errors.priceFrom}</div>}
                </Field>
                {F(product, setProduct, 'unit', 'Ед. измерения', true, null, 'text', UNITS)}
              </div>

              <Field label="Объём производства в месяц" required hint="Например: 50 000 кг/мес или 100 000 упак/мес">
                <input
                  className={`input${errors.volume ? ' err' : ''}`}
                  value={product.volume}
                  onChange={e => { setProduct({ ...product, volume: e.target.value }); setErrors(p => ({ ...p, volume: undefined })) }}
                  placeholder="100 000 упак/мес"
                />
                {errors.volume && <div className="err-msg">{errors.volume}</div>}
              </Field>

              <Field label="УТП продукта" optional hint="3 ключевых преимущества перед конкурентами">
                <textarea
                  className="input"
                  value={product.utp}
                  onChange={e => setProduct({ ...product, utp: e.target.value })}
                  placeholder="1. Уникальный рецептурный состав без консервантов&#10;2. Собственная сырьевая база — 100% отечественное сырьё&#10;3. Срок годности 30 дней — дольше среднего по рынку"
                />
              </Field>

              <Field label="Сертификаты" optional>
                <div className="pill-group">
                  {CERTS.map(cert => (
                    <div
                      key={cert}
                      className={`pill${product.certs.includes(cert) ? ' on' : ''}`}
                      onClick={() => setProduct(p => ({
                        ...p,
                        certs: p.certs.includes(cert) ? p.certs.filter(c => c !== cert) : [...p.certs, cert],
                      }))}
                    >
                      {product.certs.includes(cert) ? '✓ ' : ''}{cert}
                    </div>
                  ))}
                </div>
              </Field>

              <div className="alert alert-success" style={{ marginTop: 4 }}>
                <span className="alert-icon">🚀</span>
                <span>После регистрации откроется окно возможностей — вы увидите как платформа помогает войти в торговые сети</span>
              </div>
            </>
          )}

          <div className="divider" />

          <div style={s.navRow}>
            {step > 0 ? (
              <button className="btn btn-ghost" onClick={() => { setStep(s => s - 1); setErrors({}) }}>
                ← Назад
              </button>
            ) : <div />}
            <button className="btn btn-primary btn-lg" onClick={handleNext}>
              {step < 2 ? 'Далее →' : '✓ Завершить регистрацию'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-4)', marginTop: 16 }}>
          Нажимая «Далее», вы соглашаетесь с{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Политикой конфиденциальности</span>{' '}
          и{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Условиями использования</span>
        </p>
      </div>
    </div>
  )
}

const s = {
  stepper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 0,
    padding: '20px 0 0',
  },
  stepWrap: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  stepBubble: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
    flexShrink: 0,
    transition: 'all .2s',
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginLeft: 8,
    transition: 'background .3s',
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 6,
  },
  stepSub: {
    color: 'var(--text-3)',
    fontSize: 14,
    marginBottom: 28,
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  innBadge: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  innDadata: {
    fontSize: 12,
    color: 'var(--primary)',
    marginTop: 5,
    fontWeight: 500,
  },
}
