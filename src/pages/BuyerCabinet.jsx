import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BUYERS } from '../data/accounts'
import { useMessaging } from '../context/MessagingContext'
import BuyerInbox from './buyer/BuyerInbox'
import BuyerCatalog from './buyer/BuyerCatalog'
import BuyerTenders from './buyer/BuyerTenders'

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
  { id: 'overview',   icon: '🏠', label: 'Обзор' },
  { id: 'tenders',    icon: '📋', label: 'Тендеры' },
  { id: 'catalog',    icon: '🔍', label: 'Каталог' },
  { id: 'inbox',      icon: '📥', label: 'Входящие заявки' },
  { id: 'analytics',  icon: '📊', label: 'Аналитика' },
]

const TITLES = {
  overview:  'Обзор кабинета закупщика',
  tenders:   'Тендеры и пред-тендеры',
  catalog:   'Каталог продуктов и поставщиков',
  inbox:     'Входящие заявки от поставщиков',
  analytics: 'Аналитика закупок',
}

function Overview({ buyer, onNav, getInbox }) {
  const inbox = getInbox(buyer.id)
  const newCount = inbox.filter(m => m.status === 'new').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Welcome */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)', borderRadius: 'var(--r)', padding: '20px 24px', color: '#fff' }}>
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>{buyer.logo} {buyer.name}</div>
        <div style={{ opacity: 0.8, fontSize: 14 }}>{buyer.type === 'hypermarket' ? 'Гипермаркет' : 'Супермаркет'} · {buyer.stores.toLocaleString()} магазинов · {buyer.contact}</div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { label: 'Активных тендеров', value: '2', icon: '📋', color: '#8B5CF6', onClick: () => onNav('tenders') },
          { label: 'Новых КП', value: newCount, icon: '🔴', color: '#EF4444', onClick: () => onNav('inbox') },
          { label: 'Поставщиков в базе', value: '3', icon: '🏭', color: '#00A651', onClick: () => onNav('catalog') },
          { label: 'Принятых КП', value: inbox.filter(m => m.status === 'accepted').length, icon: '✅', color: '#00A651', onClick: () => onNav('inbox') },
        ].map(k => (
          <div
            key={k.label}
            onClick={k.onClick}
            className="card-hover"
            style={{ background: '#fff', border: '1px solid var(--border)', borderTop: `3px solid ${k.color}`, borderRadius: 'var(--r)', padding: '16px', cursor: 'pointer' }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* New KP alert */}
      {newCount > 0 && (
        <div className="alert alert-warning" style={{ cursor: 'pointer' }} onClick={() => onNav('inbox')}>
          <span className="alert-icon">📥</span>
          <div>
            <strong>{newCount} новых КП от поставщиков</strong> ждут вашего ответа.{' '}
            <span style={{ color: '#92400E', fontWeight: 600, textDecoration: 'underline' }}>Перейти во входящие →</span>
          </div>
        </div>
      )}

      {/* Recent inbox */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Последние заявки</div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNav('inbox')}>Все →</button>
        </div>
        {inbox.slice(0, 3).map(msg => {
          const st = { new: { c: '#EF4444', l: 'Новое' }, read: { c: '#F59E0B', l: 'Прочитано' }, replied: { c: '#00A651', l: 'Отвечено' }, accepted: { c: '#00A651', l: 'Принято' }, rejected: { c: '#6B7280', l: 'Отклонено' } }[msg.status] || { c: '#6B7280', l: msg.status }
          return (
            <div key={msg.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{msg.subject}</div>
                <div style={{ fontSize: 11, color: 'var(--text-4)' }}>{msg.date} · {msg.category}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>{msg.price}</div>
                <span style={{ fontSize: 10, fontWeight: 700, color: st.c, background: `${st.c}18`, padding: '1px 6px', borderRadius: 100 }}>{st.l}</span>
              </div>
            </div>
          )
        })}
        {inbox.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-4)', fontSize: 13 }}>Заявок пока нет</div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {[
          { icon: '📋', title: 'Создать тендер', desc: 'Опубликуйте требования к поставщику', action: () => onNav('tenders'), color: '#8B5CF6' },
          { icon: '🔍', title: 'Найти поставщика', desc: 'Каталог с фильтрами по категории и региону', action: () => onNav('catalog'), color: '#3B82F6' },
          { icon: '📦', title: 'Найти продукт', desc: 'Поиск по 3-уровневым категориям', action: () => onNav('catalog'), color: '#00A651' },
        ].map(a => (
          <div
            key={a.title}
            onClick={a.action}
            className="card-hover"
            style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px', cursor: 'pointer', borderLeft: `3px solid ${a.color}` }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{a.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{a.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Analytics() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Статистика закупок</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { l: 'КП получено за месяц', v: '12', sub: '+3 за неделю' },
            { l: 'Принято КП', v: '4', sub: '33% конверсия' },
            { l: 'Активных поставщиков', v: '3', sub: 'В переговорах' },
            { l: 'Средний квант', v: '267 кг', sub: 'По принятым КП' },
          ].map(s => (
            <div key={s.l} style={{ background: 'var(--bg-2)', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>{s.v}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600 }}>{s.l}</div>
              <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="alert alert-info">
        <span className="alert-icon">ℹ️</span>
        <span>Расширенная аналитика с разбивкой по категориям, регионам и поставщикам — в следующей версии платформы.</span>
      </div>
    </div>
  )
}

export default function BuyerCabinet() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [activeBuyer, setActiveBuyer] = useState('b1')
  const [activeSection, setActiveSection] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getInbox } = useMessaging()

  const buyer = BUYERS.find(b => b.id === activeBuyer)

  function renderSection() {
    switch (activeSection) {
      case 'overview':  return <Overview buyer={buyer} onNav={setActiveSection} getInbox={getInbox} />
      case 'tenders':   return <BuyerTenders />
      case 'catalog':   return <BuyerCatalog />
      case 'inbox':     return <BuyerInbox buyerId={activeBuyer} />
      case 'analytics': return <Analytics />
      default:          return null
    }
  }

  const allInbox = getInbox(activeBuyer)
  const newCount = allInbox.filter(m => m.status === 'new').length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column' }}>
      {/* Account switcher bar */}
      <div style={{ background: '#1E3A8A', padding: '7px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 200, overflowX: 'auto' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.6)', whiteSpace: 'nowrap' }}>🏪 АККАУНТ СЕТИ:</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {BUYERS.map(b => (
            <button
              key={b.id}
              onClick={() => { setActiveBuyer(b.id); setActiveSection('overview') }}
              style={{
                padding: '4px 12px', borderRadius: 100, border: 'none', fontSize: 12, cursor: 'pointer',
                fontWeight: activeBuyer === b.id ? 700 : 400,
                background: activeBuyer === b.id ? '#3B82F6' : 'rgba(255,255,255,.1)',
                color: activeBuyer === b.id ? '#fff' : 'rgba(255,255,255,.7)',
                transition: 'all .18s', whiteSpace: 'nowrap',
              }}
            >
              {b.logo} {b.name}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: 'none', fontSize: 11, whiteSpace: 'nowrap' }}
            onClick={() => navigate('/cabinet')}
          >
            ↩ Кабинет поставщика
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Mobile overlay */}
        {isMobile && mobileMenuOpen && (
          <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 149 }} />
        )}

        {/* Sidebar */}
        {(!isMobile || mobileMenuOpen) && (
          <div style={isMobile ? { position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 150 } : {}}>
            <aside style={{ width: 220, background: '#fff', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 38, height: 'calc(100vh - 38px)', overflowY: 'auto', flexShrink: 0 }}>
              {/* Logo */}
              <div style={{ padding: '16px 14px 10px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🛒</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{buyer?.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-4)' }}>Кабинет закупщика</div>
                </div>
              </div>

              <nav style={{ flex: 1, padding: '8px' }}>
                {NAV.map(item => {
                  const isActive = activeSection === item.id
                  const badge = item.id === 'inbox' && newCount > 0 ? newCount : null
                  return (
                    <div
                      key={item.id}
                      onClick={() => { setActiveSection(item.id); if (isMobile) setMobileMenuOpen(false) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, background: isActive ? '#EFF6FF' : 'transparent', color: isActive ? '#1E40AF' : 'var(--text-3)', fontWeight: isActive ? 700 : 400, fontSize: 14, transition: 'all .15s' }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-2)' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                    >
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {badge && <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#EF4444', padding: '1px 6px', borderRadius: 100 }}>{badge}</span>}
                      {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1E40AF', flexShrink: 0 }} />}
                    </div>
                  )
                })}
              </nav>

              <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-4)', textAlign: 'center' }}>© 2026 Sale Tracker</div>
              </div>
            </aside>
          </div>
        )}

        {/* Main */}
        <main style={{ flex: 1, overflowX: 'hidden', minWidth: 0 }}>
          {/* Topbar */}
          <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', position: 'sticky', top: 38, zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {isMobile && (
                <button onClick={() => setMobileMenuOpen(v => !v)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: '4px 6px', color: 'var(--text)' }}>☰</button>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: isMobile ? 15 : 17 }}>{TITLES[activeSection]}</div>
                {!isMobile && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{buyer?.name} · Закупщик</div>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {newCount > 0 && (
                <button className="btn btn-sm" style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', fontSize: 12 }} onClick={() => setActiveSection('inbox')}>
                  📥 {newCount} новых КП
                </button>
              )}
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← На главную</button>
            </div>
          </div>

          <div style={{ padding: isMobile ? '16px 12px 48px' : '20px 24px 48px' }}>
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  )
}
