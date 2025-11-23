# ⚡ Quick Reference Guide

## 🚀 Quick Start

```bash
# Install
bun install

# Run dev server
bun run dev

# Build
bun run build
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app dengan router |
| `src/components/Navbar.tsx` | Navigation bar |
| `src/pages/Home.tsx` | Landing page |
| `src/pages/About.tsx` | About page |
| `src/index.css` | Global styles & theme |

---

## 🎨 Design Tokens

```css
/* Colors */
bg-main              /* Main accent color */
bg-background        /* Background */
border-border        /* Black borders */
text-main-foreground /* Text on main */
text-foreground      /* Default text */

/* Spacing */
rounded-base         /* 10px border radius */
border-2             /* 2px borders */
shadow-shadow        /* 4px 4px shadow */

/* Typography */
font-heading         /* Bold 700 */
font-base            /* Medium 500 */
```

---

## 🔗 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Landing page |
| `/about` | `About` | About page |

---

## 🧩 Common Components

### Button
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg">Click</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card className="bg-main">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Navigation
```tsx
import { Link } from 'react-router-dom'

<Link to="/about">About</Link>
```

---

## 📦 Key Dependencies

- `react-router-dom` - Routing
- `tailwindcss` - Styling
- `@radix-ui/*` - UI primitives
- `lucide-react` - Icons
- `recharts` - Charts

---

## 🎯 Component Locations

```
src/
├── components/
│   ├── ui/          # 17 UI components
│   └── Navbar.tsx   # Custom navbar
├── pages/
│   ├── Home.tsx     # Landing
│   └── About.tsx    # About
└── lib/
    └── utils.ts     # Utilities
```

---

## 💡 Tips

1. **Path Aliases:** Use `@/` for `src/`
2. **Styling:** Use Tailwind classes + neobrutalism tokens
3. **Components:** All UI components in `@/components/ui/`
4. **Routing:** Use `Link` from `react-router-dom`

---

**See full docs:** [INDEX.md](./INDEX.md)

