import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ResponsiveContainer } from 'recharts'
import api from '@/lib/api'

interface ClusterStatistic {
  cluster_id: number
  cluster_label: string
  tahun: number
  total_provinces: number
  avg_ikp: number
  avg_rasio: number
  avg_inflasi: number
  min_ikp: number
  max_ikp: number
  provinces: string[]
}

interface OverallStatistics {
  total_provinces: number
  total_surplus: number
  total_rentan: number
  total_defisit: number
  silhouette_score: number
  davies_bouldin_index: number
  calinski_harabasz_index: number
  distribution_by_cluster: Record<string, number>
  distribution_by_category: Record<string, number>
}

interface ProvinceData {
  id: number
  provinsi: string
  tahun: number
  ikp: number
  rasio_produksi_konsumsi: number
  rata_rata_inflasi_persen: number
  cluster: number
  kategori_ketahanan: string
}

interface VisualizationData {
  provinces: string[]
  pca_x: number[]
  pca_y: number[]
  clusters: number[]
  categories: string[]
  tahun: number
  variance_explained: {
    pc1: number
    pc2: number
    total: number
  }
}

const chartConfig = {
  ikp: {
    label: 'IKP',
    color: 'var(--color-chart-1)',
  },
  rasio: {
    label: 'Rasio Produksi/Konsumsi',
    color: 'var(--color-chart-2)',
  },
  inflasi: {
    label: 'Inflasi (%)',
    color: 'var(--color-chart-3)',
  },
  cluster_0: {
    label: 'Defisit',
    color: 'hsl(var(--destructive))',
  },
  cluster_1: {
    label: 'Rentan',
    color: 'hsl(var(--warning))',
  },
  cluster_2: {
    label: 'Surplus',
    color: 'hsl(var(--success))',
  },
}

const CLUSTER_COLORS = {
  0: '#ef4444', // red for Defisit
  1: '#f59e0b', // orange/yellow for Rentan
  2: '#22c55e', // green for Surplus
}

function Analytics() {
  const [statistics, setStatistics] = useState<OverallStatistics | null>(null)
  const [clusterStats, setClusterStats] = useState<ClusterStatistic[]>([])
  const [provinces, setProvinces] = useState<ProvinceData[]>([])
  const [visualization, setVisualization] = useState<VisualizationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(2023)

  useEffect(() => {
    fetchAllData()
  }, [selectedYear])

  const fetchAllData = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching data from API...')
      const [statsRes, clusterRes, provincesRes, vizRes] = await Promise.all([
        api.get(`/clustering/provinces/statistics/?tahun=${selectedYear}`),
        api.get(`/clustering/provinces/clusters/?tahun=${selectedYear}`),
        api.get(`/clustering/provinces/?tahun=${selectedYear}`),
        api.get(`/clustering/provinces/visualization/?tahun=${selectedYear}`),
      ])

      console.log('Statistics Response:', statsRes)
      console.log('Cluster Response:', clusterRes)
      console.log('Provinces Response:', provincesRes)
      console.log('Visualization Response:', vizRes)

      // Handle response structure - API returns { success: true, data: {...} }
      setStatistics(statsRes.data)
      setClusterStats(clusterRes.data)
      setProvinces(provincesRes.data)
      setVisualization(vizRes.data)

      console.log('Data loaded successfully')
    } catch (err) {
      setError('Gagal memuat data. Pastikan backend API berjalan di http://127.0.0.1:8000')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Prepare data for charts - with guards
  const clusterBarData = clusterStats?.map(cluster => ({
    cluster: cluster.cluster_label.split('(')[1]?.replace(')', '') || cluster.cluster_label,
    total: cluster.total_provinces,
    avg_ikp: cluster.avg_ikp,
    avg_rasio: cluster.avg_rasio / 1000, // Convert to thousands for better visualization
    avg_inflasi: cluster.avg_inflasi,
  })) || []

  const distributionPieData = clusterStats?.map((cluster) => ({
    name: cluster.cluster_label.split('(')[1]?.replace(')', '') || cluster.cluster_label,
    value: cluster.total_provinces,
    color: CLUSTER_COLORS[cluster.cluster_id as keyof typeof CLUSTER_COLORS] || 'var(--color-chart-1)',
  })) || []

  const top10Provinces = provinces?.length > 0 ? [...provinces]
    .sort((a, b) => b.ikp - a.ikp)
    .slice(0, 10)
    .map(p => ({
      provinsi: p.provinsi.length > 15 ? p.provinsi.substring(0, 12) + '...' : p.provinsi,
      ikp: p.ikp,
      rasio: p.rasio_produksi_konsumsi / 1000,
    })) : []

  const pcaScatterData = visualization ? visualization.provinces.map((prov, index) => ({
    provinsi: prov,
    x: visualization.pca_x[index],
    y: visualization.pca_y[index],
    cluster: visualization.clusters[index],
    kategori: visualization.categories[index],
  })) : []

  if (loading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground">Memuat data analitik...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">{error}</p>
          <button
            onClick={fetchAllData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-heading">Analitik Ketahanan Pangan</h1>
          <p className="text-lg font-base text-foreground/80">
            Visualisasi data clustering dan analisis ketahanan pangan nasional - Tahun {selectedYear}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-main">
            <CardHeader className="pb-2">
              <CardDescription className="text-main-foreground/80">Total Provinsi</CardDescription>
              <CardTitle className="text-3xl">{statistics?.total_provinces || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-main-foreground/60">Provinsi terdata</p>
            </CardContent>
          </Card>

          <Card className="bg-main border-success/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-main-foreground/80">Surplus</CardDescription>
              <CardTitle className="text-3xl text-success">{statistics?.total_surplus || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-main-foreground/60">Ketahanan tinggi</p>
            </CardContent>
          </Card>

          <Card className="bg-main border-warning/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-main-foreground/80">Rentan</CardDescription>
              <CardTitle className="text-3xl text-warning">{statistics?.total_rentan || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-main-foreground/60">Ketahanan sedang</p>
            </CardContent>
          </Card>

          <Card className="bg-main border-destructive/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-main-foreground/80">Defisit</CardDescription>
              <CardTitle className="text-3xl text-destructive">{statistics?.total_defisit || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-main-foreground/60">Ketahanan rendah</p>
            </CardContent>
          </Card>
        </div>

        {/* Grid Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Statistik per Cluster */}
          <Card className="bg-main">
            <CardHeader>
              <CardTitle className="text-2xl">Rata-rata IKP per Kategori</CardTitle>
              <CardDescription className="text-main-foreground/80">
                Indeks Ketahanan Pangan rata-rata tiap cluster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={clusterBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="cluster"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avg_ikp" fill="var(--color-chart-1)" name="Rata-rata IKP" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Distribusi Provinsi per Cluster */}
          <Card className="bg-main">
            <CardHeader>
              <CardTitle className="text-2xl">Distribusi Provinsi per Kategori</CardTitle>
              <CardDescription className="text-main-foreground/80">
                Jumlah provinsi di setiap kategori ketahanan pangan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={distributionPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top 10 Provinsi dengan IKP Tertinggi */}
          <Card className="bg-main">
            <CardHeader>
              <CardTitle className="text-2xl">Top 10 Provinsi IKP Tertinggi</CardTitle>
              <CardDescription className="text-main-foreground/80">
                Provinsi dengan Indeks Ketahanan Pangan terbaik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={top10Provinces}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="provinsi"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="ikp" fill="#3b82f6" name="IKP" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* PCA Visualization */}
          <Card className="bg-main">
            <CardHeader>
              <CardTitle className="text-2xl">Visualisasi Clustering (PCA)</CardTitle>
              <CardDescription className="text-main-foreground/80">
                Analisis komponen utama hasil clustering
                {visualization && visualization.variance_explained ?
                  ` (Variance: ${visualization.variance_explained.total.toFixed(1)}%)` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pcaScatterData.length > 0 && pcaScatterData.some(d => d.x !== 0 || d.y !== 0) ? (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="PC1"
                      label={{ value: `PC1 (${visualization?.variance_explained?.pc1.toFixed(1) || 0}%)`, position: 'bottom' }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="PC2"
                      label={{ value: `PC2 (${visualization?.variance_explained?.pc2.toFixed(1) || 0}%)`, angle: -90, position: 'left' }}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{data.provinsi}</p>
                              <p className="text-sm text-muted-foreground">{data.kategori}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter
                      data={pcaScatterData.filter(d => d.cluster === 0)}
                      fill={CLUSTER_COLORS[0]}
                      name="Defisit"
                    />
                    <Scatter
                      data={pcaScatterData.filter(d => d.cluster === 1)}
                      fill={CLUSTER_COLORS[1]}
                      name="Rentan"
                    />
                    <Scatter
                      data={pcaScatterData.filter(d => d.cluster === 2)}
                      fill={CLUSTER_COLORS[2]}
                      name="Surplus"
                    />
                  </ScatterChart>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground">Data PCA tidak tersedia</p>
                    <p className="text-sm text-muted-foreground">
                      Visualisasi PCA belum diproses oleh backend
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cluster Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clusterStats?.map((cluster) => (
            <Card key={cluster.cluster_id} className="bg-main">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CLUSTER_COLORS[cluster.cluster_id as keyof typeof CLUSTER_COLORS] }}
                  />
                  {cluster.cluster_label}
                </CardTitle>
                <CardDescription className="text-main-foreground/80">
                  {cluster.total_provinces} provinsi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Rata-rata IKP</p>
                  <p className="text-2xl font-bold">{cluster.avg_ikp.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rasio Produksi/Konsumsi</p>
                  <p className="text-lg font-semibold">{cluster.avg_rasio.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rata-rata Inflasi</p>
                  <p className="text-lg font-semibold">{cluster.avg_inflasi.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rentang IKP</p>
                  <p className="text-sm">{cluster.min_ikp.toFixed(1)} - {cluster.max_ikp.toFixed(1)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Clustering Quality Metrics */}
        <Card className="bg-main">
          <CardHeader>
            <CardTitle className="text-2xl">Metrik Kualitas Clustering</CardTitle>
            <CardDescription className="text-main-foreground/80">
              Evaluasi performa algoritma clustering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Silhouette Score</p>
                <p className="text-3xl font-bold">{statistics?.silhouette_score.toFixed(3)}</p>
                <p className="text-xs text-muted-foreground">
                  Semakin tinggi (mendekati 1), semakin baik
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Davies-Bouldin Index</p>
                <p className="text-3xl font-bold">{statistics?.davies_bouldin_index.toFixed(3)}</p>
                <p className="text-xs text-muted-foreground">
                  Semakin rendah (mendekati 0), semakin baik
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Calinski-Harabasz Index</p>
                <p className="text-3xl font-bold">{statistics?.calinski_harabasz_index.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  Semakin tinggi, semakin baik
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Analytics

