import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const STATS = [
  { v: '500+', l: 'поставщиков на платформе' },
  { v: '120+', l: 'торговых сетей-партнёров' },
  { v: '73%', l: 'конверсия в предварительный договор' },
  { v: '5 мин', l: 'на регистрацию поставщика' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header minimal />

      {/* Hero */}
      <section style={s.hero}>
        <div className="wrap" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span className="badge badge-green" style={{ marginBottom: 20, fontSize: 13 }}>
            🚀 Платформа входа в торговые сети
          </span>
          <h1 style={s.heroTitle}>
            Ваш товар — <span style={{ color: 'var(--primary)' }}>в крупнейшие<br/>сети России</span>
          </h1>
          <p style={s.heroSub}>
            Sale Tracker — платформа, которая с помощью ИИ, рекомендательных технологий и живых переговоров доводит вашу продукцию до полки в торговых сетях.
          </p>

          {/* Path cards */}
          <div style={s.pathGrid}>
            <div
              className="card card-hover"
              style={s.pathCard}
              onClick={() => navigate('/supplier')}
            >
              <div style={s.pathEmoji}>🏭</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Я поставщик</h3>
              <p style={{ color: 'var(--text-3)', marginBottom: 24, lineHeight: 1.6 }}>
                Хочу войти в торговые сети. Ищу покупателей<br/>на свою продукцию.
              </p>
              <div style={s.pathFeatures}>
                {['Размещение карточек товаров', 'Переговоры с закупщиками', 'ИИ-аналитика рынка'].map(f => (
                  <div key={f} style={s.pathFeature}>
                    <span style={{ color: 'var(--primary)' }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-block" style={{ marginTop: 24 }}>
                Начать регистрацию →
              </button>
            </div>

            <div
              className="card card-hover"
              style={{ ...s.pathCard, borderColor: '#3B82F6', borderWidth: 2 }}
              onClick={() => navigate('/buyer')}
            >
              <div style={s.pathEmoji}>🛒</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Я торговая сеть</h3>
              <p style={{ color: 'var(--text-3)', marginBottom: 24, lineHeight: 1.6 }}>
                Ищу новых поставщиков и продукцию для расширения ассортимента.
              </p>
              <div style={s.pathFeatures}>
                {['Каталог верифицированных поставщиков', 'Входящие КП от поставщиков', 'Тендеры и пред-тендеры'].map(f => (
                  <div key={f} style={s.pathFeature}>
                    <span style={{ color: '#3B82F6' }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button className="btn btn-block" style={{ marginTop: 24, background: '#3B82F6', color: '#fff', border: 'none' }}>
                Войти в кабинет закупщика →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={s.statsBar}>
        <div className="wrap">
          <div style={s.statsGrid}>
            {STATS.map(stat => (
              <div key={stat.l} style={s.statItem}>
                <div style={s.statValue}>{stat.v}</div>
                <div style={s.statLabel}>{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Как работает платформа</h2>
            <p style={{ color: 'var(--text-3)', fontSize: 17 }}>Четыре уровня вовлечённости — от знакомства до контракта</p>
          </div>
          <div style={s.stepsGrid}>
            {[
              { n: 1, name: 'Рабочее место', price: '0 ₽', desc: 'Регистрация, аналитика рынка, обучение. Изучите потенциал вашего товара.', color: '#6B7280' },
              { n: 2, name: 'Онлайн продавец', price: '50 000 ₽', desc: 'Верификация, видимость для закупщиков, первые сигналы интереса от сетей.', color: '#3B82F6' },
              { n: 3, name: 'Сетевой отдел', price: '150 000 ₽', desc: 'Zoom-переговоры, тендеры, автопуш закупщиков. Предварительный договор.', color: 'var(--primary)' },
              { n: 4, name: 'Офис продаж', price: '250 000 ₽', desc: 'Персональный менеджер, ручной дожим, закрытые мероприятия. Максимальный результат.', color: '#F59E0B' },
            ].map((step, i) => (
              <div key={step.n} style={s.stepCard}>
                <div style={{ ...s.stepNum, background: step.color }}>{step.n}</div>
                <div style={s.stepName}>{step.name}</div>
                <div style={s.stepPrice}>{step.price}</div>
                <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
                {i < 3 && <div style={s.stepArrow}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="wrap-sm">
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Готовы начать?</h2>
          <p style={{ color: 'var(--text-3)', fontSize: 17, marginBottom: 36 }}>
            Регистрация занимает 5 минут. Базовый доступ — бесплатно.
          </p>
          <button className="btn btn-primary btn-xl" onClick={() => navigate('/supplier')}>
            Зарегистрироваться как поставщик →
          </button>
          <p style={{ color: 'var(--text-4)', fontSize: 13, marginTop: 16 }}>
            Без скрытых платежей на первом этапе
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Sale Tracker</span>
          <span style={{ color: 'var(--text-4)', fontSize: 14 }}>© 2026 Sale Tracker. Все права защищены.</span>
        </div>
      </footer>
    </div>
  )
}

const s = {
  hero: {
    padding: '72px 0 64px',
    background: 'linear-gradient(180deg, #F0FBF5 0%, #FFFFFF 100%)',
    borderBottom: '1px solid var(--border)',
  },
  heroTitle: {
    fontSize: 'clamp(32px, 5vw, 56px)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-1.5px',
    marginBottom: 20,
    color: 'var(--text)',
  },
  heroSub: {
    fontSize: 18,
    color: 'var(--text-3)',
    lineHeight: 1.65,
    marginBottom: 52,
  },
  pathGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
    maxWidth: 800,
    margin: '0 auto',
    textAlign: 'left',
  },
  pathCard: {
    padding: '32px',
    borderRadius: 16,
    cursor: 'pointer',
    transition: 'transform .2s, box-shadow .2s',
  },
  pathEmoji: {
    fontSize: 40,
    marginBottom: 16,
    display: 'block',
  },
  pathFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  pathFeature: {
    fontSize: 14,
    color: 'var(--text-2)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  statsBar: {
    padding: '32px 0',
    background: 'var(--text)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 32,
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 800,
    color: 'var(--primary)',
    letterSpacing: '-1px',
  },
  statLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20,
    position: 'relative',
  },
  stepCard: {
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '24px',
    position: 'relative',
  },
  stepNum: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 16,
    marginBottom: 12,
  },
  stepName: {
    fontWeight: 700,
    fontSize: 16,
    marginBottom: 4,
    color: 'var(--text)',
  },
  stepPrice: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-3)',
    marginBottom: 12,
  },
  stepArrow: {
    position: 'absolute',
    right: -14,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 20,
    color: 'var(--border)',
    fontWeight: 700,
    zIndex: 1,
  },
  footer: {
    borderTop: '1px solid var(--border)',
    padding: '20px 0',
    background: 'var(--bg-2)',
  },
}
