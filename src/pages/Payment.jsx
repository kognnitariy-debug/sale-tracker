import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'

const PLANS = [
  {
    id: 'online',
    name: 'Онлайн продавец',
    price: 50000,
    color: '#3B82F6',
    badge: 'badge-blue',
    label: '🚀 Старт',
    desc: 'Для поставщиков, которые хотят стать видимыми для закупщиков и получить первые сигналы интереса.',
    utp: ['Верификация и бейдж поставщика', 'До 5 карточек товаров', 'Видимость в каталоге', 'Базовые инструменты продаж'],
    for: 'Подходит для: малый и средний бизнес, первый выход в сети',
  },
  {
    id: 'network',
    name: 'Сетевой отдел',
    price: 150000,
    color: '#00A651',
    badge: 'badge-green',
    label: '⭐ Популярный',
    desc: 'Для поставщиков, готовых к системным переговорам и нацеленных на заключение предварительного договора.',
    utp: ['До 15 карточек товаров', 'Zoom-переговоры с закупщиками', 'Тендеры и офлайн-встречи', 'Автопуш закупщикам', 'Управляемая воронка переговоров'],
    for: 'Подходит для: компании с оборотом 50+ млн ₽, серьёзный настрой',
  },
  {
    id: 'office',
    name: 'Офис продаж',
    price: 250000,
    color: '#F59E0B',
    badge: 'badge-orange',
    label: '💎 Максимум',
    desc: 'Для поставщиков, которым нужен гарантированный результат и персональное сопровождение команды.',
    utp: ['Персональный менеджер', 'Ручной дожим закупщиков', 'До 30 карточек товаров', 'Закрытые мероприятия', 'Приоритет во всех инструментах'],
    for: 'Подходит для: компании с амбициями на федеральные сети',
  },
]

const PROMO_CODES = {
  'CZS10': 10,
  'PARTNER5': 5,
  'SALE2025': 10,
}

export default function Payment() {
  const navigate = useNavigate()
  const { user, setPlan } = useUser()
  const [selected, setSelected] = useState('network')
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [invoiceGenerated, setInvoiceGenerated] = useState(false)
  const [paying, setPaying] = useState(false)

  const plan = PLANS.find(p => p.id === selected)
  const discount = promoApplied ? PROMO_CODES[promoApplied] : 0
  const total = Math.round(plan.price * (1 - discount / 100))
  const invoiceDate = new Date()
  const invoiceExpiry = new Date(invoiceDate.getTime() + 5 * 24 * 60 * 60 * 1000)

  function applyPromo() {
    const code = promo.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setPromoApplied(code)
      setPromoError('')
    } else {
      setPromoError('Промокод не найден или уже использован')
      setPromoApplied(null)
    }
  }

  function generateInvoice() {
    setInvoiceGenerated(true)
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  function handlePay() {
    setPaying(true)
    setTimeout(() => {
      setPlan(selected)
      navigate('/payment/success')
    }, 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-2)' }}>
      <Header />

      <div className="wrap-md" style={{ padding: '32px 24px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 10 }}>Выберите пакет</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 16 }}>
            Счёт действует 5 рабочих дней. Цены могут вырасти — фиксируйте сейчас.
          </p>
        </div>

        <div className="alert alert-warning" style={{ marginBottom: 28 }}>
          <span className="alert-icon">⏰</span>
          <span>
            <strong>Специальное предложение.</strong> Текущие цены действуют ограниченное время.
            После оформления счёта у вас есть 5 рабочих дней для оплаты по зафиксированной цене.
          </span>
        </div>

        {/* Plan cards */}
        <div style={s.plansGrid}>
          {PLANS.map(p => (
            <div
              key={p.id}
              style={{
                ...s.planCard,
                borderColor: selected === p.id ? p.color : 'var(--border)',
                borderWidth: selected === p.id ? 2 : 1,
                boxShadow: selected === p.id ? `0 4px 20px ${p.color}25` : 'var(--shadow-xs)',
              }}
              onClick={() => setSelected(p.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: p.color, background: `${p.color}15`, padding: '4px 10px', borderRadius: 100 }}>
                  {p.label}
                </span>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: `2px solid ${selected === p.id ? p.color : 'var(--border)'}`,
                  background: selected === p.id ? p.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {selected === p.id && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
                </div>
              </div>

              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: p.color, marginBottom: 12 }}>
                {p.price.toLocaleString('ru')} ₽
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.55, marginBottom: 14 }}>{p.desc}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {p.utp.map(u => (
                  <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ color: p.color }}>✓</span>
                    <span style={{ color: 'var(--text-2)' }}>{u}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-4)', fontStyle: 'italic' }}>{p.for}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Оформление счёта</h3>

          {/* Promo */}
          <div className="form-group">
            <label className="label">Промокод <span className="opt">(если есть)</span></label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="input"
                placeholder="Например: CZS10"
                value={promo}
                onChange={e => { setPromo(e.target.value.toUpperCase()); setPromoError(''); setPromoApplied(null) }}
                style={{ flex: 1 }}
              />
              <button className="btn btn-outline" onClick={applyPromo}>
                Применить
              </button>
            </div>
            {promoError && <div className="err-msg">{promoError}</div>}
            {promoApplied && (
              <div style={{ fontSize: 13, color: 'var(--primary)', marginTop: 6, fontWeight: 600 }}>
                ✓ Промокод «{promoApplied}» применён — скидка {PROMO_CODES[promoApplied]}%
              </div>
            )}
            <div className="hint">Если вы были на мероприятии ЦЗС — введите CZS10 для скидки 10%</div>
          </div>

          <div className="divider" />

          {/* Totals */}
          <div style={s.totals}>
            <div style={s.totalRow}>
              <span style={{ color: 'var(--text-3)' }}>Пакет</span>
              <span style={{ fontWeight: 600 }}>{plan.name}</span>
            </div>
            <div style={s.totalRow}>
              <span style={{ color: 'var(--text-3)' }}>Базовая цена</span>
              <span>{plan.price.toLocaleString('ru')} ₽</span>
            </div>
            {discount > 0 && (
              <div style={{ ...s.totalRow, color: 'var(--primary)' }}>
                <span>Скидка по промокоду</span>
                <span>−{discount}% (−{(plan.price * discount / 100).toLocaleString('ru')} ₽)</span>
              </div>
            )}
            <div className="divider" style={{ margin: '12px 0' }} />
            <div style={{ ...s.totalRow, fontWeight: 800, fontSize: 20 }}>
              <span>Итого к оплате</span>
              <span style={{ color: plan.color }}>{total.toLocaleString('ru')} ₽</span>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
              Получатель счёта: <strong style={{ color: 'var(--text)' }}>{user?.companyName || 'Ваша компания'}</strong>{' '}
              · ИНН: <strong style={{ color: 'var(--text)' }}>{user?.inn || '—'}</strong>
            </div>

            {!invoiceGenerated ? (
              <button className="btn btn-primary btn-xl btn-block" onClick={generateInvoice}>
                📄 Сформировать счёт-договор
              </button>
            ) : (
              <div>
                <div className="alert alert-success" style={{ marginBottom: 16 }}>
                  <span className="alert-icon">📄</span>
                  <div>
                    <strong>Счёт №ST-{Date.now().toString().slice(-6)} сформирован</strong><br/>
                    <span style={{ fontSize: 13 }}>
                      Действует до {invoiceExpiry.toLocaleDateString('ru-RU')} · Отправлен на {user?.contact?.email || 'ваш email'}
                    </span>
                  </div>
                </div>

                <div style={s.invoiceCard}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--text)' }}>
                    📋 Счёт-договор №ST-{Date.now().toString().slice(-6)}
                  </div>
                  <div style={s.invoiceRow}><span>Поставщик:</span><span>ООО «Sale Tracker»</span></div>
                  <div style={s.invoiceRow}><span>Покупатель:</span><span>{user?.companyName || 'Ваша компания'}</span></div>
                  <div style={s.invoiceRow}><span>ИНН покупателя:</span><span>{user?.inn || '—'}</span></div>
                  <div style={s.invoiceRow}><span>Услуга:</span><span>Подписка «{plan.name}»</span></div>
                  <div style={s.invoiceRow}><span>Сумма (с НДС):</span><strong>{total.toLocaleString('ru')} ₽</strong></div>
                  <div style={s.invoiceRow}><span>Срок оплаты:</span><span>{invoiceExpiry.toLocaleDateString('ru-RU')}</span></div>
                  <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-4)' }}>
                    * Оплата регулируется договором-офертой, размещённым на сайте Sale Tracker.
                    После оплаты доступ активируется в течение 1 рабочего дня.
                  </div>
                </div>

                <div style={s.paymentMethods}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', marginBottom: 12 }}>
                    Способы оплаты:
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
                    {['QR-код Райффайзен', 'Банковский перевод', 'Эквайринг карт'].map(m => (
                      <div key={m} style={s.methodBadge}>{m}</div>
                    ))}
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-xl btn-block"
                  onClick={handlePay}
                  disabled={paying}
                >
                  {paying ? '⏳ Обрабатываем оплату...' : '💳 Оплатить через QR · Райффайзенбанк →'}
                </button>

                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-4)', marginTop: 12 }}>
                  После оплаты подтверждение придёт на телефон, email и в Telegram/WhatsApp
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 16,
  },
  planCard: {
    background: '#fff',
    borderRadius: 'var(--r)',
    padding: '22px',
    cursor: 'pointer',
    transition: 'all .2s',
    borderStyle: 'solid',
  },
  totals: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 15,
  },
  invoiceCard: {
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-sm)',
    padding: '20px',
    marginBottom: 20,
    fontSize: 14,
  },
  invoiceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid var(--border)',
    fontSize: 14,
    color: 'var(--text-2)',
  },
  paymentMethods: {
    marginTop: 20,
    marginBottom: 4,
  },
  methodBadge: {
    padding: '8px 16px',
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-2)',
    cursor: 'pointer',
  },
}
