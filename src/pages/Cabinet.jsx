import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { PLAN_META, PLAN_ORDER } from '../data/plans'
import Overview from './cabinet/Overview'
import Product from './cabinet/Product'
import Negotiations from './cabinet/Negotiations'
import Promo from './cabinet/Promo'
import Analytics from './cabinet/Analytics'
import { Company, Team, Learning } from './cabinet/Secondary'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return isMobile
}

const NAV = [
  { id: 'overview',      icon: '🏠', label: 'Обзор',                 group: 'main'   },
  { id: 'company',       icon: '🏢', label: 'Компания',              group: 'main'   },
  { id: 'team',          icon: '👤', label: 'Персона',               group: 'main'   },
  { id: 'product',       icon: '📦', label: 'Продукт',               group: 'main'   },
  { id: 'negotiations',  icon: '🤝', label: 'Переговоры с сетями',   group: 'main'   },
  { id: 'promo',         icon: '📢', label: 'Продвижение в сетях',   group: 'main'   },
  { id: 'analytics',     icon: '📊', label: 'Аналитика',             group: 'main'   },
  { id: 'learning',      icon: '🎓', label: 'Обучение',              group: 'main'   },
  { id: 'subscription',  icon: '💳', label: 'Тариф и оплата',        group: 'bottom' },
]

const SECTION_TITLES = {
  overview:     'Обзор кабинета',
  company:      'Профиль компании',
  team:         'Персона',
  product:      'Управление продуктом',
  negotiations: 'Переговоры с сетями',
  promo:        'Продвижение в сетях',
  analytics:    'Аналитика и данные',
  learning:     'Обучение',
  subscription: 'Тариф и оплата',
}

function PlanSwitcher({ active, userPlan, onChange }) {
  return (
    <div style={ss.switcherBar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch', flexShrink: 0, minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.6)', whiteSpace: 'nowrap' }}>
          👁 ПРЕДПРОСМОТР ТАРИФА:
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {PLAN_ORDER.map(planId => {
            const p = PLAN_META[planId]
            const isCurrent = planId === userPlan
            const isActive = planId === active
            return (
              <button
                key={planId}
                onClick={() => onChange(planId)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 100,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 400,
                  cursor: 'pointer',
                  background: isActive ? p.color : 'rgba(255,255,255,.1)',
                  color: isActive ? '#fff' : 'rgba(255,255,255,.7)',
                  transition: 'all .18s',
                  position: 'relative',
                }}
              >
                {p.label}
                {isCurrent && (
                  <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, background: '#4ADE80', borderRadius: '50%', border: '1.5px solid var(--text)' }} />
                )}
              </button>
            )
          })}
        </div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginLeft: 4 }}>
          · зелёная точка = ваш тариф
        </span>
      </div>
    </div>
  )
}

function Sidebar({ active, onNav, planId, userPlan, onClose, isMobile }) {
  const navigate = useNavigate()
  const plan = PLAN_META[planId]
  const nextPlan = plan.next ? PLAN_META[plan.next] : null
  const [collapsed, setCollapsed] = useState(false)

  function handleNav(id) {
    onNav(id)
    if (isMobile && onClose) onClose()
  }

  return (
    <aside style={{ ...ss.sidebar, width: isMobile ? 260 : collapsed ? 60 : 220 }}>
      {/* Logo */}
      <div style={ss.sidebarLogo} onClick={() => navigate('/')}>
        <div style={ss.logoIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 17l4-8 4 4 4-6 4 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {!collapsed && <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Sale Tracker</span>}
      </div>

      {/* Company info */}
      {!collapsed && (
        <div style={ss.companyBadge}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 2 }}>ООО Агро-Молоко</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: plan.color, background: plan.colorBg, padding: '2px 8px', borderRadius: 100 }}>
            {plan.label}
          </span>
          {planId !== userPlan && (
            <div style={{ fontSize: 10, color: '#F59E0B', marginTop: 4 }}>
              👁 Предпросмотр
            </div>
          )}
        </div>
      )}

      <div className="divider" style={{ margin: '8px 12px' }} />

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {NAV.filter(n => n.group === 'main').map(item => (
          <NavItem key={item.id} item={item} active={active} onNav={handleNav} collapsed={collapsed && !isMobile} />
        ))}
        <div className="divider" style={{ margin: '8px 4px' }} />
        {NAV.filter(n => n.group === 'bottom').map(item => (
          <NavItem key={item.id} item={item} active={active} onNav={handleNav} collapsed={collapsed && !isMobile} />
        ))}
      </nav>

      {/* Upgrade card */}
      {!collapsed && nextPlan && planId === userPlan && (
        <div style={{ padding: '12px', marginTop: 'auto' }}>
          <div style={{ background: `${nextPlan.color}12`, border: `1px solid ${nextPlan.color}40`, borderRadius: 10, padding: '12px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: nextPlan.color, marginBottom: 4 }}>
              🔥 Следующий уровень
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{nextPlan.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>{nextPlan.priceLabel}</div>
            <button
              className="btn btn-sm btn-block"
              style={{ background: nextPlan.color, color: '#fff', border: 'none', fontSize: 12 }}
              onClick={() => navigate('/payment')}
            >
              Оформить →
            </button>
          </div>
        </div>
      )}

      {/* Collapse toggle — desktop only */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(v => !v)}
          style={{ position: 'absolute', right: -12, top: 80, width: 24, height: 24, borderRadius: '50%', background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, color: 'var(--text-3)', boxShadow: 'var(--shadow-sm)', zIndex: 10 }}
        >
          {collapsed ? '›' : '‹'}
        </button>
      )}
    </aside>
  )
}

function NavItem({ item, active, onNav, collapsed, primary }) {
  const isActive = active === item.id
  return (
    <div
      onClick={() => onNav(item.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: collapsed ? '10px 14px' : '9px 12px',
        borderRadius: 8, cursor: 'pointer', marginBottom: 2,
        background: isActive ? 'var(--primary-light)' : 'transparent',
        color: isActive ? 'var(--primary-dark)' : primary ? 'var(--text)' : 'var(--text-3)',
        fontWeight: isActive ? 700 : primary ? 500 : 400,
        fontSize: 14,
        transition: 'all .15s',
        justifyContent: collapsed ? 'center' : 'flex-start',
        position: 'relative',
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-2)' }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
      title={collapsed ? item.label : undefined}
    >
      <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
      {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
      {!collapsed && isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
    </div>
  )
}

function SubscriptionPage({ planId, userPlan }) {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Ваш текущий тариф</div>
        {(() => {
          const p = PLAN_META[userPlan]
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: p.colorBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>💳</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 20, color: p.color }}>{p.label}</div>
                <div style={{ fontSize: 14, color: 'var(--text-3)' }}>{p.priceLabel} · Активен</div>
              </div>
            </div>
          )
        })()}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {PLAN_ORDER.filter(id => id !== 'free').map(id => {
          const p = PLAN_META[id]
          const isCurrent = id === userPlan
          const isUpgrade = PLAN_ORDER.indexOf(id) > PLAN_ORDER.indexOf(userPlan)
          return (
            <div key={id} style={{ background: '#fff', border: `${isCurrent ? 2 : 1}px solid ${isCurrent ? p.color : 'var(--border)'}`, borderRadius: 'var(--r)', padding: '18px', opacity: !isUpgrade && !isCurrent ? 0.6 : 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: p.color, marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 12 }}>{p.priceLabel}</div>
              {isCurrent
                ? <div className="badge badge-green">✓ Текущий тариф</div>
                : isUpgrade
                ? <button className="btn btn-sm btn-block" style={{ background: p.color, color: '#fff', border: 'none' }} onClick={() => navigate('/payment')}>Перейти →</button>
                : <div style={{ fontSize: 12, color: 'var(--text-4)' }}>Предыдущий уровень</div>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Cabinet() {
  const navigate = useNavigate()
  const { user, plan: userPlan } = useUser()
  const [previewPlan, setPreviewPlan] = useState(userPlan || 'free')
  const [activeSection, setActiveSection] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => { setPreviewPlan(userPlan || 'free') }, [userPlan])
  useEffect(() => { if (!isMobile) setMobileMenuOpen(false) }, [isMobile])

  const activePlan = previewPlan

  function renderSection() {
    switch (activeSection) {
      case 'overview':      return <Overview planId={activePlan} onNav={setActiveSection} />
      case 'product':       return <Product planId={activePlan} />
      case 'negotiations':  return <Negotiations planId={activePlan} />
      case 'promo':         return <Promo planId={activePlan} />
      case 'analytics':     return <Analytics planId={activePlan} />
      case 'company':       return <Company planId={activePlan} />
      case 'team':          return <Team planId={activePlan} />
      case 'learning':      return <Learning planId={activePlan} />
      case 'subscription':  return <SubscriptionPage planId={activePlan} userPlan={userPlan || 'free'} />
      default:              return null
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column' }}>
      {/* Plan switcher bar */}
      <PlanSwitcher
        active={previewPlan}
        userPlan={userPlan || 'free'}
        onChange={setPreviewPlan}
      />

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Mobile overlay */}
        {isMobile && mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 149 }}
          />
        )}

        {/* Sidebar */}
        {(!isMobile || mobileMenuOpen) && (
          <div style={isMobile ? { position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 150, display: 'flex' } : {}}>
            <Sidebar
              active={activeSection}
              onNav={setActiveSection}
              planId={activePlan}
              userPlan={userPlan || 'free'}
              isMobile={isMobile}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* Main content */}
        <main style={{ flex: 1, overflowX: 'hidden', minWidth: 0 }}>
          {/* Top bar */}
          <div style={ss.topBar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {isMobile && (
                <button
                  onClick={() => setMobileMenuOpen(v => !v)}
                  style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: '4px 6px', color: 'var(--text)', lineHeight: 1 }}
                  aria-label="Открыть меню"
                >
                  ☰
                </button>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: isMobile ? 15 : 18 }}>{SECTION_TITLES[activeSection]}</div>
                {!isMobile && (
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    ООО Агро-Молоко ·{' '}
                    <span style={{ color: PLAN_META[activePlan].color, fontWeight: 600 }}>
                      {PLAN_META[activePlan].label}
                    </span>
                    {previewPlan !== (userPlan || 'free') && (
                      <span style={{ color: '#F59E0B', marginLeft: 8 }}>👁 Режим предпросмотра</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* Next step nudge */}
              {!isMobile && PLAN_META[activePlan].next && previewPlan === (userPlan || 'free') && (
                <button
                  className="btn btn-sm"
                  style={{ background: PLAN_META[PLAN_META[activePlan].next].color, color: '#fff', border: 'none', fontSize: 12 }}
                  onClick={() => navigate('/payment')}
                >
                  🔥 Перейти на {PLAN_META[PLAN_META[activePlan].next].label}
                </button>
              )}
              <button className="btn btn-ghost btn-sm" style={{ fontSize: isMobile ? 12 : 14 }} onClick={() => navigate('/dashboard')}>← Выход</button>
            </div>
          </div>

          {/* Section content */}
          <div style={{ padding: isMobile ? '16px 12px 48px' : '20px 24px 48px' }}>
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  )
}

const ss = {
  switcherBar: {
    background: '#1A1A2E',
    padding: '7px 20px',
    display: 'flex',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 200,
  },
  sidebar: {
    background: '#fff',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 38,
    height: 'calc(100vh - 38px)',
    overflowY: 'auto',
    flexShrink: 0,
    transition: 'width .25s',
    position: 'sticky',
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '16px 14px 12px',
    cursor: 'pointer',
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 7,
    background: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  companyBadge: {
    padding: '0 14px 10px',
  },
  navGroup: {
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--text-4)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    padding: '8px 12px 4px',
  },
  topBar: {
    background: '#fff',
    borderBottom: '1px solid var(--border)',
    padding: '14px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    position: 'sticky',
    top: 38,
    zIndex: 100,
  },
}
