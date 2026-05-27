import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FEATURES, PLAN_META, MOCK } from '../../data/plans'

function Lock({ text, plan, why }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 6, cursor: 'pointer', opacity: 0.4, transition: 'all .18s', borderBottom: '1px dashed var(--border)' }}
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
          <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E', background: '#FDE68A', padding: '2px 8px', borderRadius: 100 }}>{plan}</span>
        </div>
      )}
    </div>
  )
}

export function Company({ planId }) {
  const navigate = useNavigate()
  const f = FEATURES.company[planId]
  const STATUS_LABELS = { guest: 'Гость + Новый участник', user: 'Пользователь', practitioner: 'Поставщик-практик', recommended: 'Рекомендованный поставщик' }
  const STATUS_COLORS = { guest: '#6B7280', user: '#3B82F6', practitioner: '#00A651', recommended: '#F59E0B' }
  const STATUS_DESC = {
    guest:       'Базовый профиль · ИИ-подсказки по заполнению',
    user:        'Обогащён через Дадата · Рейтинг надёжности · Бейдж «Верифицирован»',
    practitioner:'Статус виден закупщикам · Отображение в ТОП-5 категории · Метрики активности публичны',
    recommended: 'Высший статус · Попадание в Featured-дайджесты закупщиков · Приоритет в поиске',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🏭</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>ООО Агро-Молоко</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>ИНН: 7700123456 · Московская область</div>
            <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: STATUS_COLORS[f.status], background: `${STATUS_COLORS[f.status]}15`, padding: '3px 10px', borderRadius: 100 }}>
                {STATUS_LABELS[f.status]}
              </span>
              {f.verified
                ? <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>✓ Верифицирован</span>
                : <span style={{ fontSize: 12, color: 'var(--text-4)' }}>✗ Не верифицирован</span>
              }
              {f.enriched && <span style={{ fontSize: 12, color: '#3B82F6', fontWeight: 600 }}>✓ Дадата</span>}
              {f.top5 && <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>⭐ ТОП-5 категории</span>}
              {f.featured && <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>📢 Featured</span>}
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-3)' }}>{STATUS_DESC[f.status]}</div>
          </div>
          <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>Редактировать</button>
        </div>

        <div className="divider" style={{ margin: '0 0 16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['Категория', 'Молочная продукция'], ['Регион', 'Московская область'], ['Оборот', '150–500 млн ₽/год'], ['Сайт', 'agromoloko.ru']].map(([k, v]) => (
            <div key={k}><div style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 2 }}>{k}</div><div style={{ fontSize: 14, fontWeight: 500 }}>{v}</div></div>
          ))}
        </div>
        {!f.enriched && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: '#FFFBEB', borderRadius: 'var(--r-sm)', fontSize: 13, color: '#92400E', border: '1px solid #FDE68A' }}>
            💡 Подключите ИИ-подсказки — они помогут заполнить профиль по стандартам, которые увеличивают видимость для закупщиков
          </div>
        )}
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Прогрессия статуса</div>
        {[
          { status: 'guest',       label: 'Рабочее место',           desc: 'Базовый профиль + ИИ-подсказки', plan: 'free'    },
          { status: 'user',        label: 'Онлайн продавец',         desc: 'Верификация + обогащение + бейдж', plan: 'online'  },
          { status: 'practitioner',label: 'Сетевой отдел',           desc: 'ТОП-5 категории + публичные метрики', plan: 'network' },
          { status: 'recommended', label: 'Офис продаж',             desc: 'Рекомендованный + Featured-дайджест', plan: 'office'  },
        ].map((s, i) => {
          const isCurrent = s.plan === planId
          const isPast = ['free','online','network','office'].indexOf(s.plan) <= ['free','online','network','office'].indexOf(planId)
          return (
            <div key={s.status} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: isCurrent ? STATUS_COLORS[s.status] : isPast ? '#E5E7EB' : 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: isCurrent ? '#fff' : '#6B7280', flexShrink: 0, marginTop: 2 }}>
                {isPast && !isCurrent ? '✓' : i + 1}
              </div>
              <div style={{ flex: 1, opacity: isPast ? 1 : 0.5 }}>
                <div style={{ fontWeight: isCurrent ? 700 : 500, fontSize: 14, color: isCurrent ? STATUS_COLORS[s.status] : 'var(--text-2)' }}>
                  {s.label} {isCurrent && '← вы здесь'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.desc}</div>
              </div>
            </div>
          )
        })}
        {!f.verified && <Lock text="Верификация компании + рейтинг надёжности + бейдж" plan="Онлайн продавец · 50 000 ₽" why="Закупщики фильтруют каталог по статусу «верифицирован». Без бейджа вы невидимы в большинстве поисков." />}
        {!f.top5 && <Lock text='Отображение в ТОП-5 категории для закупщиков' plan="Сетевой отдел · 150 000 ₽" why="Ваш профиль попадает в топ выдачи при просмотре вашей категории. Видят закупщики, которые даже не искали вас специально." />}
        {!f.featured && <Lock text='Статус "Рекомендованный" + Featured в дайджестах закупщиков' plan="Офис продаж · 250 000 ₽" why="Высший статус доверия + ваша компания упоминается в еженедельных дайджестах, которые читают закупщики целевых сетей." />}
      </div>
    </div>
  )
}

export function Team({ planId }) {
  const f = FEATURES.team[planId]
  const ROLE_OPTIONS = ['Руководитель', 'Менеджер по сетям', 'Технолог', 'Бухгалтер']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Members */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Участники команды</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{MOCK.team.length} / {f.accounts}</span>
            <button className="btn btn-primary btn-sm" disabled={MOCK.team.length >= f.accounts}>+ Пригласить</button>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
          {planId === 'free'    && '1 аккаунт (только владелец)'}
          {planId === 'online'  && '2 аккаунта · разграничение ролей менеджер / директор'}
          {planId === 'network' && 'До 5 аккаунтов · история действий по каждому пользователю'}
          {planId === 'office'  && 'До 15 аккаунтов · CRM-интеграция · полная история действий'}
        </div>
        {MOCK.team.slice(0, f.accounts).map(m => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
              {m.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                {f.roles
                  ? <select style={{ border: 'none', background: 'transparent', fontSize: 12, color: 'var(--text-3)', cursor: 'pointer' }}>
                      {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  : m.role}
                {' · '}{m.email}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {f.history && <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>История</button>}
              <span style={{ fontSize: 11, fontWeight: 700, color: m.status === 'owner' ? '#F59E0B' : '#00A651', background: m.status === 'owner' ? '#FEF3C7' : '#E6F7EE', padding: '2px 8px', borderRadius: 100 }}>
                {m.status === 'owner' ? '👑 Владелец' : '✓ Активен'}
              </span>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!f.roles && <Lock text="Разграничение ролей (менеджер / директор)" plan="Онлайн продавец · 50 000 ₽" why="Разные права доступа для разных сотрудников — менеджер видит только переговоры, директор — всё." />}
          {!f.history && f.roles && <Lock text="История действий по каждому пользователю" plan="Сетевой отдел · 150 000 ₽" why="Полный лог — кто, когда и что сделал. Контроль команды и разбор ошибок." />}
          {!f.crm && <Lock text="CRM-интеграция (amoCRM, Bitrix24)" plan="Офис продаж · 250 000 ₽" why="Данные переговоров автоматически попадают в вашу CRM. Никакой ручной работы." />}
        </div>
      </div>

      {/* Digital passport / rating */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Цифровой паспорт и репутация</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14 }}>
          {planId === 'free'    && 'Оценки не доступны — подключите Онлайн продавец'}
          {planId === 'online'  && 'Лайк / Дислайк + текстовый отзыв от сети после переговоров'}
          {planId === 'network' && 'Рейтинг в баллах + оценка от закупщика · метрики публичны'}
          {planId === 'office'  && 'Ручной сбор + публикация кейсов успешных сделок в каталоге'}
        </div>

        {!f.rating && <Lock text="Оценки и отзывы от торговых сетей" plan="Онлайн продавец · 50 000 ₽" why="Закупщики оставляют лайк/дислайк и текстовый отзыв после переговоров. Для новых сетей ваш рейтинг — социальное доказательство надёжности." />}

        {f.rating === 'like' && (
          <div style={{ display: 'flex', gap: 12, padding: '12px', background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 8, fontSize: 22 }}>
              <span title="2 лайка">👍 2</span>
              <span title="0 дислайков">👎 0</span>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Положительная репутация</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>2 отзыва от закупщиков · «Надёжный поставщик, быстро отвечает»</div>
            </div>
          </div>
        )}

        {(f.rating === 'star' || f.rating === 'case') && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', marginBottom: 8 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#F59E0B' }}>4.2</div>
              <div>
                <div style={{ color: '#F59E0B', fontSize: 18, marginBottom: 2 }}>★★★★☆</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>3 оценки в баллах · Видно всем закупщикам платформы</div>
              </div>
            </div>
            {!f.passport && <Lock text="Полный цифровой паспорт с историей взаимодействий" plan="Сетевой отдел · 150 000 ₽" why="История всех переговоров + собранные отзывы публично видна закупщикам. Ваша репутация работает как актив." />}
          </div>
        )}

        {f.rating === 'case' && f.passport && (
          <div style={{ padding: '12px 14px', background: '#FFFBEB', borderRadius: 'var(--r-sm)', border: '1px solid #FDE68A' }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#92400E', marginBottom: 6 }}>📖 Опубликованные кейсы</div>
            <div style={{ fontSize: 13, color: '#92400E' }}>«Вход в Магнит за 4 месяца — как мы прошли путь от КП до договора» · 230 просмотров закупщиками</div>
            <button className="btn btn-sm" style={{ marginTop: 10, background: '#F59E0B', color: '#fff', border: 'none' }}>+ Добавить кейс</button>
          </div>
        )}
      </div>
    </div>
  )
}

function Article({ title, sub, icon, locked, lockedPlan }) {
  const [open, setOpen] = useState(false)
  if (locked) return (
    <div>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px dashed var(--border)', cursor: 'pointer', opacity: 0.4, transition: 'all .18s' }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = '#FFFBEB'; e.currentTarget.style.padding = '10px 8px' }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.padding = '10px 0' } }}
        onClick={() => setOpen(v => !v)}
      >
        <span style={{ fontSize: 16 }}>🔒</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-3)' }}>{title}</div>
          {sub && <div style={{ fontSize: 12, color: 'var(--text-4)' }}>{sub}</div>}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-4)', background: 'var(--bg-3)', padding: '2px 8px', borderRadius: 100, whiteSpace: 'nowrap' }}>{lockedPlan}</span>
      </div>
      {open && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '8px 12px', marginBottom: 4, fontSize: 12, color: '#92400E' }}>
          Откроется в тарифе: <strong>{lockedPlan}</strong>
        </div>
      )}
    </div>
  )
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background .15s' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.padding = '10px 8px' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.padding = '10px 0' }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{sub}</div>}
      </div>
      <button className="btn btn-ghost btn-sm">Открыть →</button>
    </div>
  )
}

export function Learning({ planId }) {
  const f = FEATURES.learning[planId]
  const navigate = useNavigate()
  const isOnlinePlus = ['online', 'network', 'office'].includes(planId)
  const isNetworkPlus = ['network', 'office'].includes(planId)
  const isOffice = planId === 'office'

  const QUOTA_MAP = { free: 0, online: 0, network: 0, office: 30 }
  const consultQuota = QUOTA_MAP[planId]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Tier summary banner */}
      <div style={{
        background: isOffice ? 'linear-gradient(135deg, #92400E, #F59E0B)'
          : isNetworkPlus ? 'linear-gradient(135deg, #0D3D26, #00A651)'
          : isOnlinePlus ? 'linear-gradient(135deg, #1E3A8A, #3B82F6)'
          : 'linear-gradient(135deg, #374151, #6B7280)',
        borderRadius: 'var(--r)', padding: '20px 24px', color: '#fff'
      }}>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>
          {isOffice ? '🏆 Персональный наставник' : isNetworkPlus ? '🤖 ИИ-подбор и методология' : isOnlinePlus ? '📚 Методология входа в сети' : '📖 Базовый доступ'}
        </div>
        <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>
          {isOffice
            ? 'Личный эксперт с рыночными связями. Рекомендует конкретных закупщиков, организует встречи.'
            : isNetworkPlus
            ? 'ИИ анализирует ваши параметры и предлагает конкретные сети. Вы получаете персональный план входа.'
            : isOnlinePlus
            ? 'Методология правильного заполнения параметров продукта и технология лонглист→шортлист.'
            : 'Обзор рынка и базовые материалы. Понять, как устроена система входа в торговые сети.'}
        </div>
      </div>

      {/* Block 1: Knowledge base — всем */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>База знаний</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>
          {f.kb ? 'Полный доступ' : 'Ограниченный доступ'} · {planId === 'free' ? '3 вводных материала' : 'Все материалы платформы'}
        </div>
        <Article icon="📄" title="Как торговые сети выбирают поставщиков" sub="Критерии отбора, типичные ошибки, что проверяют закупщики · 12 мин" />
        <Article icon="📄" title="Структура рынка: кто такой закупщик и как он думает" sub="Психология закупщика, его KPI и мотивация · 8 мин" />
        <Article
          icon="📄"
          title="Как подготовить продукт к выходу в сеть"
          sub="Упаковка, маркировка, сертификаты, логистика · 15 мин"
          locked={!f.kb || planId === 'free'}
          lockedPlan="Онлайн продавец"
        />
        <Article
          icon="📄"
          title="Чек-лист готовности к переговорам с закупщиком"
          sub="Что взять на встречу, как говорить о цене · 10 мин"
          locked={planId === 'free'}
          lockedPlan="Онлайн продавец"
        />
      </div>

      {/* Block 2: Methodology — Online+ */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Методология входа в сети</div>
          {!isOnlinePlus && <span style={{ fontSize: 12, color: '#3B82F6', background: '#EFF6FF', padding: '3px 10px', borderRadius: 100, fontWeight: 600 }}>Онлайн продавец</span>}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>Системный подход: от параметров продукта до первого КП</div>
        <Article
          icon="🎯" title="Как правильно заполнить параметры продукта"
          sub="Ключевые поля, которые влияют на видимость в поиске закупщиков · 20 мин"
          locked={!isOnlinePlus} lockedPlan="Онлайн продавец"
        />
        <Article
          icon="📋" title="Технология Лонглист → Шортлист"
          sub="Как из 200 сетей выбрать 10 целевых и правильно расставить приоритеты · 25 мин"
          locked={!isOnlinePlus} lockedPlan="Онлайн продавец"
        />
        <Article
          icon="🎥" title="Вебинар: Как Пятёрочка выбирает поставщиков"
          sub="Запись · Закупщик Пятёрочки рассказывает критерии отбора · 45 мин"
          locked={!isOnlinePlus} lockedPlan="Онлайн продавец"
        />
        <Article
          icon="🎥" title="Вебинар: Вход в Магнит и Ленту — практические кейсы"
          sub="Запись · Разбор 3 реальных сделок с поставщиками · 38 мин"
          locked={!isOnlinePlus} lockedPlan="Онлайн продавец"
        />

        {/* AI trainer */}
        {f.aiTrainer === 'demo' && (
          <div style={{ marginTop: 12, background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', padding: '14px', border: '1px dashed var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>🤖</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>ИИ-тренажёр переговоров — 1 пробный диалог</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Попробуйте один раз бесплатно — затем доступно в «Онлайн продавец»</div>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 'var(--r-sm)', padding: '10px', border: '1px solid var(--border)', marginBottom: 8 }}>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>💬 Добрый день! Я — виртуальный закупщик. Расскажите о вашем продукте...</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input" style={{ flex: 1, fontSize: 14 }} placeholder="Ваш ответ (демо)..." />
                <button className="btn btn-sm btn-primary">Ответить</button>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-4)' }}>Демо · Использовано 0 из 1 бесплатного диалога</div>
          </div>
        )}
        {f.aiTrainer === true && (
          <div style={{ marginTop: 16, background: 'linear-gradient(135deg, #0D3D26, #00A651)', borderRadius: 'var(--r-sm)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>🤖</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>ИИ-тренажёр переговоров</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>Симуляция переговоров с виртуальным закупщиком · безлимит</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 'var(--r-sm)', padding: '12px' }}>
              <div style={{ fontSize: 13, color: '#fff', marginBottom: 10 }}>💬 Добрый день! Я — виртуальный закупщик Пятёрочки. Расскажите о вашем продукте и условиях поставки...</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input" style={{ flex: 1, background: 'rgba(255,255,255,.2)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', fontSize: 14 }} placeholder="Ваш ответ..." />
                <button className="btn btn-sm" style={{ background: '#fff', color: 'var(--primary)', border: 'none' }}>Ответить</button>
              </div>
            </div>
          </div>
        )}
        {f.aiTrainer === 'mentor' && (
          <div style={{ marginTop: 16, background: 'linear-gradient(135deg, #92400E, #F59E0B)', borderRadius: 'var(--r-sm)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 28 }}>🏆</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Разбор реальных кейсов с ментором</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)' }}>Не симуляция — живая сессия с экспертом по вашим переговорам</div>
              </div>
            </div>
            <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', border: '1px solid rgba(255,255,255,.4)' }}>
              📅 Записаться на разбор кейса
            </button>
          </div>
        )}
      </div>

      {/* Block 3: AI matching & events — Network+ */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>ИИ-подбор сетей и события</div>
          {!isNetworkPlus && <span style={{ fontSize: 12, color: '#00A651', background: '#E6F7EE', padding: '3px 10px', borderRadius: 100, fontWeight: 600 }}>Сетевой отдел</span>}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>Ваши параметры → конкретные рекомендации сетей и ближайшие ЦЗС</div>
        {isNetworkPlus ? (
          <>
            <div style={{ background: 'var(--primary-light)', border: '1px solid #6EE7B7', borderRadius: 'var(--r-sm)', padding: '16px', marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary-dark)', marginBottom: 8 }}>🎯 Ваши рекомендованные сети</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { name: 'ВкусВилл', match: 94, reason: 'Фермерская молочка, Московская обл.' },
                  { name: 'Перекрёсток', match: 87, reason: 'Пастеризованное молоко, ценовой сегмент' },
                  { name: 'Лента', match: 79, reason: 'Объём производства, логистика МО' },
                ].map(s => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.reason}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)' }}>{s.match}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>📅 Ближайшие ЦЗС с вашими целевыми сетями</div>
            {[
              { date: '15.06.2025', name: 'ЦЗС Молочная категория', network: 'ВкусВилл + Перекрёсток', city: 'Москва' },
              { date: '22.06.2025', name: 'День поставщика Лента', network: 'Лента', city: 'СПб' },
            ].map(ev => (
              <div key={ev.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary)', minWidth: 80 }}>{ev.date}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{ev.network} · {ev.city}</div>
                </div>
                <button className="btn btn-outline btn-sm">Записаться</button>
              </div>
            ))}
          </>
        ) : (
          <>
            <Lock text="ИИ-анализ: ваши параметры → рекомендованные сети с процентом совпадения" plan="Сетевой отдел · 150 000 ₽" why="Система сравнивает ваш продукт с профилями 500+ сетей и выдаёт персональный топ-3 — с указанием причин совпадения. Вы не гадаете, а идёте туда, где вас ждут." />
            <Lock text="Календарь ЦЗС с вашими целевыми сетями" plan="Сетевой отдел · 150 000 ₽" why="ЦЗС (Центры закупок сетей) — специализированные мероприятия, где закупщики принимают поставщиков. Мы показываем только те, где есть ваши целевые сети." />
            <Lock text="Персональный дайджест: что происходит в вашей категории" plan="Сетевой отдел · 150 000 ₽" why="Еженедельный отчёт: новые тендеры, смена байеров, акции сетей в вашей категории. Вы в рынке без мониторинга вручную." />
          </>
        )}
      </div>

      {/* Block: KVK Webinars & conferences — Online+ */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Вебинары и конференции КВК</div>
          {!isOnlinePlus && <span style={{ fontSize: 12, color: '#3B82F6', background: '#EFF6FF', padding: '3px 10px', borderRadius: 100, fontWeight: 600 }}>Онлайн продавец</span>}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>
          {isOffice ? 'Полный доступ + офлайн участие' : isOnlinePlus ? 'Онлайн-доступ к вебинарам и записям' : 'Демо-доступ к анонсам'}
        </div>
        {[
          { title: 'Конференция «Поставщик сетей 2025»',        date: '19.06.2025', format: 'Онлайн',  locked: !isOnlinePlus },
          { title: 'Вебинар: Как войти в private label сети',   date: '26.06.2025', format: 'Онлайн',  locked: !isOnlinePlus },
          { title: 'Форум «Продовольственная розница»',         date: '10.07.2025', format: 'Офлайн',  locked: !isOffice     },
        ].map(ev => (
          <div key={ev.title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', opacity: ev.locked ? 0.45 : 1 }}>
            <span style={{ fontSize: 16 }}>{ev.locked ? '🔒' : ev.format === 'Офлайн' ? '🎤' : '🎥'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 14, color: ev.locked ? 'var(--text-3)' : 'var(--text)' }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-4)' }}>{ev.date} · {ev.format}</div>
            </div>
            {!ev.locked && <button className="btn btn-ghost btn-sm">Записаться</button>}
            {ev.locked && <span style={{ fontSize: 11, color: 'var(--text-4)', background: 'var(--bg-3)', padding: '2px 8px', borderRadius: 100, whiteSpace: 'nowrap' }}>
              {!isOnlinePlus ? 'Онлайн продавец' : 'Офис продаж'}
            </span>}
          </div>
        ))}
      </div>

      {/* Block: Market digests — row 29 */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Дайджесты рынка</div>
          <span style={{ fontSize: 12, fontWeight: 600,
            color: f.digests === 'premium' ? '#F59E0B' : f.digests === 'personal' ? 'var(--primary)' : f.digests === 'general' ? '#3B82F6' : 'var(--text-4)',
            background: f.digests === 'premium' ? '#FFFBEB' : f.digests === 'personal' ? 'var(--primary-light)' : f.digests === 'general' ? '#EFF6FF' : 'var(--bg-3)',
            padding: '3px 10px', borderRadius: 100,
          }}>
            {f.digests === 'premium' ? '⭐ Премиум · 10 тегов' : f.digests === 'personal' ? '🎯 Персональный · 5 тегов' : f.digests === 'general' ? 'Общий · 3 тега' : 'Ограниченный · 1 тег'}
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>
          {f.digests === 'limited' ? '1 тематический дайджест в месяц по 1 выбранному тегу'
            : f.digests === 'general' ? 'Общие новости + персонализация по 3 тегам и региону'
            : f.digests === 'personal' ? 'Персональный + аналитика тенденций рынка · 5 тегов'
            : 'Персональный + аналитика тенденций · 10 тегов'}
        </div>
        <div style={{ padding: '12px 14px', background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 6 }}>ПОСЛЕДНИЙ ДАЙДЖЕСТ · 26.05.2025</div>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Молочная категория: тренды мая</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
            {f.digests === 'limited'
              ? 'Пятёрочка расширяет полку молочного СТМ — 12 новых слотов. Полный анализ доступен в «Онлайн продавец».'
              : 'Пятёрочка расширяет полку молочного СТМ · Магнит меняет байера в молочной категории · ВкусВилл увеличивает долю фермерской продукции · Лента проводит тендер на кефир'}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>Открыть дайджест →</button>
        </div>
      </div>

      {/* Block 4: Personal mentor — Office */}
      <div style={{ background: '#fff', border: `1px solid ${isOffice ? '#FDE68A' : 'var(--border)'}`, borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Персональный наставник</div>
          {!isOffice && <span style={{ fontSize: 12, color: '#F59E0B', background: '#FFFBEB', padding: '3px 10px', borderRadius: 100, fontWeight: 600 }}>Офис продаж</span>}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>Эксперт с личными связями на рынке — помогает попасть к конкретным закупщикам</div>
        {isOffice ? (
          <>
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--r-sm)', padding: '16px', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: '#fff', flexShrink: 0 }}>С</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Светлана Коваль</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Эксперт по молочной категории · 12 лет в закупках сетей</div>
                  <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>✓ Личные связи: Пятёрочка, Магнит, Лента, ВкусВилл</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ background: '#fff', borderRadius: 'var(--r-sm)', padding: '10px 14px', flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 2 }}>ЛИМИТ КОНСУЛЬТАЦИЙ</div>
                  <div style={{ fontWeight: 800, fontSize: 22, color: '#F59E0B' }}>{consultQuota}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>вопросов в год</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 'var(--r-sm)', padding: '10px 14px', flex: 2, minWidth: 180 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 4 }}>ЧТО ДЕЛАЕТ НАСТАВНИК</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                    Рекомендует конкретных байеров → организует личную встречу или Zoom → помогает подготовить КП под стандарты сети
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-sm" style={{ background: '#F59E0B', color: '#fff', border: 'none' }}>📅 Записаться на сессию</button>
              <button className="btn btn-outline btn-sm">💬 Написать наставнику</button>
            </div>
          </>
        ) : (
          <>
            <Lock text="Персональный наставник — эксперт с личными связями у закупщиков" plan="Офис продаж · 250 000 ₽" why="Наставник знает байеров лично — он рекомендует вас не как незнакомца из системы, а как проверенного поставщика. Это принципиально меняет скорость сделки." />
            <Lock text="Фиксированный лимит консультаций (20–50 вопросов в год)" plan="Офис продаж · 250 000 ₽" why="Чётко оговорённый объём — вы знаете, что входит в пакет. Без ограничений по теме: стратегия, переговоры, конкретный байер, анализ категории." />
            <Lock text="Организация личных встреч и Zoom с конкретными закупщиками" plan="Офис продаж · 250 000 ₽" why="Наставник договаривается о встрече от своего имени — это работает, когда все попытки выйти самостоятельно не дают ответа." />
          </>
        )}
      </div>
    </div>
  )
}
