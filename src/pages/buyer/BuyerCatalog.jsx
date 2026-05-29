import { useState } from 'react'
import { CATEGORIES, REGIONS, SEGMENTS } from '../../data/categories'
import { SUPPLIERS, MOCK_PRODUCTS } from '../../data/accounts'

const SEG_COLORS = { economy: '#6B7280', mid: '#3B82F6', premium: '#F59E0B' }
const SEG_LABELS = { economy: 'Эконом', mid: 'Средний', premium: 'Премиум' }

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px', borderRadius: 100, border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
        background: active ? 'var(--primary-light)' : '#fff', color: active ? 'var(--primary-dark)' : 'var(--text-3)',
        fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
      }}
    >
      {label}
    </button>
  )
}

function ProductCard({ product, onSendRequest }) {
  const supplier = SUPPLIERS.find(s => s.id === product.supplierId)
  const cat = CATEGORIES.find(c => c.id === product.category)
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{product.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-4)' }}>{cat?.name}</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: SEG_COLORS[product.segment], background: `${SEG_COLORS[product.segment]}18`, padding: '2px 8px', borderRadius: 100, whiteSpace: 'nowrap' }}>
          {SEG_LABELS[product.segment]}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {[
          { l: 'Цена', v: `${product.price} ₽/${product.unit}` },
          { l: 'Квант', v: `${product.quantum} кг` },
          { l: 'Регион', v: product.region },
          { l: 'РРЦ', v: product.rrc ? '✓ Да' : '✗ Нет' },
        ].map(r => (
          <div key={r.l} style={{ background: 'var(--bg-2)', borderRadius: 6, padding: '6px 8px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-4)' }}>{r.l}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{r.v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: 16 }}>{supplier?.logo}</span>
        <div style={{ flex: 1, fontSize: 12, color: 'var(--text-3)' }}>
          {supplier?.name}
          {supplier?.verified && <span style={{ color: 'var(--primary)', marginLeft: 6 }}>✓</span>}
        </div>
      </div>

      <button className="btn btn-primary btn-sm btn-block" onClick={() => onSendRequest(product)}>
        Запросить КП →
      </button>
    </div>
  )
}

function SupplierCard({ supplier }) {
  const cats = supplier.categories.map(c => CATEGORIES.find(cat => cat.id === c)?.name).filter(Boolean)
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 32 }}>{supplier.logo}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{supplier.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-4)' }}>{supplier.region}</div>
        </div>
        {supplier.verified && (
          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: 100 }}>✓ Верифицирован</span>
        )}
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>{supplier.description}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {cats.map(c => <span key={c} style={{ fontSize: 11, color: 'var(--text-3)', background: 'var(--bg-3)', padding: '2px 8px', borderRadius: 100 }}>{c}</span>)}
        <span style={{ fontSize: 11, color: SEG_COLORS[supplier.segment], background: `${SEG_COLORS[supplier.segment]}18`, padding: '2px 8px', borderRadius: 100 }}>
          {SEG_LABELS[supplier.segment]}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-4)' }}>
        <span>👥 {supplier.employees} сотр.</span>
        <span>📅 С {supplier.founded} г.</span>
        <span>🏢 ИНН {supplier.inn}</span>
      </div>
      <button className="btn btn-outline btn-sm btn-block">Посмотреть профиль →</button>
    </div>
  )
}

export default function BuyerCatalog() {
  const [tab, setTab] = useState('products')
  const [search, setSearch] = useState('')
  const [selCat, setSelCat] = useState(null)
  const [selSub, setSelSub] = useState(null)
  const [selSeg, setSelSeg] = useState(null)
  const [selRegion, setSelRegion] = useState(null)
  const [rrcOnly, setRrcOnly] = useState(false)
  const [expandedCat, setExpandedCat] = useState(null)
  const [requestSent, setRequestSent] = useState(null)

  const cat = CATEGORIES.find(c => c.id === selCat)

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (selCat && p.category !== selCat) return false
    if (selSub && p.sub !== selSub) return false
    if (selSeg && p.segment !== selSeg) return false
    if (selRegion && p.region !== selRegion) return false
    if (rrcOnly && !p.rrc) return false
    return true
  })

  const filteredSuppliers = SUPPLIERS.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false
    if (selCat && !s.categories.includes(selCat)) return false
    if (selSeg && s.segment !== selSeg) return false
    if (selRegion && s.region !== selRegion) return false
    return true
  })

  function handleRequest(product) {
    setRequestSent(product.id)
    setTimeout(() => setRequestSent(null), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-3)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[{ id: 'products', label: '📦 Продукты' }, { id: 'suppliers', label: '🏭 Поставщики' }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? 'var(--text)' : 'var(--text-4)',
              boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
              transition: 'all .15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        className="input"
        placeholder={tab === 'products' ? '🔍 Поиск по наименованию продукта...' : '🔍 Поиск по названию или описанию поставщика...'}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Left: category tree */}
        <div style={{ width: 220, flexShrink: 0, background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '12px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '0 14px 8px' }}>Категории</div>
          <div
            onClick={() => { setSelCat(null); setSelSub(null) }}
            style={{ padding: '7px 14px', cursor: 'pointer', fontSize: 13, fontWeight: !selCat ? 700 : 400, color: !selCat ? 'var(--primary-dark)' : 'var(--text-2)', background: !selCat ? 'var(--primary-light)' : 'transparent', borderLeft: !selCat ? '3px solid var(--primary)' : '3px solid transparent' }}
          >
            Все категории
          </div>
          {CATEGORIES.map(c => (
            <div key={c.id}>
              <div
                onClick={() => { setExpandedCat(expandedCat === c.id ? null : c.id); setSelCat(c.id); setSelSub(null) }}
                style={{ padding: '7px 14px', cursor: 'pointer', fontSize: 13, fontWeight: selCat === c.id ? 700 : 400, color: selCat === c.id ? 'var(--primary-dark)' : 'var(--text-2)', background: selCat === c.id ? 'var(--primary-light)' : 'transparent', borderLeft: selCat === c.id ? '3px solid var(--primary)' : '3px solid transparent', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>{c.icon}</span>
                <span style={{ flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{expandedCat === c.id ? '▲' : '▼'}</span>
              </div>
              {expandedCat === c.id && c.sub.map(s => (
                <div
                  key={s.id}
                  onClick={() => { setSelCat(c.id); setSelSub(s.id) }}
                  style={{ padding: '5px 14px 5px 30px', cursor: 'pointer', fontSize: 12, color: selSub === s.id ? 'var(--primary)' : 'var(--text-3)', fontWeight: selSub === s.id ? 600 : 400, background: selSub === s.id ? '#F0FBF5' : 'transparent' }}
                >
                  {s.name}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right: filters + results */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Filters */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '12px 16px', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 700, flexShrink: 0 }}>СЕГМЕНТ:</span>
              <FilterChip label="Все" active={!selSeg} onClick={() => setSelSeg(null)} />
              {SEGMENTS.map(s => <FilterChip key={s.id} label={s.label} active={selSeg === s.id} onClick={() => setSelSeg(selSeg === s.id ? null : s.id)} />)}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 700, flexShrink: 0 }}>РЕГИОН:</span>
              <FilterChip label="Все" active={!selRegion} onClick={() => setSelRegion(null)} />
              {['Москва', 'Санкт-Петербург', 'Новосибирск', 'Самара', 'Екатеринбург'].map(r => (
                <FilterChip key={r} label={r} active={selRegion === r} onClick={() => setSelRegion(selRegion === r ? null : r)} />
              ))}
            </div>
            {tab === 'products' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 700 }}>ДОСТАВКА НА РРЦ:</span>
                <FilterChip label="Только с РРЦ" active={rrcOnly} onClick={() => setRrcOnly(v => !v)} />
              </div>
            )}
          </div>

          {/* Success toast */}
          {requestSent && (
            <div className="alert alert-success" style={{ marginBottom: 12 }}>
              <span className="alert-icon">✅</span>
              <span>Запрос КП отправлен поставщику. Ждите ответа в течение 24 часов.</span>
            </div>
          )}

          {/* Results count */}
          <div style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 10 }}>
            Найдено: {tab === 'products' ? filteredProducts.length : filteredSuppliers.length} {tab === 'products' ? 'позиций' : 'поставщиков'}
          </div>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {tab === 'products'
              ? filteredProducts.map(p => <ProductCard key={p.id} product={p} onSendRequest={handleRequest} />)
              : filteredSuppliers.map(s => <SupplierCard key={s.id} supplier={s} />)
            }
          </div>

          {tab === 'products' && filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-4)' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
              <div>Ничего не найдено. Попробуйте изменить фильтры.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
