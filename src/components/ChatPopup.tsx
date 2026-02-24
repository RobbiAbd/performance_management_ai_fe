import { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getChatHistory, postChat } from "@/lib/api";
import type { ChatHistoryItem } from "@/lib/api";

const HISTORY_LIMIT = 50;

interface ChatPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ChatPopup({ open, onOpenChange }: ChatPopupProps) {
  const [messages, setMessages] = useState<ChatHistoryItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoadingHistory(true);
    getChatHistory(HISTORY_LIMIT)
      .then((res) => {
        const list = res.data?.history ?? [];
        setMessages(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Gagal memuat riwayat.");
        setMessages([]);
      })
      .finally(() => setLoadingHistory(false));
  }, [open]);

  useEffect(() => {
    if (messages.length || loading) scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError(null);
    const userMsg: ChatHistoryItem = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await postChat(text);
      const assistantContent =
        res.data?.assistant_content ??
        (res as { assistant_content?: string }).assistant_content ??
        "";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantContent,
          id: res.data?.id,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim pesan.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-5 border-l p-6 sm:max-w-md"
      >
        <SheetHeader className="pr-12 pt-1 pb-0">
          <SheetTitle className="text-left">AI Assistant</SheetTitle>
          <SheetDescription className="text-left">
            Tanya seputar dengan performa, KPI, motivasi, atau fitur aplikasi ini. Riwayat disimpan.
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 px-1">
            <div className="flex flex-col gap-3 py-2 pr-3">
              {loadingHistory ? (
                <p className="text-sm text-foreground/70">Memuat riwayat...</p>
              ) : messages.length === 0 && !loading ? (
                <p className="text-sm text-foreground/70">
                  Belum ada percakapan. Kirim pesan untuk memulai.
                </p>
              ) : null}
              {messages.map((m, i) => (
                <div
                  key={m.id ?? i}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-lg bg-main px-3 py-2 text-sm text-main-foreground"
                      : "mr-auto max-w-[85%] rounded-lg bg-secondary-background border border-border px-3 py-2 text-sm text-foreground"
                  }
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="mr-auto flex max-w-[85%] items-center gap-2 rounded-lg bg-secondary-background border border-border px-3 py-2.5 text-sm text-foreground/70">
                  <span className="inline-flex gap-0.5">
                    <span className="size-1.5 animate-bounce rounded-full bg-foreground/60 [animation-delay:0ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-foreground/60 [animation-delay:150ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-foreground/60 [animation-delay:300ms]" />
                  </span>
                  <span>Asisten sedang mengetik...</span>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-2">
            <Textarea
              placeholder="Ketik pesan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
              rows={2}
              disabled={loading}
              className="min-h-[80px] resize-none"
            />
            <Button type="submit" variant="default" disabled={loading || !input.trim()}>
              {loading ? "Mengirim..." : "Kirim"}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ChatPopup;
