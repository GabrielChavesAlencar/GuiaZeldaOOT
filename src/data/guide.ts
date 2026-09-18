export type GuideStep = {
  id: string
  era: 'Criança' | 'Adulto'
  title: string
  place: string
  summary: string
  objectives: string[]
}

export const guideSteps: GuideStep[] = [
  { id:'start', era:'Criança', title:'O chamado da Grande Árvore Deku', place:'Floresta Kokiri', summary:'Prepare Link para sair da floresta e começar a jornada.', objectives:['Pegue a Espada Kokiri','Consiga um Escudo Deku','Entre na Grande Árvore Deku'] },
  { id:'deku', era:'Criança', title:'Dentro da Grande Árvore Deku', place:'Grande Árvore Deku', summary:'Aprenda os fundamentos de exploração 3D, combate e uso de itens.', objectives:['Obtenha o Estilingue','Resolva o núcleo da masmorra','Derrote o chefe'] },
  { id:'castle', era:'Criança', title:'Rumo ao Castelo de Hyrule', place:'Campo de Hyrule / Mercado', summary:'Conheça o centro de Hyrule e avance a trama principal.', objectives:['Chegue ao Mercado','Entre no Castelo','Encontre a Princesa Zelda'] },
  { id:'dodongo', era:'Criança', title:'A crise dos Gorons', place:'Montanha da Morte', summary:'Ajude os Gorons e conquiste a segunda Pedra Espiritual.', objectives:['Chegue à Cidade Goron','Acesse a Caverna dos Dodongos','Consiga Bombas e vença o chefe'] },
  { id:'jabu', era:'Criança', title:'A missão dos Zora', place:'Domínio Zora', summary:'Abra caminho até Jabu-Jabu e complete a terceira grande etapa infantil.', objectives:['Ganhe acesso à Fonte Zora','Entre em Jabu-Jabu','Resgate Ruto e obtenha a Pedra Espiritual'] },
  { id:'master-sword', era:'Criança', title:'A Porta do Tempo', place:'Templo do Tempo', summary:'Use as três Pedras Espirituais para chegar ao ponto de virada da história.', objectives:['Obtenha a Ocarina do Tempo','Abra a Porta do Tempo','Retire a Espada Mestra'] },
  { id:'forest', era:'Adulto', title:'O despertar do Herói do Tempo', place:'Bosque Sagrado', summary:'Reencontre a floresta e conclua o primeiro grande templo da fase adulta.', objectives:['Volte aos Bosques Perdidos','Alcance o Templo da Floresta','Consiga o Arco e derrote o chefe'] },
  { id:'fire', era:'Adulto', title:'Perigo na Montanha da Morte', place:'Cratera da Montanha da Morte', summary:'Enfrente o calor da cratera e liberte os Gorons.', objectives:['Prepare proteção contra o calor','Entre no Templo do Fogo','Consiga o Megaton Hammer e vença o chefe'] },
  { id:'water', era:'Adulto', title:'Sob as águas do Lago Hylia', place:'Lago Hylia', summary:'Explore o complexo Templo da Água e restaure a região.', objectives:['Obtenha os recursos para mergulho','Domine os níveis de água','Consiga o Longshot e conclua o templo'] },
  { id:'shadow', era:'Adulto', title:'Os segredos de Kakariko', place:'Kakariko / Cemitério', summary:'Use o Olho da Verdade para enfrentar o templo escondido nas sombras.', objectives:['Acesse o Templo das Sombras','Use o Olho da Verdade','Consiga as Hover Boots e derrote o chefe'] },
  { id:'spirit', era:'Adulto', title:'Além do deserto', place:'Deserto Gerudo', summary:'Cruze a região Gerudo e explore um templo que exige as duas eras.', objectives:['Complete a Fortaleza Gerudo','Atravesse o Deserto Assombrado','Explore o Templo do Espírito como criança e adulto'] },
  { id:'finale', era:'Adulto', title:'A batalha por Hyrule', place:'Castelo de Ganon', summary:'Use o poder dos sábios para romper as barreiras e concluir a jornada.', objectives:['Rompa as seis barreiras','Suba a torre','Enfrente as batalhas finais'] },
]
