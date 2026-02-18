import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPerformanceAnalytics } from "@/lib/api";
import type { PerformanceAnalyticsResponse } from "@/lib/api";

const PERIODS = ["Q1-2026", "Q2-2026", "Q3-2026", "Q4-2026"];

function Analytics() {
  const [period, setPeriod] = useState<string>("Q1-2026");
  const [data, setData] = useState<PerformanceAnalyticsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await getPerformanceAnalytics(period);
      if (res.status === "success" && res.data) setData(res.data);
      else setError(res.message || "Gagal mengambil data.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil analytics.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading mb-6 text-foreground">
        Analytics Performa
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,380px)_1fr] gap-6 lg:gap-8 items-start">
        {/* Kiri: Form periode */}
        <Card className="lg:sticky lg:top-24 bg-main text-main-foreground">
          <CardHeader>
            <CardTitle>Periode</CardTitle>
            <CardDescription className="text-main-foreground/80">
              Pilih periode untuk melihat ringkasan analisis performa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="bg-secondary-background text-foreground border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <Button variant="reverse" onClick={fetchAnalytics} disabled={loading}>
              {loading ? "Memuat..." : "Refresh"}
            </Button>
          </CardContent>
        </Card>

        {/* Kanan: Konten analytics */}
        <div className="min-h-[200px]">
          {data ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rata-rata per departemen */}
              <Card className="bg-main text-main-foreground">
                <CardHeader>
                  <CardTitle>Rata-rata Skor per Departemen</CardTitle>
                  <CardDescription className="text-main-foreground/80">
                    Periode {data.period}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.avg_score_per_department.map((d, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-start gap-4 py-2 border-b border-border last:border-0"
                      >
                        <span className="text-main-foreground">{d.department}</span>
                        <span className="font-heading text-main-foreground text-right shrink-0">
                          <span className="block text-sm font-normal opacity-90">Rata-rata: {d.avg_score.toFixed(2)}</span>
                          <span className="block text-sm font-normal opacity-90">Jumlah karyawan: {d.employee_count}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Distribusi kategori */}
              <Card className="bg-main text-main-foreground">
                <CardHeader>
                  <CardTitle>Distribusi Kategori Performa</CardTitle>
                  <CardDescription className="text-main-foreground/80">
                    Periode {data.period}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.category_distribution.map((c, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center py-2 border-b border-border last:border-0"
                      >
                        <span className="text-main-foreground">{c.category}</span>
                        <span className="font-heading text-main-foreground">{c.count}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Top performers - full width */}
              <Card className="lg:col-span-2 bg-main text-main-foreground">
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription className="text-main-foreground/80">
                    Periode {data.period}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b-2 border-border">
                          <th className="py-2 pr-4 text-main-foreground">ID</th>
                          <th className="py-2 pr-4 text-main-foreground">Nama</th>
                          <th className="py-2 pr-4 text-main-foreground">Total Skor</th>
                          <th className="py-2 text-main-foreground">Kategori</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.top_performers.map((p) => (
                          <tr key={p.employee_id} className="border-b border-border">
                            <td className="py-2 pr-4 text-main-foreground">{p.employee_id}</td>
                            <td className="py-2 pr-4 text-main-foreground">{p.full_name}</td>
                            <td className="py-2 pr-4 text-main-foreground">{p.total_score.toFixed(2)}</td>
                            <td className="py-2 text-main-foreground">{p.performance_category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Underperformers - full width */}
              <Card className="lg:col-span-2 bg-main text-main-foreground">
                <CardHeader>
                  <CardTitle>Underperformers</CardTitle>
                  <CardDescription className="text-main-foreground/80">
                    Periode {data.period}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b-2 border-border">
                          <th className="py-2 pr-4 text-main-foreground">ID</th>
                          <th className="py-2 pr-4 text-main-foreground">Nama</th>
                          <th className="py-2 pr-4 text-main-foreground">Total Skor</th>
                          <th className="py-2 text-main-foreground">Kategori</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.underperformers.map((p) => (
                          <tr key={p.employee_id} className="border-b border-border">
                            <td className="py-2 pr-4 text-main-foreground">{p.employee_id}</td>
                            <td className="py-2 pr-4 text-main-foreground">{p.full_name}</td>
                            <td className="py-2 pr-4 text-main-foreground">{p.total_score.toFixed(2)}</td>
                            <td className="py-2 text-main-foreground">{p.performance_category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-main/50 text-main-foreground border-dashed">
              <CardContent className="flex items-center justify-center py-16">
                <p className="text-main-foreground/70 text-center">
                  {loading ? "Memuat data..." : "Pilih periode untuk menampilkan analytics."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
