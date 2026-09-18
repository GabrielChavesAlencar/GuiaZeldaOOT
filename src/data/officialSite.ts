export type OfficialMediaCard = {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
}

const base = 'https://www.nintendo.com/jp/games/switch2/aa9ja/assets/img/top'

export const officialMediaCards: OfficialMediaCard[] = [
  {
    id: 'across-two-ages',
    title: 'Across Two Ages',
    subtitle: '2つの時代',
    description: 'Material oficial destacando a jornada entre a infância e a fase adulta de Link.',
    image: `${base}/age_chara.webp`,
  },
  {
    id: 'young-era',
    title: 'The Young Era',
    subtitle: 'こども時代',
    description: 'Arte oficial com o visual mais novo da fase infantil.',
    image: `${base}/age_chara_child_sp.webp`,
  },
  {
    id: 'adult-era',
    title: 'The Adult Era',
    subtitle: 'おとな時代',
    description: 'Arte oficial com o visual mais novo da fase adulta.',
    image: `${base}/age_chara_adult_sp.webp`,
  },
  {
    id: 'world-on-the-brink',
    title: 'A World On The Brink',
    subtitle: '世界の異変に立ち向かう',
    description: 'Visual oficial para desafios, exploração e situações de aventura.',
    image: `${base}/world_slide_thumb_01_sp.webp`,
  },
  {
    id: 'ocarina-power',
    title: 'The Ocarina',
    subtitle: 'オカリナ',
    description: 'O site oficial ressalta a ocarina como peça central de tempo, caminhos e emoções.',
    image: `${base}/world_slide_thumb_03_sp.webp`,
  },
  {
    id: 'sword-and-shield',
    title: 'Sword and Shield',
    subtitle: '剣と盾',
    description: 'Visual oficial focado no combate e no novo design de ação.',
    image: `${base}/action_chara.webp`,
  },
  {
    id: 'land-of-hyrule',
    title: 'The Land of Hyrule',
    subtitle: '大地「ハイラル」',
    description: 'Painel oficial com personagens e povos de várias regiões de Hyrule.',
    image: `${base}/hyrule_chara.webp`,
  },
  {
    id: 'hyrule-scene-1',
    title: 'Hyrule Scene',
    subtitle: 'Oficial Nintendo',
    description: 'Uma das artes de cenário destacadas na página japonesa do jogo.',
    image: `${base}/hyrule_kv_01_sp.webp`,
  },
  {
    id: 'hyrule-scene-2',
    title: 'Hyrule Scene',
    subtitle: 'Oficial Nintendo',
    description: 'Outra cena promocional com o visual atualizado do remake.',
    image: `${base}/hyrule_kv_02_sp.webp`,
  },
  {
    id: 'hyrule-scene-3',
    title: 'Hyrule Scene',
    subtitle: 'Oficial Nintendo',
    description: 'Cena promocional adicional do site oficial japonês.',
    image: `${base}/hyrule_kv_04_sp.webp`,
  },
]

export const officialSectionBanners = {
  bestiary: `${base}/action_bg.webp`,
  bestiaryFigure: `${base}/action_chara.webp`,
  npcs: `${base}/hyrule_bg_sp.webp`,
  npcsFigure: `${base}/hyrule_chara.webp`,
  timeline: `${base}/age_chara.webp`,
}

export const officialJapanPageUrl = 'https://www.nintendo.com/jp/games/switch2/aa9ja/index.html'
