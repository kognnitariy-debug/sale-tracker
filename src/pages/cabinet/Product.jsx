import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FEATURES, NUDGES, PLAN_META, MOCK } from '../../data/plans'

function StatusBadge({ status }) {
  const map = { active: ['Активна', '#00A651'], draft: ['Черновик', '#6B7280'], pending: ['На проверке', '#F59E0B'] }
  const [label, color] = map[status] || ['—', '#ccc']
  return <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}15`, padding: '2px 8px', borderRadius: 100 }}>{label}</span>
}

function LockFeature({ text, plan, why }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 6, cursor: 'pointer', opacity: 0.4, transition: 'all .18s' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => { if (!open) e.currentTarget.style.opacity = '0.4' }}
        onClick={() => setOpen(v => !v)}
      >
        <span style={{ fontSize: 14 }}>🔒</span>
        <span style={{ fontSize: 14, color: 'var(--text-2)', flex: 1 }}>{text}</span>
        <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{open ? '▲' : '?'}</span>
      </div>
      {open && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '10px 14px', marginLeft: 8, marginBottom: 4, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
          <div style={{ marginBottom: 8 }}>{why}</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E', background: '#FDE68A', padding: '2px 8px', borderRadius: 100 }}>
            Открывается: {plan}
          </span>
        </div>
      )}
    </div>
  )
}

export default function Product({ planId }) {
  const navigate = useNavigate()
  const f = FEATURES.product[planId]
  const nudge = NUDGES.product[planId]
  const next = PLAN_META[PLAN_META[planId]?.next]
  const visibleProducts = MOCK.products.slice(0, f.cards)
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Quota bar */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>📦 Карточки товаров</div>
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Квота: {visibleProducts.length} / {f.cards}</span>
        </div>
        <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 100, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ height: '100%', background: 'var(--primary)', width: `${(visibleProducts.length / f.cards) * 100}%`, borderRadius: 100, transition: 'width .3s' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-sm"
            disabled={visibleProducts.length >= f.cards}
            onClick={() => setShowAddForm(v => !v)}
          >
            + Добавить товар
          </button>
          {visibleProducts.length >= f.cards && (
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/payment')}>
              Увеличить квоту →
            </button>
          )}
        </div>
      </div>

      {/* Add form mock */}
      {showAddForm && (
        <div style={{ background: '#fff', border: '1px solid var(--primary)', borderRadius: 'var(--r)', padding: '20px' }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Новая карточка товара</div>
          <div className="form-row">
            <div className="form-group"><label className="label">Название товара <span className="req">*</span></label><input className="input" placeholder="Молоко пастеризованное 2,5%, 1л" /></div>
            <div className="form-group"><label className="label">Категория</label><input className="input" placeholder="Молочная продукция" /></div>
          </div>
          <div className="form-group"><label className="label">Описание</label><textarea className="input" placeholder="Краткое описание продукта..." /></div>
          <div className="form-row">
            <div className="form-group"><label className="label">Цена от (₽/ед)</label><input className="input" type="number" placeholder="68" /></div>
            <div className="form-group"><label className="label">Объём производства</label><input className="input" placeholder="120 000 шт/мес" /></div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary btn-sm">Сохранить карточку</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAddForm(false)}>Отмена</button>
          </div>
        </div>
      )}

      {/* Product cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {visibleProducts.map(p => (
          <div key={p.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, flex: 1 }}>{p.name}</div>
              <StatusBadge status={p.status} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>{p.category}</div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text-4)' }}>Цена от</div><div style={{ fontWeight: 700, fontSize: 14 }}>{p.price} ₽/{p.unit}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-4)' }}>Просмотры</div><div style={{ fontWeight: 700, fontSize: 14 }}>{p.views}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-4)' }}>В сетях</div><div style={{ fontWeight: 700, fontSize: 14 }}>{p.networks}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>Редактировать</button>
              <button className="btn btn-primary btn-sm">КП →</button>
            </div>
            {/* Visibility indicator */}
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              {f.visible
                ? <><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00A651', display: 'inline-block' }} /><span style={{ fontSize: 11, color: 'var(--primary)' }}>Видим закупщикам</span></>
                : <><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9CA3AF', display: 'inline-block' }} /><span style={{ fontSize: 11, color: 'var(--text-4)' }}>Только по точному названию</span></>
              }
              {f.recommend && <><span style={{ fontSize: 11, color: 'var(--text-4)' }}>·</span><span style={{ fontSize: 11, color: '#3B82F6' }}>В рекомендациях ИИ</span></>}
            </div>
          </div>
        ))}

        {/* Locked slots */}
        {Array.from({ length: Math.max(0, f.cards - visibleProducts.length - (showAddForm ? 1 : 0)) }).map((_, i) => (
          <div key={`empty-${i}`} style={{ background: 'var(--bg-2)', border: '1.5px dashed var(--border)', borderRadius: 'var(--r)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120, cursor: 'pointer' }} onClick={() => setShowAddForm(true)}>
            <div style={{ textAlign: 'center', color: 'var(--text-4)' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>+</div>
              <div style={{ fontSize: 13 }}>Добавить товар</div>
            </div>
          </div>
        ))}
      </div>

      {/* Visibility in catalog — row 7 */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Видимость в поиске закупщиков</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
          {planId === 'free'    && 'Анонимный запрос — закупщик находит вашу категорию, но не видит вас'}
          {planId === 'online'  && 'Категория 1-го уровня + конкретные сети видят вашу карточку'}
          {planId === 'network' && 'Все уровни категории + видите, какие конкретные сети ищут ваш продукт'}
          {planId === 'office'  && 'Все уровни категории + приоритет в выдаче + персональный показ целевым закупщикам'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Видимость по точному названию', active: true },
            { label: 'Видимость по категории 1-го уровня', active: ['online','network','office'].includes(planId), plan: 'Онлайн продавец', why: 'Закупщик ищет «молоко Московская область» — вы появляетесь в выдаче. Без этого — только точное название.' },
            { label: 'Видимость по всем уровням категории + кто смотрел', active: ['network','office'].includes(planId), plan: 'Сетевой отдел', why: 'Вы видите, какие конкретные сети просматривали ваш продукт — и можете инициировать контакт первыми.' },
            { label: 'Приоритет в выдаче + персональный показ', active: planId === 'office', plan: 'Офис продаж', why: 'Ваш продукт выделен в результатах и показывается целевым закупщикам даже при нерелевантном запросе.' },
          ].map(item => (
            <div
              key={item.label}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 'var(--r-sm)', background: item.active ? 'var(--primary-light)' : 'var(--bg-2)', opacity: item.active ? 1 : 0.5, cursor: !item.active ? 'pointer' : 'default' }}
              onClick={() => !item.active && item.plan && alert(`Доступно: ${item.plan}\n\n${item.why}`)}
            >
              <span style={{ fontSize: 14 }}>{item.active ? '✅' : '🔒'}</span>
              <span style={{ fontSize: 13, flex: 1, color: item.active ? 'var(--primary-dark)' : 'var(--text-3)', fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
              {!item.active && item.plan && <span style={{ fontSize: 11, color: 'var(--text-4)', whiteSpace: 'nowrap' }}>{item.plan}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Locked features */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: 'var(--text-2)' }}>Дополнительные возможности карточки</div>
        {!f.recommend && (
          <LockFeature
            text="Попадание в рекомендательную систему ИИ + статистика кликов"
            plan="Сетевой отдел · 150 000 ₽"
            why="ИИ автоматически предлагает ваш товар закупщикам, которые ищут похожую продукцию. Вы также видите, кто конкретно кликал на вашу карточку."
          />
        )}
        {f.recommend && (
          <div style={{ padding: '8px 10px', borderRadius: 6, background: 'var(--primary-light)', marginBottom: 4, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>✅</span>
            <span style={{ fontSize: 14, color: 'var(--primary-dark)', fontWeight: 600 }}>В рекомендательной системе ИИ {f.abTest ? '+ A/B-тест двух версий карточки' : ''}</span>
          </div>
        )}
        {!f.abTest && f.recommend && (
          <LockFeature
            text="A/B-тест двух версий карточки"
            plan="Сетевой отдел · 150 000 ₽"
            why="Запускаете два варианта карточки и платформа определяет, какая конвертирует лучше. Автоматическая оптимизация без вашего участия."
          />
        )}
        {!f.expertReview && (
          <LockFeature
            text="Ручная доработка карточек командой платформы"
            plan="Офис продаж · 250 000 ₽"
            why="Эксперты платформы лично дорабатывают ваши карточки по стандартам конкретных сетей. Карточка выглядит как у топ-поставщиков категории."
          />
        )}
      </div>

      {/* KP section — rows 8, visibility */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>📄 Коммерческие предложения</div>
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
            {f.kp > 1 ? `Квота: ${MOCK.kp.length} / ${f.kp} шт` : `${MOCK.kp.length} / ${f.kp} КП`}
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
          {planId === 'free'    && '1 КП + примеры успешных КП по категории (анонимно)'}
          {planId === 'online'  && '5 КП + ИИ-проверка на соответствие требованиям сетей'}
          {planId === 'network' && '15 КП + автопроверка + сравнение с топ-КП категории · автоповтор незакрытым сетям'}
          {planId === 'office'  && '15 КП + персональная доработка экспертом платформы + ручной дожим закупщика менеджером'}
        </div>

        {/* КП visibility */}
        <div style={{ padding: '10px 14px', background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', marginBottom: 14, fontSize: 13, color: 'var(--text-2)' }}>
          <span style={{ fontWeight: 600 }}>Видимость КП: </span>
          {planId === 'free'    && 'Анонимный запрос — сколько раз искали категорию за месяц'}
          {planId === 'online'  && 'Категория 1-го уровня + конкретные сети'}
          {planId === 'network' && 'Все уровни категории + видите, какие сети просматривали КП'}
          {planId === 'office'  && 'Все уровни + приоритет в выдаче + персональная аналитика'}
        </div>

        {f.kpCheck && (
          <div style={{ padding: '10px 14px', background: '#EFF6FF', borderRadius: 'var(--r-sm)', marginBottom: 14, fontSize: 13, color: '#1E40AF', border: '1px solid #BFDBFE' }}>
            🤖 {f.kpCheck === 'ai' ? 'ИИ автоматически проверяет КП на соответствие требованиям сети перед отправкой' : 'Эксперт платформы лично проверяет и дорабатывает КП по стандартам конкретной сети'}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MOCK.kp.map(kp => (
            <div key={kp.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 20 }}>📄</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{kp.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{kp.network} · {kp.date}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: kp.status === 'viewed' ? '#00A651' : '#3B82F6', background: kp.status === 'viewed' ? '#E6F7EE' : '#EFF6FF', padding: '2px 8px', borderRadius: 100 }}>
                {kp.status === 'viewed' ? '👁 Просмотрено' : '📤 Отправлено'}
              </span>
              <button className="btn btn-ghost btn-sm">Открыть</button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button className="btn btn-outline btn-sm" disabled={MOCK.kp.length >= f.kp}>+ Создать КП</button>
          {planId === 'free' && (
            <button className="btn btn-ghost btn-sm">Примеры КП →</button>
          )}
        </div>
      </div>

      {/* Upgrade nudge */}
      {nudge && next && (
        <div style={{ background: `${next.color}10`, border: `1px solid ${next.color}40`, borderRadius: 'var(--r)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: next.color, marginBottom: 4 }}>🔥 {next.label}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{nudge.text}</div>
          </div>
          <button className="btn btn-sm" style={{ background: next.color, color: '#fff', border: 'none' }} onClick={() => navigate('/payment')}>
            {next.priceLabel} →
          </button>
        </div>
      )}
    </div>
  )
}
