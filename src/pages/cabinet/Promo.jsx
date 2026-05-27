import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FEATURES, NUDGES, PLAN_META } from '../../data/plans'

function Lock({ text, plan, why }) {
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

const TENDER_LABELS = { anon: 'Анонимный', cat1: 'Категория 1', cat2: 'Категория 1–2', cat3: 'Категория 1–3' }
const TENDER_COLORS = { anon: '#9CA3AF', cat1: '#3B82F6', cat2: '#00A651', cat3: '#F59E0B' }

const MOCK_TENDERS = [
  { id: 1, network: 'Лента',       category: 'Молочная продукция',  deadline: '10.06.2025', slots: 3 },
  { id: 2, network: 'ВкусВилл',    category: 'Фермерская молочка',  deadline: '20.06.2025', slots: 1 },
  { id: 3, network: 'Перекрёсток', category: 'СТМ молочная',        deadline: '05.07.2025', slots: 5 },
]

export default function Promo({ planId }) {
  const navigate = useNavigate()
  const fi = FEATURES.interaction[planId]
  const fc = FEATURES.company[planId]
  const nudge = NUDGES.communications[planId]
  const next = PLAN_META[PLAN_META[planId]?.next]
  const tenderColor = TENDER_COLORS[fi.tenders] || '#9CA3AF'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Autopush + Manager */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Push-уведомления и дожим закупщиков</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>

          <div style={{ flex: 1, minWidth: 220, background: fi.autoPush ? '#E6F7EE' : 'var(--bg-2)', border: `1px solid ${fi.autoPush ? '#6EE7B7' : 'var(--border)'}`, borderRadius: 'var(--r)', padding: '16px 18px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: fi.autoPush ? 'var(--primary-dark)' : 'var(--text-4)' }}>
              {fi.autoPush ? '✅ Автопуш активен' : planId === 'online' ? '🔔 Уведомления о просмотрах' : '🔒 Автопуш недоступен'}
            </div>
            <div style={{ fontSize: 13, color: fi.autoPush ? 'var(--primary)' : planId === 'online' ? 'var(--text-3)' : 'var(--text-4)', lineHeight: 1.5 }}>
              {fi.autoPush === 'auto'
                ? 'Платформа автоматически напоминает закупщикам о вашем КП каждые 5 дней.'
                : fi.autoPush === 'manual'
                ? 'Ваш менеджер вручную пушит закупщиков — максимальная персонализация.'
                : planId === 'online'
                ? 'Вы получаете уведомление, когда закупщик смотрит ваш профиль или КП.'
                : 'Доступно в «Сетевой отдел». Автоматические напоминания возвращают вас наверх стека.'}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 220, background: fi.manager ? '#FFFBEB' : 'var(--bg-2)', border: `1px solid ${fi.manager ? '#FDE68A' : 'var(--border)'}`, borderRadius: 'var(--r)', padding: '16px 18px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: fi.manager ? '#92400E' : 'var(--text-4)' }}>
              {fi.manager === 'full' ? '👤 Персональный менеджер' : fi.manager === 'consult' ? '👤 Разовая консультация' : '🔒 Персональный менеджер'}
            </div>
            <div style={{ fontSize: 13, color: fi.manager ? '#92400E' : 'var(--text-4)', lineHeight: 1.5 }}>
              {fi.manager === 'full'
                ? 'Иванова Светлана · +7 (495) 000-00-01 · Ежемесячные статус-встречи + личный дожим закупщиков.'
                : fi.manager === 'consult'
                ? 'Разовая консультация по запросу — стратегия, выбор сети, подготовка к переговорам.'
                : 'Доступно в «Офис продаж». Менеджер дожимает закупщиков лично — вы занимаетесь производством.'}
            </div>
            {fi.manager === 'full' && (
              <button className="btn btn-sm" style={{ marginTop: 10, background: '#F59E0B', color: '#fff', border: 'none' }}>
                Связаться →
              </button>
            )}
            {fi.manager === 'consult' && (
              <button className="btn btn-outline btn-sm" style={{ marginTop: 10, borderColor: '#F59E0B', color: '#92400E' }}>
                Записаться на консультацию
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Priority in search */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Приоритет в поиске закупщиков</div>
          <span style={{ fontSize: 12, fontWeight: 600,
            color: fc.top5 ? (planId === 'office' ? '#F59E0B' : 'var(--primary)') : 'var(--text-4)',
            background: fc.top5 ? (planId === 'office' ? '#FFFBEB' : 'var(--primary-light)') : 'var(--bg-3)',
            padding: '3px 10px', borderRadius: 100,
          }}>
            {planId === 'office' ? '⭐ Выделенное размещение' : fc.top5 ? '✔ Приоритет' : 'По умолчанию'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Визуализация выдачи */}
          {['Агро-Молоко (вы)', 'МолПром', 'ФермаСевер', 'DairyRus'].map((name, i) => {
            const isYou = i === 0
            const highlighted = isYou && fc.top5
            const topPos = isYou && planId === 'office'
            return (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                borderRadius: 'var(--r-sm)',
                background: topPos ? '#FFFBEB' : highlighted ? 'var(--primary-light)' : 'var(--bg-2)',
                border: `1px solid ${topPos ? '#FDE68A' : highlighted ? '#6EE7B7' : 'var(--border)'}`,
              }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-4)', width: 16 }}>{i + 1}</div>
                <div style={{ flex: 1, fontWeight: isYou ? 700 : 400, fontSize: 14, color: isYou ? 'var(--text)' : 'var(--text-3)' }}>{name}</div>
                {topPos && <span style={{ fontSize: 11, color: '#92400E', fontWeight: 700 }}>⭐ Выделено</span>}
                {highlighted && !topPos && <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>▲ Приоритет</span>}
                {isYou && !highlighted && <span style={{ fontSize: 11, color: 'var(--text-4)' }}>← вы (без приоритета)</span>}
              </div>
            )
          })}
        </div>

        {!fc.top5 && (
          <div style={{ marginTop: 12 }}>
            {planId === 'online' && (
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 8 }}>
                💡 В вашем тарифе — базовый ИИ-аудит карточки для улучшения позиции
              </div>
            )}
            <Lock text="Приоритет в выдаче при поиске закупщиков" plan="Сетевой отдел · 150 000 ₽" why="Закупщик ищет «молоко Московская область» — вы появляетесь первыми в результатах. Без приоритета вы на 4-й позиции и ниже." />
          </div>
        )}
      </div>

      {/* Offline events */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Офлайн-встречи с закупщиками (ЦЗС)</div>
          {fi.offline > 0
            ? <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: 100 }}>{fi.offline} слота в год</span>
            : <span style={{ fontSize: 12, color: 'var(--text-4)', background: 'var(--bg-3)', padding: '3px 10px', borderRadius: 100 }}>Недоступно</span>
          }
        </div>

        {fi.offline > 0 ? (
          <>
            <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
              10-минутная презентация продукта закупщику на площадке ЦЗС.
              {planId === 'office' ? ' Перед встречей — консультация эксперта платформы.' : ' Мы согласовываем закупщика из вашей категории.'}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              <div style={{ flex: 1, minWidth: 160, background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', padding: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 4 }}>СЛОТОВ ДОСТУПНО</div>
                <div style={{ fontWeight: 800, fontSize: 28, color: 'var(--primary)' }}>{fi.offline}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>из {fi.offline} в год</div>
              </div>
              <div style={{ flex: 2, minWidth: 220, background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', padding: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 8 }}>БЛИЖАЙШИЕ ЦЗС</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>🗓 Молочная категория — 15.06, Москва</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>🗓 День поставщика Лента — 28.06, СПб</div>
              </div>
            </div>
            <button className="btn btn-outline btn-sm">Забронировать слот →</button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 10 }}>
              {planId === 'free'
                ? 'Расписание ближайших ЦЗС доступно для ознакомления:'
                : 'Расписание + превью как проходит мероприятие:'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {[
                ['15.06.2025', 'ЦЗС Молочная', 'Москва'],
                ['28.06.2025', 'День поставщика Лента', 'СПб'],
              ].map(([date, name, city]) => (
                <div key={date} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', opacity: 0.7 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-3)', minWidth: 90 }}>{date}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{name} · {city}</div>
                </div>
              ))}
            </div>
            <Lock text="Слоты на офлайн-встречи с закупщиками" plan="Сетевой отдел · 150 000 ₽" why="Живые встречи в 3 раза эффективнее Zoom. Платформа согласовывает закупщика из вашей категории — 10 минут презентации перед реальным байером." />
          </>
        )}
      </div>

      {/* Tenders */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Тендеры торговых сетей</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: tenderColor, background: `${tenderColor}18`, padding: '4px 12px', borderRadius: 100 }}>
            {TENDER_LABELS[fi.tenders]}
          </span>
        </div>

        {fi.tenders === 'anon' ? (
          <>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>
              Вы видите тендеры в анонимном режиме — название сети скрыто, откликнуться нельзя.
            </div>
            {MOCK_TENDERS.slice(0, 2).map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', marginBottom: 8, opacity: 0.6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-3)' }}>████████ · {t.category}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-4)' }}>Дедлайн: {t.deadline} · {t.slots} слота</div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-4)' }}>🔒</span>
              </div>
            ))}
            <Lock text="Отклик на тендеры + уведомления о новых тендерах" plan="Онлайн продавец · 50 000 ₽" why="Сети регулярно ищут поставщиков через тендеры. Ваш отклик — готовое КП с автоматической проверкой соответствия параметрам сети." />
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14 }}>
              {fi.tenders === 'cat1' && 'Тендеры по категории 1-го уровня. При интересе сети — предложение встречи на ЦЗС.'}
              {fi.tenders === 'cat2' && 'Тендеры по категориям 1–2-го уровня + рекомендация релевантных тендеров от платформы.'}
              {fi.tenders === 'cat3' && 'Полный доступ по всем категориям + помощь команды в подготовке заявки.'}
            </div>
            {MOCK_TENDERS.map((t, i) => {
              const locked = (fi.tenders === 'cat1' && i > 0)
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: locked ? 'var(--bg-2)' : '#fff', borderRadius: 'var(--r-sm)', marginBottom: 8, border: `1px solid ${locked ? 'var(--border)' : 'var(--primary)'}40`, opacity: locked ? 0.5 : 1 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: locked ? 'var(--border)' : 'var(--primary)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.network} · {t.category}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Дедлайн: {t.deadline} · {t.slots} {t.slots === 1 ? 'слот' : 'слота'}</div>
                  </div>
                  {locked
                    ? <span style={{ fontSize: 11, color: 'var(--text-4)' }}>🔒 Выше тариф</span>
                    : <button className="btn btn-primary btn-sm">
                        {fi.tenders === 'cat3' ? 'Подать заявку с помощью →' : 'Откликнуться →'}
                      </button>
                  }
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* Promo campaigns */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Промо-кампании</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* News post — Online+ */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: planId !== 'free' ? 'var(--primary-light)' : 'var(--bg-2)', borderRadius: 'var(--r-sm)', border: `1px solid ${planId !== 'free' ? '#6EE7B7' : 'var(--border)'}`, opacity: planId === 'free' ? 0.5 : 1 }}>
            <span style={{ fontSize: 20 }}>📰</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: planId !== 'free' ? 'var(--primary-dark)' : 'var(--text-3)' }}>
                Публикация новости о компании в ленте
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                {planId !== 'free' ? 'Доступно · 1 публикация в год' : 'Онлайн продавец и выше'}
              </div>
            </div>
            {planId !== 'free' ? (
              <button className="btn btn-outline btn-sm" style={{ borderColor: 'var(--primary)', color: 'var(--primary)', fontSize: 12 }}>Разместить</button>
            ) : (
              <span style={{ fontSize: 11, color: 'var(--text-4)' }}>🔒</span>
            )}
          </div>

          {/* Banner — Network+ */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: ['network', 'office'].includes(planId) ? '#FFFBEB' : 'var(--bg-2)', borderRadius: 'var(--r-sm)', border: `1px solid ${['network', 'office'].includes(planId) ? '#FDE68A' : 'var(--border)'}`, opacity: ['network', 'office'].includes(planId) ? 1 : 0.5 }}>
            <span style={{ fontSize: 20 }}>🖼</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: ['network', 'office'].includes(planId) ? '#92400E' : 'var(--text-3)' }}>
                Баннер в категории каталога
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                {planId === 'network' ? '1 баннер в год · Ваша категория видна всем закупщикам' : planId === 'office' ? '2 баннера в год + спецрепортаж в дайджесте закупщиков' : 'Сетевой отдел и выше'}
              </div>
            </div>
            {['network', 'office'].includes(planId) ? (
              <button className="btn btn-sm" style={{ background: '#F59E0B', color: '#fff', border: 'none', fontSize: 12 }}>Разместить</button>
            ) : (
              <span style={{ fontSize: 11, color: 'var(--text-4)' }}>🔒</span>
            )}
          </div>

          {/* Special report — Office */}
          {planId === 'office' && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: '#FFFBEB', borderRadius: 'var(--r-sm)', border: '1px solid #FDE68A' }}>
              <span style={{ fontSize: 20 }}>⭐</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#92400E' }}>Спецрепортаж в дайджесте закупщиков</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Статья о вашей компании + продукте в еженедельной рассылке закупщикам вашей категории</div>
              </div>
              <button className="btn btn-sm" style={{ background: '#F59E0B', color: '#fff', border: 'none', fontSize: 12 }}>Запустить</button>
            </div>
          )}

          {!['network', 'office'].includes(planId) && (
            <Lock text="Баннер в категории + спецрепортаж в дайджесте закупщиков" plan="Сетевой отдел · 150 000 ₽" why="Ваш баннер видят все закупщики, которые смотрят вашу товарную категорию. Это пассивный поток входящих — без активных действий с вашей стороны." />
          )}
        </div>
      </div>

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
