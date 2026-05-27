import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FEATURES, NUDGES, PLAN_META, MOCK } from '../../data/plans'

function LockOverlay({ text, plan, why, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.4 }}>{children}</div>
      <div
        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)', cursor: 'pointer', borderRadius: 'var(--r)' }}
        onClick={() => setOpen(v => !v)}
      >
        <div style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🔒</div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{plan}</div>
        </div>
      </div>
      {open && (
        <div style={{ position: 'absolute', inset: 0, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--r)', padding: 20, zIndex: 10 }}>
          <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 12 }}>{why}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', background: '#FDE68A', padding: '3px 10px', borderRadius: 100, display: 'inline-block', marginBottom: 12 }}>{plan}</div>
          <br />
          <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Закрыть</button>
        </div>
      )}
    </div>
  )
}

function BarChart({ data, locked, plan, why }) {
  const max = Math.max(...data.map(d => d.deals))
  const chart = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map(d => (
        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 100, fontSize: 13, fontWeight: 500, color: 'var(--text-2)', textAlign: 'right', flexShrink: 0 }}>{d.name}</div>
          <div style={{ flex: 1, height: 24, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--primary)', width: `${(d.deals / max) * 100}%`, borderRadius: 4, transition: 'width .6s' }} />
          </div>
          <div style={{ width: 60, fontSize: 13, color: 'var(--text-3)', flexShrink: 0 }}>{d.deals} сделок</div>
          <div style={{ width: 80, fontSize: 12, color: 'var(--text-4)', flexShrink: 0 }}>{d.avgContract}</div>
        </div>
      ))}
    </div>
  )
  if (locked) return <LockOverlay text="Статистика по сетям" plan={plan} why={why}>{chart}</LockOverlay>
  return chart
}

function ScoringGauge({ score, locked, plan, why, preview }) {
  const color = score < 40 ? '#EF4444' : score < 65 ? '#F59E0B' : '#00A651'
  const gauge = (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: 48, fontWeight: 800, color, marginBottom: 8 }}>{score}</div>
      <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>из 100 баллов</div>
      <div style={{ height: 12, background: 'linear-gradient(to right, #EF4444, #F59E0B, #00A651)', borderRadius: 100, position: 'relative', marginBottom: 8 }}>
        <div style={{ position: 'absolute', top: -4, left: `${score}%`, transform: 'translateX(-50%)', width: 20, height: 20, background: '#fff', border: `3px solid ${color}`, borderRadius: '50%', boxShadow: '0 2px 6px rgba(0,0,0,.2)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-4)' }}>
        <span>Не готов</span><span>Частично</span><span>Готов</span>
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
        {[['Качество упаковки', 78], ['Документация', 65], ['Ценообразование', 58], ['Объём производства', 45], ['Сертификаты', 40]].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)', width: 160, flexShrink: 0 }}>{label}</span>
            <div style={{ flex: 1, height: 6, background: 'var(--bg-3)', borderRadius: 100 }}>
              <div style={{ height: '100%', background: val >= 65 ? '#00A651' : val >= 50 ? '#F59E0B' : '#EF4444', width: `${val}%`, borderRadius: 100 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', width: 28, textAlign: 'right' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
  if (preview) return (
    <div style={{ position: 'relative' }}>
      <div style={{ filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.3 }}>{gauge}</div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ fontSize: 28 }}>👁</div>
        <div style={{ fontWeight: 700, fontSize: 14, textAlign: 'center' }}>Превью скоринга</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', maxWidth: 260 }}>{plan}</div>
      </div>
    </div>
  )
  if (locked) return <LockOverlay text="ИИ-скоринг готовности продукта" plan={plan} why={why}>{gauge}</LockOverlay>
  return gauge
}

function FunnelChart({ steps, locked, partial, plan, why }) {
  const chart = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {steps.map((s, i) => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 140, fontSize: 12, color: 'var(--text-2)', textAlign: 'right', flexShrink: 0 }}>{s.name}</div>
          <div style={{ flex: 1, height: 28, background: 'var(--bg-3)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: `rgba(0,166,81,${0.3 + i * 0.15})`, width: `${s.pct}%`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-dark)' }}>{s.pct}%</span>
            </div>
          </div>
          <div style={{ width: 32, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{s.count}</div>
        </div>
      ))}
    </div>
  )
  if (locked) return <LockOverlay text="Дашборд воронки продаж" plan={plan} why={why}>{chart}</LockOverlay>
  return (
    <div>
      {chart}
      {partial && (
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', fontSize: 13, color: 'var(--text-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Экспорт в PDF доступен</span>
          <button className="btn btn-ghost btn-sm">📄 Скачать</button>
        </div>
      )}
    </div>
  )
}

export default function Analytics({ planId }) {
  const navigate = useNavigate()
  const f = FEATURES.analytics[planId]
  const nudge = NUDGES.analytics[planId]
  const next = PLAN_META[PLAN_META[planId]?.next]
  const d = MOCK.analytics

  const isNetworkPlus = ['network', 'office'].includes(planId)
  const isOnlinePlus = ['online', 'network', 'office'].includes(planId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {[
          { label: 'Переговоров в категории за год',  value: '147',              icon: '🤝', locked: false },
          { label: 'Средний контракт по категории',   value: isOnlinePlus ? '1.9 млн ₽' : '—', icon: '💰', locked: !isOnlinePlus, hint: 'Онлайн продавец' },
          { label: 'Активных сетей в категории',      value: isOnlinePlus ? '18' : '—',         icon: '🏪', locked: !isOnlinePlus, hint: 'Онлайн продавец' },
          { label: 'Ваш ИИ-скоринг',                 value: isNetworkPlus ? `${d.scoring}/100` : '—', icon: '⭐', locked: !isNetworkPlus, hint: 'Сетевой отдел' },
        ].map(m => (
          <div key={m.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '14px 16px', opacity: m.locked ? 0.55 : 1 }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 4, color: m.locked ? 'var(--text-4)' : 'var(--text)' }}>{m.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.4 }}>{m.label}</div>
            {m.locked && <div style={{ fontSize: 10, color: 'var(--primary)', marginTop: 4, fontWeight: 600 }}>{m.hint} →</div>}
          </div>
        ))}
      </div>

      {/* Deal statistics — rows 22–23 */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Переговоры по сетям в вашей категории</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>
          {f.level === 'general'
            ? 'Общие данные · Конкретные сети и суммы скрыты — доступно в Онлайн продавец'
            : f.level === 'categories'
            ? 'Молочная продукция · Категория 1-го уровня + конкретные сети — Май 2025'
            : 'Молочная продукция · Все уровни категории + детализация по сетям — Май 2025'}
        </div>
        <BarChart
          data={d.categoryDeals}
          locked={f.level === 'general'}
          plan="Онлайн продавец · 50 000 ₽"
          why="Вы видите конкретные названия сетей, количество переговоров и средние суммы контрактов. Это позволяет целиться в нужные сети, а не тратить усилия на всех подряд."
        />
        {isOnlinePlus && (
          <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Сделок за год', value: '147' },
              { label: 'Средний оборот', value: isNetworkPlus ? '1.9 млн ₽' : '—' },
              { label: 'Средний чек', value: isNetworkPlus ? '340 тыс ₽' : '—' },
              { label: 'Сетей в категории', value: '18' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, minWidth: 120, background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 2 }}>{s.label.toUpperCase()}</div>
                <div style={{ fontWeight: 700, fontSize: 17, color: s.value === '—' ? 'var(--text-4)' : 'var(--text)' }}>{s.value}</div>
                {s.value === '—' && <div style={{ fontSize: 10, color: 'var(--primary)', marginTop: 2 }}>Сетевой отдел</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Scoring — row 24 */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>ИИ-скоринг готовности продукта к сетям</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>
          {isNetworkPlus
            ? 'Оценка по 12 параметрам — конкретные рекомендации что доработать для успешного входа'
            : planId === 'office' && f.scoring === 'expert'
            ? 'Экспертный аудит + персональный план входа в сети'
            : 'Доступно в Сетевом отделе — ИИ-анализ по 12 параметрам с рекомендациями'}
        </div>
        <ScoringGauge
          score={d.scoring}
          locked={false}
          preview={!isNetworkPlus}
          plan={!isNetworkPlus ? 'Доступно в «Сетевой отдел» · ИИ анализирует 12 параметров и говорит, что конкретно доработать' : undefined}
          why="ИИ-скоринг показывает узкие места вашего продукта с точки зрения закупщика. Конкретные рекомендации — что исправить, чтобы получить «да»."
        />
        {f.scoring === 'expert' && (
          <div style={{ marginTop: 14, padding: '12px 14px', background: '#FFFBEB', borderRadius: 'var(--r-sm)', border: '1px solid #FDE68A' }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#92400E', marginBottom: 4 }}>⭐ Экспертный аудит</div>
            <div style={{ fontSize: 13, color: '#92400E' }}>Эксперт платформы лично разбирает скоринг и составляет персональный план входа в сети</div>
            <button className="btn btn-sm" style={{ marginTop: 10, background: '#F59E0B', color: '#fff', border: 'none' }}>Запросить аудит</button>
          </div>
        )}
      </div>

      {/* Dashboard / Funnel — row 26 */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Дашборд воронки продаж</div>
          <span style={{ fontSize: 12, fontWeight: 600,
            color: f.dashboard === 'advanced' ? '#F59E0B' : f.dashboard ? 'var(--primary)' : f.dashboard === 'partial' ? '#3B82F6' : 'var(--text-4)',
            background: f.dashboard === 'advanced' ? '#FFFBEB' : f.dashboard ? 'var(--primary-light)' : f.dashboard === 'partial' ? '#EFF6FF' : 'var(--bg-3)',
            padding: '3px 10px', borderRadius: 100,
          }}>
            {f.dashboard === 'advanced' ? '⭐ Расширенный' : f.dashboard === true ? '✔ Полный + прогноз' : f.dashboard === 'partial' ? 'Усечённый' : 'Демо'}
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>
          {f.dashboard
            ? 'Конверсия поставщиков по категории «Молочная продукция»'
            : f.dashboard === 'partial'
            ? 'Усечённая воронка — основные этапы без прогноза · Экспорт в PDF'
            : 'Демо-режим: данные примерные, ваши данные не подключены'}
        </div>
        <FunnelChart
          steps={d.funnelSteps}
          locked={!f.dashboard && f.dashboard !== 'partial'}
          partial={f.dashboard === 'partial'}
          plan="Онлайн продавец · 50 000 ₽"
          why="Видите, на каком этапе теряются поставщики в вашей категории. Понимаете, где узкое место — и что сделать, чтобы дойти до предварительного договора."
        />
        {f.dashboard === true && (
          <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--primary-light)', borderRadius: 'var(--r-sm)', border: '1px solid #6EE7B7', fontSize: 13, color: 'var(--primary-dark)' }}>
            📈 <strong>Прогноз:</strong> при текущем темпе — 2 новые сделки в квартал · Вероятность закрытия Лента: 67%
          </div>
        )}
      </div>

      {/* Network directory — row 22 */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Справочник торговых сетей</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
              {f.level === 'general' ? 'Верхнеуровневые данные'
                : f.level === 'categories' ? 'Со статистикой по сетям из открытых источников'
                : f.level === 'detailed' ? 'Полный доступ'
                : 'Полный доступ + рекомендации по запросу'}
            </div>
          </div>
          {f.research === 'custom' && (
            <button className="btn btn-sm" style={{ background: '#F59E0B', color: '#fff', border: 'none' }}>Запросить рекомендацию</button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { name: 'Пятёрочка',  detail: '17 500 магазинов · Категория 1: молочная · Байер: Иванова Е.С.' },
            { name: 'Магнит',     detail: '28 000 магазинов · Категория 1: все форматы · Байер: Петров А.Г.' },
            { name: 'Лента',      detail: '810 магазинов · Категория 2: middle+ premium · Байер: Кузьмин Д.В.' },
            { name: 'ВкусВилл',   detail: '1 500 магазинов · Категория 2: фермерская, органика · Байер: Соколова М.Р.' },
          ].map((item, i) => {
            const showDetail = isOnlinePlus
            const showBuyer = isNetworkPlus
            const detail = showBuyer ? item.detail : showDetail ? item.detail.split(' · Байер:')[0] : 'Данные скрыты'
            return (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏪</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: isOnlinePlus ? 'var(--text-3)' : 'var(--text-4)' }}>{detail}</div>
                </div>
                <button className="btn btn-ghost btn-sm" disabled={!isOnlinePlus}>Подробнее</button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Market research — row 27 */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Рыночные исследования</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Партнёр — ИНФОЛАЙН и другие аналитические агентства</div>
          </div>
          {f.research === 'custom' && (
            <span style={{ fontSize: 12, fontWeight: 600, color: '#F59E0B', background: '#FFFBEB', padding: '3px 10px', borderRadius: 100 }}>
              + Брифинг аналитика / квартал
            </span>
          )}
        </div>
        {[
          { title: 'Обзор рынка молочной продукции 2025', type: 'ИНФОЛАЙН', locked: false, access: f.research !== false },
          { title: 'Тренды: private label в молочной категории', type: 'ИНФОЛАЙН', locked: f.research === 'teaser', access: isOnlinePlus },
          { title: 'Детальный анализ: ВкусВилл и фермерская ниша', type: 'ИНФОЛАЙН Premium', locked: !isNetworkPlus, access: isNetworkPlus },
          { title: 'Индивидуальный отчёт под ваш запрос', type: 'Эксклюзив', locked: f.research !== 'custom', access: f.research === 'custom' },
        ].map(r => (
          <div
            key={r.title}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', opacity: r.locked ? 0.45 : 1 }}
          >
            <span style={{ fontSize: 16 }}>{r.locked ? '🔒' : '📊'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 14, color: r.locked ? 'var(--text-3)' : 'var(--text)' }}>{r.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-4)' }}>{r.type}</div>
            </div>
            {!r.locked && <button className="btn btn-ghost btn-sm">Открыть →</button>}
            {r.locked && (
              <span style={{ fontSize: 11, color: 'var(--text-4)', background: 'var(--bg-3)', padding: '2px 8px', borderRadius: 100, whiteSpace: 'nowrap' }}>
                {!isOnlinePlus ? 'Онлайн продавец' : !isNetworkPlus ? 'Сетевой отдел' : 'Офис продаж'}
              </span>
            )}
          </div>
        ))}
        {f.research === 'custom' && (
          <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>📅 Запись на брифинг аналитика</button>
        )}
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
