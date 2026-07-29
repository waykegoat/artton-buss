import { assetUrl } from '@/utils/url'

export type ServiceCategory = 'ceilings' | 'tinting'
export type PortfolioCategory = 'track' | 'light-lines' | 'two-level' | 'photo-print' | 'tinting'

export interface Service {
  id: string
  category: ServiceCategory
  title: string
  description: string
  image: string
  imageAlt: string
  features: string[]
}

export interface PortfolioItem {
  id: string
  category: PortfolioCategory
  title: string
  description: string
  image: string
  imageAlt: string
}

export const services: Service[] = [
  {
    id: 'classic',
    category: 'ceilings',
    title: 'Классические потолки',
    description: 'Лаконичная ровная поверхность для жилых и коммерческих помещений.',
    image: assetUrl('/images/classic/classic1.png'),
    imageAlt: 'Классический белый натяжной потолок с точечным освещением',
    features: [
      'Матовые и сатиновые фактуры',
      'Точечное и основное освещение',
      'Аккуратные примыкания',
    ],
  },
  {
    id: 'track-light',
    category: 'ceilings',
    title: 'Трековое освещение',
    description: 'Гибкий сценарий света, который можно менять после завершения ремонта.',
    image: assetUrl('/images/tracklight/tracklight1.jpg'),
    imageAlt: 'Натяжной потолок с чёрной трековой системой и светильниками',
    features: ['Встроенные треки', 'Поворотные светильники', 'Сценарии общего и акцентного света'],
  },
  {
    id: 'light-lines',
    category: 'ceilings',
    title: 'Световые линии',
    description: 'Встроенное линейное освещение для ровного, выразительного света.',
    image: assetUrl('/images/lightlines/lightlines1.jpg'),
    imageAlt: 'Натяжной потолок со световыми линиями',
    features: [
      'Прямые и угловые композиции',
      'Равномерное освещение',
      'Сценарии под планировку комнаты',
    ],
  },
  {
    id: 'two-level',
    category: 'ceilings',
    title: 'Двухуровневые конструкции',
    description: 'Выразительная геометрия, зонирование пространства и сочетание фактур.',
    image: assetUrl('/images/2layer/2layer1.jpg'),
    imageAlt: 'Двухуровневый потолок с тёмной рамой по периметру',
    features: ['Зонирование помещения', 'Комбинация цветов', 'Фигурные решения'],
  },
  {
    id: 'photo-print',
    category: 'ceilings',
    title: 'Фотопечать',
    description: 'Индивидуальное изображение на полотне для яркого интерьерного акцента.',
    image: assetUrl('/images/photoprint/photoprint1.jpg'),
    imageAlt: 'Натяжной потолок с художественной фотопечатью',
    features: [
      'Индивидуальный сюжет',
      'Подбор масштаба изображения',
      'Сочетание со встроенным светом',
    ],
  },
  {
    id: 'window-tinting',
    category: 'tinting',
    title: 'Тонировка окон',
    description: 'Плёнка для окон дома, квартиры, офиса, балкона или веранды.',
    image: assetUrl('/images/tonirovka/tonirovka.jpg'),
    imageAlt: 'Архитектурная тонировка окон частного дома',
    features: ['Архитектурная тонировка', 'Атермальная тонировка', 'Бронирование стекла'],
  },
]

export const portfolio: PortfolioItem[] = [
  {
    id: 'light-lines-1',
    category: 'light-lines',
    title: 'Световые линии в интерьере',
    description: 'Линейный свет как основной и акцентный сценарий освещения.',
    image: assetUrl('/images/lightlines/lightlines1.jpg'),
    imageAlt: 'Световые линии в натяжном потолке',
  },
  {
    id: 'light-lines-2',
    category: 'light-lines',
    title: 'Геометрия световых линий',
    description: 'Линейное освещение для современного интерьера.',
    image: assetUrl('/images/lightlines/lightlines2.jpg'),
    imageAlt: 'Геометрические световые линии на натяжном потолке',
  },
  {
    id: 'light-lines-3',
    category: 'light-lines',
    title: 'Линейный свет в комнате',
    description: 'Ровный свет и аккуратная интеграция в потолок.',
    image: assetUrl('/images/lightlines/lightlines3.jpg'),
    imageAlt: 'Линейное освещение в натяжном потолке',
  },
  {
    id: 'light-lines-4',
    category: 'light-lines',
    title: 'Световые линии под планировку',
    description: 'Акцентируем зоны комнаты с помощью встроенного света.',
    image: assetUrl('/images/lightlines/lightlines4.jpg'),
    imageAlt: 'Световые линии в интерьере квартиры',
  },
  {
    id: 'light-lines-5',
    category: 'light-lines',
    title: 'Световой сценарий интерьера',
    description: 'Композиция из линий для основного и акцентного освещения.',
    image: assetUrl('/images/lightlines/lightlines6.jpg'),
    imageAlt: 'Натяжной потолок со встроенными световыми линиями',
  },
  {
    id: 'track-1',
    category: 'track',
    title: 'Геометрическая трековая система',
    description: 'Комбинация трековых и точечных светильников.',
    image: assetUrl('/images/tracklight/tracklight1.jpg'),
    imageAlt: 'Геометрическая трековая система на белом потолке',
  },
  {
    id: 'tinting-1',
    category: 'tinting',
    title: 'Архитектурная тонировка дома',
    description: 'Солнцезащитная плёнка для окон частного дома.',
    image: assetUrl('/images/tonirovka/tonirovka.jpg'),
    imageAlt: 'Дом с архитектурной тонировкой окон',
  },
  {
    id: 'two-level-1',
    category: 'two-level',
    title: 'Контрастный второй уровень',
    description: 'Светлое полотно с тёмным периметром.',
    image: assetUrl('/images/2layer/2layer1.jpg'),
    imageAlt: 'Контрастный двухуровневый натяжной потолок',
  },
  {
    id: 'photo-1',
    category: 'photo-print',
    title: 'Фотопечать в интерьере',
    description: 'Акцентный потолок с индивидуальным изображением.',
    image: assetUrl('/images/photoprint/photoprint2.jpg'),
    imageAlt: 'Фотопечать с морской раковиной на натяжном потолке',
  },
  {
    id: 'track-2',
    category: 'track',
    title: 'Линия направленного света',
    description: 'Трековые светильники для функциональной зоны.',
    image: assetUrl('/images/tracklight/tracklight2.jpg'),
    imageAlt: 'Линейная трековая система с направленными светильниками',
  },
  {
    id: 'tinting-2',
    category: 'tinting',
    title: 'Тонировка остекления',
    description: 'Равномерное затемнение большой площади окна.',
    image: assetUrl('/images/tonirovka/tonirovka2.jpg'),
    imageAlt: 'Тонированное остекление в жилом помещении',
  },
  {
    id: 'two-level-2',
    category: 'two-level',
    title: 'Мягкая геометрия',
    description: 'Двухуровневая конструкция с точечным светом.',
    image: assetUrl('/images/2layer/2layer3.jpg'),
    imageAlt: 'Двухуровневый потолок сложной геометрической формы',
  },
  {
    id: 'photo-2',
    category: 'photo-print',
    title: 'Декоративная фотопечать',
    description: 'Сложный рисунок по всей поверхности полотна.',
    image: assetUrl('/images/photoprint/photoprint3.jpg'),
    imageAlt: 'Декоративная фотопечать на натяжном потолке',
  },
  {
    id: 'track-3',
    category: 'track',
    title: 'Треки в светлом интерьере',
    description: 'Чёрные линии света как графичный элемент.',
    image: assetUrl('/images/tracklight/tracklight4.jpg'),
    imageAlt: 'Чёрная трековая система в светлом помещении',
  },
  {
    id: 'photo-3',
    category: 'photo-print',
    title: 'Потолок с рисунком',
    description: 'Индивидуальное решение для необычного интерьера.',
    image: assetUrl('/images/2layer/2layer5.jpg'),
    imageAlt: 'Натяжной потолок с индивидуальным рисунком',
  },
  {
    id: 'tinting-4',
    category: 'tinting',
    title: 'Тонировка балкона',
    description: 'Защита от солнца и дополнительная приватность.',
    image: assetUrl('/images/tonirovka/balcon.jpg'),
    imageAlt: 'Балкон с тонированным остеклением',
  },
  {
    id: 'cornice-1',
    category: 'two-level',
    title: 'Скрытый карниз',
    description: 'Аккуратная линия шторы без видимых креплений.',
    image: assetUrl('/images/hided-cornise/hided-cornise1.jpg'),
    imageAlt: 'Натяжной потолок со скрытым карнизом',
  },
  {
    id: 'contour-1',
    category: 'two-level',
    title: 'Контурный профиль',
    description: 'Световой акцент по периметру потолка.',
    image: assetUrl('/images/conture-profile/conture-profile1.jpg'),
    imageAlt: 'Контурный профиль в натяжном потолке',
  },
  {
    id: 'lights-1',
    category: 'track',
    title: 'Точечные светильники',
    description: 'Ровный свет и чистая геометрия интерьера.',
    image: assetUrl('/images/dot-lamps/dot-lamps1.jpg'),
    imageAlt: 'Точечные светильники в натяжном потолке',
  },
  {
    id: 'air-1',
    category: 'two-level',
    title: 'Парящий эффект',
    description: 'Световая линия по краю конструкции добавляет интерьеру лёгкость.',
    image: assetUrl('/images/aireffect/aireffect.jpg'),
    imageAlt: 'Парящий натяжной потолок с подсветкой',
  },
  {
    id: 'photo-4',
    category: 'photo-print',
    title: 'Фотопечать с подсветкой',
    description: 'Декоративное решение для выразительного интерьера.',
    image: assetUrl('/images/photoprint/photoprint4.jpg'),
    imageAlt: 'Потолок с фотопечатью и подсветкой',
  },
]

export const processSteps = [
  {
    number: '01',
    title: 'Знакомимся с задачей',
    description: 'Уточняем помещение, желаемый результат и удобное время.',
  },
  {
    number: '02',
    title: 'Подбираем решение',
    description: 'Для потолка проводим замер, для тонировки начинаем с консультации.',
  },
  {
    number: '03',
    title: 'Согласуем детали',
    description: 'Фиксируем материалы, объём работы и итоговые условия.',
  },
  {
    number: '04',
    title: 'Выполняем работу',
    description: 'Приезжаем в согласованное время и реализуем выбранное решение.',
  },
] as const

export const faq = [
  {
    question: 'В каких городах вы работаете?',
    answer: 'В Заречном, Пензе и других населённых пунктах Пензенской области.',
  },
  {
    question: 'Замер потолка платный?',
    answer:
      'На сайте используется запись на бесплатный замер. Условия для конкретного адреса подтвердит специалист.',
  },
  {
    question: 'Нужен ли замер для тонировки?',
    answer:
      'Первый шаг для тонировки — консультация. Специалист уточнит объект и скажет, что потребуется дальше.',
  },
  {
    question: 'Можно ли совместить потолок и сложное освещение?',
    answer:
      'Да. Среди реализованных работ есть встроенные трековые системы и комбинированное освещение.',
  },
] as const
