# How to Create the OG Image

You have an OG image template at `public/og-image.html`. To convert it to a PNG:

## Option 1: Use a Screenshot Tool (Recommended)
1. Open `public/og-image.html` in your browser
2. Use a browser extension or tool to take a full-page screenshot at 1200x630px
3. Save it as `public/og-image.png`

## Option 2: Use Playwright/Puppeteer
```bash
npx playwright screenshot public/og-image.html public/og-image.png --viewport-size=1200,630
```

## Option 3: Use an Online Tool
1. Go to https://www.screely.com or similar
2. Upload the HTML or take a screenshot
3. Resize to 1200x630px
4. Save as `public/og-image.png`

## Option 4: Manual Screenshot
1. Open `file:///Users/koushithamin/Desktop/personal/side-projects/Accounting/landing/public/og-image.html` in your browser
2. Set browser window to exactly 1200x630
3. Take a screenshot
4. Save as `public/og-image.png`

Once you have the PNG, you're all set!
