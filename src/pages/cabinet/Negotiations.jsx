import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FEATURES, NUDGES, PLAN_META, MOCK } from '../../data/plans'

const STAGES = [
  { id: 'new',            label: 'Новый',               color: '#9CA3AF' },
  { id: 'kp_sent',        label: 'КП отправлено',        color: '#3B82F6' },
  { id: 'waiting',        label: 'Ожидаем ответ',        color: '#F59E0B' },
  { id: 'zoom_scheduled', label: 'Zoom запланирован',    color: '#8B5CF6' },
  { id: 'contract',       label: 'Предв. договор',       color: '#00A651' },
]

function LockRow({ text, plan, why }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 6, cursor: 'pointer', opacity: 0.4, transition: 'all .18s', borderBottom: '1px dashed var(--border)' }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = '#FFFBEB' }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.background = 'transparent' } }}
        onClick={() => setOpen(v => !v)}
      >
        <span>🔒</span>
        <span style={{ fontSize: 14, color: 'var(--text-2)', flex: 1 }}>{text}</span>
        <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{open ? '▲' : '?'}</span>
      </div>
      {open && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '10px 14px', marginLeft: 8, marginBottom: 4, fontSize: 13, lineHeight: 1.6, color: 'var(--text-2)' }}>
          <div style={{ marginBottom: 8 }}>{why}</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E', background: '#FDE68A', padding: '2px 8px', borderRadius: 100 }}>Открывается: {plan}</span>
        </div>
      )}
    </div>
  )
}

const NETWORKS = ['Пятёрочка', 'Магнит', 'Лента', 'ВкусВилл', 'Дикси', 'Перекрёсток', 'О`кей', 'Ашан']

const INCOMING_REQUESTS = [
  { id: 1, network: 'ВкусВилл', type: 'Запрос образца', product: 'Молочная продукция', date: '23.05.2025', urgent: true },
  { id: 2, network: 'Лента', type: 'Запрос КП', product: 'Молоко 2,5%', date: '25.05.2025', urgent: false },
]

export default function Negotiations({ planId }) {
  const navigate = useNavigate()
  const f = FEATURES.interaction[planId]
  const nudge = NUDGES.communications[planId]
  const next = PLAN_META[PLAN_META[planId]?.next]
  const [selectedNeg, setSelectedNeg] = useState(null)
  const [showMailing, setShowMailing] = useState(false)

  const mailingsLabel = f.mailings === 999 ? 'безлимит' : f.mailings > 0 ? `до ${f.mailings}` : null
  const kpLabel = f.kpMonth === 999 ? 'безлимит' : f.kpMonth > 0 ? `до ${f.kpMonth}` : null
  const zoomLabel = f.zoom === 999 ? 'безлимит' : f.zoom > 0 ? `до ${f.zoom}` : null

  const chatDesc = {
    none:     'Чат заблокирован',
    inbound:  'При отклике + шаблоны',
    ai:       'Инициируемый + ИИ-суфлёр',
    managed:  'С менеджером + транскрипция',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Quick actions */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Инструменты коммуникации</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>

          {/* Mailing */}
          <button
            className={`btn btn-sm ${f.mailings > 0 ? 'btn-primary' : 'btn-ghost'}`}
            disabled={f.mailings === 0}
            onClick={() => setShowMailing(v => !v)}
          >
            📤 Рассылка карточки {mailingsLabel ? `(${mailingsLabel})` : '🔒'}
          </button>

          {/* КП */}
          <button
            className={`btn btn-sm ${f.kpMonth > 0 ? 'btn-outline' : 'btn-ghost'}`}
            disabled={f.kpMonth === 0}
          >
            📄 Отправить КП {kpLabel ? `(${kpLabel})` : '🔒'}
          </button>

          {/* Zoom */}
          <button
            className={`btn btn-sm ${f.zoom ? 'btn-outline' : 'btn-ghost'}`}
            disabled={!f.zoom}
            onClick={() => f.zoom && alert('Открывается форма бронирования Zoom-встречи с закупщиком')}
            title={!f.zoom ? 'Доступно в Сетевом отделе' : undefined}
          >
            🎥 Zoom-встреча {zoomLabel ? `(${zoomLabel})` : '🔒'}
          </button>

          {/* Chat */}
          <button
            className="btn btn-ghost btn-sm"
            disabled={f.chat === 'none'}
            title={chatDesc[f.chat]}
          >
            💬 {f.chat === 'none' ? 'Чат 🔒' : f.chat === 'ai' ? 'Чат + ИИ-суфлёр' : f.chat === 'managed' ? 'Чат с менеджером' : 'Написать закупщику'}
          </button>
        </div>

        {/* Zoom preview for free/online */}
        {!f.zoom && (
          <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 24 }}>🎥</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-3)' }}>Zoom-переговоры с закупщиком — доступно в «Сетевой отдел»</div>
              <div style={{ fontSize: 12, color: 'var(--text-4)' }}>Живой разговор + ИИ-анализ записи + рекомендации после встречи · до 3 встреч, безлимит в Офисе продаж</div>
            </div>
          </div>
        )}

        {/* Mailing form */}
        {showMailing && f.mailings > 0 && (
          <div style={{ marginTop: 16, padding: '16px', background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
              Рассылка карточки товара {f.mailings === 999 ? '— безлимит' : `— до ${f.mailings} сетей`}
            </div>
            <div className="form-group">
              <label className="label">Товар</label>
              <select className="input">
                <option>Молоко пастеризованное 2,5%, 1л</option>
                <option>Кефир 2,5%, 1л</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Выберите сети {f.mailings !== 999 ? `(до ${f.mailings})` : ''}</label>
              <div className="pill-group">
                {NETWORKS.map(n => <div key={n} className="pill">{n}</div>)}
              </div>
            </div>
            {f.mailings === 5 && (
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>
                💡 Если сеть откликнулась — можно докупить встречу в формате ЦЗС
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary btn-sm">Отправить рассылку</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowMailing(false)}>Отмена</button>
            </div>
          </div>
        )}
      </div>

      {/* Incoming requests from networks */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Входящие запросы от сетей</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
              {f.requests === 'direct' ? 'Получаете все запросы — отвечать без шаблонов'
                : f.requests === 10 ? 'До 10 откликов + шаблоны ответа под каждый тип сети'
                : 'Безлимит + ИИ-рекомендация приоритетных запросов'}
            </div>
          </div>
          {INCOMING_REQUESTS.length > 0 && (
            <span style={{ fontSize: 12, fontWeight: 700, color: '#EF4444', background: '#FEF2F2', padding: '3px 10px', borderRadius: 100 }}>
              {INCOMING_REQUESTS.length} новых
            </span>
          )}
        </div>
        {INCOMING_REQUESTS.map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.urgent ? '#EF4444' : '#F59E0B', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.network} · {r.type}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{r.product} · {r.date}</div>
            </div>
            {r.urgent && <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 700 }}>Срочно</span>}
            <div style={{ display: 'flex', gap: 8 }}>
              {f.requests !== 'direct' && <button className="btn btn-outline btn-sm" style={{ fontSize: 12 }}>Шаблон ответа</button>}
              <button className="btn btn-primary btn-sm" style={{ fontSize: 12 }}>Ответить →</button>
            </div>
          </div>
        ))}
        <div style={{ padding: '12px 0', color: 'var(--text-4)', fontSize: 13 }}>+ Новые запросы появятся здесь автоматически</div>
      </div>

      {/* Negotiations list */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0', fontWeight: 700, fontSize: 15 }}>Мои переговоры</div>
        {/* Stage pipeline */}
        <div style={{ display: 'flex', gap: 0, padding: '12px 20px', overflowX: 'auto' }}>
          {STAGES.map((st, i) => (
            <div key={st.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ padding: '4px 12px', borderRadius: 100, background: `${st.color}15`, color: st.color, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: `1px solid ${st.color}40` }}>
                {st.label}
                <span style={{ marginLeft: 6, background: st.color, color: '#fff', borderRadius: 100, padding: '1px 6px', fontSize: 10 }}>
                  {MOCK.negotiations.filter(n => n.stage === st.id).length}
                </span>
              </div>
              {i < STAGES.length - 1 && <span style={{ margin: '0 6px', color: 'var(--border)', fontSize: 18 }}>›</span>}
            </div>
          ))}
        </div>
        <div className="divider" style={{ margin: 0 }} />
        <div>
          {MOCK.negotiations.map(n => {
            const stage = STAGES.find(s => s.id === n.stage) || STAGES[0]
            const isOpen = selectedNeg === n.id
            return (
              <div key={n.id}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setSelectedNeg(isOpen ? null : n.id)}
                >
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: stage.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{n.network}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{n.product} · {n.responsible}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: stage.color, background: `${stage.color}15`, padding: '2px 8px', borderRadius: 100 }}>
                      {stage.label}
                    </span>
                    <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4 }}>{n.date}</div>
                  </div>
                  <span style={{ color: 'var(--text-4)', fontSize: 14 }}>{isOpen ? '▲' : '▼'}</span>
                </div>
                {isOpen && (
                  <div style={{ padding: '14px 20px 16px 44px', background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>💬 {n.comment}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {f.zoom && <button className="btn btn-primary btn-sm">🎥 Назначить Zoom</button>}
                      <button className="btn btn-outline btn-sm" disabled={f.kpMonth === 0}>📄 Отправить КП</button>
                      {f.chat !== 'none' && <button className="btn btn-outline btn-sm">💬 Написать</button>}
                      {f.contracts !== 'template' && <button className="btn btn-ghost btn-sm">📋 Договор о намерениях</button>}
                      <button className="btn btn-ghost btn-sm">📋 История</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, opacity: 0.5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-3)' }}>+ Новые переговоры появятся здесь</div>
              <div style={{ fontSize: 12, color: 'var(--text-4)' }}>После рассылки или отклика от сети</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contracts / Letters of Intent */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Договоры о намерениях</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>
          {f.contracts === 'template' ? 'Шаблон договора — для ознакомления'
            : f.contracts === 'on_reply' ? 'Активируется при отклике сети на КП'
            : f.contracts === 'full' ? 'Полный доступ + уведомления об изменении статуса сделки'
            : 'Гарантированный + сопровождение до подписания по технологии платформы'}
        </div>
        {f.contracts === 'template' ? (
          <div>
            <div style={{ padding: '12px 14px', background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center', opacity: 0.6 }}>
              <span style={{ fontSize: 20 }}>📋</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-3)' }}>Образец договора о намерениях</div>
                <div style={{ fontSize: 12, color: 'var(--text-4)' }}>Ознакомительная версия · Подписание недоступно</div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>Посмотреть</button>
            </div>
            <LockRow text="Электронное подписание договора о намерениях" plan="Онлайн продавец · 50 000 ₽" why="Договор о намерениях фиксирует интерес сети — юридически не обязывает, но создаёт психологическое обязательство. Закупщик реже «пропадает» после его подписания." />
          </div>
        ) : (
          <div>
            {[
              { network: 'Пятёрочка', product: 'Молоко 2,5%', status: 'signed', date: '14.05.2025' },
              { network: 'Магнит', product: 'Кефир 2,5%', status: 'pending', date: '20.05.2025' },
            ].map(c => (
              <div key={c.network} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 18 }}>📋</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.network} · {c.product}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.date}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.status === 'signed' ? '#00A651' : '#F59E0B', background: c.status === 'signed' ? '#E6F7EE' : '#FFFBEB', padding: '2px 8px', borderRadius: 100 }}>
                  {c.status === 'signed' ? '✓ Подписан' : '⏳ На подписании'}
                </span>
                {f.contracts === 'guaranteed' && c.status === 'pending' && (
                  <button className="btn btn-sm" style={{ background: '#F59E0B', color: '#fff', border: 'none', fontSize: 12 }}>Сопровождение →</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Locked features */}
      {(f.kpMonth === 0 || !f.zoom || f.chat === 'none') && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: 'var(--text-2)' }}>Доступно на следующем уровне</div>
          {f.kpMonth === 0 && <LockRow text="Отправка КП в торговые сети" plan="Онлайн продавец · 50 000 ₽" why="Без верификации КП не отправляется. С Онлайн продавцом — до 5 КП в месяц с ИИ-проверкой на соответствие требованиям сетей." />}
          {!f.zoom && <LockRow text="Zoom-переговоры с закупщиком + ИИ-анализ записи" plan="Сетевой отдел · 150 000 ₽" why="Живой разговор конвертирует в 5 раз лучше, чем email. После встречи ИИ анализирует запись и даёт рекомендации что сказать в следующий раз." />}
          {f.chat === 'none' && <LockRow text="Чат с закупщиком" plan="Онлайн продавец · 50 000 ₽" why="Прямое сообщение закупщику при его отклике — быстро и без посредников." />}
        </div>
      )}

      {/* Upgrade nudge */}
      {nudge && next && (
        <div style={{ background: `${next.color}10`, border: `1px solid ${next.color}40`, borderRadius: 'var(--r)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: next.color, marginBottom: 4 }}>🔥 {next.label}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{nudge.text}</div>
            {nudge.sub && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{nudge.sub}</div>}
          </div>
          <button className="btn btn-sm" style={{ background: next.color, color: '#fff', border: 'none' }} onClick={() => navigate('/payment')}>
            {next.priceLabel} →
          </button>
        </div>
      )}
    </div>
  )
}
