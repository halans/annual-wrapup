# Annual Wrap-Up 2025

A configurable, interactive "Year in Review" web application inspired by the many "Wrapped" apps that exist. It features auto-advancing slides, progress bars, and rich animations to present annual data in an engaging story format.

## Features
- **Interactive Story Engine**: Auto-plays slides with pause/resume support (hold to pause).
- **Responsive Design**: Full-screen immersive experience on mobile, sleek card layout on desktop.
- **Rich Slide Types**:
  - **Intro/Outro**: Big bold typography.
  - **Big Stat**: Highlight key numbers.
  - **Top List**: Staggered list animations for top items (e.g., songs, languages).
- **Themeable**: Dynamic background colors per slide.
- **No Build Step**: Pure HTML/CSS/JS for maximum simplicity and speed.

## 🏃‍♂️ Running Locally

You can run this project directly on your machine:

1. **Simple Method**: Just double-click `index.html` to open it in your web browser.
2. **Better Method** (for exact mobile testing): Use a local development server.
   - If you have Node.js installed:
     ```bash
     npx serve .
     ```
   - Or use the "Live Server" extension in VS Code.

## Deployment on Cloudflare Pages

This project is a static site, making it perfect for Cloudflare Pages.

### Option 1: Git Integration (Recommended)
1. Clone this project https://github.com/halans/annual-wrapup.git and push it to your Git repository.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
3. Go to **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
4. Select your repository.
5. **Build Settings**:
   - **Framework Preset**: None (it's static).
   - **Build Command**: (Leave empty).
   - **Build Output Directory**: `.` (or just leave empty/default if it serves root).
6. Click **Save and Deploy**.

### Option 2: Direct Upload (Drag & Drop)
1. Go to **Workers & Pages** > **Create Application** > **Pages** > **Upload Assets**.
2. Drag this entire project folder into the upload zone.
3. Deploy!

### Option 3: Wrangler CLI
If you prefer the command line:
```bash
# Install Wrangler if you haven't
npm install -g wrangler

# Login
npx wrangler login

# Deploy current directory
npx wrangler pages deploy . --project-name=my-year-in-review
```

## Customization

### Slide Configuration (`data.js`)
The `data.js` file contains the `WRAP_UP_DATA` object. You can configure global metadata and the list of slides here.

#### Global Properties
In `meta`, you can set:
- **`slide_duration`**: Time in milliseconds (e.g., `5000` for 5s).
- **`theme_color`**: App accent color.

In each slide object, you can set:
- **`bg_color`**: Background color (Hex code `"#000"` or name).
- **`text_color`**: Text color (Hex code `"#fff"` or name).

#### Slide Types

**1. Intro / Outro (`type: "intro"` or `"outro"`)**
Used for the cover page or closing message.
- **`title`**: Main headline text.
- **`subtitle`** (optional): Smaller sub-text.

```javascript
{
    "type": "intro",
    "title": "2025 Wrapped",
    "subtitle": "What a year!",
    "bg_color": "#6200EA"
}
```

**2. Big Stat (`type: "stat"`)**
Used to highlight a single large number or metric.
- **`value`**: The big number/text (e.g., "12,400", "Top 1%").
- **`label`**: The description below the number.

```javascript
{
    "type": "stat",
    "value": "15,000",
    "label": "Minutes Listened",
    "bg_color": "#03DAC6"
}
```

**3. Top List (`type: "list"`)**
Used to show a ranking (e.g., Top Songs, Top Friends).
- **`title`**: Header for the list.
- **`items`**: An array of strings to display in order.

```javascript
{
    "type": "list",
    "title": "Top Genres",
    "items": ["Pop", "Rock", "Indie"],
    "bg_color": "#FFC107"
}
```

**4. Photo Slide (`type: "photo"`)**
Used to display a full-screen background image with overlay text.
- **`image`**: URL to the image (can be local or remote).
- **`title`**: Overlay title.

```javascript
{
    "type": "photo",
    "title": "Best Memory",
    "image": "https://example.com/photo.jpg"
}
```

### Changing Colors and Fonts
Global styles are defined in `style.css` using CSS variables.

**To change the font:**
1. Import your desired font in `index.html` (e.g., from Google Fonts).
2. Update the variable in `style.css`:
```css
:root {
    --font-main: 'Your New Font', sans-serif;
}
```

**To change default colors:**
Edit the `:root` variables in `style.css`:
```css
:root {
    --bg-color: #121212;       /* Fallback background */
    --accent-color: #BB86FC;   /* Main accent */
    --progress-bar-bg: rgba(255, 255, 255, 0.3);
}
```

### Adding New Slide Types
1. **HTML/CSS**: Create a new layout class in `style.css` (e.g., `.slide-photo`).
2. **JS**: Update `renderSlideContent` in `app.js` to handle your new `type` (e.g., `if (data.type === 'photo') ...`).


Created with Google Antigravity.