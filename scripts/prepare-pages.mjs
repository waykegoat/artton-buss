import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'

const projectRoot = resolve(import.meta.dirname, '..')
const outputDirectory = resolve(projectRoot, 'dist')
const publicRoutes = ['services', 'portfolio', 'contacts']
const siteUrl = (process.env.VITE_SITE_URL ?? 'https://artton58.ru').replace(/\/$/, '')
const socialImageUrl = `${siteUrl}/og.png`

const pageSeo = {
  'index.html': {
    path: '/',
    title: 'Монтаж натяжных потолков и солнцезащитных плёнок — Art Ton',
    description:
      'Монтаж натяжных потолков и солнцезащитных плёнок в Заречном, Пензе и Пензенской области. Бесплатный замер и консультация.',
  },
  'services/index.html': {
    path: '/services/',
    title: 'Натяжные потолки и тонировка окон — Art Ton',
    description:
      'Классические и двухуровневые натяжные потолки, трековое освещение, фотопечать и тонировка окон в Пензенской области.',
  },
  'portfolio/index.html': {
    path: '/portfolio/',
    title: 'Портфолио натяжных потолков и тонировки — Art Ton',
    description:
      'Реальные работы Art Ton: натяжные потолки, трековое освещение, фотопечать и тонировка окон.',
  },
  'contacts/index.html': {
    path: '/contacts/',
    title: 'Контакты Art Ton — Заречный, Пенза и Пензенская область',
    description:
      'Запись на бесплатный замер натяжного потолка и консультацию по тонировке окон. Телефон +7 (987) 505-18-59.',
  },
}

const structuredData = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'Art Ton',
  url: siteUrl,
  telephone: '+79875051859',
  sameAs: ['https://vk.ru/art_ton_58', 'https://max.ru/channel_art_ton_58'],
  areaServed: ['Заречный', 'Пенза', 'Пензенская область'],
  openingHours: 'Mo-Sa 09:00-20:00',
  serviceType: ['Натяжные потолки', 'Тонировка окон'],
}).replaceAll('<', '\\u003c')

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function injectSeo(html, page) {
  const canonicalUrl = `${siteUrl}${page.path}`
  const title = escapeAttribute(page.title)
  const head = [
    `<meta name="description" content="${escapeAttribute(page.description)}">`,
    `<link rel="canonical" href="${canonicalUrl}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${escapeAttribute(page.description)}">`,
    `<meta property="og:url" content="${canonicalUrl}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="ru_RU">',
    '<meta property="og:site_name" content="Art Ton">',
    `<meta property="og:image" content="${socialImageUrl}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:image" content="${socialImageUrl}">`,
    `<script type="application/ld+json">${structuredData}</script>`,
  ].join('')

  return html
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace('</head>', `${head}</head>`)
}

await Promise.all(
  publicRoutes.map(async (route) => {
    const routeDirectory = resolve(outputDirectory, route)
    await mkdir(routeDirectory, { recursive: true })
    await copyFile(resolve(outputDirectory, `${route}.html`), resolve(routeDirectory, 'index.html'))
  }),
)

await copyFile(resolve(outputDirectory, 'index.html'), resolve(outputDirectory, '404.html'))

await Promise.all(
  Object.entries(pageSeo).map(async ([relativePath, page]) => {
    const filePath = resolve(outputDirectory, relativePath)
    const html = await readFile(filePath, 'utf8')
    await writeFile(filePath, injectSeo(html, page))
  }),
)

for (const route of publicRoutes) {
  await copyFile(
    resolve(outputDirectory, route, 'index.html'),
    resolve(outputDirectory, `${route}.html`),
  )
}

const adminDirectory = resolve(outputDirectory, 'admin')
await mkdir(adminDirectory, { recursive: true })
const adminHtml = (await readFile(resolve(outputDirectory, 'admin.html'), 'utf8')).replace(
  '</head>',
  '<meta name="robots" content="noindex, nofollow"></head>',
)
await writeFile(resolve(adminDirectory, 'index.html'), adminHtml)
await writeFile(resolve(outputDirectory, 'admin.html'), adminHtml)

const notFoundPath = resolve(outputDirectory, '404.html')
const notFoundHtml = await readFile(notFoundPath, 'utf8')
await writeFile(
  notFoundPath,
  notFoundHtml
    .replace(/<title>.*?<\/title>/s, '<title>Страница не найдена — Art Ton</title>')
    .replace('</head>', '<meta name="robots" content="noindex, nofollow"></head>'),
)

await writeFile(resolve(outputDirectory, '.nojekyll'), '')
