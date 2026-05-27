export const PLAN_META = {
  free:    { id: 'free',    label: 'Рабочее место',   price: 0,      priceLabel: '0 ₽',       color: '#6B7280', colorBg: '#F3F4F6', next: 'online'  },
  online:  { id: 'online',  label: 'Онлайн продавец', price: 50000,  priceLabel: '50 000 ₽',  color: '#3B82F6', colorBg: '#EFF6FF', next: 'network' },
  network: { id: 'network', label: 'Сетевой отдел',   price: 150000, priceLabel: '150 000 ₽', color: '#00A651', colorBg: '#E6F7EE', next: 'office'  },
  office:  { id: 'office',  label: 'Офис продаж',     price: 250000, priceLabel: '250 000 ₽', color: '#F59E0B', colorBg: '#FFFBEB', next: null      },
}

export const PLAN_ORDER = ['free', 'online', 'network', 'office']

// Feature flags per plan — v2
export const FEATURES = {
  product: {
    //                         cards  kp   visible  recommend  expertReview  banners  abTest  kpCheck
    free:    { cards: 1,  kp: 1,  visible: false, recommend: false, expertReview: false, banners: 0, abTest: false, kpCheck: false },
    online:  { cards: 5,  kp: 5,  visible: true,  recommend: false, expertReview: false, banners: 0, abTest: false, kpCheck: 'ai'  },
    network: { cards: 15, kp: 15, visible: true,  recommend: true,  expertReview: false, banners: 0, abTest: true,  kpCheck: 'ai'  },
    office:  { cards: 30, kp: 15, visible: true,  recommend: true,  expertReview: true,  banners: 2, abTest: true,  kpCheck: 'expert'},
  },
  interaction: {
    //                  mailings     kpMonth      zoom     offline  autoPush     chat        tenders   manager      requests      contracts
    free:    { mailings: 0,     kpMonth: 0,     zoom: false, offline: 0, autoPush: false,    chat: 'none',    tenders: 'anon', manager: false,     requests: 'direct', contracts: 'template'    },
    online:  { mailings: 5,     kpMonth: 5,     zoom: false, offline: 0, autoPush: false,    chat: 'inbound', tenders: 'cat1', manager: false,     requests: 10,       contracts: 'on_reply'    },
    network: { mailings: 999,   kpMonth: 999,   zoom: 3,     offline: 2, autoPush: 'auto',   chat: 'ai',      tenders: 'cat2', manager: 'consult', requests: 999,      contracts: 'full'        },
    office:  { mailings: 999,   kpMonth: 999,   zoom: 999,   offline: 3, autoPush: 'manual', chat: 'managed', tenders: 'cat3', manager: 'full',    requests: 999,      contracts: 'guaranteed'  },
  },
  analytics: {
    //                  level           scoring    dashboard    research      analysis
    free:    { level: 'general',    scoring: false,    dashboard: false,     research: 'teaser',   analysis: false    },
    online:  { level: 'categories', scoring: false,    dashboard: 'partial', research: 'limited',  analysis: false    },
    network: { level: 'detailed',   scoring: 'ai',     dashboard: true,      research: 'standard', analysis: 'ai'     },
    office:  { level: 'full',       scoring: 'expert', dashboard: 'advanced',research: 'custom',   analysis: 'expert' },
  },
  company: {
    //                  verified  enriched  status            promo  top5   featured
    free:    { verified: false, enriched: false, status: 'guest',       promo: 0, top5: false, featured: false },
    online:  { verified: true,  enriched: true,  status: 'user',        promo: 0, top5: false, featured: false },
    network: { verified: true,  enriched: true,  status: 'practitioner',promo: 1, top5: true,  featured: false },
    office:  { verified: true,  enriched: true,  status: 'recommended', promo: 2, top5: true,  featured: true  },
  },
  team: {
    //                  accounts  rating    passport  roles   history  crm
    free:    { accounts: 1,  rating: false,  passport: false, roles: false, history: false, crm: false },
    online:  { accounts: 2,  rating: 'like', passport: false, roles: true,  history: false, crm: false },
    network: { accounts: 5,  rating: 'star', passport: true,  roles: true,  history: true,  crm: false },
    office:  { accounts: 15, rating: 'case', passport: true,  roles: true,  history: true,  crm: true  },
  },
  learning: {
    //                  kb     webinars  aiTrainer  digests      consultation  kvk
    free:    { kb: true, webinars: false, aiTrainer: 'demo',   digests: 'limited', consultation: false, kvk: 'demo'    },
    online:  { kb: true, webinars: true,  aiTrainer: true,     digests: 'general', consultation: false, kvk: true      },
    network: { kb: true, webinars: true,  aiTrainer: true,     digests: 'personal',consultation: false, kvk: true      },
    office:  { kb: true, webinars: true,  aiTrainer: 'mentor', digests: 'premium', consultation: true,  kvk: 'offline' },
  },
}

// Upgrade nudges per section × plan
export const NUDGES = {
  product: {
    free: {
      text: 'Добавьте ещё 4 карточки — и ваш товар станет виден закупщикам. Карточка продукта и коммерческое предложение появятся в поиске сетей автоматически.',
      sub: 'Сейчас вас находят только по точному названию. С верификацией — по категории, региону и параметрам.',
    },
    online: {
      text: 'С 15 карточками и ИИ-рекомендациями ваш продукт попадёт в автоматический подбор сетей по параметрам.',
      sub: 'Система сама предлагает ваш товар закупщикам, которые ищут похожую продукцию.',
    },
    network: {
      text: 'Экспертная проверка КП перед отправкой увеличивает конверсию в ответ на 40%.',
      sub: 'Эксперт проверяет ваше КП по стандартам конкретной сети до того, как закупщик его увидит.',
    },
    office: null,
  },
  communications: {
    free: {
      text: 'Начните активные продажи — отправьте карточку товара в 5 сетей сами, не ожидая входящего.',
      sub: 'Сейчас вы только ждёте, когда сеть найдёт вас. Пора выходить первым.',
    },
    online: {
      text: 'Zoom-переговоры и автопуш закупщикам ускоряют сделку в 3 раза.',
      sub: 'Живой разговор с закупщиком + автоматическое напоминание о вашем КП каждые 5 дней.',
    },
    network: {
      text: 'Персональный менеджер лично дожимает закупщиков и добивается ответа за вас.',
      sub: 'Вы занимаетесь производством, менеджер — продажами в сети.',
    },
    office: null,
  },
  analytics: {
    free: {
      text: 'Узнайте, сколько переговоров идёт в вашей категории и в каких именно сетях.',
      sub: 'Принимайте решения на данных, а не интуиции.',
    },
    online: {
      text: 'ИИ-скоринг покажет, готов ли ваш продукт к сетям и что конкретно доработать.',
      sub: 'Оценка по 12 параметрам с конкретными рекомендациями по улучшению.',
    },
    network: {
      text: 'Экспертный анализ ваших переговоров — персональные рекомендации от специалиста.',
      sub: 'Разбор реальных переговоров: что говорить, как реагировать, как дожать.',
    },
    office: null,
  },
}

// Mock data for the cabinet
export const MOCK = {
  products: [
    { id: 1, name: 'Молоко пастеризованное 2,5%, 1л', category: 'Молочная продукция', price: 68, unit: 'шт', volume: '120 000 шт/мес', status: 'active', views: 142, networks: 3 },
    { id: 2, name: 'Кефир 2,5%, 1л', category: 'Молочная продукция', price: 72, unit: 'шт', volume: '80 000 шт/мес', status: 'active', views: 89, networks: 1 },
    { id: 3, name: 'Ряженка 4%, 500мл', category: 'Молочная продукция', price: 54, unit: 'шт', volume: '60 000 шт/мес', status: 'draft', views: 0, networks: 0 },
  ],
  kp: [
    { id: 1, name: 'КП для Пятёрочки — молоко', date: '14.05.2025', status: 'sent', network: 'Пятёрочка' },
    { id: 2, name: 'КП для Магнита — кефир', date: '20.05.2025', status: 'viewed', network: 'Магнит' },
  ],
  negotiations: [
    { id: 1, network: 'Пятёрочка', product: 'Молоко 2,5%', stage: 'kp_sent', date: '14.05.2025', responsible: 'Иванов А.В.', comment: 'КП открыто закупщиком' },
    { id: 2, network: 'Магнит', product: 'Кефир 2,5%', stage: 'waiting', date: '20.05.2025', responsible: 'Сидорова М.П.', comment: 'Ожидаем ответ 5 дней' },
    { id: 3, network: 'Лента', product: 'Молоко 2,5%', stage: 'zoom_scheduled', date: '27.05.2025', responsible: 'Иванов А.В.', comment: 'Zoom 29.05 в 14:00' },
  ],
  analytics: {
    categoryDeals: [
      { name: 'Пятёрочка', deals: 47, avgContract: '2.1 млн ₽' },
      { name: 'Магнит', deals: 39, avgContract: '1.8 млн ₽' },
      { name: 'Лента', deals: 28, avgContract: '3.2 млн ₽' },
      { name: 'ВкусВилл', deals: 19, avgContract: '0.9 млн ₽' },
      { name: 'Дикси', deals: 12, avgContract: '1.4 млн ₽' },
    ],
    scoring: 62,
    funnelSteps: [
      { name: 'Зарегистрированы', count: 100, pct: 100 },
      { name: 'Верифицированы', count: 73, pct: 73 },
      { name: 'Отправили КП', count: 41, pct: 41 },
      { name: 'Провели Zoom', count: 22, pct: 22 },
      { name: 'Предварительный договор', count: 11, pct: 11 },
    ],
  },
  team: [
    { id: 1, name: 'Иванов Алексей Владимирович', role: 'Руководитель', email: 'a.ivanov@company.ru', status: 'owner' },
    { id: 2, name: 'Сидорова Мария Петровна', role: 'Менеджер по сетям', email: 'm.sidorova@company.ru', status: 'active' },
  ],
}
