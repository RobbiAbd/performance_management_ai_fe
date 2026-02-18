import { useState, useEffect } from "react";
import { getUser } from "@/lib/auth";
import { generateMotivation } from "@/lib/api";

function getGreeting(hour: number): string {
  if (hour >= 0 && hour < 12) return "Selamat pagi";
  if (hour >= 12 && hour < 15) return "Selamat siang";
  if (hour >= 15 && hour < 18) return "Selamat sore";
  return "Selamat malam";
}

function getTimeString(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function getDateString(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Home() {
  const [now, setNow] = useState(() => new Date());
  const [motivation, setMotivation] = useState<string | null>(null);
  const [motivationLoading, setMotivationLoading] = useState(true);

  const user = getUser();
  const nama = user?.full_name ?? "";

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setMotivationLoading(true);
    generateMotivation()
      .then((res) => {
        if (!cancelled && res.status === "success" && res.data?.motivation) {
          setMotivation(res.data.motivation);
        }
      })
      .catch(() => {
        if (!cancelled) setMotivation(null);
      })
      .finally(() => {
        if (!cancelled) setMotivationLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const greeting = getGreeting(now.getHours());

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background via-background to-main/10">
      <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-2">
        {/* Jam */}
        <p className="text-7xl md:text-8xl lg:text-9xl font-heading tabular-nums text-foreground tracking-tight">
          {getTimeString(now)}
        </p>
        {/* Tanggal */}
        <p className="text-lg md:text-xl text-foreground/80 font-base">
          {getDateString(now)}
        </p>
        {/* Sapaan + Nama */}
        <p className="text-2xl md:text-3xl lg:text-4xl font-heading text-foreground pt-4">
          {greeting}{nama ? `, ${nama}.` : "."}
        </p>
        {/* Kata motivasi dari EP */}
        <blockquote className="pt-8 md:pt-12 text-lg md:text-xl text-foreground/90 font-base italic max-w-xl">
          {motivationLoading ? (
            <span className="text-foreground/60">Memuat motivasi...</span>
          ) : motivation ? (
            <>&ldquo;{motivation}&rdquo;</>
          ) : (
            <span className="text-foreground/60">Motivasi tidak tersedia.</span>
          )}
        </blockquote>
      </div>
    </div>
  );
}

export default Home;
