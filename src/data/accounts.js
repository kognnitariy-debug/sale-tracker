export const SUPPLIERS = [
  {
    id: 's1', role: 'supplier', name: 'ООО Агро-Молоко',
    inn: '7701234567', region: 'Москва', segment: 'mid',
    categories: ['dairy'], plan: 'network', verified: true,
    description: 'Молочное производство Подмосковье. ГОСТ, сертификаты имеются.',
    logo: '🐄', employees: 42, founded: 2015,
  },
  {
    id: 's2', role: 'supplier', name: 'КФХ Сибирские продукты',
    inn: '5401234567', region: 'Новосибирск', segment: 'economy',
    categories: ['meat', 'frozen'], plan: 'online', verified: true,
    description: 'Собственное хозяйство, прямые поставки без посредников.',
    logo: '🥩', employees: 18, founded: 2012,
  },
  {
    id: 's3', role: 'supplier', name: 'ИП Фермер Иванов',
    inn: '6301234567', region: 'Самара', segment: 'premium',
    categories: ['bakery', 'confectionery'], plan: 'office', verified: true,
    description: 'Фермерская выпечка на закваске. Без консервантов, eco-упаковка.',
    logo: '🍞', employees: 8, founded: 2019,
  },
]

export const BUYERS = [
  {
    id: 'b1', role: 'buyer', name: 'Перекрёсток',
    type: 'supermarket', stores: 1000,
    regions: ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань'],
    categories: ['dairy', 'bakery', 'confectionery'],
    logo: '🛒', contact: 'Иванова А.В., категорийный менеджер',
  },
  {
    id: 'b2', role: 'buyer', name: 'Магнит',
    type: 'supermarket', stores: 28000,
    regions: ['Все регионы РФ'],
    categories: ['dairy', 'meat', 'bakery', 'frozen'],
    logo: '🏪', contact: 'Петров С.И., закупщик',
  },
  {
    id: 'b3', role: 'buyer', name: 'Лента',
    type: 'hypermarket', stores: 600,
    regions: ['Москва', 'Санкт-Петербург', 'Краснодар', 'Новосибирск'],
    categories: ['meat', 'frozen', 'dairy'],
    logo: '🏬', contact: 'Сидорова М.К., менеджер по закупкам',
  },
]

export const MOCK_PRODUCTS = [
  { id: 'p1', supplierId: 's1', name: 'Молоко пастеризованное 3.2% 1л', category: 'dairy', sub: 'milk', price: 65, unit: 'л', quantum: 500, rrc: true, region: 'Москва', segment: 'mid' },
  { id: 'p2', supplierId: 's1', name: 'Кефир 2.5% 1л', category: 'dairy', sub: 'kefir', price: 72, unit: 'л', quantum: 500, rrc: true, region: 'Москва', segment: 'mid' },
  { id: 'p3', supplierId: 's1', name: 'Сметана 20% 400г', category: 'dairy', sub: 'butter', price: 95, unit: 'шт', quantum: 300, rrc: true, region: 'Москва', segment: 'mid' },
  { id: 'p4', supplierId: 's2', name: 'Говядина охлаждённая кат. А', category: 'meat', sub: 'beef', price: 480, unit: 'кг', quantum: 200, rrc: false, region: 'Новосибирск', segment: 'economy' },
  { id: 'p5', supplierId: 's2', name: 'Свинина б/к охлаждённая', category: 'meat', sub: 'pork', price: 380, unit: 'кг', quantum: 200, rrc: false, region: 'Новосибирск', segment: 'economy' },
  { id: 'p6', supplierId: 's2', name: 'Фарш говяжий 500г', category: 'meat', sub: 'semi', price: 320, unit: 'кг', quantum: 150, rrc: false, region: 'Новосибирск', segment: 'economy' },
  { id: 'p7', supplierId: 's3', name: 'Хлеб ржаной фермерский 400г', category: 'bakery', sub: 'bread', price: 85, unit: 'шт', quantum: 100, rrc: true, region: 'Самара', segment: 'premium' },
  { id: 'p8', supplierId: 's3', name: 'Батон нарезной пшеничный 350г', category: 'bakery', sub: 'buns', price: 55, unit: 'шт', quantum: 200, rrc: true, region: 'Самара', segment: 'premium' },
  { id: 'p9', supplierId: 's3', name: 'Круассаны ассорти 200г', category: 'confectionery', sub: 'pastry', price: 145, unit: 'шт', quantum: 100, rrc: true, region: 'Самара', segment: 'premium' },
]

export const ALL_ACCOUNTS = [...SUPPLIERS, ...BUYERS]
