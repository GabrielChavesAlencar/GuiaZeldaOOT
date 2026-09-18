export type LocationCategory = 'Região' | 'Cidade' | 'Masmorra' | 'Templo' | 'Ponto de interesse'
export type Era = 'Criança' | 'Adulto' | 'Ambas'

export type MapLocation = {
  id: string
  name: string
  shortName: string
  x: number
  y: number
  category: LocationCategory
  era: Era
  description: string
  highlights: string[]
  wikiTitle: string
  spoiler?: string
}

// Coordenadas em porcentagem sobre public/hyrule-map.png.
// Foram separadas dos componentes para facilitar o ajuste fino do mapa depois.
export const locations: MapLocation[] = [
  { id:'hyrule-field', wikiTitle:'Hyrule Field', name:'Campo de Hyrule', shortName:'Campo', x:47, y:58, category:'Região', era:'Ambas', description:'A área central que conecta grande parte de Hyrule.', highlights:['Rotas para as principais regiões','Ciclo de dia e noite','Poes e outros encontros variam por era'] },
  { id:'market', wikiTitle:'Hyrule Castle Town', name:'Cidade do Castelo / Mercado', shortName:'Mercado', x:45.5, y:37.5, category:'Cidade', era:'Ambas', description:'Centro urbano próximo ao Castelo de Hyrule e ao Templo do Tempo.', highlights:['Lojas e minijogos','Templo do Tempo','Acesso ao Castelo de Hyrule'] },
  { id:'hyrule-castle', wikiTitle:'Hyrule Castle', name:'Castelo de Hyrule', shortName:'Castelo', x:41.5, y:28.5, category:'Ponto de interesse', era:'Criança', description:'Residência da família real e um dos primeiros grandes objetivos da aventura.', highlights:['Encontro com Zelda','Área de furtividade'] },
  { id:'temple-time', wikiTitle:'Temple of Time', name:'Templo do Tempo', shortName:'Tempo', x:48, y:38, category:'Templo', era:'Ambas', description:'Ponto central da narrativa e da passagem entre as duas eras.', highlights:['Espada Mestra','Pedestal do Tempo','Mudança de era'] },
  { id:'lon-lon', wikiTitle:'Lon Lon Ranch', name:'Rancho Lon Lon', shortName:'Rancho', x:37.5, y:53, category:'Ponto de interesse', era:'Ambas', description:'Rancho no coração de Hyrule, ligado a Malon, Talon e Epona.', highlights:['Epona','Minijogos','Leite Lon Lon'] },
  { id:'kokiri', wikiTitle:'Kokiri Forest', name:'Floresta Kokiri', shortName:'Kokiri', x:77, y:68, category:'Cidade', era:'Ambas', description:'Lar dos Kokiri e ponto inicial da jornada de Link.', highlights:['Casa de Link','Espada Kokiri','Loja Kokiri'] },
  { id:'deku-tree', wikiTitle:'Inside the Deku Tree', name:'Interior da Grande Árvore Deku', shortName:'Deku', x:81.5, y:63, category:'Masmorra', era:'Criança', description:'Primeira masmorra principal da aventura.', highlights:['Estilingue','Primeiro chefe','Pedra Espiritual'] },
  { id:'lost-woods', wikiTitle:'Lost Woods', name:'Bosques Perdidos', shortName:'Bosques', x:70, y:62, category:'Região', era:'Ambas', description:'Labirinto florestal que leva a áreas secretas e ao Bosque Sagrado.', highlights:['Atalhos','Saria','Bosque Sagrado'] },
  { id:'forest-temple', wikiTitle:'Forest Temple', name:'Templo da Floresta', shortName:'Floresta', x:73, y:58, category:'Templo', era:'Adulto', description:'Templo escondido no Bosque Sagrado.', highlights:['Arco e flecha','Fantasmas Poe','Medalhão da Floresta'] },
  { id:'kakariko', wikiTitle:'Kakariko Village', name:'Vila Kakariko', shortName:'Kakariko', x:63.5, y:40, category:'Cidade', era:'Ambas', description:'Vila aos pés da Montanha da Morte e acesso a várias áreas importantes.', highlights:['Casa das Skulltulas','Moinho','Cemitério'] },
  { id:'graveyard', wikiTitle:'Kakariko Village Graveyard', name:'Cemitério de Kakariko', shortName:'Cemitério', x:68, y:39, category:'Ponto de interesse', era:'Ambas', description:'Cemitério conectado a segredos, túmulos e ao Templo das Sombras.', highlights:['Túmulo da Família Real','Dampé','Templo das Sombras'] },
  { id:'death-mountain', wikiTitle:'Death Mountain', name:'Montanha da Morte', shortName:'Montanha', x:62.5, y:18.5, category:'Região', era:'Ambas', description:'Região vulcânica acima de Kakariko e lar dos Gorons.', highlights:['Trilha da Montanha da Morte','Cidade Goron','Cratera'] },
  { id:'goron-city', wikiTitle:'Goron City', name:'Cidade Goron', shortName:'Goron', x:57, y:26, category:'Cidade', era:'Ambas', description:'Lar subterrâneo dos Gorons.', highlights:['Darunia','Loja Goron','Acesso à Cratera'] },
  { id:'dodongo', wikiTitle:"Dodongo's Cavern", name:'Caverna dos Dodongos', shortName:'Dodongo', x:56, y:30.5, category:'Masmorra', era:'Criança', description:'Segunda masmorra principal da fase infantil.', highlights:['Bombas','King Dodongo','Pedra Espiritual'] },
  { id:'fire-temple', wikiTitle:'Fire Temple', name:'Templo do Fogo', shortName:'Fogo', x:61.8, y:22.5, category:'Templo', era:'Adulto', description:'Templo localizado na região vulcânica da Montanha da Morte.', highlights:['Megaton Hammer','Gorons presos','Medalhão do Fogo'] },
  { id:'zora-river', wikiTitle:"Zora's River", name:'Rio Zora', shortName:'Rio Zora', x:67.5, y:41, category:'Região', era:'Ambas', description:'Rio que conduz ao domínio dos Zora.', highlights:['Atalhos pelo rio','Feijões mágicos','Entrada do domínio'] },
  { id:'zora-domain', wikiTitle:"Zora's Domain", name:'Domínio Zora', shortName:'Zora', x:78, y:36, category:'Cidade', era:'Ambas', description:'Lar dos Zora, governado pelo Rei Zora.', highlights:['Rei Zora','Loja Zora','Acesso à Fonte Zora'] },
  { id:'zora-fountain', wikiTitle:"Zora's Fountain", name:'Fonte Zora', shortName:'Fonte Zora', x:84, y:35, category:'Região', era:'Ambas', description:'Área atrás do domínio Zora, ligada a Jabu-Jabu e à Caverna de Gelo.', highlights:['Jabu-Jabu','Caverna de Gelo','Grande Fada'] },
  { id:'jabu', wikiTitle:"Inside Jabu-Jabu's Belly", name:'Interior de Jabu-Jabu', shortName:'Jabu-Jabu', x:84, y:37.5, category:'Masmorra', era:'Criança', description:'Terceira masmorra principal da fase infantil.', highlights:['Bumerangue','Princesa Ruto','Pedra Espiritual'] },
  { id:'lake-hylia', wikiTitle:'Lake Hylia', name:'Lago Hylia', shortName:'Lago', x:39, y:82.5, category:'Região', era:'Ambas', description:'Grande lago ao sul de Hyrule e acesso ao Templo da Água.', highlights:['Pesca','Laboratório','Templo da Água'] },
  { id:'water-temple', wikiTitle:'Water Temple', name:'Templo da Água', shortName:'Água', x:41, y:79, category:'Templo', era:'Adulto', description:'Templo submerso no Lago Hylia.', highlights:['Longshot','Níveis de água','Medalhão da Água'] },
  { id:'gerudo-valley', wikiTitle:'Gerudo Valley', name:'Vale Gerudo', shortName:'Vale', x:23, y:53, category:'Região', era:'Ambas', description:'Desfiladeiro que leva ao território Gerudo.', highlights:['Ponte','Carpinteiros','Acesso à Fortaleza'] },
  { id:'gerudo-fortress', wikiTitle:'Gerudo Fortress', name:'Fortaleza Gerudo', shortName:'Fortaleza', x:20, y:43, category:'Ponto de interesse', era:'Adulto', description:'Fortaleza das Gerudo no caminho para o deserto.', highlights:['Resgate dos carpinteiros','Passe Gerudo','Arco a cavalo'] },
  { id:'haunted-wasteland', wikiTitle:'Haunted Wasteland', name:'Deserto Assombrado', shortName:'Deserto', x:17, y:34, category:'Região', era:'Adulto', description:'Travessia de deserto entre a Fortaleza Gerudo e o Colosso do Deserto.', highlights:['Tempestade de areia','Guia fantasma','Olho da Verdade'] },
  { id:'desert-colossus', wikiTitle:'Desert Colossus', name:'Colosso do Deserto', shortName:'Colosso', x:18, y:22, category:'Região', era:'Ambas', description:'Oásis e área externa do Templo do Espírito.', highlights:['Grande Fada','Requiem of Spirit','Entrada do Templo'] },
  { id:'spirit-temple', wikiTitle:'Spirit Temple', name:'Templo do Espírito', shortName:'Espírito', x:19, y:20, category:'Templo', era:'Ambas', description:'Templo do deserto explorado nas duas eras.', highlights:['Silver Gauntlets','Mirror Shield','Medalhão do Espírito'] },
  { id:'shadow-temple', wikiTitle:'Shadow Temple', name:'Templo das Sombras', shortName:'Sombras', x:69.5, y:42, category:'Templo', era:'Adulto', description:'Templo oculto no cemitério de Kakariko.', highlights:['Hover Boots','Olho da Verdade','Medalhão das Sombras'] },
  { id:'ganon-castle', wikiTitle:"Ganon's Castle", name:'Castelo de Ganon', shortName:'Ganon', x:44, y:31.5, category:'Masmorra', era:'Adulto', description:'Área final da aventura na fase adulta.', highlights:['Barreira dos seis sábios','Chefes finais','Conclusão da história'] },
]
