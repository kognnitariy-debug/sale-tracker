import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'

const PLAN_NAMES = {
  online: 'Онлайн продавец',
  network: 'Сетевой отдел',
  office: 'Офис продаж',
}

const NEXT_STEPS = [
  { icon: '📱', title: 'Проверьте телефон и email', desc: 'Отправили подтверждение оплаты и данные доступа' },
  { icon: '💬', title: 'Подключитесь в Telegram', desc: 'Наш менеджер напишет вам в течение 1 рабочего дня' },
  { icon: '📦', title: 'Добавьте карточки товаров', desc: 'Заполните полный профиль для максимальной видимости' },
  { icon: '🎯', title: 'Изучите инструкции', desc: 'В разделе "Обучение" открылись закрытые материалы' },
]

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const { user, plan } = useUser()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-2)' }}>
      <Header />

      <div className="wrap-sm" style={{ padding: '48px 24px 64px', textAlign: 'center' }}>
        {/* Confetti / Success icon */}
        <div style={s.successIcon}>
          <span style={{ fontSize: 56 }}>🎉</span>
        </div>

        <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, marginBottom: 12 }}>
          Поздравляем!
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-3)', lineHeight: 1.65, marginBottom: 8 }}>
          Оплата успешно получена. Вы активировали пакет
        </p>
        <span className="badge badge-green" style={{ fontSize: 15, padding: '8px 18px', marginBottom: 32 }}>
          {PLAN_NAMES[plan] || 'Онлайн продавец'}
        </span>

        <div className="alert alert-success" style={{ textAlign: 'left', marginBottom: 32 }}>
          <span className="alert-icon">📧</span>
          <div>
            Подтверждение и счёт-фактура отправлены на{' '}
            <strong>{user?.contact?.email || 'ваш email'}</strong>.
            Дополнительно уведомление придёт в Telegram и WhatsApp.
          </div>
        </div>

        {/* What's next */}
        <div style={{ textAlign: 'left', marginBottom: 36 }}>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
            Что делать дальше?
          </h3>
          <div style={s.nextGrid}>
            {NEXT_STEPS.map((step, i) => (
              <div key={i} className="card" style={{ padding: '20px 22px' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{step.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 5 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <div style={s.guaranteeBox}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>🤝</div>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Следуйте нашей технологии</h3>
          <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6 }}>
            Поставщики, которые проходят все этапы нашей технологии, гарантированно получают
            переговоры с торговыми сетями. Мы сопровождаем вас на каждом шаге.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
            Перейти в личный кабинет →
          </button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 16 }}>
          Есть вопросы? Напишите нам: <span style={{ color: 'var(--primary)' }}>support@sale-tracker.ru</span>
        </p>
      </div>
    </div>
  )
}

const s = {
  successIcon: {
    width: 100,
    height: 100,
    background: 'var(--primary-light)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    border: '3px solid var(--primary)',
  },
  nextGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 14,
  },
  guaranteeBox: {
    background: 'var(--primary-light)',
    border: '1px solid var(--primary)',
    borderRadius: 'var(--r)',
    padding: '24px',
    textAlign: 'center',
    marginBottom: 28,
  },
}
