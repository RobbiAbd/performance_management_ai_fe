import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getTSembakoList, TSembako, TSembakoListParams, getProvinsiList, getKabupatenKotaList, getSembakoSimpleList, Provinsi, KabupatenKota, Sembako } from '@/lib/api'
import { RefreshCw, MapPin, Calendar, Database, FileSpreadsheet, BarChart3, Image as ImageIcon, Store } from 'lucide-react'

// Component for small image in header
function SmallImageWithPlaceholder({ src, alt }: { src?: string | null; alt: string }) {
  const [imageError, setImageError] = useState(false)
  const hasImage = src && !imageError

  return (
    <div className="w-12 h-12 rounded-base overflow-hidden border-2 border-border bg-secondary-background flex items-center justify-center shrink-0">
      {hasImage ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <ImageIcon className="h-5 w-5 text-foreground/30" />
      )}
    </div>
  )
}

function DataSembako() {
  const [data, setData] = useState<TSembako[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    total_pages: 0,
  })
  const [filters, setFilters] = useState<TSembakoListParams>({
    page: 1,
    limit: 9,
  })
  const [locationType, setLocationType] = useState<'provinsi' | 'kabupaten' | ''>('')
  const [locationId, setLocationId] = useState<string>('')

  // Location data
  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([])
  const [kabupatenKotaList, setKabupatenKotaList] = useState<KabupatenKota[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)

  // Sembako data
  const [sembakoList, setSembakoList] = useState<Sembako[]>([])
  const [loadingSembako, setLoadingSembako] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getTSembakoList(filters)
      if (response.success) {
        setData(response.data.data)
        setPagination(response.data.pagination)
      } else {
        setError(response.message || 'Failed to fetch data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const fetchProvinsiList = async () => {
    setLoadingLocations(true)
    try {
      const response = await getProvinsiList()
      if (response.success) {
        setProvinsiList(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch provinsi list:', err)
    } finally {
      setLoadingLocations(false)
    }
  }

  const fetchKabupatenKotaList = async () => {
    setLoadingLocations(true)
    try {
      const response = await getKabupatenKotaList()
      if (response.success) {
        setKabupatenKotaList(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch kabupaten/kota list:', err)
    } finally {
      setLoadingLocations(false)
    }
  }

  const fetchSembakoList = async () => {
    setLoadingSembako(true)
    try {
      const response = await getSembakoSimpleList()
      if (response.success) {
        setSembakoList(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch sembako list:', err)
    } finally {
      setLoadingSembako(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filters])

  useEffect(() => {
    // Fetch location and sembako lists on mount
    fetchProvinsiList()
    fetchKabupatenKotaList()
    fetchSembakoList()
  }, [])

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  const handleFilterChange = (key: keyof TSembakoListParams, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1, // Reset to first page when filter changes
    }))
  }

  const handleLocationTypeChange = (type: 'provinsi' | 'kabupaten' | '') => {
    setLocationType(type)
    setLocationId('')
    // Clear both location filters when type changes
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters.provinsi_id
      delete newFilters.kabupaten_kota_id
      return { ...newFilters, page: 1 }
    })
  }

  const handleLocationIdChange = (id: string) => {
    setLocationId(id)
    if (locationType === 'provinsi') {
      setFilters((prev) => ({
        ...prev,
        provinsi_id: id || undefined,
        kabupaten_kota_id: undefined,
        page: 1,
      }))
    } else if (locationType === 'kabupaten') {
      setFilters((prev) => ({
        ...prev,
        kabupaten_kota_id: id || undefined,
        provinsi_id: undefined,
        page: 1,
      }))
    } else {
      // Clear both if no type selected
      setFilters((prev) => {
        const newFilters = { ...prev }
        delete newFilters.provinsi_id
        delete newFilters.kabupaten_kota_id
        return { ...newFilters, page: 1 }
      })
    }
  }

  const handleLimitChange = (newLimit: number) => {
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }))
  }

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'mahal':
        return 'mahal'
      case 'murah':
        return 'murah'
      case 'normal':
        return 'normal'
      default:
        return 'neutral'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'database':
        return <Database className="h-4 w-4" />
      case 'gsheet':
        return <FileSpreadsheet className="h-4 w-4" />
      case 'bps':
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'database':
        return 'Data internal'
      case 'gsheet':
        return 'Google Sheet'
      case 'bps':
        return 'BPS'
      default:
        return source
    }
  }

  const formatCurrency = (value: string) => {
    const num = parseFloat(value)
    if (isNaN(num)) return value
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).format(date).replace(/\//g, '/')
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-heading">Data Sembako</h1>
          <p className="text-lg font-base text-foreground/80">
            Daftar transaksi sembako dengan informasi harga dan lokasi
          </p>
        </div>

        {/* Filters Card */}
        <Card className="bg-main">
          <CardHeader>
            <CardTitle>Filter Data</CardTitle>
            <CardDescription>Filter data berdasarkan kriteria tertentu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sembako</label>
                <Select
                  value={filters.sembako_id ? String(filters.sembako_id) : undefined}
                  onValueChange={(value) => handleFilterChange('sembako_id', value === 'all' ? undefined : parseInt(value))}
                  disabled={loadingSembako}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingSembako ? 'Memuat...' : 'Pilih Sembako'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    {sembakoList.map((sembako) => (
                      <SelectItem key={sembako.id} value={String(sembako.id)}>
                        {sembako.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lokasi</label>
                <div className="flex gap-2">
                  <Select
                    value={locationType || undefined}
                    onValueChange={(value) => handleLocationTypeChange(value === 'all' ? '' : (value as 'provinsi' | 'kabupaten'))}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="provinsi">Provinsi</SelectItem>
                      <SelectItem value="kabupaten">Kabupaten/Kota</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={locationId || undefined}
                    onValueChange={(value) => handleLocationIdChange(value === 'all' ? '' : value)}
                    disabled={!locationType || loadingLocations}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue
                        placeholder={
                          loadingLocations
                            ? 'Memuat...'
                            : locationType === 'provinsi'
                              ? 'Pilih Provinsi'
                              : locationType === 'kabupaten'
                                ? 'Pilih Kabupaten/Kota'
                                : 'Pilih tipe dulu'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      {locationType === 'provinsi' && provinsiList.map((prov) => (
                        <SelectItem key={prov.id} value={prov.id}>
                          {prov.nama}
                        </SelectItem>
                      ))}
                      {locationType === 'kabupaten' && kabupatenKotaList.map((kab) => (
                        <SelectItem key={kab.id} value={kab.id}>
                          {kab.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Pasar</label>
                <Input
                  placeholder="Masukkan nama pasar"
                  value={filters.nama_pasar || ''}
                  onChange={(e) => handleFilterChange('nama_pasar', e.target.value || undefined)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Source</label>
                <Select
                  value={filters.source || undefined}
                  onValueChange={(value) => handleFilterChange('source', value === 'all' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="gsheet">Google Sheet</SelectItem>
                    <SelectItem value="bps">BPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={fetchData} variant="neutral" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Cards */}
        <Card className="bg-main">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daftar Transaksi Sembako</CardTitle>
                <CardDescription>
                  Total: {pagination.total} data | Halaman {pagination.page} dari {pagination.total_pages}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Items per page:</span>
                <Select
                  value={String(pagination.limit)}
                  onValueChange={(value) => handleLimitChange(parseInt(value))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="18">18</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: pagination.limit || 9 }).map((_, index) => (
                  <Card key={index} className="bg-background border-2 border-border shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <Skeleton className="w-12 h-12 rounded-base shrink-0" />
                          <div className="flex-1">
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-16 ml-2 shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-8 w-40" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24 pt-2 border-t border-border" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <p className="text-destructive text-lg font-medium">{error}</p>
                <Button onClick={fetchData} variant="neutral">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Coba Lagi
                </Button>
              </div>
            ) : data.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-lg text-foreground/60">Tidak ada data ditemukan</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.map((item) => (
                    <Card key={item.id} className="bg-background border-2 border-border shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <SmallImageWithPlaceholder 
                              src={item.sembako.image}
                              alt={item.sembako.nama}
                            />
                            <div className="flex-1">
                              <CardTitle className="text-xl font-heading mb-1">
                                {item.sembako.nama}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                Per {item.sembako.satuan}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant={getStatusBadgeVariant(item.status)}
                            className="ml-2 shrink-0"
                          >
                            {item.status || 'N/A'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Price */}
                        <div>
                          <p className="text-3xl font-bold text-primary">
                            {formatCurrency(item.harga)}
                          </p>
                        </div>

                        {/* Location */}
                        <div className="space-y-2 text-sm">
                          {item.provinsi_nama && (
                            <div className="flex items-center gap-2 text-foreground/80">
                              <MapPin className="h-4 w-4 text-foreground/60" />
                              <span>
                                <span className="font-medium">Provinsi:</span> {item.provinsi_nama}
                              </span>
                            </div>
                          )}
                          {item.kabupaten_kota_nama && (
                            <div className="flex items-center gap-2 text-foreground/80">
                              <MapPin className="h-4 w-4 text-foreground/60" />
                              <span>
                                <span className="font-medium">Kab/Kota:</span> {item.kabupaten_kota_nama}
                              </span>
                            </div>
                          )}
                          {item.kecamatan_nama && (
                            <div className="flex items-center gap-2 text-foreground/80">
                              <MapPin className="h-4 w-4 text-foreground/60" />
                              <span>
                                <span className="font-medium">Kecamatan:</span> {item.kecamatan_nama}
                              </span>
                            </div>
                          )}
                          {item.kelurahan_nama && (
                            <div className="flex items-center gap-2 text-foreground/80">
                              <MapPin className="h-4 w-4 text-foreground/60" />
                              <span>
                                <span className="font-medium">Kelurahan:</span> {item.kelurahan_nama}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Nama Pasar */}
                        {item.sembako.nama_pasar && (
                          <div className="flex items-center gap-2 text-sm text-foreground/80">
                            <Store className="h-4 w-4 text-foreground/60" />
                            <span>
                              <span className="font-medium">Pasar:</span> {item.sembako.nama_pasar}
                            </span>
                          </div>
                        )}

                        {/* Survey Date */}
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                          <Calendar className="h-4 w-4 text-foreground/60" />
                          <span>
                            <span className="font-medium">Survey:</span> {formatDate(item.survey_at)}
                          </span>
                        </div>

                        {/* Source */}
                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                          <div className="flex items-center gap-2 text-sm text-foreground/60">
                            {getSourceIcon(item.source)}
                            <span>{getSourceLabel(item.source)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-foreground/60">
                      Menampilkan {((pagination.page - 1) * pagination.limit) + 1} -{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} dari{' '}
                      {pagination.total} data
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="neutral"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Sebelumnya
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                          let pageNum: number
                          if (pagination.total_pages <= 5) {
                            pageNum = i + 1
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1
                          } else if (pagination.page >= pagination.total_pages - 2) {
                            pageNum = pagination.total_pages - 4 + i
                          } else {
                            pageNum = pagination.page - 2 + i
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={pagination.page === pageNum ? 'default' : 'neutral'}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>
                      <Button
                        variant="neutral"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.total_pages}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DataSembako

