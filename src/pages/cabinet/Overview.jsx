import { useNavigate } from 'react-router-dom'
import { PLAN_META, FEATURES, NUDGES, MOCK } from '../../data/plans'

const STAGE_LABELS = {
  kp_sent: { label: 'КП отправлено', color: '#3B82F6' },
  waiting: { label: 'Ожидаем ответ', color: '#F59E0B' },
  zoom_scheduled: { label: 'Zoom запланирован', color: '#00A651' },
  contract: { label: 'Предв. договор', color: '#8B5CF6' },
}

function PrimaryCard({ icon, title, color, children, onOpen }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderTop: `3px solid ${color}`, borderRadius: 'var(--r)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{icon}</span>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{title}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onOpen}>Открыть →</button>
      </div>
      {children}
    </div>
  )
}

function MetricRow({ label, value, locked, lockPlan }) {
  if (locked) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px dashed var(--border)', opacity: 0.45 }}>
        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>🔒 {label}</span>
        <span style={{ fontSize: 11, color: 'var(--text-4)', background: 'var(--bg-3)', padding: '2px 8px', borderRadius: 100 }}>{lockPlan}</span>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{value}</span>
    </div>
  )
}

function UpgradeCard({ planId }) {
  const nudge = NUDGES.product[planId] || NUDGES.communications[planId]
  const next = PLAN_META[PLAN_META[planId]?.next]
  if (!next || !nudge) return null

  const navigate = useNavigate()
  return (
    <div style={{ background: `linear-gradient(135deg, ${next.color}15, ${next.color}08)`, border: `1px solid ${next.color}40`, borderRadius: 'var(--r)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: next.color, marginBottom: 4 }}>🔥 Следующий уровень: {next.label}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{nudge.text}</div>
      </div>
      <button className="btn btn-sm" style={{ background: next.color, color: '#fff', border: 'none', flexShrink: 0 }} onClick={() => navigate('/payment')}>
        {next.priceLabel} →
      </button>
    </div>
  )
}

export default function Overview({ planId, onNav }) {
  const navigate = useNavigate()
  const pf = PLAN_META[planId]
  const prod = FEATURES.product[planId]
  const inter = FEATURES.interaction[planId]
  const anal = FEATURES.analytics[planId]

  const funnelStep = { free: 1, online: 2, network: 3, office: 4 }[planId]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Funnel progress */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Ваш прогресс по воронке</div>
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Шаг {funnelStep} из 4</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { step: 1, name: 'Рабочее место', planId: 'free' },
            { step: 2, name: 'Онлайн продавец', planId: 'online' },
            { step: 3, name: 'Сетевой отдел', planId: 'network' },
            { step: 4, name: 'Офис продаж', planId: 'office' },
          ].map(s => {
            const done = s.step <= funnelStep
            const active = s.step === funnelStep
            const meta = PLAN_META[s.planId]
            return (
              <div key={s.step} style={{ flex: 1 }}>
                <div style={{ height: 6, borderRadius: 100, background: done ? meta.color : 'var(--bg-3)', marginBottom: 6, transition: 'background .3s' }} />
                <div style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: active ? meta.color : 'var(--text-4)', textAlign: 'center', lineHeight: 1.3 }}>
                  {s.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Upgrade nudge */}
      <UpgradeCard planId={planId} />

      {/* PRIMARY blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>

        {/* Продукт */}
        <PrimaryCard icon="📦" title="Продукт" color="#00A651" onOpen={() => onNav('product')}>
          <MetricRow label="Карточки товаров" value={`${Math.min(MOCK.products.length, prod.cards)} / ${prod.cards}`} />
          <MetricRow label="Коммерческих предложений" value={`${MOCK.kp.length} / ${prod.kp}`} />
          <MetricRow label="Рекомендательная система" value={prod.recommend ? '✓ Подключена' : '✗ Выключена'} locked={!prod.recommend} lockPlan="Сетевой отдел" />
          <MetricRow label="Экспертная проверка КП" value="✓ Включена" locked={!prod.expertReview} lockPlan="Офис продаж" />
          <button className="btn btn-primary btn-sm btn-block" style={{ marginTop: 4 }} onClick={() => onNav('product')}>
            + Добавить товар
          </button>
        </PrimaryCard>

        {/* Взаимодействие */}
        <PrimaryCard icon="🤝" title="Переговоры" color="#3B82F6" onOpen={() => onNav('negotiations')}>
          <MetricRow label="Активных переговоров" value={MOCK.negotiations.length} />
          <MetricRow label="Рассылок в месяц" value={inter.mailings === 999 ? 'Безлимит' : inter.mailings > 0 ? `${inter.mailings} шт` : 'Недоступно'} locked={inter.mailings === 0} lockPlan="Онлайн продавец" />
          <MetricRow label="Zoom-встреч" value={inter.zoom === 999 ? 'Безлимит' : inter.zoom > 0 ? `${inter.zoom} в мес.` : '—'} locked={!inter.zoom} lockPlan="Сетевой отдел" />
          <MetricRow label="Автопуш закупщикам" value="✓ Авто" locked={!inter.autoPush} lockPlan="Сетевой отдел" />
          <MetricRow label="Персональный менеджер" value="✓ Назначен" locked={!inter.manager} lockPlan="Офис продаж" />
        </PrimaryCard>

        {/* Аналитика */}
        <PrimaryCard icon="📊" title="Аналитика" color="#8B5CF6" onOpen={() => onNav('analytics')}>
          <MetricRow label="Данные по рынку" value={anal.level === 'general' ? 'Общие' : anal.level === 'categories' ? 'По категориям' : 'Детальные'} />
          <MetricRow label="ИИ-скоринг продукта" value="62 / 100" locked={!anal.scoring} lockPlan="Сетевой отдел" />
          <MetricRow label="Дашборд воронки" value="✓ Доступен" locked={!anal.dashboard} lockPlan="Сетевой отдел" />
          <MetricRow label="Анализ переговоров" value="✓ Доступен" locked={!anal.analysis} lockPlan="Сетевой отдел" />
        </PrimaryCard>
      </div>

      {/* Active negotiations */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Активные переговоры</div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNav('negotiations')}>Все →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MOCK.negotiations.map(n => {
            const stage = STAGE_LABELS[n.stage]
            return (
              <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{n.network}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{n.product} · {n.date}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: stage.color, background: `${stage.color}15`, padding: '3px 10px', borderRadius: 100 }}>
                  {stage.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Secondary blocks summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {[
          { id: 'company', icon: '🏢', title: 'Компания', info: `Статус: ${FEATURES.company[planId].verified ? '✓ Верифицирован' : '✗ Не верифицирован'}` },
          { id: 'team', icon: '👤', title: 'Команда', info: `${Math.min(MOCK.team.length, FEATURES.team[planId].accounts)} / ${FEATURES.team[planId].accounts} аккаунтов` },
          { id: 'learning', icon: '🎓', title: 'Обучение', info: FEATURES.learning[planId].aiTrainer === true || FEATURES.learning[planId].aiTrainer === 'mentor' ? 'ИИ-тренажёр доступен' : 'Только база знаний' },
        ].map(s => (
          <div
            key={s.id}
            className="card card-hover"
            style={{ padding: '14px 16px', cursor: 'pointer' }}
            onClick={() => onNav(s.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{s.info}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
