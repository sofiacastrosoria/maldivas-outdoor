"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ASSISTANT_WELCOME,
  ASSISTANT_WHATSAPP_MESSAGE,
  DEFAULT_SUGGESTIONS,
} from "@/data/knowledge-base";
import { getAssistantReply } from "@/lib/assistant";
import { openWhatsApp } from "@/lib/whatsapp";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  escalated?: boolean;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function MaldivasAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: createId(),
          role: "assistant",
          text: ASSISTANT_WELCOME,
        },
      ]);
      setSuggestions(DEFAULT_SUGGESTIONS);
    }
  }, [open, messages.length]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: createId(), role: "user", text: trimmed },
    ]);
    setInput("");

    const reply = getAssistantReply(trimmed);
    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: "assistant",
        text: reply.answer,
        escalated: reply.escalated,
      },
    ]);
    setSuggestions(reply.escalated ? [] : reply.suggestions);
  }, []);

  const handleEscalation = () => {
    openWhatsApp(ASSISTANT_WHATSAPP_MESSAGE);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label="Cerrar asistente"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[44] bg-matte-black/20 backdrop-blur-[2px] md:bg-transparent md:backdrop-blur-0"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-4 sm:right-6 z-[45] flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Asistente Maldivas"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-[min(100vw-2rem,380px)] rounded-xl border border-premium-border bg-ivory shadow-[0_8px_40px_-12px_rgba(26,26,26,0.22)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="px-5 py-4 border-b border-premium-border bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] tracking-luxury uppercase text-premium-gray">
                      Maldivas Outdoor
                    </p>
                    <h2 className="text-base font-light text-matte-black mt-1">
                      Asistente Maldivas
                    </h2>
                    <p className="text-xs text-premium-gray mt-1 leading-relaxed">
                      Estoy para ayudarte a encontrar la mejor solución para tu
                      espacio.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Cerrar"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-premium-gray hover:text-matte-black hover:bg-matte-black/5 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </header>

              <div
                ref={scrollRef}
                className="max-h-[min(52dvh,420px)] overflow-y-auto overscroll-y-contain px-4 py-4 space-y-3"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-matte-black text-white"
                          : "bg-white border border-premium-border text-matte-black/90"
                      }`}
                    >
                      {msg.text}
                      {msg.escalated && (
                        <button
                          type="button"
                          onClick={handleEscalation}
                          className="mt-3 block w-full text-center text-[10px] tracking-luxury uppercase border border-matte-black/20 px-4 py-2.5 hover:bg-matte-black hover:text-white transition-all duration-500"
                        >
                          Hablar con un asesor
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {suggestions.length > 0 && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage(suggestion)}
                      className="text-[10px] leading-snug text-left text-premium-gray border border-premium-border rounded-full px-3 py-1.5 hover:border-matte-black/30 hover:text-matte-black transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              <form
                className="border-t border-premium-border p-3 bg-white flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribí tu consulta..."
                  className="flex-1 min-w-0 rounded-lg border border-premium-border bg-ivory px-3 py-2.5 text-sm text-matte-black placeholder:text-premium-gray/70 focus:outline-none focus:border-matte-black/30"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex-shrink-0 text-[10px] tracking-luxury uppercase border border-matte-black px-4 py-2.5 text-matte-black hover:bg-matte-black hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-matte-black transition-all duration-500"
                >
                  Enviar
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Asistente Maldivas"
          className="text-[10px] tracking-luxury uppercase border border-matte-black/20 bg-white/95 backdrop-blur-sm text-matte-black px-5 py-3 rounded-full shadow-[0_4px_20px_-6px_rgba(26,26,26,0.18)] hover:bg-matte-black hover:text-white hover:border-matte-black transition-all duration-500"
        >
          Asistente Maldivas
        </button>
      </div>
    </>
  );
}
