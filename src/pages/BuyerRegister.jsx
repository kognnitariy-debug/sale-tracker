import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { CATEGORIES } from '../data/categories'

const NETWORK_TYPES = [
  'Супермаркет', 'Гипермаркет', 'Дискаунтер', 'Магазин у дома',
  'Фермерский магазин', 'Онлайн-ритейлер', 'Оптовый оператор', 'Другое',
]

const STORE_COUNTS = [
  'до 10 магазинов', '10–50 магазинов', '50–200 магазинов',
  '200–1 000 магазинов', 'более 1 000 магазинов',
]

const REGIONS = [
  'Москва', 'Санкт-Петербург', 'Московская область', 'Ленинградская область',
  'Краснодарский край', 'Свердловская область', 'Татарстан',
  'Ростовская область', 'Нижегородская область', 'Новосибирская область',
  'Самарская область', 'Все регионы РФ',
]

const POSITIONS = [
  'Категорийный менеджер', 'Директор по закупкам', 'Менеджер по закупкам',
  'Коммерческий директор', 'Руководитель отдела закупок', 'Другое',
]

const SOURCES = [
  'ЦЗС (живая сессия)', 'Рекомендация партнёра', 'Социальные сети',
  'Поиск в интернете', 'Выставка/мероприятие', 'Другое',
]

const SEGMENTS = ['Эконом', 'Средний', 'Премиум', 'Все сегменты']
const QUANTUM_OPTIONS = ['от 100 кг', 'от 500 кг', 'от 1 000 кг', 'от 5 000 кг', 'без ограничений']

const STEP_TITLES = ['Компания', 'Представитель', 'Что ищу']

function Stepper({ current }) {
  return (
    <div style={s.stepper}>
      {STEP_TITLES.map((t, i) => (
        <div key={t} style={s.stepWrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              ...s.stepBubble,
              background: i <= current ? '#1E40AF' : 'var(--bg-3)',
              color: i <= current ? '#fff' : 'var(--text-4)',
              boxShadow: i === current ? '0 0 0 4px #DBEAFE' : 'none',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 500 }}>Шаг {i + 1}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: i <= current ? 'var(--text)' : 'var(--text-4)' }}>
                {t}{i === 2 && <span style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 400, marginLeft: 4 }}>(необязательно)</span>}
              </div>
            </div>
          </div>
          {i < STEP_TITLES.length - 1 && (
            <div style={{ flex: 1, height: 2, marginLeft: 8, background: i < current ? '#1E40AF' : 'var(--border)', transition: 'background .3s' }} />
          )}
        </div>
      ))}
    </div>
  )
}

function Field({ label, required, optional, hint, error, children }) {
  return (
    <div className="form-group">
      <label className="label">
        {label}
        {required && <span className="req"> *</span>}
        {optional && <span className="opt"> (необязательно)</span>}
      </label>
      {children}
      {hint && !error && <div className="hint">{hint}</div>}
      {error && <div className="err-msg">{error}</div>}
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
        <>
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <span style={{ color: '#1E40AF', fontSize: 14 }}>✓</span>
          </div>
          <div style={{ fontSize: 12, color: '#1E40AF', marginTop: 5, fontWeight: 500 }}>✓ ИНН проверен через Дадата</div>
        </>
      )}
    </div>
  )
}

export default function BuyerRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})

  const [company, setCompany] = useState({
    name: '', inn: '', type: '', storeCount: '', regions: [], site: '',
  })

  const [person, setPerson] = useState({
    fullName: '', position: '', phone: '', email: '', telegram: '', source: '',
  })

  const [request, setRequest] = useState({
    categories: [], segments: [], quantum: '', rrc: false, regions: [], comment: '',
  })

  function setC(k, v) { setCompany(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })) }
  function setP(k, v) { setPerson(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })) }
  function setR(k, v) { setRequest(p => ({ ...p, [k]: v })) }
  function toggleArr(obj, setObj, key, val) {
    setObj(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val] }))
  }

  function validateStep0() {
    const e = {}
    if (!company.name.trim()) e.name = 'Введите название сети'
    if (company.inn.length !== 10 && company.inn.length !== 12) e.inn = 'ИНН должен содержать 10 или 12 цифр'
    if (!company.type) e.type = 'Выберите тип объекта'
    if (!company.storeCount) e.storeCount = 'Укажите количество магазинов'
    return e
  }

  function validateStep1() {
    const e = {}
    if (!person.fullName.trim()) e.fullName = 'Введите ФИО'
    if (!person.position) e.position = 'Выберите должность'
    if (!person.phone.replace(/\D/g, '') || person.phone.replace(/\D/g, '').length < 10) e.phone = 'Введите корректный телефон'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) e.email = 'Введите корректный email'
    return e
  }

  function handleNext() {
    let e = {}
    if (step === 0) e = validateStep0()
    if (step === 1) e = validateStep1()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    if (step < 2) {
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/buyer')
    }
  }

  function handleSkip() {
    navigate('/buyer')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-2)' }}>
      <Header minimal />

      <div className="wrap-sm" style={{ padding: '32px 24px 64px' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#DBEAFE', color: '#1E40AF', fontSize: 13, fontWeight: 700, padding: '4px 14px', borderRadius: 100, marginBottom: 14 }}>
            🛒 Регистрация торговой сети
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, marginBottom: 8 }}>Кабинет закупщика</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 15 }}>Найдите поставщиков, публикуйте тендеры, получайте КП</p>
        </div>

        <Stepper current={step} />

        <div className="card" style={{ marginTop: 28 }}>

          {/* Step 0 — Company */}
          {step === 0 && (
            <>
              <h2 style={s.stepTitle}>🏢 Информация о сети</h2>
              <p style={s.stepSub}>Данные компании для создания профиля в каталоге закупщиков</p>

              <Field label="Название торговой сети" required error={errors.name}>
                <input
                  className={`input${errors.name ? ' err' : ''}`}
                  placeholder="ООО Торговая сеть «Ромашка»"
                  value={company.name}
                  onChange={e => setC('name', e.target.value)}
                />
              </Field>

              <Field label="ИНН" required hint="10 цифр для юрлица" error={errors.inn}>
                <InnField value={company.inn} onChange={v => setC('inn', v)} />
              </Field>

              <div className="form-row">
                <Field label="Тип объекта" required error={errors.type}>
                  <select className={`input${errors.type ? ' err' : ''}`} value={company.type} onChange={e => setC('type', e.target.value)}>
                    <option value="">Выберите...</option>
                    {NETWORK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Количество магазинов" required error={errors.storeCount}>
                  <select className={`input${errors.storeCount ? ' err' : ''}`} value={company.storeCount} onChange={e => setC('storeCount', e.target.value)}>
                    <option value="">Выберите...</option>
                    {STORE_COUNTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Регионы присутствия" optional hint="Выберите все применимые">
                <div className="pill-group">
                  {REGIONS.map(r => (
                    <div
                      key={r}
                      className={`pill${company.regions.includes(r) ? ' on' : ''}`}
                      onClick={() => toggleArr(company, setCompany, 'regions', r)}
                    >
                      {company.regions.includes(r) ? '✓ ' : ''}{r}
                    </div>
                  ))}
                </div>
              </Field>

              <Field label="Сайт компании" optional>
                <input className="input" type="url" placeholder="https://..." value={company.site} onChange={e => setC('site', e.target.value)} />
              </Field>
            </>
          )}

          {/* Step 1 — Person */}
          {step === 1 && (
            <>
              <h2 style={s.stepTitle}>👤 Представитель компании</h2>
              <p style={s.stepSub}>Контактные данные для верификации и общения с поставщиками</p>

              <Field label="Фамилия, Имя, Отчество" required error={errors.fullName}>
                <input
                  className={`input${errors.fullName ? ' err' : ''}`}
                  placeholder="Иванов Иван Иванович"
                  value={person.fullName}
                  onChange={e => setP('fullName', e.target.value)}
                />
              </Field>

              <Field label="Должность" required error={errors.position}>
                <select className={`input${errors.position ? ' err' : ''}`} value={person.position} onChange={e => setP('position', e.target.value)}>
                  <option value="">Выберите...</option>
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>

              <div className="form-row">
                <Field label="Рабочий телефон" required error={errors.phone}>
                  <input
                    className={`input${errors.phone ? ' err' : ''}`}
                    type="tel"
                    placeholder="+7 (900) 000-00-00"
                    value={person.phone}
                    onChange={e => setP('phone', e.target.value)}
                  />
                </Field>
                <Field label="Рабочий email" required error={errors.email}>
                  <input
                    className={`input${errors.email ? ' err' : ''}`}
                    type="email"
                    placeholder="name@company.ru"
                    value={person.email}
                    onChange={e => setP('email', e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Telegram" optional>
                <input className="input" placeholder="@username" value={person.telegram} onChange={e => setP('telegram', e.target.value)} />
              </Field>

              <Field label="Откуда узнали о платформе" optional>
                <select className="input" value={person.source} onChange={e => setP('source', e.target.value)}>
                  <option value="">Выберите...</option>
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>

              <div className="alert alert-info" style={{ marginTop: 8 }}>
                <span className="alert-icon">📱</span>
                <span>После регистрации на email придёт подтверждение. Поставщики увидят ваш профиль в каталоге сетей.</span>
              </div>
            </>
          )}

          {/* Step 2 — Request (optional) */}
          {step === 2 && (
            <>
              <h2 style={s.stepTitle}>📋 Что вы ищете</h2>
              <p style={s.stepSub}>
                Заполните заранее — поставщики из каталога автоматически получат уведомление о вашем интересе.
                <strong> Шаг необязательный</strong>, можно заполнить позже в разделе Тендеры.
              </p>

              <Field label="Категории продуктов" optional hint="Выберите все интересующие">
                <div className="pill-group">
                  {CATEGORIES.map(c => (
                    <div
                      key={c.id}
                      className={`pill${request.categories.includes(c.id) ? ' on' : ''}`}
                      onClick={() => toggleArr(request, setRequest, 'categories', c.id)}
                    >
                      {request.categories.includes(c.id) ? '✓ ' : ''}{c.icon} {c.name}
                    </div>
                  ))}
                </div>
              </Field>

              <Field label="Ценовой сегмент" optional>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {SEGMENTS.map(seg => (
                    <div
                      key={seg}
                      className={`pill${request.segments.includes(seg) ? ' on' : ''}`}
                      onClick={() => toggleArr(request, setRequest, 'segments', seg)}
                    >
                      {request.segments.includes(seg) ? '✓ ' : ''}{seg}
                    </div>
                  ))}
                </div>
              </Field>

              <div className="form-row">
                <Field label="Регион поставщика" optional>
                  <select className="input" value={request.regions[0] || ''} onChange={e => setR('regions', e.target.value ? [e.target.value] : [])}>
                    <option value="">Любой регион</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Минимальный квант поставки" optional>
                  <select className="input" value={request.quantum} onChange={e => setR('quantum', e.target.value)}>
                    <option value="">Без ограничений</option>
                    {QUANTUM_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Доставка на РРЦ" optional>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
                  <input
                    type="checkbox"
                    id="rrc_req"
                    checked={request.rrc}
                    onChange={e => setR('rrc', e.target.checked)}
                    style={{ width: 16, height: 16 }}
                  />
                  <label htmlFor="rrc_req" style={{ fontSize: 14, cursor: 'pointer' }}>
                    Обязательна доставка на распределительный центр (РРЦ)
                  </label>
                </div>
              </Field>

              <Field label="Дополнительные требования" optional hint="Сертификаты, особенности упаковки, срок годности...">
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Например: ГОСТ обязателен, срок годности не менее 30 дней, eco-упаковка приветствуется"
                  value={request.comment}
                  onChange={e => setR('comment', e.target.value)}
                />
              </Field>

              <div className="alert alert-success" style={{ marginTop: 4 }}>
                <span className="alert-icon">🚀</span>
                <span>После регистрации вы сразу попадёте в кабинет закупщика — каталог поставщиков, входящие КП и тендеры</span>
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

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {step === 2 && (
                <button className="btn btn-ghost" onClick={handleSkip}>
                  Пропустить
                </button>
              )}
              <button
                className="btn btn-lg"
                style={{ background: '#1E40AF', color: '#fff', border: 'none' }}
                onClick={handleNext}
              >
                {step < 2 ? 'Далее →' : '✓ Войти в кабинет'}
              </button>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-4)', marginTop: 16 }}>
          Нажимая «Далее», вы соглашаетесь с{' '}
          <span style={{ color: '#1E40AF', cursor: 'pointer' }}>Политикой конфиденциальности</span>{' '}
          и{' '}
          <span style={{ color: '#1E40AF', cursor: 'pointer' }}>Условиями использования</span>
        </p>
      </div>
    </div>
  )
}

const s = {
  stepper: { display: 'flex', alignItems: 'flex-start', gap: 0, padding: '20px 0 0' },
  stepWrap: { display: 'flex', alignItems: 'center', flex: 1 },
  stepBubble: { width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0, transition: 'all .2s' },
  stepTitle: { fontSize: 22, fontWeight: 700, marginBottom: 6 },
  stepSub: { color: 'var(--text-3)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 },
  navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
}
