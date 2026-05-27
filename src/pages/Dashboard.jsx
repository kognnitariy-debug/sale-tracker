import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'

// PRIMARY — главные блоки (Продукт, Взаимодействие, Аналитика)
// SECONDARY — базовые блоки (Компания, Персона, Обучение)
const BLOCKS = [
  {
    id: 'product', tier: 'primary', icon: '📦', accentColor: '#00A651',
    title: 'Продукт',
    desc: 'Карточки товаров и коммерческие предложения',
    goal: 'Стать видимым для закупщиков по вашей категории и получить первые входящие отклики',
    free: ['1 карточка товара в каталоге', 'Лайт-КП — 1 документ'],
    locked: [
      {
        text: 'До 15 карточек товаров + приоритет в поиске',
        plan: 'Онлайн продавец · 50 000 ₽',
        why: 'Больше товарных позиций — больше точек входа для запросов закупщиков. Охват нескольких линеек одновременно. Продукт с 5+ карточками получает в 4 раза больше просмотров.',
      },
      {
        text: 'Видимость в рекомендательной системе ИИ',
        plan: 'Онлайн продавец · 50 000 ₽',
        why: 'ИИ автоматически показывает ваш товар закупщикам, которые ищут похожую продукцию. Без этого вас находят только по точному названию компании.',
      },
      {
        text: 'Генератор КП с автоматической проверкой',
        plan: 'Сетевой отдел · 150 000 ₽',
        why: 'Система проверяет КП на типичные ошибки и форматирует под требования конкретной сети. Конверсия в ответ от закупщика выше на 40% по сравнению с самостоятельным КП.',
      },
      {
        text: 'Экспертная проверка КП + 30 карточек товаров',
        plan: 'Офис продаж · 250 000 ₽',
        why: 'Эксперт проверяет КП по стандартам конкретной торговой сети перед отправкой. Выявляет ошибки ценообразования, упаковки, документации — до того как закупщик их увидит.',
      },
    ],
  },
  {
    id: 'interaction', tier: 'primary', icon: '🤝', accentColor: '#3B82F6',
    title: 'Взаимодействие',
    desc: 'Коммуникации с закупщиками торговых сетей',
    goal: 'Выйти на прямые переговоры с закупщиками и довести их до предварительного договора с сетью',
    free: ['Входящие обращения (если сеть найдёт сама)', 'Анонимный просмотр тендеров'],
    locked: [
      {
        text: 'Рассылка карточек товара в 5 сетей',
        plan: 'Онлайн продавец · 50 000 ₽',
        why: 'Вы сами отправляете карточку товара в выбранные сети — не ждёте входящего. Это активная работа: вы управляете воронкой, а не надеетесь на случай.',
      },
      {
        text: 'Zoom-переговоры с закупщиками (до 3)',
        plan: 'Сетевой отдел · 150 000 ₽',
        why: 'Живой разговор с закупщиком в разы эффективнее email. Zoom-встреча фиксирует интерес и переводит сделку в следующую стадию. Именно здесь рождается большинство предварительных договоров.',
      },
      {
        text: 'Автопуш — система напоминает закупщику',
        plan: 'Сетевой отдел · 150 000 ₽',
        why: 'Платформа автоматически напоминает закупщику о вашем КП, если он не ответил в течение 5 дней. Снимает главную боль поставщиков — "отправил и тишина".',
      },
      {
        text: 'Персональный менеджер + ручной дожим',
        plan: 'Офис продаж · 250 000 ₽',
        why: 'Наш менеджер лично звонит закупщику и добивается обратной связи. Вы не тратите время на гонки за ответом — команда платформы делает это за вас.',
      },
    ],
  },
  {
    id: 'analytics', tier: 'primary', icon: '📊', accentColor: '#8B5CF6',
    title: 'Аналитика',
    desc: 'Данные рынка и воронки продаж',
    goal: 'Понять реальную ёмкость рынка по вашей категории и принимать решения на данных, а не интуиции',
    free: ['Общая статистика без деталей', 'Ограниченный справочник сетей'],
    locked: [
      {
        text: 'Статистика переговоров с указанием сетей',
        plan: 'Онлайн продавец · 50 000 ₽',
        why: 'Видите конкретные сети в вашей категории, количество переговоров и средние суммы контрактов. Понимаете, куда целиться — и не тратите время на нецелевые контакты.',
      },
      {
        text: 'ИИ-скоринг готовности продукта к сетям',
        plan: 'Сетевой отдел · 150 000 ₽',
        why: 'Алгоритм оценивает ваш продукт по 12 параметрам готовности к работе с сетями и даёт конкретные рекомендации: что доработать, чтобы закупщик сказал "да".',
      },
      {
        text: 'Дашборд воронки продаж в реальном времени',
        plan: 'Сетевой отдел · 150 000 ₽',
        why: 'Вы видите: сколько сетей рассматривают ваше КП, на каком этапе каждый диалог, где возникает потеря. Управляете переговорами как процессом, а не хаосом.',
      },
      {
        text: 'Анализ записей переговоров с рекомендациями',
        plan: 'Офис продаж · 250 000 ₽',
        why: 'Эксперты разбирают ваши Zoom-переговоры с закупщиками и дают конкретные рекомендации по улучшению. Вы растёте от сессии к сессии.',
      },
    ],
  },
  // SECONDARY — блоки, которые мало меняются между планами
  {
    id: 'company', tier: 'secondary', icon: '🏢', accentColor: '#6B7280',
    title: 'Компания',
    desc: 'Профиль и статус в каталоге',
    goal: 'Сформировать доверие у закупщиков через верифицированный профиль',
    free: ['Базовое размещение в каталоге'],
    locked: [
      {
        text: 'Верификация + бейдж поставщика',
        plan: 'Онлайн продавец · 50 000 ₽',
        why: 'Закупщики фильтруют каталог по статусу "верифицирован". Без бейджа вы невидимы в большинстве поисков.',
      },
      {
        text: 'Статус «Рекомендованный поставщик»',
        plan: 'Офис продаж · 250 000 ₽',
        why: 'Максимальный статус доверия на платформе. Закупщики видят, что вы прошли полный путь и проверены командой.',
      },
    ],
  },
  {
    id: 'persona', tier: 'secondary', icon: '👤', accentColor: '#6B7280',
    title: 'Персона',
    desc: 'Аккаунты и цифровая репутация',
    goal: 'Выстроить цифровую репутацию, которую видят закупщики при оценке поставщика',
    free: ['1 учётная запись · Статус: Гость'],
    locked: [
      {
        text: 'Рейтинг и отзывы от торговых сетей',
        plan: 'Онлайн продавец · 50 000 ₽',
        why: 'Ваш "цифровой паспорт" с оценками от закупщиков. Для новых сетей это социальное доказательство: вы реальный и надёжный партнёр.',
      },
      {
        text: 'До 5 учётных записей для команды',
        plan: 'Сетевой отдел · 150 000 ₽',
        why: 'Разные менеджеры ведут разные сети в одном аккаунте компании. Прозрачность и контроль без путаницы.',
      },
    ],
  },
  {
    id: 'learning', tier: 'secondary', icon: '🎓', accentColor: '#6B7280',
    title: 'Обучение',
    desc: 'База знаний и тренажёры',
    goal: 'Подготовиться к переговорам с сетями и избежать типичных ошибок новичка',
    free: ['База знаний платформы', 'Дорожная карта поставщика'],
    locked: [
      {
        text: 'ИИ-тренажёр переговоров с закупщиком',
        plan: 'Онлайн продавец · 50 000 ₽',
        why: 'Практикуете переговоры с виртуальным закупщиком. Пробуете разные сценарии и получаете фидбек — до того как придёте на реальную встречу.',
      },
      {
        text: 'Закрытые вебинары и кейсы',
        plan: 'Онлайн продавец · 50 000 ₽',
        why: 'Разборы реальных кейсов поставщиков, которые уже вошли в сети через платформу. Видите что работает, а что — нет.',
      },
    ],
  },
]

const TABLE_ROWS = [
  { section: 'Компания', cells: ['В каталоге (гость)', 'Верификация + Дадата', '+ Статус "Практик"', '+ Статус "Рекомендованный"'] },
  { section: 'Персона', cells: ['1 аккаунт · Гость', '2 аккаунта · Пользователь', '5 аккаунтов · Практик', '15 аккаунтов · Рекомендованный'] },
  { section: 'Карточки товаров', cells: ['1 шт · без приоритета', '5 шт · 3-й уровень', '15 шт · 2-й уровень + рекомендации', '30 шт · 1-й уровень + приоритет'] },
  { section: 'Коммуникации', cells: ['Только входящие от сетей', '5 рассылок, 1 КП/мес, чат при отклике', '10 рассылок, 10 КП, Zoom ×3, автопуш', 'Безлимит + персональный менеджер'] },
  { section: 'Переговоры', cells: ['—', 'Только при инициативе сети', 'Zoom + офлайн (2 слота) + тендеры', 'Zoom безлимит + офлайн (3 слота) + ручной дожим'] },
  { section: 'Аналитика', cells: ['Общая без детализации', 'По категориям с сетями', 'С деталями + ИИ-скоринг + дашборд', 'Подробная + экспертные рекомендации'] },
  { section: 'Обучение', cells: ['База знаний', '+ Вебинары + ИИ-тренажёр', '+ Вебинары + ИИ-тренажёр', '+ Личная консультация'] },
]

const PLANS = [
  { id: 'free', name: 'Рабочее место', price: '0 ₽', color: '#6B7280' },
  { id: 'online', name: 'Онлайн продавец', price: '50 000 ₽', color: '#3B82F6' },
  { id: 'network', name: 'Сетевой отдел', price: '150 000 ₽', color: '#00A651' },
  { id: 'office', name: 'Офис продаж', price: '250 000 ₽', color: '#F59E0B' },
]

// Компонент одного заблокированного пункта с hover и click
function LockedItem({ blockId, index, item, openKey, setOpenKey }) {
  const key = `${blockId}-${index}`
  const isOpen = openKey === key
  const [hovered, setHovered] = useState(false)

  return (
    <div>
      <div
        style={{
          ...s.lockedRow,
          opacity: hovered || isOpen ? 1 : 0.38,
          background: isOpen ? '#FEF3C7' : hovered ? '#FFF8E7' : 'transparent',
          borderRadius: 6,
          cursor: 'pointer',
          transition: 'opacity .18s, background .18s',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpenKey(isOpen ? null : key)}
      >
        <span style={{ fontSize: 13, flexShrink: 0 }}>🔒</span>
        <span style={{ fontSize: 13, color: 'var(--text-2)', flex: 1 }}>{item.text}</span>
        <span style={{
          fontSize: 11,
          color: isOpen ? '#92400E' : 'var(--text-4)',
          fontWeight: 600,
          flexShrink: 0,
          transition: 'color .18s',
        }}>
          {isOpen ? '▲' : '?'}
        </span>
      </div>

      {isOpen && (
        <div style={s.lockExplanation}>
          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 10 }}>
            {item.why}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#92400E', background: '#FDE68A', padding: '2px 8px', borderRadius: 100 }}>
              Открывается: {item.plan}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function PrimaryBlock({ block, openKey, setOpenKey, onDetails }) {
  return (
    <div style={{ ...s.primaryCard, borderTopColor: block.accentColor }}>
      <div style={s.blockTopRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>{block.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{block.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{block.desc}</div>
          </div>
        </div>
        <span style={{ ...s.tierBadge, color: block.accentColor, background: `${block.accentColor}15` }}>
          🔑 Ключевой
        </span>
      </div>

      {/* Client goal */}
      <div style={s.goalRow}>
        <span style={{ fontSize: 12, fontWeight: 700, color: block.accentColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Ваша цель
        </span>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, margin: 0, marginTop: 3 }}>
          {block.goal}
        </p>
      </div>

      <div className="divider" style={{ margin: '14px 0' }} />

      {/* Free features */}
      <div style={{ marginBottom: 8 }}>
        {block.free.map(f => (
          <div key={f} style={s.freeRow}>
            <span style={{ color: block.accentColor, fontSize: 13 }}>✓</span>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{f}</span>
            <span className="badge badge-gray" style={{ fontSize: 10, marginLeft: 'auto', flexShrink: 0 }}>сейчас</span>
          </div>
        ))}
      </div>

      {/* Locked features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {block.locked.map((item, i) => (
          <LockedItem
            key={i}
            blockId={block.id}
            index={i}
            item={item}
            openKey={openKey}
            setOpenKey={setOpenKey}
          />
        ))}
      </div>

      <button
        className="btn btn-outline btn-sm btn-block"
        style={{ marginTop: 14, borderColor: block.accentColor, color: block.accentColor }}
        onClick={onDetails}
      >
        Подробнее и цены →
      </button>
    </div>
  )
}

function SecondaryBlock({ block, openKey, setOpenKey }) {
  return (
    <div style={s.secondaryCard}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 22 }}>{block.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{block.title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-4)' }}>{block.desc}</div>
        </div>
        <span style={s.secBadge}>Базовый</span>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 10, borderLeft: '2px solid var(--border)', paddingLeft: 8 }}>
        <em>{block.goal}</em>
      </div>

      {block.free.map(f => (
        <div key={f} style={{ ...s.freeRow, marginBottom: 4 }}>
          <span style={{ color: 'var(--text-4)', fontSize: 12 }}>✓</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{f}</span>
        </div>
      ))}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
        {block.locked.map((item, i) => (
          <LockedItem
            key={i}
            blockId={block.id}
            index={i}
            item={item}
            openKey={openKey}
            setOpenKey={setOpenKey}
          />
        ))}
      </div>
    </div>
  )
}

function VideoPlaceholder() {
  const [playing, setPlaying] = useState(false)
  return (
    <div style={s.video} onClick={() => setPlaying(true)}>
      {!playing ? (
        <>
          <div style={s.videoPlay}>▶</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#fff' }}>Как Sale Tracker помогает войти в торговые сети</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', marginTop: 4 }}>2 минуты · Посмотрите прямо сейчас</div>
          </div>
        </>
      ) : (
        <div style={{ color: '#fff', fontSize: 15, fontWeight: 500, textAlign: 'center' }}>
          ▶ Видео воспроизводится...<br/>
          <span style={{ fontSize: 12, opacity: 0.7 }}>(интеграция с видео-платформой в production-версии)</span>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, verified } = useUser()
  const [openKey, setOpenKey] = useState(null)
  const [showTable, setShowTable] = useState(false)
  const companyName = user?.companyName || 'Ваша компания'

  const primary = BLOCKS.filter(b => b.tier === 'primary')
  const secondary = BLOCKS.filter(b => b.tier === 'secondary')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-2)' }}>
      <Header />

      <div className="wrap-md" style={{ padding: '32px 24px 64px' }}>

        {/* Welcome */}
        <div style={s.welcomeBar}>
          <div>
            <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', fontWeight: 800, marginBottom: 4 }}>
              Поздравляем, {companyName}! 🎉
            </h1>
            <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
              Шаг 1 из 4 завершён · Вы зарегистрированы на платформе
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span className="badge badge-gray">🏠 Рабочее место · 0 ₽</span>
            {verified && <span className="badge badge-green">✓ Верифицирован</span>}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/cabinet')}>
            Перейти в кабинет →
          </button>
        </div>

        {/* Alert */}
        {!verified && (
          <div className="alert alert-warning" style={{ marginBottom: 16 }}>
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Вы в каталоге, но не верифицированы.</strong>{' '}
              Сети находят вас только по точному названию. Без статуса вы невидимы в поиске по категории.{' '}
              <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/verification')}>
                Верифицироваться бесплатно →
              </span>
            </div>
          </div>
        )}

        <div className="alert alert-success" style={{ marginBottom: 24 }}>
          <span className="alert-icon">🎯</span>
          <span>
            <strong>Следуйте нашей технологии</strong> — и получите гарантированные переговоры с торговыми сетями.
            Нажимайте на заблокированные строки в блоках, чтобы понять ценность каждой функции.
          </span>
        </div>

        {/* Video */}
        <div className="card" style={{ marginBottom: 28, padding: 0, overflow: 'hidden' }}>
          <VideoPlaceholder />
          <div style={{ padding: '18px 24px' }}>
            <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Ваше окно возможностей</h3>
            <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.65 }}>
              Это первый этап воронки. Вы зафиксировались на платформе. Изучите 6 блоков ниже —
              они показывают весь путь от регистрации до контракта с торговой сетью.
            </p>
          </div>
        </div>

        {/* PRIMARY BLOCKS */}
        <div style={s.sectionLabel}>
          <div style={s.sectionLine} />
          <span style={s.sectionLabelText}>🔑 Ключевые блоки — здесь происходят продажи</span>
          <div style={s.sectionLine} />
        </div>

        <div style={s.primaryGrid}>
          {primary.map(block => (
            <PrimaryBlock
              key={block.id}
              block={block}
              openKey={openKey}
              setOpenKey={setOpenKey}
              onDetails={() => navigate('/payment')}
            />
          ))}
        </div>

        {/* SECONDARY BLOCKS */}
        <div style={{ ...s.sectionLabel, marginTop: 24 }}>
          <div style={s.sectionLine} />
          <span style={s.sectionLabelText}>⚙️ Базовые блоки — поддержка и доверие</span>
          <div style={s.sectionLine} />
        </div>

        <div style={s.secondaryGrid}>
          {secondary.map(block => (
            <SecondaryBlock
              key={block.id}
              block={block}
              openKey={openKey}
              setOpenKey={setOpenKey}
            />
          ))}
        </div>

        {/* Upgrade banner */}
        <div style={s.upgradeBanner}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 6 }}>
              Разблокируйте полные возможности платформы
            </div>
            <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 14 }}>
              Пакет «Онлайн продавец» от 50 000 ₽ — верификация, видимость, первые отклики от закупщиков.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexShrink: 0, flexWrap: 'wrap' }}>
            <button className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.4)' }} onClick={() => setShowTable(v => !v)}>
              {showTable ? 'Скрыть таблицу ↑' : 'Сравнить пакеты'}
            </button>
            <button className="btn btn-dark" style={{ background: '#fff', color: 'var(--primary)' }} onClick={() => navigate('/payment')}>
              Оформить подписку →
            </button>
          </div>
        </div>

        {/* Subscription table */}
        {showTable && (
          <div style={{ overflowX: 'auto', marginTop: 8 }}>
            <table className="tbl" style={{ background: '#fff', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
              <thead>
                <tr>
                  <th style={{ minWidth: 150 }}>Возможности</th>
                  {PLANS.map((p, i) => (
                    <th key={p.id} style={{ minWidth: 180 }}>
                      <div style={{ color: p.color, fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginTop: 2 }}>{p.price}</div>
                      {i === 0 && <span className="badge badge-gray" style={{ marginTop: 4, fontSize: 10 }}>Текущий</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map(row => (
                  <tr key={row.section}>
                    <td style={{ fontWeight: 600, color: 'var(--text-2)', fontSize: 13 }}>{row.section}</td>
                    {row.cells.map((cell, i) => (
                      <td key={i} className={i === 0 ? 'col-active' : ''} style={{ fontSize: 13, color: i === 0 ? 'var(--primary-dark)' : 'var(--text-2)' }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Verification section */}
        {!verified && (
          <div style={s.verifySection}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>🔐</div>
            <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 8 }}>Почему важна верификация?</h3>
            <p style={{ color: 'var(--text-3)', marginBottom: 20, lineHeight: 1.7, fontSize: 15 }}>
              Верифицированные поставщики — реальные компании. Закупщики видят это и охотнее идут на контакт.
              Без верификации вы просто запись в базе. С верификацией — надёжный партнёр.
            </p>
            <div style={s.verifyBenefits}>
              {['🔍 Видимость по категории в поиске закупщиков', '✅ Бейдж верифицированного поставщика', '📈 Попадание в рекомендательную систему', '💬 Возможность инициировать чат с сетями'].map(b => (
                <div key={b} style={{ fontSize: 14, color: 'var(--text-2)' }}>{b}</div>
              ))}
            </div>
            <button className="btn btn-primary btn-lg" style={{ marginTop: 24 }} onClick={() => navigate('/verification')}>
              Пройти верификацию бесплатно →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  welcomeBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 16, flexWrap: 'wrap', gap: 12,
  },
  primaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
    marginBottom: 8,
  },
  secondaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 14,
    marginBottom: 28,
  },
  primaryCard: {
    background: '#fff',
    border: '1px solid var(--border)',
    borderTop: '3px solid',
    borderRadius: 'var(--r)',
    padding: '20px',
    boxShadow: 'var(--shadow-xs)',
  },
  secondaryCard: {
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r)',
    padding: '16px 18px',
    boxShadow: 'var(--shadow-xs)',
    opacity: 0.9,
  },
  blockTopRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 14, gap: 8,
  },
  tierBadge: {
    fontSize: 11, fontWeight: 700, padding: '3px 8px',
    borderRadius: 100, flexShrink: 0,
  },
  secBadge: {
    fontSize: 10, fontWeight: 600, padding: '2px 8px',
    borderRadius: 100, background: '#F3F4F6', color: '#6B7280',
    flexShrink: 0,
  },
  goalRow: {
    background: 'var(--bg-2)',
    borderRadius: 6,
    padding: '10px 12px',
    marginBottom: 4,
  },
  freeRow: {
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
  },
  lockedRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '5px 7px',
  },
  lockExplanation: {
    background: '#FFFBEB',
    border: '1px solid #FDE68A',
    borderRadius: 6,
    padding: '10px 12px',
    marginBottom: 4,
    marginLeft: 8,
  },
  sectionLabel: {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
  },
  sectionLine: {
    flex: 1, height: 1, background: 'var(--border)',
  },
  sectionLabelText: {
    fontSize: 12, fontWeight: 700, color: 'var(--text-3)',
    whiteSpace: 'nowrap', background: 'var(--bg-2)', padding: '0 4px',
  },
  video: {
    height: 190,
    background: 'linear-gradient(135deg, #0D3D26 0%, #00A651 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', gap: 12, cursor: 'pointer',
  },
  videoPlay: {
    width: 56, height: 56,
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, color: '#fff',
    border: '2px solid rgba(255,255,255,0.5)',
  },
  upgradeBanner: {
    background: 'linear-gradient(135deg, #007A3C 0%, #00A651 100%)',
    borderRadius: 'var(--r-lg)',
    padding: '24px 28px',
    display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
    marginBottom: 4,
  },
  verifySection: {
    background: '#fff',
    border: '2px solid var(--primary)',
    borderRadius: 'var(--r-lg)',
    padding: '32px', textAlign: 'center', marginTop: 28,
  },
  verifyBenefits: {
    display: 'inline-flex', flexDirection: 'column', gap: 10, textAlign: 'left',
  },
}
