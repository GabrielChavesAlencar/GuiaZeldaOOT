# Guia Hyrule — Ocarina of Time (PT-BR)

MVP em React + TypeScript para um guia não oficial em português de *The Legend of Zelda: Ocarina of Time*.

## Recursos

- mapa ilustrado interativo com zoom/pan;
- pins por categoria e busca;
- painel de detalhes dos locais;
- roteiro da campanha por era;
- checklist persistido em `localStorage`;
- seção dedicada ao remake de Nintendo Switch 2;
- layout responsivo para desktop e celular;
- dados do mapa separados em `src/data/locations.ts` para ajuste fácil das coordenadas.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Onde editar

- `public/hyrule-map.png`: imagem-base do mapa.
- `src/data/locations.ts`: pins, coordenadas e textos dos locais.
- `src/data/guide.ts`: passos do guia.
- `src/data/remake.ts`: destaques e screenshots oficiais.
- `src/styles.css`: identidade visual.

## Observação sobre o remake

O conteúdo principal é estruturado a partir do Ocarina of Time clássico. Diferenças específicas da versão Nintendo Switch 2 devem ser confirmadas após o lançamento antes de serem tratadas como definitivas.
