export type NpcCategory =
  | 'Principal'
  | 'Aliado'
  | 'Antagonista'
  | 'Comerciante'
  | 'Morador'
  | 'Minijogo'
  | 'Divindade'
  | 'Animal'
  | 'Grupo'

export type NpcEntry = {
  id: string
  name: string
  pageTitle: string
  category: NpcCategory
  role: string
  location: string
  era: 'Criança' | 'Adulto' | 'Ambas'
  description: string
  visual?: 'Clássico' | 'Remake 2026'
  imageUrl?: string
}

const npc = (
  id: string,
  name: string,
  pageTitle: string,
  category: NpcCategory,
  role: string,
  location: string,
  era: NpcEntry['era'],
  description: string,
  imageUrl?: string,
  visual?: NpcEntry['visual'],
): NpcEntry => ({ id, name, pageTitle, category, role, location, era, description, imageUrl, visual })

export const npcEntries: NpcEntry[] = [
  npc('zelda', 'Princesa Zelda', 'Princess Zelda', 'Principal', 'Princesa de Hyrule', 'Castelo de Hyrule / Templo do Tempo', 'Ambas', 'Figura central da profecia, ligada à Triforce da Sabedoria e ao destino de Link.', 'https://z64central.com/switch-2/hyrule-castle-switch-2-remake-zelda-2_hu_750ff04710f6f399.webp', 'Remake 2026'),
  npc('sheik', 'Sheik', 'Sheik', 'Principal', 'Guia misterioso', 'Diversas regiões de Hyrule', 'Adulto', 'Aparece durante a fase adulta para orientar Link e ensinar canções importantes.', 'https://z64central.com/switch-2/kakariko-village-switch-2-remake-sheik-closeup_hu_54eaf578a7a2ae79.webp', 'Remake 2026'),
  npc('ganondorf', 'Ganondorf', 'Ganondorf', 'Antagonista', 'Rei dos Gerudo', 'Castelo de Hyrule / Castelo de Ganon', 'Ambas', 'Principal antagonista da aventura e portador da Triforce do Poder.', 'https://z64central.com/switch-2/ganons-castle-switch-2-remake-ganondorf-closeup-1_hu_cbf99b05d7b275ba.webp', 'Remake 2026'),
  npc('navi', 'Navi', 'Navi', 'Principal', 'Fada companheira de Link', 'Acompanha Link por toda Hyrule', 'Ambas', 'Companheira constante que ajuda com mira, dicas e leitura de inimigos.', 'https://z64central.com/switch-2/kokiri-forest-switch-2-remake-1_hu_c6a57dc866430243.webp', 'Remake 2026'),
  npc('impa', 'Impa', 'Impa', 'Principal', 'Protetora da família real', 'Castelo de Hyrule / Kakariko', 'Ambas', 'Sheikah ligada à Princesa Zelda e à história de Kakariko.', 'https://z64central.com/switch-2/hyrule-castle-town-switch-2-remake-zelda-throws-ocarina_hu_93eec75415559d74.webp', 'Remake 2026'),
  npc('rauru', 'Rauru', 'Rauru', 'Aliado', 'Sábio da Luz', 'Templo da Luz / Reino Sagrado', 'Adulto', 'Recebe Link após o salto temporal e explica sua nova missão.'),
  npc('saria', 'Saria', 'Saria', 'Aliado', 'Amiga de Link / Sábia da Floresta', 'Floresta Kokiri / Bosque Sagrado', 'Ambas', 'Amiga de infância de Link e personagem essencial do arco da floresta.', 'https://z64central.com/switch-2/kokiri-forest-switch-2-remake-saria-goodbye-2_hu_3ba2368b7a6cb9bf.webp', 'Remake 2026'),
  npc('darunia', 'Darunia', 'Darunia', 'Aliado', 'Líder dos Gorons / Sábio do Fogo', 'Cidade Goron / Templo do Fogo', 'Ambas', 'Líder carismático dos Gorons e aliado importante de Link.', 'https://z64central.com/switch-2/goron-city-switch-2-remake-darunia_hu_b3c5b92001d68744.webp', 'Remake 2026'),
  npc('ruto', 'Princesa Ruto', 'Princess Ruto', 'Aliado', 'Princesa Zora / Sábia da Água', 'Domínio Zora / Templo da Água', 'Ambas', 'Princesa dos Zora, encontrada ainda criança dentro de Jabu-Jabu.', 'https://z64central.com/switch-2/jabu-jabus-belly-switch-2-remake-ruto_hu_72178b245be3b870.webp', 'Remake 2026'),
  npc('nabooru', 'Nabooru', 'Nabooru', 'Aliado', 'Guerreira Gerudo / Sábia do Espírito', 'Deserto Gerudo / Templo do Espírito', 'Ambas', 'Gerudo que se opõe a Ganondorf e se torna uma das Sábias.'),

  npc('great-deku-tree', 'Grande Árvore Deku', 'Great Deku Tree', 'Aliado', 'Guardião da floresta', 'Floresta Kokiri', 'Criança', 'Guardião dos Kokiri e responsável por iniciar a grande jornada de Link.', 'https://z64central.com/switch-2/great-deku-tree-switch-2-remake-1_hu_fdb67c2e629d0f3a.webp', 'Remake 2026'),
  npc('deku-tree-sprout', 'Broto da Árvore Deku', 'Deku Tree Sprout', 'Aliado', 'Novo guardião da floresta', 'Floresta Kokiri', 'Adulto', 'Surge depois que a maldição sobre a floresta começa a ser desfeita.'),
  npc('kaepora', 'Kaepora Gaebora', 'Kaepora Gaebora', 'Aliado', 'Coruja guia', 'Diversas regiões', 'Criança', 'Coruja sábia que orienta Link nos primeiros passos da aventura.', 'https://z64central.com/switch-2/lake-hylia-switch-2-remake-owl_hu_5a7dc75677d56803.webp', 'Remake 2026'),
  npc('epona', 'Epona', 'Epona', 'Animal', 'Égua de Link', 'Rancho Lon Lon / Campo de Hyrule', 'Ambas', 'Montaria de Link e peça-chave para exploração rápida na fase adulta.', 'https://z64central.com/switch-2/lon-lon-ranch-switch-2-remake-2_hu_6ea55e610c243ab2.webp', 'Remake 2026'),
  npc('malon', 'Malon', 'Malon', 'Aliado', 'Moradora do Rancho Lon Lon', 'Rancho Lon Lon', 'Ambas', 'Ligada a Epona e a vários eventos opcionais do rancho.'),
  npc('talon', 'Talon', 'Talon', 'Morador', 'Dono do Rancho Lon Lon', 'Rancho Lon Lon / Castelo de Hyrule', 'Ambas', 'Pai de Malon e personagem recorrente em eventos do rancho.'),
  npc('ingo', 'Ingo', 'Ingo', 'Antagonista', 'Administrador do rancho', 'Rancho Lon Lon', 'Ambas', 'Assume o controle do rancho na fase adulta e participa da sequência de Epona.'),

  npc('king-zora', 'Rei Zora', 'King Zora', 'Aliado', 'Rei dos Zora', 'Domínio Zora', 'Ambas', 'Pai de Ruto e governante do povo Zora.'),
  npc('jabu-jabu', 'Lord Jabu-Jabu', 'Lord Jabu-Jabu', 'Divindade', 'Guardião dos Zora', 'Fonte Zora', 'Criança', 'Entidade reverenciada pelos Zora e cenário de uma das primeiras masmorras.', 'https://z64central.com/switch-2/jabu-jabus-belly-switch-2-remake-swallow-2_hu_92df9ffd83dece00.webp', 'Remake 2026'),
  npc('biggoron', 'Biggoron', 'Biggoron', 'Comerciante', 'Grande ferreiro Goron', 'Topo da Montanha da Morte', 'Adulto', 'Responsável pela sequência que leva à poderosa Biggoron’s Sword.'),
  npc('medigoron', 'Medigoron', 'Medigoron', 'Comerciante', 'Ferreiro Goron', 'Cidade Goron', 'Adulto', 'Vende a Giant’s Knife e representa a tradição dos ferreiros Goron.'),
  npc('hot-rodder-goron', 'Hot Rodder Goron', 'Hot Rodder Goron', 'Minijogo', 'Goron corredor', 'Cidade Goron', 'Criança', 'Goron que rola em alta velocidade e pode ser parado para obter uma recompensa.'),
  npc('goron-chief', 'Chefe Goron', 'Goron Chief', 'Morador', 'Figura Goron', 'Cidade Goron', 'Ambas', 'Personagem associado à comunidade Goron e à região da Montanha da Morte.'),
  npc('goron-link', 'Link, o Goron', 'Link (Goron)', 'Morador', 'Jovem Goron', 'Cidade Goron', 'Adulto', 'Goron que recebeu o nome de Link e ajuda a explicar a crise do povo na fase adulta.'),

  npc('mido', 'Mido', 'Mido', 'Morador', 'Líder informal Kokiri', 'Floresta Kokiri', 'Ambas', 'Kokiri orgulhoso que inicialmente bloqueia e questiona Link.'),
  npc('fado', 'Fado', 'Fado (Ocarina of Time)', 'Morador', 'Kokiri', 'Floresta Kokiri / Bosques Perdidos', 'Ambas', 'Kokiri ligada a eventos nos Bosques Perdidos e à sequência de troca adulta.'),
  npc('kokiri-brothers', 'Know-It-All Brothers', 'Know-It-All Brothers', 'Grupo', 'Kokiri instrutores', 'Floresta Kokiri', 'Criança', 'Grupo que ensina controles e fundamentos básicos ao jogador.'),
  npc('skull-kid', 'Skull Kid', 'Skull Kid', 'Morador', 'Habitante dos Bosques Perdidos', 'Bosques Perdidos', 'Ambas', 'Personagem misterioso associado à música e aos Bosques Perdidos.'),
  npc('phonogram-man', 'Phonogram Man', 'Phonogram Man', 'Morador', 'Músico', 'Floresta Kokiri', 'Criança', 'Morador ligado ao ambiente musical da floresta.'),

  npc('happy-mask-salesman', 'Happy Mask Salesman', 'Happy Mask Salesman', 'Comerciante', 'Vendedor de máscaras', 'Mercado de Hyrule', 'Criança', 'Responsável pela sequência de troca e venda de máscaras.'),
  npc('bazaar-owner', 'Dono do Bazaar', 'Bazaar Owner', 'Comerciante', 'Lojista', 'Mercado / Kakariko', 'Ambas', 'Vende equipamentos e suprimentos úteis em lojas de Hyrule.'),
  npc('bombchu-shop-owner', 'Dono da Loja de Bombchu', 'Bombchu Shop Owner', 'Comerciante', 'Lojista', 'Mercado de Hyrule', 'Criança', 'Responsável pela loja especializada em Bombchus.'),
  npc('bombchu-bowling', 'Operadora do Bombchu Bowling', 'Bombchu Bowling Alley Operator', 'Minijogo', 'Atendente de minijogo', 'Mercado de Hyrule', 'Criança', 'Comanda o Bombchu Bowling Alley e distribui prêmios.'),
  npc('shooting-gallery-owner', 'Dono da Galeria de Tiro', 'Shooting Gallery Owner', 'Minijogo', 'Atendente de minijogo', 'Mercado / Kakariko', 'Ambas', 'Administra desafios de tiro que rendem melhorias importantes.'),
  npc('running-man', 'Running Man', 'Running Man', 'Minijogo', 'Corredor', 'Campo de Hyrule / Vale Gerudo', 'Adulto', 'Personagem associado a uma corrida opcional na fase adulta.'),
  npc('blue-juggler', 'Malabarista Azul', 'Blue Juggler', 'Morador', 'Artista de rua', 'Mercado de Hyrule', 'Criança', 'Um dos artistas encontrados na praça do mercado.'),
  npc('red-juggler', 'Malabarista Vermelho', 'Red Juggler', 'Morador', 'Artista de rua', 'Mercado de Hyrule', 'Criança', 'Forma dupla com o outro malabarista do mercado.'),
  npc('twin-jugglers', 'Malabaristas Gêmeos', 'Twin Jugglers', 'Grupo', 'Artistas de rua', 'Mercado de Hyrule', 'Criança', 'Dupla de artistas que ajuda a dar vida à praça do mercado.'),
  npc('dancing-couple', 'Casal Dançarino', 'Dancing Couple', 'Morador', 'Moradores do mercado', 'Mercado de Hyrule', 'Criança', 'Casal que dança na praça em meio à rotina da cidade.', 'https://z64central.com/switch-2/hyrule-castle-town-switch-2-remake-market-2_hu_96361eba0b1e7ab4.webp', 'Remake 2026'),
  npc('darling', 'Darling', 'Darling', 'Morador', 'Morador de Hyrule', 'Mercado de Hyrule', 'Criança', 'Um dos personagens civis presentes na vida cotidiana do mercado.'),
  npc('honey', 'Honey', 'Honey', 'Morador', 'Moradora de Hyrule', 'Mercado de Hyrule', 'Criança', 'Personagem civil associada à movimentação do Mercado de Hyrule.'),
  npc('young-punk', 'Young Punk Guy', 'Young Punk Guy', 'Morador', 'Morador do mercado', 'Mercado de Hyrule', 'Criança', 'Jovem encontrado entre os habitantes da cidade.'),
  npc('man-carrying-sack', 'Homem com Saco', 'Man Carrying Sack', 'Morador', 'Trabalhador', 'Mercado de Hyrule', 'Criança', 'Morador visto carregando mercadorias pela cidade.'),
  npc('man-on-roof', 'Homem no Telhado', 'Man on a Roof', 'Morador', 'Morador de Kakariko', 'Kakariko', 'Ambas', 'NPC encontrado em posição elevada na vila e ligado à exploração vertical.'),
  npc('pooch-lady', 'Dona do Cachorro', 'Pooch Lady', 'Morador', 'Moradora do mercado', 'Mercado de Hyrule', 'Criança', 'Proprietária de um cachorro perdido em uma pequena tarefa opcional.'),
  npc('richard', 'Richard', 'Richard (Ocarina of Time)', 'Animal', 'Cachorro', 'Mercado de Hyrule', 'Criança', 'Cachorro ligado à pequena missão da Pooch Lady.'),

  npc('cucco-lady', 'Cucco Lady', 'Cucco Lady', 'Morador', 'Criadora de Cuccos', 'Kakariko', 'Ambas', 'NPC associada a Cuccos e a uma sequência de troca importante.'),
  npc('dampe', 'Dampé', 'Dampé', 'Minijogo', 'Coveiro', 'Cemitério de Kakariko', 'Ambas', 'Coveiro ligado a minijogos, túmulos e à obtenção do Hookshot.'),
  npc('graveyard-boy', 'Menino do Cemitério', 'Graveyard Boy', 'Morador', 'Morador de Kakariko', 'Cemitério de Kakariko', 'Criança', 'Criança encontrada no cemitério durante o dia.'),
  npc('windmill-man', 'Homem do Moinho', 'Windmill Man', 'Morador', 'Músico do moinho', 'Moinho de Kakariko', 'Ambas', 'Personagem ligado diretamente à Song of Storms e a um paradoxo temporal.'),
  npc('professor-shikashi', 'Professor Shikashi', 'Professor Shikashi', 'Morador', 'Ancião de Kakariko', 'Kakariko', 'Ambas', 'Morador idoso que conhece histórias e informações da vila.'),
  npc('cursed-rich-man', 'Homem Rico Amaldiçoado', 'Cursed Rich Man', 'Morador', 'Morador amaldiçoado', 'Casa da Skulltula', 'Ambas', 'Chefe da família afetada pela maldição das Gold Skulltulas.'),
  npc('medicine-owner', 'Dona da Loja de Poções', 'Medicine Shop Owner', 'Comerciante', 'Alquimista', 'Kakariko', 'Adulto', 'Vende remédios e participa da sequência de troca adulta.'),
  npc('granny', 'Granny', 'Granny', 'Comerciante', 'Alquimista', 'Kakariko', 'Adulto', 'Anciã associada à Odd Potion na sequência da Biggoron’s Sword.'),
  npc('death-mountain-gatekeeper', 'Guarda da Trilha da Montanha', 'Death Mountain Trail Gatekeeper', 'Morador', 'Guarda', 'Entrada da Trilha da Montanha da Morte', 'Criança', 'Controla o acesso inicial à Montanha da Morte.'),
  npc('royal-guard', 'Guarda Real', 'Royal Guard', 'Grupo', 'Guarda do reino', 'Castelo de Hyrule / Mercado', 'Criança', 'Guardas que protegem áreas restritas da família real.'),
  npc('soldier', 'Soldado', 'Soldier', 'Grupo', 'Soldado de Hyrule', 'Castelo / Mercado', 'Criança', 'Soldados encontrados em postos e áreas relacionadas ao castelo.'),
  npc('hylian-knight', 'Cavaleiro Hylian', 'Hylian Knight', 'Grupo', 'Cavaleiro de Hyrule', 'Castelo de Hyrule', 'Criança', 'Membro das forças militares do reino.'),

  npc('fishing-hole-man', 'Dono do Fishing Pond', 'Fishing Hole Man', 'Minijogo', 'Atendente de pesca', 'Lago Hylia', 'Ambas', 'Administra o minijogo de pesca e entrega recompensas por grandes capturas.'),
  npc('lake-scientist', 'Cientista do Lago', 'Lake Scientist', 'Morador', 'Pesquisador', 'Laboratório do Lago Hylia', 'Ambas', 'Pesquisador associado a testes de mergulho e ao ambiente do lago.'),
  npc('bonooru', 'Bonooru', 'Bonooru', 'Morador', 'Espantalho', 'Lago Hylia', 'Ambas', 'Um dos espantalhos usados para criar a Scarecrow’s Song.'),
  npc('pierre', 'Pierre', 'Pierre', 'Morador', 'Espantalho', 'Lago Hylia / pontos de invocação', 'Ambas', 'Pode ser invocado em pontos específicos depois que a canção do espantalho é criada.'),

  npc('bean-seller', 'Vendedor de Feijões', 'Bean Seller', 'Comerciante', 'Vendedor de Magic Beans', 'Rio Zora', 'Criança', 'Vende Magic Beans que criam rotas especiais na fase adulta.'),
  npc('frogs', 'Fabulous Five Froggish Tenors', 'Fabulous Five Froggish Tenors', 'Grupo', 'Quinteto de sapos', 'Rio Zora', 'Criança', 'Grupo musical ligado a canções e recompensas opcionais.'),
  npc('blue-frog', 'Sapo Azul', 'Blue Frog', 'Animal', 'Membro do quinteto', 'Rio Zora', 'Criança', 'Um dos sapos do grupo musical do Rio Zora.'),
  npc('green-frog', 'Sapo Verde', 'Green Frog', 'Animal', 'Membro do quinteto', 'Rio Zora', 'Criança', 'Um dos sapos do grupo musical do Rio Zora.'),
  npc('pink-frog', 'Sapo Rosa', 'Pink Frog', 'Animal', 'Membro do quinteto', 'Rio Zora', 'Criança', 'Um dos sapos do grupo musical do Rio Zora.'),
  npc('white-frog', 'Sapo Branco', 'White Frog', 'Animal', 'Membro do quinteto', 'Rio Zora', 'Criança', 'Um dos sapos do grupo musical do Rio Zora.'),
  npc('yellow-frog', 'Sapo Amarelo', 'Yellow Frog', 'Animal', 'Membro do quinteto', 'Rio Zora', 'Criança', 'Um dos sapos do grupo musical do Rio Zora.'),

  npc('carpenters-boss', 'Chefe dos Carpinteiros', "Carpenters' Boss", 'Morador', 'Mestre dos carpinteiros', 'Kakariko / Vale Gerudo', 'Ambas', 'Chefe do grupo de carpinteiros e pai do jovem ligado à sequência de troca.'),
  npc('master-craftsman', 'Master Craftsman', 'Master Craftsman', 'Morador', 'Artesão', 'Kakariko', 'Ambas', 'Artesão ligado aos carpinteiros e à história de seu filho.'),
  npc('craftsman-son', 'Filho do Master Craftsman', "Master Craftsman's Son", 'Morador', 'Jovem perdido', 'Kakariko / Bosques Perdidos', 'Adulto', 'Participa da sequência de troca da Biggoron’s Sword.'),
  npc('ichiro', 'Ichiro', 'Ichiro', 'Morador', 'Carpinteiro', 'Fortaleza Gerudo', 'Adulto', 'Um dos carpinteiros capturados pelas Gerudo.'),
  npc('jiro', 'Jiro', 'Jiro', 'Morador', 'Carpinteiro', 'Fortaleza Gerudo', 'Adulto', 'Um dos carpinteiros presos na fortaleza.'),
  npc('saburo', 'Saburo', 'Saburo', 'Morador', 'Carpinteiro', 'Fortaleza Gerudo', 'Adulto', 'Um dos carpinteiros que Link precisa libertar.'),
  npc('shiro', 'Shiro', 'Shiro', 'Morador', 'Carpinteiro', 'Fortaleza Gerudo', 'Adulto', 'Um dos carpinteiros mantidos prisioneiros pelas Gerudo.'),

  npc('gerudo-warrior', 'Gerudo Warrior', 'Gerudo Warrior', 'Grupo', 'Guerreira Gerudo', 'Fortaleza Gerudo', 'Adulto', 'Representa as guerreiras que patrulham e protegem a fortaleza.', 'https://z64central.com/switch-2/gerudos-fortress-switch-2-remake-gerudo_hu_18cc3d89b051df19.webp', 'Remake 2026'),
  npc('nabooru-second', 'Segunda em Comando de Nabooru', "Nabooru's Second-in-Command", 'Aliado', 'Gerudo de alta patente', 'Fortaleza Gerudo', 'Adulto', 'Figura de liderança entre as Gerudo ligadas a Nabooru.'),
  npc('carpet-merchant', 'Carpet Merchant', 'Carpet Merchant', 'Comerciante', 'Mercador do deserto', 'Deserto Assombrado', 'Adulto', 'Mercador encontrado em um tapete voador no deserto.'),
  npc('kotake', 'Kotake', 'Kotake', 'Antagonista', 'Bruxa do gelo', 'Templo do Espírito', 'Ambas', 'Uma das bruxas Gerudo que servem Ganondorf e formam Twinrova.', 'https://z64central.com/switch-2/spirit-temple-switch-2-remake-twinrova-1_hu_1ebd2cf387886d3a.webp', 'Remake 2026'),
  npc('koume', 'Koume', 'Koume', 'Antagonista', 'Bruxa do fogo', 'Templo do Espírito', 'Ambas', 'Irmã de Kotake e metade da dupla Twinrova.'),
  npc('twinrova', 'Twinrova', 'Twinrova', 'Antagonista', 'Forma combinada de Kotake e Koume', 'Templo do Espírito', 'Adulto', 'Fusão das duas bruxas e chefe do Templo do Espírito.', 'https://z64central.com/switch-2/spirit-temple-switch-2-remake-twinrova-1_hu_1ebd2cf387886d3a.webp', 'Remake 2026'),

  npc('poe-collector', 'Poe Collector', 'Poe Collector', 'Comerciante', 'Colecionador de Poes', 'Mercado destruído', 'Adulto', 'Compra Big Poes e recompensa Link pelo progresso na coleta.'),
  npc('buyer', 'Buyer', 'Buyer', 'Comerciante', 'Comprador', 'Hyrule', 'Ambas', 'NPC associado a trocas e compra de itens em eventos específicos.'),

  npc('great-fairy-courage', 'Grande Fada da Coragem', 'Great Fairy of Courage', 'Divindade', 'Grande Fada', 'Fonte de Grande Fada', 'Ambas', 'Concede uma melhoria importante ligada à Coragem.', 'https://z64central.com/switch-2/great-fairy-fountain-switch-2-remake-1_hu_a73b5ee6d0010fd3.webp', 'Remake 2026'),
  npc('great-fairy-magic', 'Grande Fada da Magia', 'Great Fairy of Magic', 'Divindade', 'Grande Fada', 'Fonte de Grande Fada', 'Ambas', 'Concede magia ou aprimoramentos mágicos a Link.', 'https://z64central.com/switch-2/great-fairy-fountain-switch-2-remake-1_hu_a73b5ee6d0010fd3.webp', 'Remake 2026'),
  npc('great-fairy-power', 'Grande Fada do Poder', 'Great Fairy of Power', 'Divindade', 'Grande Fada', 'Fonte de Grande Fada', 'Ambas', 'Concede um aprimoramento ligado ao poder de Link.', 'https://z64central.com/switch-2/great-fairy-fountain-switch-2-remake-1_hu_a73b5ee6d0010fd3.webp', 'Remake 2026'),
  npc('great-fairy-wisdom', 'Grande Fada da Sabedoria', 'Great Fairy of Wisdom', 'Divindade', 'Grande Fada', 'Fonte de Grande Fada', 'Ambas', 'Concede um aprimoramento associado à Sabedoria.', 'https://z64central.com/switch-2/great-fairy-fountain-switch-2-remake-1_hu_a73b5ee6d0010fd3.webp', 'Remake 2026'),
  npc('din', 'Din', 'Din', 'Divindade', 'Deusa do Poder', 'Mito de criação de Hyrule', 'Ambas', 'Uma das três Golden Goddesses responsáveis pela criação de Hyrule.'),
  npc('nayru', 'Nayru', 'Nayru', 'Divindade', 'Deusa da Sabedoria', 'Mito de criação de Hyrule', 'Ambas', 'Deusa associada à sabedoria e às leis do mundo.'),
  npc('farore', 'Farore', 'Farore', 'Divindade', 'Deusa da Coragem', 'Mito de criação de Hyrule', 'Ambas', 'Deusa associada à coragem e à vida criada em Hyrule.'),

  npc('flat', 'Flat, o Jovem', 'Flat the Younger', 'Morador', 'Compositor fantasma', 'Cemitério de Kakariko', 'Ambas', 'Um dos irmãos compositores ligados a canções e segredos reais.'),
  npc('sharp', 'Sharp, o Ancião', 'Sharp the Elder', 'Morador', 'Compositor fantasma', 'Cemitério de Kakariko', 'Ambas', 'Irmão de Flat e figura ligada ao passado musical de Kakariko.'),
  npc('king-hyrule', 'Rei de Hyrule', 'King of Hyrule', 'Principal', 'Rei de Hyrule', 'Castelo de Hyrule', 'Criança', 'Pai de Zelda e governante de Hyrule antes da ascensão de Ganondorf.'),
  npc('ganondorf-horse', 'Cavalo de Ganondorf', "Ganondorf's Horse", 'Animal', 'Montaria de Ganondorf', 'Castelo de Hyrule', 'Criança', 'Montaria usada por Ganondorf em momentos importantes da história.'),
  npc('link-mother', 'Mãe de Link', "Link's Mother", 'Morador', 'Personagem de lore', 'História anterior ao jogo', 'Criança', 'Figura mencionada na história de origem de Link e da Guerra Civil de Hyrule.'),
]
