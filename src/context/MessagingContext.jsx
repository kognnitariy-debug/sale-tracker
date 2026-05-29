import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext(null)
const KEY = 'st_messages'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
function persist(msgs) {
  localStorage.setItem(KEY, JSON.stringify(msgs))
}

const SEED = [
  {
    id: 'seed1', from: 's1', to: 'b1', type: 'kp',
    date: '2026-05-27', status: 'new',
    subject: 'КП — Молоко пастеризованное 3.2%, 1 л',
    productName: 'Молоко пастеризованное 3.2%',
    category: 'Молочная продукция',
    price: '65 ₽/л', quantum: '500 кг', rrc: true,
    region: 'Москва', segment: 'mid',
    body: 'Добрый день! Предлагаем рассмотреть нашу молочную продукцию. Производство Подмосковье, сертификаты ГОСТ. Готовы обсудить условия поставки.',
  },
  {
    id: 'seed2', from: 's2', to: 'b2', type: 'kp',
    date: '2026-05-26', status: 'read',
    subject: 'КП — Говядина охлаждённая категории А',
    productName: 'Говядина охлаждённая кат. А',
    category: 'Мясо и птица',
    price: '480 ₽/кг', quantum: '200 кг', rrc: false,
    region: 'Новосибирск', segment: 'economy',
    body: 'Здравствуйте! КФХ Сибирские продукты предлагает говядину охлаждённую. Собственное хозяйство, прямые поставки без посредников. Готовы к переговорам.',
  },
  {
    id: 'seed3', from: 's3', to: 'b1', type: 'kp',
    date: '2026-05-25', status: 'replied',
    subject: 'КП — Хлеб ржаной фермерский 400г',
    productName: 'Хлеб ржаной фермерский 400г',
    category: 'Хлебобулочные',
    price: '85 ₽/шт', quantum: '100 кг', rrc: true,
    region: 'Самара', segment: 'premium',
    body: 'Добрый день! ИП Фермер Иванов предлагает хлеб ржаной на закваске. Без консервантов, eco-упаковка. Возможна дегустационная партия.',
  },
]

export function MessagingProvider({ children }) {
  const [messages, setMessages] = useState(() => {
    const stored = load()
    if (stored.length === 0) { persist(SEED); return SEED }
    return stored
  })

  const sendMessage = useCallback((msg) => {
    const newMsg = {
      ...msg,
      id: `msg_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'new',
    }
    setMessages(prev => {
      const next = [...prev, newMsg]
      persist(next)
      return next
    })
    return newMsg
  }, [])

  const updateStatus = useCallback((id, status) => {
    setMessages(prev => {
      const next = prev.map(m => m.id === id ? { ...m, status } : m)
      persist(next)
      return next
    })
  }, [])

  const getInbox = useCallback((buyerId) => {
    return messages
      .filter(m => m.to === buyerId)
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [messages])

  const getOutbox = useCallback((supplierId) => {
    return messages.filter(m => m.from === supplierId)
  }, [messages])

  return (
    <Ctx.Provider value={{ messages, sendMessage, updateStatus, getInbox, getOutbox }}>
      {children}
    </Ctx.Provider>
  )
}

export function useMessaging() {
  return useContext(Ctx)
}
