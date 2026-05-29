import { useState } from 'react'
import { useMessaging } from '../../context/MessagingContext'
import { SUPPLIERS, BUYERS } from '../../data/accounts'

const STATUS = {
  new:     { label: 'Новое',     color: '#EF4444', bg: '#FEF2F2' },
  read:    { label: 'Прочитано', color: '#F59E0B', bg: '#FFFBEB' },
  replied: { label: 'Отвечено', color: '#00A651', bg: '#E6F7EE' },
  accepted:{ label: 'Принято',  color: '#00A651', bg: '#E6F7EE' },
  rejected:{ label: 'Отклонено',color: '#6B7280', bg: '#F3F4F6' },
}

function MsgCard({ msg, buyerId, onUpdateStatus, onSendZoom }) {
  const [open, setOpen] = useState(msg.status === 'new')
  const [zoomSent, setZoomSent] = useState(false)
  const supplier = SUPPLIERS.find(s => s.id === msg.from)
  const st = STATUS[msg.status] || STATUS.new

  function handleOpen() {
    setOpen(v => !v)
    if (msg.status === 'new') onUpdateStatus(msg.id, 'read')
  }

  function handleZoom() {
    onUpdateStatus(msg.id, 'replied')
    onSendZoom(msg)
    setZoomSent(true)
  }

  return (
    <div style={{ background: '#fff', border: `1px solid ${msg.status === 'new' ? '#FECACA' : 'var(--border)'}`, borderRadius: 'var(--r)', overflow: 'hidden', transition: 'border-color .2s' }}>
      {/* Header row */}
      <div
        onClick={handleOpen}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', cursor: 'pointer', background: msg.status === 'new' ? '#FEF2F2' : '#fff' }}
      >
        <div style={{ fontSize: 24, flexShrink: 0 }}>{supplier?.logo || '📦'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{supplier?.name || msg.from}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, padding: '2px 8px', borderRadius: 100 }}>{st.label}</span>
            {msg.rrc && <span style={{ fontSize: 11, color: '#3B82F6', background: '#EFF6FF', padding: '2px 8px', borderRadius: 100 }}>✓ РРЦ</span>}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</div>
          <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 1 }}>{msg.date} · {msg.category} · {msg.region}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)' }}>{msg.price}</div>
          <div style={{ fontSize: 11, color: 'var(--text-4)' }}>Квант: {msg.quantum}</div>
        </div>
        <span style={{ color: 'var(--text-4)', fontSize: 18, marginLeft: 4 }}>{open ? '▲' : '▼'}</span>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--border)' }}>
          {/* Supplier info */}
          <div style={{ background: 'var(--bg-2)', borderRadius: 8, padding: '10px 14px', margin: '14px 0 12px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { l: 'ИНН', v: supplier?.inn },
              { l: 'Регион', v: supplier?.region },
              { l: 'Сегмент', v: { economy: 'Эконом', mid: 'Средний', premium: 'Премиум' }[msg.segment] },
              { l: 'Статус', v: supplier?.verified ? '✓ Верифицирован' : 'Не верифицирован' },
            ].map(r => (
              <div key={r.l}>
                <div style={{ fontSize: 11, color: 'var(--text-4)' }}>{r.l}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.v || '—'}</div>
              </div>
            ))}
          </div>

          {/* Body */}
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 16 }}>{msg.body}</p>

          {/* Actions */}
          {msg.status !== 'accepted' && msg.status !== 'rejected' && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onUpdateStatus(msg.id, 'accepted')}
              >
                ✓ Принять КП
              </button>
              <button
                className="btn btn-sm"
                style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }}
                onClick={handleZoom}
                disabled={zoomSent}
              >
                🎥 {zoomSent ? 'Zoom запрошен ✓' : 'Запросить Zoom'}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onUpdateStatus(msg.id, 'rejected')}
              >
                ✕ Отклонить
              </button>
            </div>
          )}
          {(msg.status === 'accepted' || msg.status === 'replied') && (
            <div className="alert alert-success" style={{ marginTop: 0 }}>
              <span className="alert-icon">✅</span>
              <span>
                {msg.status === 'accepted'
                  ? 'КП принято. Поставщику отправлено уведомление.'
                  : `Запрос на Zoom отправлен ${supplier?.name}. Уведомление появится в разделе «Входящие запросы от сетей» в кабинете поставщика.`}
              </span>
            </div>
          )}
          {msg.status === 'rejected' && (
            <div className="alert" style={{ background: '#F3F4F6', border: '1px solid var(--border)', marginTop: 0 }}>
              <span className="alert-icon">✕</span>
              <span style={{ color: 'var(--text-3)' }}>КП отклонено.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function BuyerInbox({ buyerId }) {
  const { getInbox, updateStatus, sendMessage } = useMessaging()
  const inbox = getInbox(buyerId)
  const [filter, setFilter] = useState('all')
  const buyer = BUYERS.find(b => b.id === buyerId)

  function handleSendZoom(msg) {
    sendMessage({
      from: buyerId,
      to: msg.from,
      type: 'zoom_request',
      subject: `Запрос Zoom-встречи: ${msg.productName}`,
      productName: msg.productName,
      category: msg.category,
      body: `${buyer?.name} (${buyer?.stores?.toLocaleString()} магазинов) хочет назначить Zoom-встречу по вашему КП на "${msg.productName}". Контакт: ${buyer?.contact}.`,
      urgent: true,
    })
  }

  const filtered = filter === 'all' ? inbox : inbox.filter(m => m.status === filter)
  const newCount = inbox.filter(m => m.status === 'new').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Входящие заявки от поставщиков</div>
            {newCount > 0 && (
              <div style={{ fontSize: 13, color: '#EF4444', marginTop: 2 }}>🔴 {newCount} новых КП</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'all', label: `Все (${inbox.length})` },
              { id: 'new', label: `Новые (${inbox.filter(m => m.status === 'new').length})` },
              { id: 'accepted', label: 'Принятые' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="btn btn-sm"
                style={{
                  background: filter === f.id ? 'var(--primary)' : 'var(--bg-2)',
                  color: filter === f.id ? '#fff' : 'var(--text-3)',
                  border: 'none',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 600, color: 'var(--text-3)' }}>Нет заявок в этой категории</div>
        </div>
      ) : (
        filtered.map(msg => (
          <MsgCard key={msg.id} msg={msg} buyerId={buyerId} onUpdateStatus={updateStatus} onSendZoom={handleSendZoom} />
        ))
      )}
    </div>
  )
}
