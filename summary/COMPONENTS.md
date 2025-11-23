# Components Documentation

## 📦 Custom Components

### 1. Navbar Component
**File:** `src/components/Navbar.tsx`

**Deskripsi:**
Navigation bar yang sticky dengan neobrutalism design. Menampilkan logo SIPALING dan navigation links dengan active state highlighting.

**Fitur:**
- Sticky positioning (stays at top when scrolling)
- Active route detection menggunakan `useLocation` hook
- Dynamic button styling berdasarkan active route
- Responsive design

**Props:** Tidak ada props (menggunakan React Router hooks)

**Dependencies:**
- `react-router-dom` (Link, useLocation)
- `@/components/ui/button`
- `@/lib/utils` (cn function)

**Usage:**
```tsx
import Navbar from '@/components/Navbar'

// Digunakan di App.jsx
<Navbar />
```

---

## 🎨 UI Components (Neobrutalism Design)

Semua UI components berada di `src/components/ui/` dan menggunakan design system neobrutalism dengan:
- Bold borders (`border-2`)
- Shadow effects (`shadow-shadow`)
- Rounded corners (`rounded-base`)
- Custom color scheme

### 2. Button Component
**File:** `src/components/ui/button.tsx`

**Variants:**
- `default` - Main button dengan shadow effect
- `noShadow` - Button tanpa shadow
- `neutral` - Secondary button style
- `reverse` - Reverse shadow effect on hover

**Sizes:**
- `default` - h-10 px-4 py-2
- `sm` - h-9 px-3
- `lg` - h-11 px-8
- `icon` - size-10

**Usage:**
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg">Click Me</Button>
```

---

### 3. Card Component
**File:** `src/components/ui/card.tsx`

**Sub-components:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Description text
- `CardContent` - Main content area
- `CardFooter` - Footer section
- `CardAction` - Action button area

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card className="bg-main">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

---

### 4. Menubar Component
**File:** `src/components/ui/menubar.tsx`

**Deskripsi:**
Menu bar component dengan dropdown functionality menggunakan Radix UI.

**Sub-components:**
- `Menubar` - Root container
- `MenubarMenu` - Menu container
- `MenubarTrigger` - Trigger button
- `MenubarContent` - Dropdown content
- `MenubarItem` - Menu item
- `MenubarSeparator` - Separator line
- Dan lainnya...

**Usage:**
```tsx
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@/components/ui/menubar'
```

---

### 5. Navigation Menu Component
**File:** `src/components/ui/navigation-menu.tsx`

**Deskripsi:**
Advanced navigation menu dengan viewport dan indicator support.

**Sub-components:**
- `NavigationMenu` - Root
- `NavigationMenuList` - List container
- `NavigationMenuItem` - Menu item
- `NavigationMenuTrigger` - Trigger with chevron
- `NavigationMenuContent` - Content area
- `NavigationMenuLink` - Link component
- `NavigationMenuViewport` - Viewport container

---

### 6. Accordion Component
**File:** `src/components/ui/accordion.tsx`

**Deskripsi:**
Collapsible content sections.

---

### 7. Alert Component
**File:** `src/components/ui/alert.tsx`

**Deskripsi:**
Alert/notification component.

---

### 8. Carousel Component
**File:** `src/components/ui/carousel.tsx`

**Deskripsi:**
Image/content carousel dengan Embla Carousel.

**Dependencies:**
- `embla-carousel-react`

---

### 9. Chart Component
**File:** `src/components/ui/chart.tsx`

**Deskripsi:**
Chart component wrapper untuk Recharts.

**Dependencies:**
- `recharts`

---

### 10. Form Component
**File:** `src/components/ui/form.tsx`

**Deskripsi:**
Form components dengan React Hook Form integration.

**Dependencies:**
- `react-hook-form`
- `@hookform/resolvers`
- `zod`

---

### 11. Hover Card Component
**File:** `src/components/ui/hover-card.tsx`

**Deskripsi:**
Card yang muncul saat hover.

**Dependencies:**
- `@radix-ui/react-hover-card`

---

### 12. Image Card Component
**File:** `src/components/ui/image-card.tsx`

**Deskripsi:**
Card khusus untuk menampilkan gambar.

---

### 13. Input Component
**File:** `src/components/ui/input.tsx`

**Deskripsi:**
Input field component dengan neobrutalism styling.

---

### 14. Label Component
**File:** `src/components/ui/label.tsx`

**Deskripsi:**
Label component untuk form fields.

**Dependencies:**
- `@radix-ui/react-label`

---

### 15. Resizable Component
**File:** `src/components/ui/resizable.tsx`

**Deskripsi:**
Resizable panels component.

**Dependencies:**
- `react-resizable-panels`

---

### 16. Skeleton Component
**File:** `src/components/ui/skeleton.tsx`

**Deskripsi:**
Loading skeleton component.

---

### 17. Sonner Component
**File:** `src/components/ui/sonner.tsx`

**Deskripsi:**
Toast notification component.

**Dependencies:**
- `sonner`

---

### 18. Switch Component
**File:** `src/components/ui/switch.tsx`

**Deskripsi:**
Toggle switch component.

**Dependencies:**
- `@radix-ui/react-switch`

---

### 19. Tooltip Component
**File:** `src/components/ui/tooltip.tsx`

**Deskripsi:**
Tooltip component.

**Dependencies:**
- `@radix-ui/react-tooltip`

---

## 📄 Page Components

### 20. Home Page
**File:** `src/pages/Home.tsx`

**Deskripsi:**
Landing page dengan hero section, features, dan CTA.

**Sections:**
1. **Hero Section**
   - Large heading "WELCOME TO SIPALING"
   - Subtitle dengan full name
   - Description
   - CTA buttons

2. **Features Section**
   - 3 feature cards:
     - Analisis Data
     - Visualisasi
     - Wawasan

3. **CTA Section**
   - Call-to-action card
   - Action buttons

**Components Used:**
- Button
- Card (CardHeader, CardTitle, CardDescription, CardContent)
- Link (react-router-dom)

---

### 21. About Page
**File:** `src/pages/About.tsx`

**Deskripsi:**
Halaman tentang SIPALING dengan informasi lengkap.

**Sections:**
1. **Header** - Title dan subtitle
2. **Tentang SIPALING** - Penjelasan platform
3. **Misi Kami** - Mission statement
4. **Apa Yang Kami Lakukan** - Features dan capabilities
5. **Teknologi** - Technology stack

**Components Used:**
- Card (semua sub-components)
- appConfig dari `@/lib/config`

---

### 22. Analytics Page
**File:** `src/pages/Analytics.tsx`

**Deskripsi:**
Halaman analytics dengan visualisasi data ketahanan pangan menggunakan chart.

**Charts:**
1. **Bar Chart** - Produksi Pangan per Provinsi
   - Data: 6 provinsi utama
   - Metrics: Beras, Jagung, Kedelai, Gula
   - Library: Recharts BarChart

2. **Line Chart** - Tren Skor Ketahanan Pangan
   - Data: 12 bulan
   - Metrics: Skor aktual vs Target
   - Library: Recharts LineChart

3. **Pie Chart** - Distribusi Jenis Pangan
   - Data: 5 kategori pangan
   - Persentase distribusi
   - Library: Recharts PieChart

4. **Area Chart** - Stok vs Kebutuhan Pangan
   - Data: 6 bulan
   - Metrics: Stok dan Kebutuhan
   - Library: Recharts AreaChart

**Summary Cards:**
- Total Produksi
- Skor Ketahanan
- Stok Tersedia
- Provinsi Terdata

**Components Used:**
- Card (semua sub-components)
- ChartContainer, ChartTooltip, ChartLegend dari `@/components/ui/chart`
- Recharts components (BarChart, LineChart, PieChart, AreaChart)

**Data:**
- Data dummy untuk demonstrasi
- Relevan dengan konteks ketahanan pangan
- Siap untuk integrasi dengan API

---

### 23. Navbar Component (Updated)
**File:** `src/components/Navbar.tsx`

**Fitur Tambahan:**
- Dark mode toggle dengan Switch component
- Icon Sun dan Moon dari lucide-react
- Theme management dengan next-themes
- Hydration mismatch prevention

**Dependencies Tambahan:**
- `next-themes` (useTheme hook)
- `lucide-react` (Sun, Moon icons)
- `@/components/ui/switch`

---

## 🎨 Design Features

### Typography
- **Base Font:** Public Sans (Google Fonts)
- **Heading Font:** Montserrat (Google Fonts)
- **Implementation:** CSS variables dan global styles

### Dark Mode
- **Library:** next-themes
- **Toggle:** Switch component di Navbar
- **Persistence:** localStorage
- **System Preference:** Supported

### Background Pattern
- **Type:** Grid pattern
- **Size:** 40px × 40px
- **Color:** Subtle dengan opacity
- **Implementation:** CSS linear-gradient

---

## 🛠️ Utility Components

### 22. Utils
**File:** `src/lib/utils.ts`

**Functions:**
- `cn(...inputs)` - Class name merger menggunakan `clsx` dan `tailwind-merge`

**Usage:**
```tsx
import { cn } from '@/lib/utils'

<div className={cn("base-class", condition && "conditional-class")} />
```

---

## 📝 Notes

- Semua UI components menggunakan TypeScript
- Components mengikuti neobrutalism design system
- Menggunakan Radix UI sebagai base untuk accessibility
- Styling menggunakan Tailwind CSS dengan custom theme
- Path aliases menggunakan `@/` untuk `src/`

