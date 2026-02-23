import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPerformanceSummary, generatePerformanceSummary } from "@/lib/api";
import type { PerformanceSummaryResponse } from "@/lib/api";

const PERIODS = ["Q1-2026", "Q2-2026", "Q3-2026", "Q4-2026"];

const ME = "me";

function Summary() {
  const [period, setPeriod] = useState<string>("Q1-2026");
  const [data, setData] = useState<PerformanceSummaryResponse["data"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setData(null);
    setLoading(true);
    try {
      let res = await getPerformanceSummary(ME, period);
      // Hanya hit POST generate jika summary not found (404)
      if (res.code === 404 || (res.status === "error" && !res.data)) {
        await generatePerformanceSummary(period);
        res = await getPerformanceSummary(ME, period);
      }
      if (res.status === "success" && res.data) {
        setData(res.data);
      } else {
        setError(res.message || "Gagal mengambil data.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading mb-6 text-foreground">
        Ringkasan Performa (AI Summary)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,380px)_1fr] gap-6 lg:gap-8 items-start">
        {/* Kiri: Form */}
        <Card className="lg:sticky lg:top-24 bg-main text-main-foreground">
          <CardHeader>
            <CardTitle>Pilih Periode</CardTitle>
            <CardDescription className="text-main-foreground/80">
            Pilih periode untuk melihat ringkasan performa Anda (berdasarkan akun login).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="period" className="text-main-foreground">
                Periode
              </Label>
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
              </div>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
              <Button type="submit" variant="reverse" disabled={loading}>
                {loading ? "Memuat..." : "Tampilkan Summary"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Kanan: Konten */}
        <div className="min-h-[200px]">
          {data?.ai_summary ? (
            <Card className="bg-main text-main-foreground">
              <CardHeader>
                <CardTitle>Ringkasan</CardTitle>
                <CardDescription className="text-main-foreground/80">
                  Periode {data.period} · Dihasilkan: {data.generated_at ? new Date(data.generated_at).toLocaleString("id-ID") : "-"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-main-foreground">{data.ai_summary.summary ?? ""}</p>
                <div>
                  <h3 className="font-heading text-main-foreground mb-2">KPI Tercapai</h3>
                  <ul className="list-disc list-inside space-y-1 text-main-foreground">
                    {(Array.isArray(data.ai_summary.achieved_kpi) ? data.ai_summary.achieved_kpi : []).map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>
                {Array.isArray(data.ai_summary.not_achieved_kpi) && data.ai_summary.not_achieved_kpi.length > 0 && (
                  <div>
                    <h3 className="font-heading text-main-foreground mb-2">KPI Belum Tercapai</h3>
                    <ul className="list-disc list-inside space-y-1 text-main-foreground">
                      {data.ai_summary.not_achieved_kpi.map((k, i) => (
                        <li key={i}>{k}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h3 className="font-heading text-main-foreground mb-2">Rekomendasi</h3>
                  <ul className="list-disc list-inside space-y-1 text-main-foreground">
                    {(Array.isArray(data.ai_summary.recommendations) ? data.ai_summary.recommendations : []).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
                <p className="pt-2 border-t border-border text-main-foreground italic">
                  {data.ai_summary.motivation ?? ""}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-main/50 text-main-foreground border-dashed">
              <CardContent className="flex items-center justify-center py-16">
                <p className="text-main-foreground/70 text-center">
                  Pilih periode lalu klik &quot;Tampilkan Summary&quot; untuk menampilkan ringkasan performa Anda.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Summary;
