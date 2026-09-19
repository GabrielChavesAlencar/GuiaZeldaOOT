# Hyrule Interactive Guide — Ocarina of Time

An interactive fan-made guide for **The Legend of Zelda: Ocarina of Time**,
built with **React + TypeScript**.

The project combines an interactive map, campaign progression, searchable
locations, persistent checklists, detailed visual references, responsive design,
and multilingual support.

> This repository is also intended as a reusable open-source base for developers
> who want to create their own interactive game guides.

## Live Demo

**https://guia-zelda-oot.vercel.app/**

## Features

- Interactive Hyrule map with zoom and pan.
- Searchable locations and categorized map markers.
- Detailed information for locations and points of interest.
- Campaign progression organized by game stage / era.
- Persistent completion checklist using `localStorage`.
- Responsive interface for desktop and mobile.
- Multilingual interface and content.
- Dedicated content for newer / remake-related material.
- Modular data structure that makes locations and guide content easier to edit.
- Visual references and screenshots for important characters, enemies, and places.

## Tech Stack

- React
- TypeScript
- Vite
- HTML
- CSS
- LocalStorage
- Vercel

## Run Locally

Clone the repository:

```bash
git clone https://github.com/GabrielChavesAlencar/GuiaZeldaOOT.git
cd GuiaZeldaOOT
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Project Structure

Some of the main areas you may want to customize:

- `public/` — images, map assets, screenshots and other public files.
- `src/data/locations.ts` — locations, markers, coordinates and related content.
- `src/data/guide.ts` — guide / campaign progression data.
- `src/data/remake.ts` — remake or newer-version related information.
- `src/` — React components, application logic and localization.
- `src/styles.css` — visual identity and application styling.

The exact structure may evolve as the project grows.

## Create Your Own Version

You are welcome to use this repository as a starting point for your own project.

You can:

- Fork the repository.
- Replace the map and location data.
- Create a guide for another game.
- Add new languages.
- Change the visual identity.
- Create new categories and markers.
- Modify the checklist and progression systems.
- Extend the application with your own React components and features.

If you redistribute this project or substantial portions of its source code,
please preserve the MIT license and attribution to the original author.

Suggested credit:

> Based on GuiaZeldaOOT by Gabriel Chaves Alencar  
> https://github.com/GabrielChavesAlencar/GuiaZeldaOOT

See [`ATTRIBUTION.md`](./ATTRIBUTION.md) for attribution information.

## Contributing

Suggestions, bug reports and pull requests are welcome.

If you want to propose a change:

1. Fork the repository.
2. Create a branch for your change.
3. Commit your changes.
4. Push the branch to your fork.
5. Open a Pull Request.

## License

The original source code created for this project is available under the
**MIT License**.

See [`LICENSE`](./LICENSE).

The MIT License applies to the original source code and original material
created by this project's author. It does **not** grant rights to third-party
intellectual property.

## Disclaimer

This is an **unofficial fan-made project**.

It is not affiliated with, endorsed by, sponsored by, or approved by Nintendo.

**The Legend of Zelda**, **Ocarina of Time**, Nintendo, associated characters,
names, artwork, screenshots, trademarks and other related intellectual property
belong to their respective owners.

Third-party images and materials are used only as references for this fan-made
guide where applicable.

## Author

**Gabriel Chaves Alencar**

Unity Developer / Game Developer / Full-Stack Developer

- GitHub: https://github.com/GabrielChavesAlencar
- LinkedIn: https://www.linkedin.com/in/gabriel-chaves-alencar-810bb5220/
- Portfolio: https://meu-portifolio-nine-snowy.vercel.app/
- Itch.io: https://gabriel-chaves-alencar.itch.io/
