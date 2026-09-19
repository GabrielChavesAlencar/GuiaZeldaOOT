export type ItemCategory =
  | 'Arma'
  | 'Escudo'
  | 'Roupa'
  | 'Botas'
  | 'Ferramenta'
  | 'Munição'
  | 'Magia'
  | 'Acessório'
  | 'Garrafa'
  | 'Máscara'
  | 'Quest'
  | 'Dungeon'

export type ItemEra = 'Criança' | 'Adulto' | 'Ambas'
export type ItemVisual = 'Remake 2026' | 'OOT 3D'

export type ItemEntry = {
  id: string
  name: string
  pageTitle: string
  category: ItemCategory
  era: ItemEra
  visual: ItemVisual
  description: string
  obtainedAt: string
  acquisition: string
  questName: string
  questIds: string[]
  locationIds: string[]
  imageUrl?: string
  visualNote?: string
}

const official = 'https://www.nintendo.com/jp/games/switch2/aa9ja/assets/img'

const remake = {
  shop: 'https://z64central.com/switch-2/kokiri-forest-switch-2-remake-shop_hu_72ac5737ea86818.webp',
  fairyOcarina: 'https://z64central.com/switch-2/kokiri-forest-switch-2-remake-saria-goodbye-2_hu_3ba2368b7a6cb9bf.webp',
  equipment: 'https://z64central.com/switch-2/ocarina-of-time-switch-2-remake-inventory-screen_hu_5252d4469e6a8d75.webp',
  quickItems: 'https://z64central.com/switch-2/ocarina-of-time-switch-2-remake-quick-item-swap_hu_7d21b66a132ba80c.webp',
  ocarinaTime: 'https://z64central.com/switch-2/hyrule-castle-town-switch-2-remake-zelda-throws-ocarina_hu_93eec75415559d74.webp',
  fishing: 'https://z64central.com/switch-2/lake-hylia-switch-2-remake-fishing-pond_hu_ba0d371a7d44f005.webp',
  silverScale: 'https://z64central.com/switch-2/zoras-domain-switch-2-remake-diving_hu_2c70f0e1336c0513.webp',
  bomb: 'https://z64central.com/switch-2/dodongos-cavern-switch-2-remake-1_hu_79c3a796fb6575f2.webp',
  boomerang: 'https://z64central.com/switch-2/jabu-jabus-belly-switch-2-remake-1_hu_401b01e7ec008275.webp',
  masterSword: 'https://z64central.com/switch-2/temple-of-time-switch-2-remake-master-sword_hu_a8698a4719e961b6.webp',
  fireTemple: 'https://z64central.com/switch-2/fire-temple-switch-2-remake-1_hu_a5356e7ba88fc70a.webp',
  waterTemple: 'https://z64central.com/switch-2/water-temple-switch-2-remake-1_hu_b421812e62258db5.webp',
  ironBoots: 'https://z64central.com/switch-2/water-temple-switch-2-remake-iron-boots_hu_34e33bf0cab5f427.webp',
  mirrorShield: 'https://z64central.com/switch-2/spirit-temple-switch-2-remake-twinrova-2_hu_22806e91b16fcfed.webp',
  goldenGauntlets: 'https://z64central.com/switch-2/ganons-castle-switch-2-remake-ganon-fight_hu_58289e0c189bc3d6.webp',
}

const i = (
  id: string,
  name: string,
  pageTitle: string,
  category: ItemCategory,
  era: ItemEra,
  description: string,
  obtainedAt: string,
  acquisition: string,
  questName: string,
  locationIds: string[] = [],
  questIds: string[] = [],
  imageUrl?: string,
  visual: ItemVisual = imageUrl ? 'Remake 2026' : 'OOT 3D',
  visualNote?: string,
): ItemEntry => ({ id, name, pageTitle, category, era, visual, description, obtainedAt, acquisition, questName, locationIds, questIds, imageUrl, visualNote })

export const itemEntries: ItemEntry[] = [
  // Espadas e escudos
  i('kokiri-sword', 'Kokiri Sword', 'Kokiri Sword', 'Arma', 'Criança', 'Espada curta de Link criança e sua primeira arma permanente.', 'Floresta Kokiri', 'Entre no túnel da área de treinamento e abra o baú no fim da passagem.', 'Preparativos na Floresta Kokiri', ['kokiri'], [], remake.equipment, 'Remake 2026', 'Na tela de Equipment do remake, a Kokiri Sword aparece equipada no jovem Link como uma lâmina curta e simples, com guarda compacta e acabamento metálico muito mais detalhado. O menu também permite girar o modelo 3D de Link para inspecionar o equipamento.'),
  i('master-sword', 'Master Sword', 'Master Sword', 'Arma', 'Adulto', 'A espada lendária ligada ao Templo do Tempo e à alternância entre as eras.', 'Templo do Tempo', 'É obtida como parte da progressão principal no Pedestal of Time.', 'Templo do Tempo', ['temple-time'], [], remake.masterSword, 'Remake 2026', 'A Master Sword mantém a silhueta clássica, mas a nova modelagem deixa a lâmina, a guarda azul e os detalhes da Triforce muito mais definidos. O trailer mostra tanto a retirada quanto a devolução da espada no Pedestal of Time.'),
  i('giants-knife', "Giant's Knife", "Giant's Knife", 'Arma', 'Adulto', 'Espada de duas mãos muito forte, porém frágil e capaz de quebrar.', 'Cidade Goron', 'Compre do grande Goron ferreiro por 200 Rupees.', 'Compra opcional', ['goron-city']),
  i('biggoron-sword', 'Biggoron’s Sword', "Biggoron's Sword", 'Arma', 'Adulto', 'Espada de duas mãos tão forte quanto a Giant’s Knife, mas permanente.', 'Montanha da Morte', 'Complete toda a sequência de trocas de Biggoron e apresente o Claim Check no fim.', 'Biggoron’s Sword', ['death-mountain'], ['biggorons-sword']),
  i('deku-shield', 'Deku Shield', 'Deku Shield', 'Escudo', 'Criança', 'Escudo de madeira usado por Link criança; pode ser queimado por fogo.', 'Loja Kokiri', 'Compre por 40 Rupees antes de entrar na Grande Árvore Deku.', 'Preparativos na Floresta Kokiri', ['kokiri'], [], remake.shop, 'Remake 2026', 'O Deku Shield aparece como um objeto físico na prateleira da Kokiri Shop, com madeira, bordas e o emblema Kokiri visíveis em alta definição. Também pode ser visto equipado nas costas de Link e no menu de Equipment.'),
  i('hylian-shield', 'Hylian Shield', 'Hylian Shield', 'Escudo', 'Ambas', 'Escudo resistente de Hyrule, usado normalmente por Link adulto.', 'Mercado / Cemitério de Kakariko', 'Pode ser comprado no Bazaar ou encontrado em uma tumba no cemitério.', 'Exploração / equipamento', ['market', 'graveyard'], [], remake.masterSword, 'Remake 2026', 'A versão nova aparece nas costas de Link em várias cenas oficiais.'),
  i('mirror-shield', 'Mirror Shield', 'Mirror Shield', 'Escudo', 'Adulto', 'Escudo capaz de refletir luz e energia, essencial para puzzles do deserto.', 'Templo do Espírito', 'Encontre o grande baú durante a parte adulta do templo.', 'Templo do Espírito', ['spirit-temple'], [], remake.mirrorShield, 'Remake 2026', 'O trailer mostra o novo Mirror Shield refletindo o ataque de Twinrova.'),

  // Roupas, botas e força
  i('kokiri-tunic', 'Kokiri Tunic', 'Kokiri Tunic', 'Roupa', 'Ambas', 'Túnica verde padrão de Link.', 'Inventário inicial', 'Link começa a aventura usando esta túnica.', 'Início da aventura', ['kokiri'], [], remake.equipment, 'Remake 2026', 'A Kokiri Tunic aparece no modelo 3D rotacionável de Link, com tecido texturizado, costuras e camadas de roupa muito mais perceptíveis que no original. O verde não é apenas uma troca de cor: o material da roupa possui volume e acabamento próprios.'),
  i('goron-tunic', 'Goron Tunic', 'Goron Tunic', 'Roupa', 'Adulto', 'Protege Link do calor extremo em áreas vulcânicas.', 'Cidade Goron', 'Receba do jovem Goron rolante ou compre na loja Goron.', 'Preparação para o Templo do Fogo', ['goron-city', 'fire-temple'], [], remake.fireTemple, 'Remake 2026', 'A Goron Tunic agora possui tecido e ornamentos próprios, não apenas a cor vermelha. No Fire Temple, a iluminação laranja destaca costuras, símbolos e diferenças de material enquanto Link usa o Megaton Hammer.'),
  i('zora-tunic', 'Zora Tunic', 'Zora Tunic', 'Roupa', 'Adulto', 'Permite permanecer debaixo d’água sem limite de respiração.', 'Domínio Zora', 'Receba do Rei Zora depois de descongelá-lo ou compre na loja.', 'Preparação para o Templo da Água', ['zora-domain', 'water-temple'], [], remake.waterTemple, 'Remake 2026', 'A Zora Tunic recebeu textura azul própria e detalhes visuais no gorro e na roupa. O trailer a mostra tanto com o Hookshot na água rasa quanto completamente submersa ao lado das Iron Boots.'),
  i('kokiri-boots', 'Kokiri Boots', 'Kokiri Boots', 'Botas', 'Ambas', 'Botas comuns usadas por Link na maior parte da aventura.', 'Inventário inicial', 'Fazem parte do equipamento inicial.', 'Início da aventura', ['kokiri']),
  i('iron-boots', 'Iron Boots', 'Iron Boots', 'Botas', 'Adulto', 'Botas pesadas que fazem Link afundar e permitem caminhar no fundo da água.', 'Ice Cavern', 'Abra o baú principal da caverna de gelo.', 'Ice Cavern / preparação para Water Temple', ['zora-fountain', 'water-temple'], [], `${official}/dungeon/item_adult_thumb_03.webp`, 'Remake 2026', 'As Iron Boots agora parecem realmente pesadas, com placas metálicas grossas e volume muito maior nos pés. O trailer mostra Link caminhando totalmente submerso no Water Temple enquanto a luz da água ondula sobre as botas e o piso.'),
  i('hover-boots', 'Hover Boots', 'Hover Boots', 'Botas', 'Adulto', 'Permitem atravessar pequenos vãos antes de Link começar a cair.', 'Templo das Sombras', 'Derrote o minichefe da sala correspondente e abra o baú.', 'Templo das Sombras', ['shadow-temple']),
  i('goron-bracelet', 'Goron’s Bracelet', "Goron's Bracelet", 'Acessório', 'Criança', 'Aumenta a força de Link criança e permite levantar Bomb Flowers.', 'Cidade Goron', 'Mostre a Saria’s Song a Darunia para receber o bracelete.', 'Ajudando os Gorons', ['goron-city']),
  i('silver-gauntlets', 'Silver Gauntlets', 'Silver Gauntlets', 'Acessório', 'Adulto', 'Aumentam muito a força e permitem mover grandes blocos.', 'Templo do Espírito', 'São obtidas durante a parte infantil do templo e usadas posteriormente como adulto.', 'Templo do Espírito', ['spirit-temple']),
  i('golden-gauntlets', 'Golden Gauntlets', 'Golden Gauntlets', 'Acessório', 'Adulto', 'Maior upgrade de força, permitindo mover obstáculos gigantes.', 'Castelo de Ganon', 'Abra o baú na prova relacionada durante a área final.', 'Castelo de Ganon', ['ganon-castle'], [], remake.goldenGauntlets, 'Remake 2026', 'As Golden Gauntlets aparecem como manoplas douradas espessas, cobrindo boa parte do antebraço de Link. Em uma cena de combate, o metal recebe o brilho da magia roxa de Ganondorf, deixando o upgrade claramente visível durante a ação.'),
  i('silver-scale', 'Silver Scale', 'Silver Scale', 'Acessório', 'Criança', 'Aumenta o tempo que Link consegue mergulhar.', 'Domínio Zora', 'Vença o Diving Game no topo da cachoeira.', 'Zora Diving Game', ['zora-domain'], ['zora-diving-game'], remake.silverScale, 'Remake 2026', 'O gameplay oficial mostra o Diving Game que concede a Silver Scale.'),
  i('golden-scale', 'Golden Scale', 'Golden Scale', 'Acessório', 'Adulto', 'Upgrade de mergulho que aumenta ainda mais o tempo submerso.', 'Fishing Pond', 'Pesque um peixe grande o suficiente na fase adulta e mostre ao dono.', 'Fishing Pond', ['lake-hylia'], ['fishing-pond'], remake.fishing, 'Remake 2026', 'O Fishing Pond e a vara aparecem no trailer do remake; a escala em si ainda não teve close oficial.'),

  // C-button / itens de uso
  i('deku-stick', 'Deku Stick', 'Deku Stick', 'Ferramenta', 'Criança', 'Galho usado como arma improvisada e para transportar fogo entre tochas.', 'Floresta Kokiri / drops', 'Compre na Kokiri Shop ou obtenha derrotando Deku Babas.', 'Exploração inicial', ['kokiri', 'deku-tree'], [], `${official}/dungeon/item_child_thumb_03.webp`, 'Remake 2026', 'A Nintendo publicou uma imagem dedicada do Deku Stick na seção de itens. O bastão mantém a forma de galho simples, mas agora tem textura de madeira, irregularidades naturais e uma ponta claramente legível, combinando com a versão usada para carregar fogo nas dungeons.'),
  i('deku-nut', 'Deku Nut', 'Deku Nut', 'Munição', 'Ambas', 'Explode em um clarão que atordoa muitos inimigos.', 'Lojas / drops', 'É vendida em lojas e encontrada em inimigos e vegetação.', 'Uso geral', ['kokiri'], [], remake.quickItems, 'Remake 2026', 'A nova versão aparece no Quick Item Swap e sendo usada contra Deku Baba.'),
  i('fairy-slingshot', 'Fairy Slingshot', 'Fairy Slingshot', 'Arma', 'Criança', 'Estilingue de longa distância exclusivo de Link criança.', 'Interior da Grande Árvore Deku', 'Abra o baú principal nas salas superiores da primeira dungeon.', 'Grande Árvore Deku', ['deku-tree'], [], `${official}/dungeon/item_child_thumb_01.webp`, 'Remake 2026', 'A imagem oficial destaca a Fairy Slingshot como uma arma de madeira compacta, com tiras e estrutura muito mais detalhadas. No gameplay, a mira agora pode permanecer em terceira pessoa, deixando Link e o estilingue visíveis durante o disparo.'),
  i('bomb', 'Bomb', 'Bomb', 'Munição', 'Ambas', 'Explosivo usado em combate, paredes rachadas e puzzles.', 'Caverna dos Dodongos / lojas', 'O Bomb Bag libera o uso de bombas; depois elas aparecem em lojas e drops.', 'Caverna dos Dodongos', ['dodongo'], [], remake.bomb, 'Remake 2026', 'O trailer mostra Link usando bombas na Dodongo’s Cavern.'),
  i('bombchu', 'Bombchu', 'Bombchu', 'Munição', 'Ambas', 'Bomba móvel que corre por superfícies antes de explodir.', 'Bombchu Bowling / lojas / baús', 'Pode ser obtido em minijogos, lojas específicas e baús.', 'Bombchu Bowling / exploração', ['market'], ['bombchu-bowling']),
  i('boomerang', 'Boomerang', 'Boomerang', 'Arma', 'Criança', 'Arma de retorno que atordoa inimigos e busca itens distantes.', 'Interior de Jabu-Jabu', 'Abra o grande baú durante a dungeon.', 'Jabu-Jabu', ['jabu'], [], `${official}/dungeon/item_child_thumb_02.webp`, 'Remake 2026', 'O Boomerang mantém o formato curvo clássico, mas ganhou material, bordas e acabamento mais ricos. O trailer o mostra em pleno voo dentro de Jabu-Jabu, inclusive contra o grande Parasitic Tentacle, deixando clara a trajetória de ida e volta.'),
  i('fairy-ocarina', 'Fairy Ocarina', 'Fairy Ocarina', 'Ferramenta', 'Criança', 'Primeira ocarina de Link, usada para tocar canções aprendidas durante a jornada.', 'Saída da Floresta Kokiri', 'Saria entrega a ocarina quando Link deixa a floresta pela primeira vez.', 'Partida para Hyrule', ['kokiri'], [], remake.fairyOcarina, 'Remake 2026', 'O novo design aparece em close nas mãos de Saria no trailer.'),
  i('ocarina-time', 'Ocarina of Time', 'Ocarina of Time', 'Ferramenta', 'Ambas', 'Ocarina azul ligada à família real e ao Templo do Tempo.', 'Entrada do Mercado / fosso do castelo', 'É obtida durante a progressão principal antes da abertura do Door of Time.', 'Templo do Tempo', ['market', 'temple-time'], [], `${official}/dungeon/item_ocarina_thumb.webp`, 'Remake 2026', 'A Ocarina of Time recebeu destaque próprio no site japonês. O novo modelo preserva o azul intenso e o formato icônico, mas apresenta superfície cerâmica, furos e reflexos mais realistas; o trailer também a mostra nas mãos de Zelda durante a fuga do castelo.'),
  i('magic-bean', 'Magic Bean', 'Magic Bean', 'Ferramenta', 'Criança', 'Semente que pode ser plantada em solo macio e vira plataforma na era adulta.', 'Rio Zora', 'Compre do Bean Seller; o preço aumenta a cada compra.', 'Magic Beans', ['zora-river'], ['magic-beans']),
  i('fairy-bow', 'Fairy Bow', 'Fairy Bow', 'Arma', 'Adulto', 'Arco de Link adulto, usado em combate, puzzles e minijogos montado em Epona.', 'Templo da Floresta', 'Abra o grande baú após uma batalha importante no templo.', 'Templo da Floresta', ['forest-temple'], [], `${official}/dungeon/item_adult_thumb_02.webp`, 'Remake 2026', 'A Fairy Bow aparece em imagem oficial da seção adulta. O arco tem corpo de madeira mais robusto, corda claramente modelada e acabamento realista, coerente com a nova direção visual; ele continua sendo usado tanto em combate quanto para ativar mecanismos à distância.'),
  i('fire-arrow', 'Fire Arrow', 'Fire Arrow', 'Arma', 'Adulto', 'Flecha elemental que incendeia alvos e acende tochas.', 'Lago Hylia', 'Após restaurar o lago, atire uma flecha no sol nascente a partir do ponto correto.', 'Fire & Ice Arrows', ['lake-hylia'], ['custom-arrows']),
  i('ice-arrow', 'Ice Arrow', 'Ice Arrow', 'Arma', 'Adulto', 'Flecha elemental opcional que congela inimigos.', 'Gerudo Training Ground', 'Complete o mini-dungeon e use chaves suficientes para alcançar o baú central.', 'Gerudo Training Ground', ['gerudo-fortress'], ['gerudo-training-ground', 'custom-arrows']),
  i('light-arrow', 'Light Arrow', 'Light Arrow', 'Arma', 'Adulto', 'Flecha de luz usada na parte final da aventura.', 'Templo do Tempo', 'É recebida durante a progressão final da campanha.', 'Reta final da campanha', ['temple-time', 'ganon-castle']),
  i('hookshot', 'Hookshot', 'Hookshot', 'Ferramenta', 'Adulto', 'Gancho com corrente que puxa Link até superfícies e recupera itens distantes.', 'Cemitério de Kakariko', 'Complete a corrida com Dampé dentro de sua tumba.', 'Corrida de Dampé', ['graveyard'], ['dampe-race'], `${official}/dungeon/item_adult_thumb_01.webp`, 'Remake 2026', 'A imagem oficial mostra o novo Hookshot com corpo metálico mais detalhado. No trailer, Link o dispara dentro do Water Temple: a corrente fica completamente visível e esticada até um alvo dourado sobre uma porta gradeada.'),
  i('longshot', 'Longshot', 'Longshot', 'Ferramenta', 'Adulto', 'Versão de alcance maior do Hookshot.', 'Templo da Água', 'Abra o grande baú depois do encontro central da dungeon.', 'Templo da Água', ['water-temple']),
  i('megaton-hammer', 'Megaton Hammer', 'Megaton Hammer', 'Arma', 'Adulto', 'Martelo pesado que quebra rochas e ativa mecanismos.', 'Templo do Fogo', 'Abra o grande baú na parte alta do templo.', 'Templo do Fogo', ['fire-temple'], [], remake.fireTemple, 'Remake 2026', 'O Megaton Hammer foi remodelado como uma ferramenta maciça, com cabeça metálica pesada e cabo robusto. No trailer, o impacto contra uma enorme estátua de rosto Goron arremessa fragmentos de pedra pelo cenário vermelho do Fire Temple.'),
  i('lens-truth', 'Lens of Truth', 'Lens of Truth', 'Ferramenta', 'Ambas', 'Lente mágica que revela paredes falsas, plataformas e objetos invisíveis.', 'Bottom of the Well', 'Explore o poço de Kakariko como criança e obtenha o item no baú correspondente.', 'Bottom of the Well / Shadow Temple', ['kakariko', 'shadow-temple']),
  i('dins-fire', 'Din’s Fire', "Din's Fire", 'Magia', 'Ambas', 'Explosão circular de fogo ao redor de Link.', 'Great Fairy Fountain perto do Castelo de Hyrule', 'Encontre a fonte e toque Zelda’s Lullaby.', 'Fontes das Grandes Fadas', ['hyrule-castle'], ['great-fairy-fountains']),
  i('farores-wind', 'Farore’s Wind', "Farore's Wind", 'Magia', 'Ambas', 'Cria um ponto de retorno dentro de dungeons.', 'Great Fairy Fountain na Fonte Zora', 'Encontre a fonte escondida e toque Zelda’s Lullaby.', 'Fontes das Grandes Fadas', ['zora-fountain'], ['great-fairy-fountains']),
  i('nayrus-love', 'Nayru’s Love', "Nayru's Love", 'Magia', 'Ambas', 'Barreira mágica temporária que reduz o risco em combates difíceis.', 'Great Fairy Fountain no Colosso do Deserto', 'Exploda a entrada da fonte e toque Zelda’s Lullaby.', 'Fontes das Grandes Fadas', ['desert-colossus'], ['great-fairy-fountains']),

  // Capacidade e utilidade
  i('bullet-bag', 'Deku Seed Bullet Bag', 'Deku Seeds Bullet Bag', 'Acessório', 'Criança', 'Bolsa de munição do Fairy Slingshot; começa com capacidade para 30 sementes.', 'Grande Árvore Deku', 'É recebida junto com o Fairy Slingshot.', 'Grande Árvore Deku / upgrades de equipamento', ['deku-tree'], ['equipment-upgrades']),
  i('quiver', 'Quiver', 'Quiver', 'Acessório', 'Adulto', 'Aljava usada para carregar flechas; pode receber upgrades de capacidade.', 'Templo da Floresta', 'É obtida junto com o Fairy Bow; upgrades vêm de desafios de tiro.', 'Upgrades de Equipamento', ['forest-temple', 'kakariko', 'gerudo-fortress'], ['equipment-upgrades', 'shooting-gallery', 'horseback-archery']),
  i('bomb-bag', 'Bomb Bag', 'Bomb Bag', 'Acessório', 'Ambas', 'Bolsa necessária para carregar Bombs; pode receber upgrades.', 'Caverna dos Dodongos', 'Abra o grande baú da dungeon; capacidade cresce em atividades opcionais.', 'Caverna dos Dodongos / Upgrades de Equipamento', ['dodongo', 'goron-city', 'market'], ['equipment-upgrades', 'bombchu-bowling']),
  i('adult-wallet', 'Adult’s Wallet', 'Adult Wallet', 'Acessório', 'Ambas', 'Aumenta a capacidade de Rupees para 200.', 'House of Skulltula', 'Colete 10 Gold Skulltula Tokens e resgate a recompensa em Kakariko.', 'House of Skulltula', ['kakariko'], ['gold-skulltulas', 'house-of-skulltula']),
  i('giants-wallet', 'Giant’s Wallet', "Giant's Wallet", 'Acessório', 'Ambas', 'Aumenta a capacidade de Rupees para 500.', 'House of Skulltula', 'Colete 30 Gold Skulltula Tokens e resgate a recompensa.', 'House of Skulltula', ['kakariko'], ['gold-skulltulas', 'house-of-skulltula']),
  i('fishing-rod', 'Fishing Rod', 'Fishing Rod', 'Ferramenta', 'Ambas', 'Vara emprestada pelo Fishing Pond para o minijogo de pesca.', 'Fishing Pond — Lago Hylia', 'Converse com o dono do lago e pague a taxa para pescar.', 'Fishing Pond', ['lake-hylia'], ['fishing-pond'], remake.fishing, 'Remake 2026', 'O trailer mostra a nova vara em uso e o Fishing Pond redesenhado.'),

  // Garrafas e conteúdo
  i('empty-bottle', 'Empty Bottle', 'Bottle', 'Garrafa', 'Ambas', 'Recipiente reutilizável para fadas, poções, leite, insetos e outros conteúdos.', 'Diversas side quests', 'Existem quatro garrafas, obtidas em atividades diferentes pelo mapa.', 'Garrafas Vazias', ['lon-lon', 'kakariko', 'lake-hylia', 'hyrule-field'], ['bottles']),
  i('rutos-letter', 'Ruto’s Letter', "Ruto's Letter", 'Quest', 'Criança', 'Mensagem encontrada em uma garrafa e usada para avançar na área Zora.', 'Lago Hylia', 'Mergulhe no fundo do lago depois de obter capacidade de mergulho suficiente.', 'Domínio Zora / Jabu-Jabu', ['lake-hylia', 'zora-domain']),
  i('lon-lon-milk', 'Lon Lon Milk', 'Lon Lon Milk', 'Garrafa', 'Ambas', 'Leite com duas doses de cura.', 'Rancho Lon Lon', 'Vença o Super Cucco Game ou compre de Talon depois do desafio.', 'Super Cucco Game', ['lon-lon'], ['super-cucco-game', 'bottles']),
  i('bottled-fairy', 'Fairy', 'Fairy', 'Garrafa', 'Ambas', 'Cura Link e pode revivê-lo automaticamente se estiver guardada em Bottle.', 'Fairy Fountains / grutas / lojas', 'Capture uma fada usando uma Empty Bottle.', 'Exploração / Fontes de Fadas', [], ['great-fairy-fountains']),
  i('blue-fire', 'Blue Fire', 'Blue Fire', 'Garrafa', 'Adulto', 'Chama fria usada para derreter gelo vermelho.', 'Ice Cavern', 'Capture a chama azul em uma Bottle ou compre em loja específica.', 'Ice Cavern / Domínio Zora', ['zora-fountain', 'zora-domain']),
  i('bottle-bug', 'Bottle Bug', 'Bottle Bug', 'Garrafa', 'Ambas', 'Insetos usados principalmente em montes de terra macia.', 'Grutas e áreas naturais', 'Capture bugs em uma Empty Bottle.', 'Gold Skulltulas / exploração', [], ['gold-skulltulas']),
  i('fish', 'Fish', 'Fish', 'Garrafa', 'Ambas', 'Peixe pequeno usado em situações específicas e que pode ser vendido.', 'Domínio Zora / grutas / lojas', 'Capture em uma Bottle ou compre em lojas.', 'Exploração', ['zora-domain']),
  i('poe-spirit', 'Poe Spirit', 'Poe', 'Garrafa', 'Adulto', 'Espírito de Poe armazenável em Bottle.', 'Campo de Hyrule e outras áreas', 'Derrote um Poe e capture o espírito.', 'Big Poe Hunt', ['hyrule-field'], ['big-poe-hunt']),
  i('big-poe', 'Big Poe Spirit', 'Big Poe Spirit', 'Garrafa', 'Adulto', 'Espírito raro procurado pelo Poe Collector.', 'Campo de Hyrule', 'Derrote Big Poes montado em Epona e capture o espírito em uma Bottle.', 'Big Poe Hunt', ['hyrule-field'], ['big-poe-hunt']),

  // Máscaras
  i('keaton-mask', 'Keaton Mask', 'Keaton Mask', 'Máscara', 'Criança', 'Primeira máscara da sequência de vendas da Happy Mask Shop.', 'Happy Mask Shop', 'Pegue emprestada e venda ao guarda da Trilha da Montanha da Morte.', 'Happy Mask Shop', ['market', 'kakariko'], ['happy-mask-shop']),
  i('skull-mask', 'Skull Mask', 'Skull Mask', 'Máscara', 'Criança', 'Máscara de caveira usada na sequência de trocas e no Forest Stage.', 'Happy Mask Shop', 'É liberada depois de concluir a etapa anterior da sequência.', 'Happy Mask Shop / Forest Stage', ['market', 'lost-woods'], ['happy-mask-shop', 'forest-stage-mask-contest']),
  i('spooky-mask', 'Spooky Mask', 'Spooky Mask', 'Máscara', 'Criança', 'Máscara assustadora usada na sequência da loja.', 'Happy Mask Shop', 'Pegue após vender a Skull Mask e leve ao NPC indicado.', 'Happy Mask Shop', ['market', 'graveyard'], ['happy-mask-shop']),
  i('bunny-hood', 'Bunny Hood', 'Bunny Hood', 'Máscara', 'Criança', 'Capuz de coelho usado na quarta venda principal da sequência.', 'Happy Mask Shop', 'É liberado depois da Spooky Mask e vendido ao Running Man.', 'Happy Mask Shop', ['market', 'hyrule-field'], ['happy-mask-shop']),
  i('mask-truth', 'Mask of Truth', 'Mask of Truth', 'Máscara', 'Criança', 'Permite compreender mensagens de Gossip Stones.', 'Happy Mask Shop', 'Complete a sequência principal de venda das quatro máscaras.', 'Happy Mask Shop / Forest Stage', ['market', 'lost-woods'], ['happy-mask-shop', 'forest-stage-mask-contest']),
  i('goron-mask', 'Goron Mask', 'Goron Mask', 'Máscara', 'Criança', 'Máscara extra liberada após completar a sequência principal.', 'Happy Mask Shop', 'Pegue emprestada depois de liberar as máscaras bônus.', 'Happy Mask Shop', ['market'], ['happy-mask-shop']),
  i('zora-mask', 'Zora Mask', 'Zora Mask', 'Máscara', 'Criança', 'Máscara extra da Happy Mask Shop sem transformação em Ocarina of Time.', 'Happy Mask Shop', 'Fica disponível depois da sequência principal.', 'Happy Mask Shop', ['market'], ['happy-mask-shop']),
  i('gerudo-mask', 'Gerudo Mask', 'Gerudo Mask', 'Máscara', 'Criança', 'Máscara extra usada principalmente para diálogos e reações.', 'Happy Mask Shop', 'Fica disponível depois da sequência principal.', 'Happy Mask Shop', ['market'], ['happy-mask-shop']),

  // Sequência Biggoron
  i('pocket-egg', 'Pocket Egg', 'Pocket Egg', 'Quest', 'Adulto', 'Primeiro item da cadeia de troca da Biggoron’s Sword.', 'Kakariko Village', 'Receba da Cucco Lady e espere chocar.', 'Biggoron’s Sword', ['kakariko'], ['biggorons-sword']),
  i('pocket-cucco', 'Pocket Cucco', 'Pocket Cucco', 'Quest', 'Adulto', 'Cucco de bolso usado para acordar Talon durante a sequência.', 'Kakariko Village', 'O Pocket Egg choca depois de passar tempo suficiente.', 'Biggoron’s Sword', ['kakariko'], ['biggorons-sword']),
  i('cojiro', 'Cojiro', 'Cojiro', 'Quest', 'Adulto', 'Cucco azul usado para encontrar o próximo participante da troca.', 'Kakariko Village', 'Volte à Cucco Lady depois de usar o Pocket Cucco.', 'Biggoron’s Sword', ['kakariko', 'lost-woods'], ['biggorons-sword']),
  i('odd-mushroom', 'Odd Mushroom', 'Odd Mushroom', 'Quest', 'Adulto', 'Cogumelo perecível que precisa ser entregue rapidamente.', 'Bosques Perdidos', 'Mostre Cojiro ao personagem correto e aceite a entrega cronometrada.', 'Biggoron’s Sword', ['lost-woods', 'kakariko'], ['biggorons-sword']),
  i('odd-potion', 'Odd Potion', 'Odd Potion', 'Quest', 'Adulto', 'Poção preparada para a cadeia de troca de Biggoron.', 'Kakariko Village', 'Entregue o Odd Mushroom à velha da loja de poções.', 'Biggoron’s Sword', ['kakariko', 'lost-woods'], ['biggorons-sword']),
  i('poachers-saw', 'Poacher’s Saw', "Poacher's Saw", 'Quest', 'Adulto', 'Serra deixada pelo artesão e usada na etapa do Vale Gerudo.', 'Bosques Perdidos', 'Entregue a Odd Potion à Kokiri que aparece no local da troca.', 'Biggoron’s Sword', ['lost-woods', 'gerudo-valley'], ['biggorons-sword']),
  i('broken-goron-sword', 'Broken Goron’s Sword', "Broken Goron's Sword", 'Quest', 'Adulto', 'Espada quebrada entregue pelo chefe dos carpinteiros.', 'Vale Gerudo', 'Troque a Poacher’s Saw com o chefe dos carpinteiros.', 'Biggoron’s Sword', ['gerudo-valley', 'death-mountain'], ['biggorons-sword']),
  i('prescription', 'Prescription', 'Prescription', 'Quest', 'Adulto', 'Receita médica dada por Biggoron.', 'Topo da Montanha da Morte', 'Mostre a Broken Goron’s Sword a Biggoron.', 'Biggoron’s Sword', ['death-mountain', 'zora-domain'], ['biggorons-sword']),
  i('eyeball-frog', 'Eyeball Frog', 'Eyeball Frog', 'Quest', 'Adulto', 'Ingrediente perecível para o colírio de Biggoron.', 'Domínio Zora', 'Mostre a Prescription ao Rei Zora depois de ajudá-lo.', 'Biggoron’s Sword', ['zora-domain', 'lake-hylia'], ['biggorons-sword']),
  i('eyedrops', 'World’s Finest Eyedrops', "World's Finest Eyedrops", 'Quest', 'Adulto', 'Colírio preparado no laboratório e que precisa chegar fresco a Biggoron.', 'Laboratório do Lago Hylia', 'Entregue o Eyeball Frog ao cientista e complete a corrida cronometrada de volta.', 'Biggoron’s Sword', ['lake-hylia', 'death-mountain'], ['biggorons-sword']),
  i('claim-check', 'Claim Check', 'Claim Check', 'Quest', 'Adulto', 'Comprovante entregue enquanto Biggoron termina a espada.', 'Topo da Montanha da Morte', 'Entregue os Eyedrops a Biggoron e aguarde o tempo necessário.', 'Biggoron’s Sword', ['death-mountain'], ['biggorons-sword']),

  // Quest e progresso principal
  i('weird-egg', 'Weird Egg', 'Weird Egg', 'Quest', 'Criança', 'Ovo recebido no caminho para encontrar a princesa.', 'Castelo de Hyrule', 'Malon entrega o ovo perto do caminho do castelo.', 'Princesa de Hyrule', ['hyrule-castle']),
  i('zeldas-letter', 'Zelda’s Letter', "Zelda's Letter", 'Quest', 'Criança', 'Carta real usada para obter acesso à Montanha da Morte.', 'Castelo de Hyrule', 'Receba de Zelda durante o primeiro encontro no castelo.', 'Princesa de Hyrule / Montanha da Morte', ['hyrule-castle', 'kakariko']),
  i('gerudo-card', 'Gerudo’s Card', "Gerudo's Membership Card", 'Quest', 'Adulto', 'Passe que concede livre circulação na Fortaleza Gerudo.', 'Fortaleza Gerudo', 'Libere os carpinteiros e conclua a sequência de desafios da fortaleza.', 'Fortaleza Gerudo', ['gerudo-fortress'], ['gerudo-training-ground', 'horseback-archery']),
  i('kokiri-emerald', 'Kokiri’s Emerald', "Kokiri's Emerald", 'Quest', 'Criança', 'Pedra Espiritual verde ligada à Floresta Kokiri.', 'Grande Árvore Deku', 'Recebida ao concluir a primeira dungeon da campanha.', 'Grande Árvore Deku', ['deku-tree']),
  i('goron-ruby', 'Goron’s Ruby', "Goron's Ruby", 'Quest', 'Criança', 'Pedra Espiritual vermelha ligada aos Gorons.', 'Caverna dos Dodongos', 'Recebida ao concluir a crise da Montanha da Morte.', 'Caverna dos Dodongos', ['dodongo']),
  i('zora-sapphire', 'Zora’s Sapphire', "Zora's Sapphire", 'Quest', 'Criança', 'Pedra Espiritual azul ligada ao povo Zora.', 'Fonte Zora / Jabu-Jabu', 'Recebida ao concluir a etapa principal envolvendo Jabu-Jabu.', 'Jabu-Jabu', ['jabu', 'zora-fountain']),
  i('light-medallion', 'Light Medallion', 'Light Medallion', 'Quest', 'Adulto', 'Medalhão ligado ao Sábio da Luz.', 'Templo da Luz', 'Recebido na progressão principal ao entrar na era adulta.', 'Despertar na era adulta', ['temple-time']),
  i('forest-medallion', 'Forest Medallion', 'Forest Medallion', 'Quest', 'Adulto', 'Medalhão obtido após restaurar a região da floresta.', 'Templo da Floresta', 'Complete o Forest Temple.', 'Templo da Floresta', ['forest-temple']),
  i('fire-medallion', 'Fire Medallion', 'Fire Medallion', 'Quest', 'Adulto', 'Medalhão relacionado à região dos Gorons.', 'Templo do Fogo', 'Complete o Fire Temple.', 'Templo do Fogo', ['fire-temple']),
  i('water-medallion', 'Water Medallion', 'Water Medallion', 'Quest', 'Adulto', 'Medalhão relacionado ao povo Zora.', 'Templo da Água', 'Complete o Water Temple.', 'Templo da Água', ['water-temple']),
  i('shadow-medallion', 'Shadow Medallion', 'Shadow Medallion', 'Quest', 'Adulto', 'Medalhão associado ao Templo das Sombras.', 'Templo das Sombras', 'Complete o Shadow Temple.', 'Templo das Sombras', ['shadow-temple']),
  i('spirit-medallion', 'Spirit Medallion', 'Spirit Medallion', 'Quest', 'Adulto', 'Medalhão associado ao Templo do Espírito.', 'Templo do Espírito', 'Complete o Spirit Temple.', 'Templo do Espírito', ['spirit-temple']),

  // Dungeon
  i('dungeon-map', 'Dungeon Map', 'Dungeon Map', 'Dungeon', 'Ambas', 'Mostra a planta das salas da dungeon atual.', 'Dungeons', 'Abra o baú específico de mapa dentro de cada dungeon.', 'Exploração de dungeons'),
  i('compass', 'Compass', 'Compass', 'Dungeon', 'Ambas', 'Mostra baús, chefe e outras informações no mapa da dungeon.', 'Dungeons', 'Abra o baú específico de Compass dentro da dungeon.', 'Exploração de dungeons'),
  i('small-key', 'Small Key', 'Small Key', 'Dungeon', 'Ambas', 'Chave descartável que abre uma porta trancada na dungeon atual.', 'Dungeons', 'Encontrada em baús, salas e puzzles específicos.', 'Exploração de dungeons'),
  i('boss-key', 'Boss Key', 'Boss Key', 'Dungeon', 'Adulto', 'Chave grande necessária para abrir a porta do chefe em templos adultos.', 'Templos', 'Abra o baú de Boss Key da dungeon correspondente.', 'Exploração de templos'),
]

export const itemCategories: Array<'Todos' | ItemCategory> = [
  'Todos', 'Arma', 'Escudo', 'Roupa', 'Botas', 'Ferramenta', 'Munição', 'Magia', 'Acessório', 'Garrafa', 'Máscara', 'Quest', 'Dungeon',
]
