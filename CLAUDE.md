# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This repository contains a portfolio site (root) and a specific application called **FairShare**, a proportional expense splitter designed for households.

### FairShare Architecture
FairShare is a client-side vanilla JavaScript application.
- **Frontend**: HTML5 and CSS3 with a "pixel-art/retro" aesthetic using Google Fonts (`Press Start 2P`, `VT323`, `Outfit`).
- **Logic**: Vanilla JavaScript (`script.js`) handling proportional calculations based on income ratios.
- **Styling**: CSS using CSS Variables for theming and advanced effects (glitch text, grain overlay, pixel-art characters via `box-shadow`).

## Development Commands
As this is a static frontend project, no build or install steps are required.

- **Run Locally**: Open `index.html` or `fairshare/index.html` directly in a browser.
- **Development Workflow**: Edit HTML/CSS/JS files and refresh the browser.

## Project Structure
- `/` : Main portfolio entry point.
- `/fairshare/` : The FairShare application.
    - `index.html`: UI structure.
    - `style.css`: Retro-themed styling and layout.
    - `script.js`: Income ratio and expense calculation logic.
