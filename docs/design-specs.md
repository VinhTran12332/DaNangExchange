# 🎨 Design Specs: UGDES Fintech UI (Detailed)

**Theme:** Dark Mode Only.
**Framework:** React + TailwindCSS.

## 1. Tailwind Config (`tailwind.config.js`)
Extend the default theme with these colors and fonts.

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#0B0E11',    // bg-slate-950 (Approx)
          card: '#151A21',    // bg-slate-900 (Approx)
          hover: '#2A2E35'
        },
        primary: {
          DEFAULT: '#00E599', // Emerald Neon
          hover: '#00C484'
        },
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6'
        },
        text: {
          main: '#EAECEF',
          muted: '#848E9C'
        },
        border: {
          subtle: '#2B3139'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  }
}
```

## 2. Component Blueprint

### 2.1. Global Layout
*   **Background:** `bg-bg-main text-text-main min-h-screen`.
*   **Header:** `h-16 border-b border-border-subtle flex items-center px-6 justify-between`.
    *   **Logo:** `font-bold text-xl tracking-tighter bg-gradient-to-r from-primary to-accent-blue bg-clip-text text-transparent`.
    *   **Search Bar:** `bg-bg-card border border-border-subtle rounded-md px-4 py-2 w-96 focus:border-primary`.
    *   **User Menu:** Avatar circle + "Switch to Selling" Button (`border border-primary text-primary hover:bg-primary/10 rounded px-3 py-1 text-sm`).

### 2.2. Sidebar (Left Panel)
*   **Container:** `w-64 border-r border-border-subtle p-4 hidden md:block`.
*   **Menu Items:** `flex items-center gap-3 px-3 py-2 text-text-muted hover:text-text-main hover:bg-bg-hover rounded transition-colors`.
*   **Active Item:** `text-primary bg-primary/10`.

### 2.3. Data Asset Card (The "Ticker")
*   **Container:** `bg-bg-card rounded-lg border border-border-subtle p-4 hover:border-primary/50 transition-all cursor-pointer group`.
*   **Title:** `font-medium text-lg mb-1 group-hover:text-primary`.
*   **Price:** `font-mono text-xl font-bold text-primary`.
*   **Sparkline:** Use a mock SVG path (Green line) at the bottom.
*   **Badges:** `text-xs px-2 py-0.5 rounded bg-accent-blue/20 text-accent-blue inline-block mt-2`.

### 2.4. Market Trend (Right Panel)
*   **Container:** `w-72 border-l border-border-subtle p-4`.
*   **Row:** `flex justify-between py-2 border-b border-border-subtle/50 text-sm`.
*   **Change:** `text-green-500` (+%) or `text-red-500` (-%).

## 3. Atomic Elements
*   **Buttons:** `px-4 py-2 rounded font-medium transition-transform active:scale-95`.
    *   *Primary:* `bg-primary text-black hover:bg-primary-hover`.
    *   *Outline:* `border border-border-subtle hover:border-text-muted`.
