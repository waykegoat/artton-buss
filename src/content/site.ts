import { assetUrl } from '@/utils/url'

export type ServiceCategory = 'ceilings' | 'tinting'
export type PortfolioCategory = 'track' | 'two-level' | 'photo-print' | 'tinting'

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
    image: assetUrl('/images/2layer/2layer2.jpg'),
    imageAlt: 'Светлый натяжной потолок с точечным освещением',
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
    image: assetUrl('/images/tonirovka/tonirovka1.jpg'),
    imageAlt: 'Тонированное панорамное окно частного дома',
    features: ['Зеркальные решения', 'Больше приватности', 'Снижение яркости солнечного света'],
  },
]

export const portfolio: PortfolioItem[] = [
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
    title: 'Зеркальная плёнка 15%',
    description: 'Тонировка панорамного окна частного дома.',
    image: assetUrl('/images/tonirovka/tonirovka1.jpg'),
    imageAlt: 'Панорамное окно с зеркальной тонировочной плёнкой',
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
    id: 'tinting-3',
    category: 'tinting',
    title: 'Плёнка для окон дома',
    description: 'Более комфортный свет и приватность внутри.',
    image: assetUrl('/images/tonirovka/tonirovka4.jpg'),
    imageAlt: 'Тонированное окно частного дома, вид из помещения',
  },
  {
    id: 'photo-3',
    category: 'photo-print',
    title: 'Потолок с рисунком',
    description: 'Индивидуальное решение для необычного интерьера.',
    image: assetUrl('/images/photoprint/photoprint5.jpg'),
    imageAlt: 'Натяжной потолок с индивидуальным рисунком',
  },
  {
    id: 'tinting-4',
    category: 'tinting',
    title: 'Тонировка веранды',
    description: 'Работа с несколькими оконными секциями.',
    image: assetUrl('/images/tonirovka/tonirovka6.jpg'),
    imageAlt: 'Тонированные окна закрытой веранды',
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
