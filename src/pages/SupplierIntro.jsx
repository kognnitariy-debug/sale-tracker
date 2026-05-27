import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const STEPS = [
  { n: 1, icon: '🏢', title: 'Компания', desc: 'ИНН, название, категория товаров' },
  { n: 2, icon: '👤', title: 'Представитель', desc: 'Контактное лицо, телефон, email' },
  { n: 3, icon: '📦', title: 'Карточка товара', desc: 'Описание, цена, объём производства' },
]

export default function SupplierIntro() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header minimal />

      <div className="wrap-sm" style={{ padding: '64px 24px' }}>
        {/* Badge */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="badge badge-green" style={{ marginBottom: 20, fontSize: 13 }}>
            🏭 Вы выбрали: Поставщик
          </span>

          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
            Добро пожаловать<br/>в <span style={{ color: 'var(--primary)' }}>Sale Tracker</span>
          </h1>

          <p style={{ fontSize: 17, color: 'var(--text-3)', lineHeight: 1.7, marginBottom: 8 }}>
            Платформа доводит ваш товар до торговых сетей через технологии воронки продаж,
            ИИ-аналитику и живые переговоры.
          </p>

          <div style={s.guarantee}>
            <span style={{ fontSize: 22 }}>🎯</span>
            <div>
              <strong style={{ color: 'var(--text)', fontSize: 15 }}>Гарантия результата</strong>
              <p style={{ color: 'var(--text-3)', fontSize: 14, margin: 0, marginTop: 2 }}>
                Следуя нашей технологии, вы гарантированно получите переговоры с торговыми сетями
              </p>
            </div>
          </div>
        </div>

        {/* Steps preview */}
        <div style={{ marginBottom: 40 }}>
          <div style={s.stepsLabel}>
            <div style={s.stepsLine} />
            <span style={{ background: '#fff', padding: '0 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-3)', position: 'relative', zIndex: 1 }}>
              ⏱ Регистрация займёт 5 минут — 3 шага
            </span>
            <div style={s.stepsLine} />
          </div>

          <div style={s.stepsGrid}>
            {STEPS.map((step) => (
              <div key={step.n} style={s.stepItem}>
                <div style={s.stepCircle}>
                  <span style={{ fontSize: 22 }}>{step.icon}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{step.desc}</div>
                </div>
                {step.n < 3 && (
                  <div style={s.stepArrow}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* What you get */}
        <div className="card" style={{ marginBottom: 32, background: 'var(--primary-light)', border: 'none' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 12 }}>
            После регистрации вы получите:
          </div>
          <div style={s.benefitsList}>
            {[
              'Место в каталоге платформы — видимость для закупщиков',
              'Аналитику рынка по вашей категории товаров',
              'Базу знаний для подготовки к работе с торговыми сетями',
              'Первую карточку товара с лайт-версией коммерческого предложения',
              'Дорожную карту для выхода в сети',
            ].map(b => (
              <div key={b} style={s.benefitItem}>
                <span style={{ color: 'var(--primary)', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary btn-xl btn-block"
          onClick={() => navigate('/register')}
        >
          Начать регистрацию →
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-4)', marginTop: 14 }}>
          Базовый доступ бесплатно · Верификация по телефону и email
        </p>
      </div>
    </div>
  )
}

const s = {
  guarantee: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    background: '#FFF8E7',
    border: '1px solid #FDE68A',
    borderRadius: 'var(--r)',
    padding: '16px 20px',
    textAlign: 'left',
    marginTop: 24,
  },
  stepsLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    marginBottom: 28,
    textAlign: 'center',
  },
  stepsLine: {
    flex: 1,
    height: 1,
    background: 'var(--border)',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 0,
    position: 'relative',
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '0 16px',
    position: 'relative',
  },
  stepCircle: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'var(--primary-light)',
    border: '2px solid var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepArrow: {
    position: 'absolute',
    right: -8,
    top: 20,
    fontSize: 20,
    color: 'var(--text-4)',
    fontWeight: 700,
  },
  benefitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
}
