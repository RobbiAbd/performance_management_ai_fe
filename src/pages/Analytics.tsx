import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer } from 'recharts'

// Data dummy untuk ketahanan pangan
const produksiPanganData = [
  { provinsi: 'Jawa Barat', beras: 8500, jagung: 3200, kedelai: 1200, gula: 450 },
  { provinsi: 'Jawa Timur', beras: 9200, jagung: 2800, kedelai: 1100, gula: 520 },
  { provinsi: 'Jawa Tengah', beras: 7800, jagung: 2500, kedelai: 950, gula: 380 },
  { provinsi: 'Sumatera Utara', beras: 4200, jagung: 1800, kedelai: 650, gula: 280 },
  { provinsi: 'Sulawesi Selatan', beras: 3800, jagung: 1500, kedelai: 580, gula: 220 },
  { provinsi: 'Lampung', beras: 3500, jagung: 1200, kedelai: 450, gula: 190 },
]

const trenKetahananData = [
  { bulan: 'Jan', skor: 72, target: 75 },
  { bulan: 'Feb', skor: 74, target: 75 },
  { bulan: 'Mar', skor: 76, target: 75 },
  { bulan: 'Apr', skor: 75, target: 75 },
  { bulan: 'Mei', skor: 78, target: 75 },
  { bulan: 'Jun', skor: 77, target: 75 },
  { bulan: 'Jul', skor: 79, target: 75 },
  { bulan: 'Agu', skor: 80, target: 75 },
  { bulan: 'Sep', skor: 81, target: 75 },
  { bulan: 'Okt', skor: 82, target: 75 },
  { bulan: 'Nov', skor: 83, target: 75 },
  { bulan: 'Des', skor: 84, target: 75 },
]

const distribusiPanganData = [
  { name: 'Beras', value: 45, color: 'var(--color-chart-1)' },
  { name: 'Jagung', value: 25, color: 'var(--color-chart-2)' },
  { name: 'Kedelai', value: 15, color: 'var(--color-chart-3)' },
  { name: 'Gula', value: 10, color: 'var(--color-chart-4)' },
  { name: 'Lainnya', value: 5, color: 'var(--color-chart-5)' },
]

const stokPanganData = [
  { bulan: 'Jan', stok: 1200, kebutuhan: 1000 },
  { bulan: 'Feb', stok: 1350, kebutuhan: 1050 },
  { bulan: 'Mar', stok: 1280, kebutuhan: 1100 },
  { bulan: 'Apr', stok: 1420, kebutuhan: 1150 },
  { bulan: 'Mei', stok: 1500, kebutuhan: 1200 },
  { bulan: 'Jun', stok: 1480, kebutuhan: 1250 },
]

const chartConfig = {
  beras: {
    label: 'Beras',
    color: 'var(--color-chart-1)',
  },
  jagung: {
    label: 'Jagung',
    color: 'var(--color-chart-2)',
  },
  kedelai: {
    label: 'Kedelai',
    color: 'var(--color-chart-3)',
  },
  gula: {
    label: 'Gula',
    color: 'var(--color-chart-4)',
  },
  skor: {
    label: 'Skor Ketahanan',
    color: 'var(--color-chart-1)',
  },
  target: {
    label: 'Target',
    color: 'var(--color-chart-2)',
  },
  stok: {
    label: 'Stok (Ribu Ton)',
    color: 'var(--color-chart-1)',
  },
  kebutuhan: {
    label: 'Kebutuhan (Ribu Ton)',
    color: 'var(--color-chart-3)',
  },
}

function Analytics() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-heading">Analitik Ketahanan Pangan</h1>
          <p className="text-lg font-base text-foreground/80">
            Visualisasi data clustering dan analisis ketahanan pangan nasional
          </p>
        </div>

        {/* Grid Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Produksi Pangan per Provinsi */}
          <Card className="bg-main">
            <CardHeader>
              <CardTitle className="text-2xl">Produksi Pangan per Provinsi</CardTitle>
              <CardDescription className="text-main-foreground/80">
                Data produksi pangan utama (dalam ribu ton)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={produksiPanganData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="provinsi" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="beras" fill="var(--color-chart-1)" />
                  <Bar dataKey="jagung" fill="var(--color-chart-2)" />
                  <Bar dataKey="kedelai" fill="var(--color-chart-3)" />
                  <Bar dataKey="gula" fill="var(--color-chart-4)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Tren Ketahanan Pangan */}
          <Card className="bg-main">
            <CardHeader>
              <CardTitle className="text-2xl">Tren Skor Ketahanan Pangan</CardTitle>
              <CardDescription className="text-main-foreground/80">
                Perkembangan skor ketahanan pangan sepanjang tahun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={trenKetahananData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis domain={[70, 85]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="skor" 
                    stroke="var(--color-chart-1)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="var(--color-chart-2)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Distribusi Jenis Pangan */}
          <Card className="bg-main">
            <CardHeader>
              <CardTitle className="text-2xl">Distribusi Jenis Pangan</CardTitle>
              <CardDescription className="text-main-foreground/80">
                Persentase distribusi pangan nasional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={distribusiPanganData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distribusiPanganData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Stok vs Kebutuhan Pangan */}
          <Card className="bg-main">
            <CardHeader>
              <CardTitle className="text-2xl">Stok vs Kebutuhan Pangan</CardTitle>
              <CardDescription className="text-main-foreground/80">
                Perbandingan stok dan kebutuhan pangan (dalam ribu ton)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <AreaChart data={stokPanganData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="stok" 
                    stackId="1"
                    stroke="var(--color-chart-1)" 
                    fill="var(--color-chart-1)"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="kebutuhan" 
                    stackId="2"
                    stroke="var(--color-chart-3)" 
                    fill="var(--color-chart-3)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-main">
            <CardHeader className="pb-2">
              <CardDescription className="text-main-foreground/80">Total Produksi</CardDescription>
              <CardTitle className="text-3xl">38,450</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-main-foreground/60">Ribu ton per tahun</p>
            </CardContent>
          </Card>

          <Card className="bg-main">
            <CardHeader className="pb-2">
              <CardDescription className="text-main-foreground/80">Skor Ketahanan</CardDescription>
              <CardTitle className="text-3xl">84</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-main-foreground/60">Dari target 75</p>
            </CardContent>
          </Card>

          <Card className="bg-main">
            <CardHeader className="pb-2">
              <CardDescription className="text-main-foreground/80">Stok Tersedia</CardDescription>
              <CardTitle className="text-3xl">1,480</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-main-foreground/60">Ribu ton</p>
            </CardContent>
          </Card>

          <Card className="bg-main">
            <CardHeader className="pb-2">
              <CardDescription className="text-main-foreground/80">Provinsi Terdata</CardDescription>
              <CardTitle className="text-3xl">34</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-main-foreground/60">Provinsi di Indonesia</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Analytics

