# STRUT*

A fashion drop store: **Fall Collection, Drop 01**. Nine looks stand in a line. Swipe the line, tap a look, shop the pieces.

A static website made of plain HTML, CSS and JavaScript. No build step, no installs.

## Folder structure

```
strut-store/
├── index.html              Page markup: top bar, stage, product list, bag, pages
├── css/
│   └── styles.css          All styling. Colours are variables at the top (:root)
├── js/                     Loaded in this order by index.html
│   ├── data.js             Looks, product names, prices, quotes and image paths
│   └── app.js              The line, line-up and look views, swipe/drag/keys, bag, checkout, pages
├── assets/
│   ├── images/
│   │   ├── looks/          The 9 cut-out look photos (look-01.webp to look-09.webp)
│   │   └── pieces/         Small crops of each top, bottom and extra for the product list
│   └── source/             Your original photos (not used by the site, kept for editing)
├── .nojekyll               Tells GitHub Pages to serve the files as they are
├── .gitignore
└── README.md
```

## What each screen is

| Screen | Where it lives |
| --- | --- |
| The line (home) | `#st` in `index.html`, positions worked out in `place()` in `js/app.js` |
| Line-up | the same stage, switched with the Line / Line-up toggle |
| Shop the look | the same stage in "look" mode, with the quote and stats |
| Product list | `#side`, built by `render()` in `js/app.js` |
| Bag, checkout and confirmation | `#bag`, built by `bagHTML()` in `js/app.js` |
| Drop 01, Stores, Journal pages | `SH` in `js/app.js`, shown in `#sheet` |

## Run it on your computer

In a terminal, inside this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy to GitHub Pages

1. Create a new repository on GitHub, for example `strut-store`.
2. Upload everything in this folder, or from the terminal:
   ```
   git init
   git add .
   git commit -m "STRUT store"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/strut-store.git
   git push -u origin main
   ```
3. In the repository open **Settings > Pages**.
4. Under **Build and deployment** choose **Deploy from a branch**, pick `main` and `/ (root)`, then Save.
5. After a minute the site is live at `https://YOUR-USERNAME.github.io/strut-store/`.

## Things you will edit most

- **Names and prices:** `js/data.js`. `T`, `B` and `X` hold each look's top, bottom and extra as `['Name', price]`. Look number 1 is the first entry in each list.
- **Look names and quotes:** `NM` and `QU` in `js/data.js`.
- **Your own photos:** replace the files in `assets/images/looks/` (the figure on the line) and `assets/images/pieces/` (the product crops). Use `.webp` or `.png` with a transparent background, feet at the bottom, and keep the same file names.
- **Sold-out look:** `SOLD` at the top of `js/app.js` is the look number (starting from 0) that shows as sold out. Set it to `-1` for none.
- **Page text** (Drop 01, Stores, Journal): `SH` in `js/app.js`.
- **Colours and fonts:** top of `css/styles.css`.
- **Brand name:** search for `STRUT` in `index.html`.

## Good to know

- The photos show other brands' logos and slogans. Swap in your own product photos before you launch.
- The text on the Drop 01, Stores and Journal pages is placeholder copy.
- Checkout is a front-end demo. It validates the form and shows a confirmation receipt, but it does not take payment or send the order anywhere. To go live, connect a payment provider or send the order details to your email or WhatsApp.
- The bag is remembered in the visitor's browser (localStorage).
- Fonts load from Google Fonts.
