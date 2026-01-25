# HR Portal Design System

> **Based on OSS Scout Research**  
> **Recommended Stack:** shadcn/ui + Lucide Icons + Tailwind CSS

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| White | `#FFFFFF` | Primary background |
| Dark Blue | `#1e3a5f` | Text, headers, navigation |
| Green | `#10b981` | Icons (outline), success states, accents |
| Gray | `#6b7280` | Secondary text, borders |

### Alert Colors
| Name | Hex | Usage |
|------|-----|-------|
| Red | `#ef4444` | Errors, critical alerts, delete actions |
| Yellow/Amber | `#f59e0b` | Warnings, pending states |

### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| Light Gray | `#f8fafc` | Background alternates |
| Border Gray | `#e2e8f0` | Dividers, input borders |

---

## Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page Title | 24px (text-2xl) | 600 (semibold) | Dark Blue |
| Section Header | 18px (text-lg) | 600 (semibold) | Dark Blue |
| Body Text | 14px (text-sm) | 400 (normal) | Dark Blue |
| Caption | 12px (text-xs) | 400 (normal) | Gray |
| Button | 14px (text-sm) | 500 (medium) | White/Dark Blue |

---

## Icons

### Style
- **Type:** Outline/stroke only (no filled icons)
- **Stroke Width:** 1.5px
- **Default Color:** Green (`#10b981`)
- **Size:** 20px (w-5 h-5) for inline, 24px (w-6 h-6) for standalone

### Library
- **Primary:** Lucide Icons (`lucide-react`)
- **Backup:** Heroicons (`@heroicons/react/24/outline`)

### Usage Example
```tsx
import { User, Calendar, AlertCircle } from 'lucide-react'

// Standard icon usage
<User className="w-5 h-5 text-accent-green" strokeWidth={1.5} />

// Alert icon (red)
<AlertCircle className="w-5 h-5 text-accent-red" strokeWidth={1.5} />
```

---

## Components

### Buttons

| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| Primary | Green | White | None | Main actions (Save, Submit) |
| Secondary | White | Dark Blue | Gray | Secondary actions (Cancel, Back) |
| Ghost | Transparent | Dark Blue | None | Tertiary actions |
| Danger | Red | White | None | Delete, destructive actions |

### Input Fields

- **Background:** White
- **Border:** 1px solid Border Gray
- **Focus:** Green border + subtle green shadow
- **Border Radius:** 8px (rounded-lg)
- **Padding:** 12px horizontal, 8px vertical

### Cards

- **Background:** White
- **Border:** 1px solid Border Gray
- **Border Radius:** 12px (rounded-xl)
- **Shadow:** sm (subtle)
- **Padding:** 16-24px

### Tables

- **Header:** Light Gray background, Dark Blue text, semibold
- **Rows:** White background, alternate Light Gray
- **Borders:** Border Gray between rows
- **Hover:** Very light gray highlight

---

## Spacing Scale

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Icon gaps, tight spacing |
| sm | 8px | Between related items |
| md | 16px | Standard gaps |
| lg | 24px | Section spacing |
| xl | 32px | Large section gaps |
| 2xl | 48px | Page sections |

---

## Implementation

### Tailwind Config
```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
          gray: '#6b7280',
        }
      }
    }
  }
}
```

### Component Installation (shadcn/ui)
```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Add core components
npx shadcn@latest add button input select table card dialog alert badge tabs
```

---

## Best Practices

### Do's
- ✅ Use white backgrounds predominantly
- ✅ Use green only for icons and success states
- ✅ Keep icons outline-style only
- ✅ Maintain generous whitespace
- ✅ Use subtle shadows (sm only)
- ✅ Keep border radius consistent (lg for inputs, xl for cards)

### Don'ts
- ❌ Don't use filled/solid icons
- ❌ Don't use bright colors for backgrounds
- ❌ Don't use heavy shadows
- ❌ Don't mix icon libraries in same view
- ❌ Don't use gradients
- ❌ Don't use more than 3 colors in one component

---

## File Structure

```
frontend/src/
├── components/
│   └── ui/              # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── table.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── alert.tsx
│       └── ...
├── lib/
│   └── utils.ts         # shadcn/ui utilities
└── styles/
    └── globals.css      # Global styles + Tailwind imports
```

---

## References

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Lucide Icons](https://lucide.dev/icons/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Heroicons](https://heroicons.com/)
