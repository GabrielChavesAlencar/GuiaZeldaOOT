import type { SiteLanguage } from './languages'
import { ENGLISH_PRELOAD } from './englishPreload'

type Dictionary = Record<string, string>

const en: Dictionary = {
  ...ENGLISH_PRELOAD,
  'Ir para o início': 'Go to home',
  'Triforce dourada': 'Golden Triforce',
  'GUIA HYRULE': 'HYRULE GUIDE',
  'Mapa': 'Map',
  'Guia': 'Guide',
  'Corações': 'Heart Pieces',
  'Itens': 'Items',
  'Locais': 'Locations',
  'Bestiário': 'Bestiary',
  'Galeria oficial': 'Official Gallery',
  'Fontes': 'Sources',
  'progresso': 'progress',
  'GUIA NÃO OFICIAL · PT-BR': 'UNOFFICIAL GUIDE · ENGLISH',
  'Uma jornada completa por': 'A complete journey through',
  'Agora com o mapa em alta resolução, favicon em forma de Triforce, guia principal, bestiário, galeria de NPCs e uma seleção de artes oficiais do site japonês do remake para mostrar os designs mais novos.': 'Explore the adventure with a high-resolution interactive map, main walkthrough, bestiary, NPC gallery, items, collectibles and official remake artwork.',
  'Abrir mapa': 'Open map',
  'Ver bestiário': 'View bestiary',
  'pontos no mapa': 'map points',
  'monstros catalogados': 'monsters catalogued',
  'NPCs listados': 'NPCs listed',
  'ROTEIRO PRINCIPAL': 'MAIN WALKTHROUGH',
  'Guia de progresso': 'Progress guide',
  'Marque as etapas concluídas. O progresso fica salvo no seu navegador.': 'Mark completed steps. Your progress is saved in your browser.',
  'Progresso da aventura': 'Adventure progress',
  'Todas': 'All',
  'Criança': 'Child',
  'Adulto': 'Adult',
  'Marcar como pendente': 'Mark as pending',
  'Marcar como concluído': 'Mark as complete',
  'Concluído': 'Completed',
  'Marcar': 'Mark',
  'MAPA INTERATIVO': 'INTERACTIVE MAP',
  'Explore Hyrule sem perder o rumo': 'Explore Hyrule without losing your way',
  'Buscar local ou Gold Skulltula...': 'Search location or Gold Skulltula...',
  'Todos': 'All',
  'Cidade': 'Town',
  'Região': 'Region',
  'Masmorra': 'Dungeon',
  'Templo': 'Temple',
  'Ponto de interesse': 'Point of interest',
  'Selecione um ponto': 'Select a point',
  'Fotos do local': 'Location photos',
  'O que conferir aqui': 'What to check here',
  'COLECIONÁVEL': 'COLLECTIBLE',
  'MINIMAPA GERAL': 'OVERVIEW MAP',
  'Visão rápida de Hyrule': 'Quick view of Hyrule',
  'Área': 'Area',
  'Buscar por número, área ou dica...': 'Search by number, area or hint...',
  'PERSONAGENS': 'CHARACTERS',
  'BESTIÁRIO': 'BESTIARY',
  'ITENS': 'ITEMS',
  'REFERÊNCIAS': 'REFERENCES',
  'Fontes usadas no projeto': 'Sources used in this project',
  'Projeto de fã, não afiliado à Nintendo.': 'Fan project, not affiliated with Nintendo.',
  'Remake 2026': '2026 Remake',
  'Clássico': 'Classic',
  'Inimigo comum': 'Common enemy',
  'Minichefe': 'Mini-boss',
  'Chefe de masmorra': 'Dungeon boss',
  'Chefe final': 'Final boss',
  'Principal': 'Main',
  'Aliado': 'Ally',
  'Antagonista': 'Antagonist',
  'Comerciante': 'Merchant',
  'Morador': 'Resident',
  'Minijogo': 'Mini-game',
  'Divindade': 'Deity',
  'Animal': 'Animal',
  'Grupo': 'Group',
  'Arma': 'Weapon',
  'Escudo': 'Shield',
  'Roupa': 'Tunic',
  'Botas': 'Boots',
  'Ferramenta': 'Tool',
  'Munição': 'Ammo',
  'Magia': 'Magic',
  'Acessório': 'Accessory',
  'Garrafa': 'Bottle',
  'Máscara': 'Mask',
  'Quest': 'Quest',
  'Dungeon': 'Dungeon',
}

const es: Dictionary = {
  'Mapa': 'Mapa', 'Guia': 'Guía', 'Corações': 'Piezas de corazón', 'Itens': 'Objetos', 'Locais': 'Lugares', 'Bestiário': 'Bestiario', 'Galeria oficial': 'Galería oficial', 'Fontes': 'Fuentes', 'progresso': 'progreso',
  'GUIA NÃO OFICIAL · PT-BR': 'GUÍA NO OFICIAL · ESPAÑOL', 'Uma jornada completa por': 'Un viaje completo por', 'Abrir mapa': 'Abrir mapa', 'Ver bestiário': 'Ver bestiario', 'ROTEIRO PRINCIPAL': 'GUÍA PRINCIPAL', 'Guia de progresso': 'Guía de progreso', 'Progresso da aventura': 'Progreso de la aventura', 'Todas': 'Todas', 'Criança': 'Niño', 'Adulto': 'Adulto', 'Concluído': 'Completado', 'Marcar': 'Marcar', 'Todos': 'Todos', 'Cidade': 'Ciudad', 'Região': 'Región', 'Masmorra': 'Mazmorra', 'Templo': 'Templo', 'Ponto de interesse': 'Punto de interés', 'Selecione um ponto': 'Selecciona un punto', 'COLECIONÁVEL': 'COLECCIONABLE', 'MINIMAPA GERAL': 'MAPA GENERAL', 'Visão rápida de Hyrule': 'Vista rápida de Hyrule', 'Área': 'Área', 'PERSONAGENS': 'PERSONAJES', 'BESTIÁRIO': 'BESTIARIO', 'ITENS': 'OBJETOS', 'REFERÊNCIAS': 'REFERENCIAS', 'Remake 2026': 'Remake 2026', 'Clássico': 'Clásico',
}

const de: Dictionary = {
  'Mapa': 'Karte', 'Guia': 'Guide', 'Corações': 'Herzteile', 'Itens': 'Gegenstände', 'Locais': 'Orte', 'Bestiário': 'Bestiarium', 'Galeria oficial': 'Offizielle Galerie', 'Fontes': 'Quellen', 'progresso': 'Fortschritt',
  'GUIA NÃO OFICIAL · PT-BR': 'INOFFIZIELLER GUIDE · DEUTSCH', 'Uma jornada completa por': 'Eine vollständige Reise durch', 'Abrir mapa': 'Karte öffnen', 'Ver bestiário': 'Bestiarium ansehen', 'ROTEIRO PRINCIPAL': 'HAUPTLÖSUNG', 'Guia de progresso': 'Fortschrittsguide', 'Progresso da aventura': 'Abenteuerfortschritt', 'Todas': 'Alle', 'Criança': 'Kind', 'Adulto': 'Erwachsen', 'Concluído': 'Abgeschlossen', 'Marcar': 'Markieren', 'Todos': 'Alle', 'Cidade': 'Stadt', 'Região': 'Region', 'Masmorra': 'Dungeon', 'Templo': 'Tempel', 'Ponto de interesse': 'Interessanter Ort', 'Selecione um ponto': 'Punkt auswählen', 'COLECIONÁVEL': 'SAMMELOBJEKT', 'MINIMAPA GERAL': 'ÜBERSICHTSKARTE', 'Visão rápida de Hyrule': 'Hyrule auf einen Blick', 'Área': 'Gebiet', 'PERSONAGENS': 'CHARAKTERE', 'BESTIÁRIO': 'BESTIARIUM', 'ITENS': 'GEGENSTÄNDE', 'REFERÊNCIAS': 'QUELLEN', 'Remake 2026': 'Remake 2026', 'Clássico': 'Klassisch',
}

const ja: Dictionary = {
  'Mapa': 'マップ', 'Guia': 'ガイド', 'Corações': 'ハートのかけら', 'Itens': 'アイテム', 'Locais': 'ロケーション', 'Bestiário': '魔物図鑑', 'Galeria oficial': '公式ギャラリー', 'Fontes': '参考資料', 'progresso': '進行度',
  'GUIA NÃO OFICIAL · PT-BR': '非公式ガイド · 日本語', 'Uma jornada completa por': '完全攻略：', 'Abrir mapa': 'マップを開く', 'Ver bestiário': '魔物図鑑を見る', 'ROTEIRO PRINCIPAL': 'メイン攻略', 'Guia de progresso': '進行ガイド', 'Progresso da aventura': '冒険の進行度', 'Todas': 'すべて', 'Criança': '子ども', 'Adulto': '大人', 'Concluído': '完了', 'Marcar': 'チェック', 'Todos': 'すべて', 'Cidade': '町', 'Região': '地域', 'Masmorra': 'ダンジョン', 'Templo': '神殿', 'Ponto de interesse': '注目地点', 'Selecione um ponto': '地点を選択', 'COLECIONÁVEL': '収集要素', 'MINIMAPA GERAL': '全体マップ', 'Visão rápida de Hyrule': 'ハイラル早見図', 'Área': 'エリア', 'PERSONAGENS': 'キャラクター', 'BESTIÁRIO': '魔物図鑑', 'ITENS': 'アイテム', 'REFERÊNCIAS': '参考資料', 'Remake 2026': '2026 リメイク', 'Clássico': 'クラシック',
}

const ru: Dictionary = {
  'Mapa': 'Карта', 'Guia': 'Гид', 'Corações': 'Части сердца', 'Itens': 'Предметы', 'Locais': 'Локации', 'Bestiário': 'Бестиарий', 'Galeria oficial': 'Официальная галерея', 'Fontes': 'Источники', 'progresso': 'прогресс',
  'GUIA NÃO OFICIAL · PT-BR': 'НЕОФИЦИАЛЬНЫЙ ГИД · РУССКИЙ', 'Uma jornada completa por': 'Полное путешествие по', 'Abrir mapa': 'Открыть карту', 'Ver bestiário': 'Открыть бестиарий', 'ROTEIRO PRINCIPAL': 'ОСНОВНОЕ ПРОХОЖДЕНИЕ', 'Guia de progresso': 'Гид по прогрессу', 'Progresso da aventura': 'Прогресс приключения', 'Todas': 'Все', 'Criança': 'Ребёнок', 'Adulto': 'Взрослый', 'Concluído': 'Готово', 'Marcar': 'Отметить', 'Todos': 'Все', 'Cidade': 'Город', 'Região': 'Регион', 'Masmorra': 'Подземелье', 'Templo': 'Храм', 'Ponto de interesse': 'Точка интереса', 'Selecione um ponto': 'Выберите точку', 'COLECIONÁVEL': 'КОЛЛЕКЦИОННОЕ', 'MINIMAPA GERAL': 'ОБЩАЯ КАРТА', 'Visão rápida de Hyrule': 'Краткая карта Хайрула', 'Área': 'Область', 'PERSONAGENS': 'ПЕРСОНАЖИ', 'BESTIÁRIO': 'БЕСТИАРИЙ', 'ITENS': 'ПРЕДМЕТЫ', 'REFERÊNCIAS': 'ИСТОЧНИКИ', 'Remake 2026': 'Ремейк 2026', 'Clássico': 'Классика',
}

const zh: Dictionary = {
  'Mapa': '地图', 'Guia': '攻略', 'Corações': '心之碎片', 'Itens': '道具', 'Locais': '地点', 'Bestiário': '怪物图鉴', 'Galeria oficial': '官方画廊', 'Fontes': '资料来源', 'progresso': '进度',
  'GUIA NÃO OFICIAL · PT-BR': '非官方攻略 · 简体中文', 'Uma jornada completa por': '完整探索', 'Abrir mapa': '打开地图', 'Ver bestiário': '查看怪物图鉴', 'ROTEIRO PRINCIPAL': '主线攻略', 'Guia de progresso': '进度指南', 'Progresso da aventura': '冒险进度', 'Todas': '全部', 'Criança': '儿童时期', 'Adulto': '成年时期', 'Concluído': '已完成', 'Marcar': '标记', 'Todos': '全部', 'Cidade': '城镇', 'Região': '区域', 'Masmorra': '迷宫', 'Templo': '神殿', 'Ponto de interesse': '兴趣点', 'Selecione um ponto': '选择一个地点', 'COLECIONÁVEL': '收集要素', 'MINIMAPA GERAL': '总览地图', 'Visão rápida de Hyrule': '海拉鲁速览', 'Área': '区域', 'PERSONAGENS': '角色', 'BESTIÁRIO': '怪物图鉴', 'ITENS': '道具', 'REFERÊNCIAS': '参考资料', 'Remake 2026': '2026 重制版', 'Clássico': '经典版',
}

export const CORE_TRANSLATIONS: Partial<Record<SiteLanguage, Dictionary>> = {
  en,
  es,
  de,
  ja,
  ru,
  'zh-CN': zh,
  'pt-BR': {},
}
