# AGENTS.md

Guidance for AI coding agents working on this repository.

## Project Structure

This repository contains:
- **Root portfolio** (`/`): Simple entry point (`index.html`) linking to applications.
- **FairShare** (`/fairshare/`): A vanilla JavaScript proportional expense splitter application.

**No build process or dependency installation required.** This is a static frontend-only project. Changes take effect immediately upon browser refresh.

## FairShare Application Architecture

### Core Purpose
FairShare calculates fair household expense splits based on **income ratios**. If Person A earns 60% and Person B earns 40%, they each pay those percentages of shared expenses.

### Key Files & Responsibilities

#### `script.js` - Calculation Logic
- **Income Stream**: Maintains two income inputs (`income1Input`, `income2Input`), calculates income percentages.
- **Expense Tracking**: Dynamic expense list with name/amount pairs, stored in `expenses[]` array with default categories (Rent, Groceries, Utilities, Internet, Insurance).
- **Core Calculation**: Uses **integer arithmetic (cents)** to avoid floating-point errors:
  ```javascript
  const inc1Cents = Math.round(parseFloat(income1Input.value) * 100);
  // Calculate shares using cents-based percentage
  const p1ShareCents = Math.round(totalExpensesCents * (p1PercentRounded / 100));
  ```
- **Currency Formatting**: `formatCurrency()` uses `Intl.NumberFormat` with locale mapping (`getLanguageFromCurrency()`). Supports USD, EUR, SEK, NOK, DKK.
- **Auto-Currency Detection**: Detects user locale and defaults currency accordingly (Nordic languages → SEK/NOK/DKK, US → USD, else EUR).
- **Event Flow**: All inputs (`income`, `expense amounts`) trigger `calculate()` on change, updating UI in real-time.

#### `style.css` - Retro Aesthetic & Layout
- **Theme**: Dark theme with purple/pink accent (`--primary: #a855f7`, `--secondary: #ec4899`) using CSS Variables.
- **Fonts**: Three Google Fonts for hierarchy:
  - `Press Start 2P`: Headers, stat values, buttons (retro arcade feel)
  - `VT323`: Description, footer (monospace retro)
  - `Outfit`: Body text, form inputs (modern readable)
- **Pixel Art**: Characters created with `box-shadow` stacking (p1, p2, heart). See `.pixel-character` and `.pixel-heart`.
- **Effects**: 
  - Glitch animation on title (`@keyframes glitch`)
  - Grain overlay (`SVG fractal noise` at opacity 0.04)
  - Heartbeat animation on heart (`@keyframes beat`)
- **Layout**: CSS Grid (`main-grid`): 2 columns on desktop (income + expenses left, results full-width), stacks to 1 column on mobile (<768px).

#### `index.html` - UI Structure
- **Dynamic Elements**: Expense list populated by JS. Income inputs use `data-index` attribute for person identification.
- **Custom Currency Selector**: Dropdown built with JS (`.currency-options.open` class toggles visibility).
- **Result Display**: Two `.result-box` elements show Person 1 and Person 2 final contributions (formatted with current currency).

### Critical Patterns & Conventions

1. **Data-Attribute IDs**: HTML elements use `data-index="0"` / `data-index="1"` to identify persons, not hardcoded IDs. If adding more than 2 persons, update this pattern.
2. **Integer Arithmetic**: All monetary calculations use cents (multiply/divide by 100) to avoid `0.1 + 0.2 === 0.3` issues. **This is non-negotiable for financial calculations.**
3. **Dynamic DOM**: Expenses are created with `createExpenseRow()` and appended to `#expenses-list`. Always re-trigger `calculate()` after DOM modifications.
4. **Event Listener Scope**: Use `document.addEventListener('click')` with target checks for dropdown closure (see currency dropdown logic). Avoid global state pollution.
5. **Currency State**: Stored in `let currentCurrency = 'USD'`. Updated via `updateCurrencyUI()` which refreshes all formatted values.

### Common Modifications

**Adding a Expense Category**: Edit `expenses[]` array in `script.js` (line 26-32). Existing categories load on init.

**Changing Fonts**: Modify Google Fonts link in `index.html` `<head>` and corresponding CSS Variable `font-family` rules in `style.css`.

**Theming**: All colors defined in `:root` CSS Variables. Update `--primary`, `--secondary`, `--bg-deep` etc. for instant theme changes.

**Localization**: Add currency to `detectDefaultCurrency()` and `getLanguageFromCurrency()` functions; add label in `labels` object (line 130-136).

## Development Workflow

1. **Edit Files**: Modify HTML, CSS, or JS directly in `/fairshare/`.
2. **Test**: Open `fairshare/index.html` in browser or `index.html` for portfolio entry point.
3. **Browser Refresh**: Changes are live immediately (no build step).
4. **Debug**: Use browser DevTools console to inspect `currentCurrency`, `expenses[]`, or calculation values.

## External Dependencies

- **Google Fonts**: Three fonts loaded via CDN (Press Start 2P, VT323, Outfit). No npm packages.
- **Intl API**: Uses browser-native `Intl.NumberFormat` for locale-aware currency formatting. No polyfill needed for modern browsers.

## Behavioral Notes

- **No Persistence**: Application state resets on page reload. Consider localStorage if persistence is desired.
- **Proportional Logic**: Totals always match: `p1Share + p2Share = totalExpenses` (within rounding).
- **Rounding Strategy**: Uses `Math.round()` after percentage calculation to minimize cumulative error. Final shares may differ by ~1 cent due to division.

## Files to Check First

- **Logic Questions**: → `script.js`
- **UI/Styling Questions**: → `style.css` and `index.html`
- **Calculation Errors**: → Check cents conversion and `Math.round()` usage in `calculate()` function
- **Styling Inconsistencies**: → Check CSS Variables in `:root` and media queries

