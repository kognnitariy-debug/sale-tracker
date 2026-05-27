import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const PLAN_LABELS = {
  free: 'Рабочее место',
  online: 'Онлайн продавец',
  network: 'Сетевой отдел',
  office: 'Офис продаж',
}

const PLAN_COLORS = {
  free: 'badge-gray',
  online: 'badge-blue',
  network: 'badge-green',
  office: 'badge-orange',
}

export default function Header({ minimal = false }) {
  const navigate = useNavigate()
  const { user, plan } = useUser()

  return (
    <header style={s.header}>
      <div className="wrap" style={s.inner}>
        <div style={s.logo} onClick={() => navigate('/')}>
          <div style={s.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 17l4-8 4 4 4-6 4 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={s.logoText}>Sale Tracker</span>
        </div>

        {!minimal && user && (
          <div style={s.right}>
            <span style={s.company}>{user.companyName}</span>
            <span className={`badge ${PLAN_COLORS[plan]}`}>{PLAN_LABELS[plan]}</span>
          </div>
        )}

        {minimal && (
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
            Войти
          </button>
        )}
      </div>
    </header>
  )
}

const s = {
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--border)',
  },
  inner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: 60,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
  },
  logoIcon: {
    width: 34, height: 34, borderRadius: 8,
    background: 'var(--primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: {
    fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px',
    color: 'var(--text)',
  },
  right: {
    display: 'flex', alignItems: 'center', gap: 12,
  },
  company: {
    fontSize: 14, fontWeight: 500, color: 'var(--text-3)',
  },
}
