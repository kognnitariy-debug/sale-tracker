import { useState } from 'react'
import { CATEGORIES } from '../../data/categories'

const MOCK_TENDERS = [
  {
    id: 't1', type: 'tender', title: 'Молочная продукция — Q3 2026',
    category: 'dairy', sub: 'Молоко и сливки', segment: ['mid', 'premium'],
    regions: ['Москва', 'Санкт-Петербург'], rrc: true,
    quantum: '1 000 кг/нед', deadline: '2026-06-15',
    responses: 3, status: 'active',
    requirements: 'ГОСТ, срок годности не менее 14 дней, упаковка Tetra Pak 1л',
  },
  {
    id: 't2', type: 'pretender', title: 'Пред-тендер: хлеб и выпечка',
    category: 'bakery', sub: 'Все позиции', segment: ['premium'],
    regions: ['Москва'], rrc: true,
    quantum: '500 кг/нед', deadline: '2026-06-30',
    responses: 1, status: 'active',
    requirements: 'Натуральный состав, срок годности не менее 5 суток',
  },
]

function TenderCard({ tender, onViewResponses }) {
  const cat = CATEGORIES.find(c => c.id === tender.category)
  const isPreTender = tender.type === 'pretender'
  const segLabels = { economy: 'Эконом', mid: 'Средний', premium: 'Премиум' }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: isPreTender ? '#8B5CF6' : '#00A651', background: isPreTender ? '#EDE9FE' : '#E6F7EE', padding: '2px 8px', borderRadius: 100 }}>
              {isPreTender ? 'Пред-тендер' : 'Тендер'}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#00A651', background: '#E6F7EE', padding: '2px 8px', borderRadius: 100 }}>Активен</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{tender.title}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{tender.responses}</div>
          <div style={{ fontSize: 11, color: 'var(--text-4)' }}>откликов</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: 12 }}>
        {[
          { l: 'Категория', v: `${cat?.icon} ${cat?.name}` },
          { l: 'Подкатегория', v: tender.sub },
          { l: 'Квант', v: tender.quantum },
          { l: 'Дедлайн', v: tender.deadline },
          { l: 'Регионы', v: tender.regions.join(', ') },
          { l: 'РРЦ', v: tender.rrc ? '✓ Обязательно' : 'Не требуется' },
        ].map(r => (
          <div key={r.l} style={{ background: 'var(--bg-2)', borderRadius: 6, padding: '6px 10px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-4)' }}>{r.l}</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{r.v}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-3)', background: 'var(--bg-2)', borderRadius: 6, padding: '8px 12px', marginBottom: 14 }}>
        <strong>Требования:</strong> {tender.requirements}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-primary btn-sm" onClick={() => onViewResponses(tender)}>
          Посмотреть отклики ({tender.responses}) →
        </button>
        <button className="btn btn-ghost btn-sm">Редактировать</button>
        <button className="btn btn-ghost btn-sm" style={{ color: '#EF4444' }}>Закрыть</button>
      </div>
    </div>
  )
}

function CreateTenderModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    type: 'pretender', title: '', category: '', sub: '',
    segment: [], quantum: '', deadline: '', regions: [], rrc: false, requirements: '',
  })
  const cat = CATEGORIES.find(c => c.id === form.category)

  function set(key, val) { setForm(p => ({ ...p, [key]: val })) }
  function toggleArr(key, val) {
    setForm(p => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val],
    }))
  }

  function handleCreate() {
    if (!form.title || !form.category) return
    onCreate({ ...form, id: `t${Date.now()}`, responses: 0, status: 'active' })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 'var(--r-lg)', padding: '28px', width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Создать тендер / пред-тендер</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-3)' }}>✕</button>
        </div>

        <div className="form-group">
          <label className="label">Тип</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ id: 'pretender', label: 'Пред-тендер' }, { id: 'tender', label: 'Тендер' }].map(t => (
              <button key={t.id} onClick={() => set('type', t.id)} className="btn btn-sm" style={{ background: form.type === t.id ? 'var(--primary)' : 'var(--bg-2)', color: form.type === t.id ? '#fff' : 'var(--text-3)', border: 'none' }}>{t.label}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="label">Название <span className="req">*</span></label>
          <input className="input" placeholder="Например: Молочная продукция Q3 2026" value={form.title} onChange={e => set('title', e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="label">Категория <span className="req">*</span></label>
            <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">Выберите...</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Подкатегория</label>
            <select className="input" value={form.sub} onChange={e => set('sub', e.target.value)} disabled={!cat}>
              <option value="">Все позиции</option>
              {cat?.sub.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="label">Сегмент</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ id: 'economy', l: 'Эконом' }, { id: 'mid', l: 'Средний' }, { id: 'premium', l: 'Премиум' }].map(s => (
              <button key={s.id} onClick={() => toggleArr('segment', s.id)} className="btn btn-sm" style={{ background: form.segment.includes(s.id) ? 'var(--primary)' : 'var(--bg-2)', color: form.segment.includes(s.id) ? '#fff' : 'var(--text-3)', border: 'none' }}>{s.l}</button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="label">Квант поставки</label>
            <input className="input" placeholder="Например: 500 кг/нед" value={form.quantum} onChange={e => set('quantum', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Дедлайн откликов</label>
            <input className="input" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Регион поставок</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Москва', 'Санкт-Петербург', 'Новосибирск', 'Самара', 'Все регионы'].map(r => (
              <button key={r} onClick={() => toggleArr('regions', r)} className="btn btn-sm" style={{ background: form.regions.includes(r) ? 'var(--primary)' : 'var(--bg-2)', color: form.regions.includes(r) ? '#fff' : 'var(--text-3)', border: 'none' }}>{r}</button>
            ))}
          </div>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="rrc" checked={form.rrc} onChange={e => set('rrc', e.target.checked)} style={{ width: 16, height: 16 }} />
          <label htmlFor="rrc" style={{ fontSize: 14, cursor: 'pointer' }}>Обязательна доставка на РРЦ</label>
        </div>

        <div className="form-group">
          <label className="label">Требования к поставщику</label>
          <textarea className="input" rows={3} placeholder="Сертификаты, срок годности, упаковка..." value={form.requirements} onChange={e => set('requirements', e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Отмена</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={!form.title || !form.category}>Опубликовать</button>
        </div>
      </div>
    </div>
  )
}

export default function BuyerTenders() {
  const [tenders, setTenders] = useState(MOCK_TENDERS)
  const [showCreate, setShowCreate] = useState(false)
  const [created, setCreated] = useState(false)

  function handleCreate(t) {
    setTenders(p => [t, ...p])
    setCreated(true)
    setTimeout(() => setCreated(false), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showCreate && <CreateTenderModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}

      {/* Header */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Тендеры и пред-тендеры</div>
          <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Публикуйте требования — поставщики откликаются сами</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>+ Создать тендер</button>
      </div>

      {created && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          <span>Тендер опубликован. Поставщики из каталога получат уведомление.</span>
        </div>
      )}

      {/* Info block */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {[
          { icon: '📋', title: 'Пред-тендер', desc: 'Сбор предложений до оформления официального тендера. Без обязательств.' },
          { icon: '🏆', title: 'Тендер', desc: 'Официальный запрос с требованиями и дедлайном. Победитель получает контракт.' },
        ].map(b => (
          <div key={b.title} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24 }}>{b.icon}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tenders list */}
      {tenders.map(t => (
        <TenderCard key={t.id} tender={t} onViewResponses={() => {}} />
      ))}
    </div>
  )
}
