"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ASSISTANT_WELCOME,
  ASSISTANT_WHATSAPP_MESSAGE,
  DEFAULT_SUGGESTIONS,
} from "@/data/knowledge-base";
import { getAssistantReply, type ConversationContext } from "@/lib/assistant";
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

function useScrollLock(active: boolean, dataAttr: string) {
  useEffect(() => {
    if (!active) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      position: style.position,
      top: style.top,
      width: style.width,
      overflow: style.overflow,
    };

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    style.overflow = "hidden";
    document.body.dataset[dataAttr] = "true";

    return () => {
      style.position = prev.position;
      style.top = prev.top;
      style.width = prev.width;
      style.overflow = prev.overflow;
      delete document.body.dataset[dataAttr];
      window.scrollTo(0, scrollY);
    };
  }, [active, dataAttr]);
}

export function MaldivasAssistant() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [context, setContext] = useState<ConversationContext>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useScrollLock(open, "assistantOpen");

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { id: createId(), role: "assistant", text: ASSISTANT_WELCOME },
      ]);
      setSuggestions(DEFAULT_SUGGESTIONS);
    }
  }, [open, messages.length]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 280);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "user", text: trimmed },
      ]);
      setInput("");

      const reply = getAssistantReply(trimmed, context);
      setContext(reply.context);
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
    },
    [context]
  );

  const handleEscalation = () => {
    openWhatsApp(ASSISTANT_WHATSAPP_MESSAGE);
  };

  const fullscreen = mounted
    ? createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="assistant-fullscreen"
              role="dialog"
              aria-modal="true"
              aria-label="Asistente Maldivas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-0 z-[300] flex flex-col bg-ivory"
            >
              <header className="relative flex-shrink-0 flex items-center justify-center border-b border-premium-border bg-white px-5 py-4 min-h-[56px]">
                <button
                  type="button"
                  onClick={close}
                  className="absolute left-4 sm:left-6 text-sm text-matte-black/70 hover:text-matte-black transition-colors tracking-wide"
                >
                  ← Cerrar
                </button>
                <h1 className="text-sm font-light tracking-wide text-matte-black">
                  Asistente Maldivas
                </h1>
              </header>

              <p className="flex-shrink-0 text-center text-xs text-premium-gray px-6 py-3 border-b border-premium-border/60 bg-white/80">
                Estoy para ayudarte a encontrar la mejor solución para tu espacio.
              </p>

              <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-4 sm:px-6 py-6"
              >
                <div className="mx-auto max-w-2xl space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[90%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-matte-black text-white"
                            : "bg-white border border-premium-border text-matte-black/90 shadow-sm"
                        }`}
                      >
                        {msg.text}
                        {msg.escalated && (
                          <button
                            type="button"
                            onClick={handleEscalation}
                            className="mt-4 block w-full text-center text-[10px] tracking-luxury uppercase border border-matte-black/20 px-4 py-3 hover:bg-matte-black hover:text-white transition-all duration-500"
                          >
                            Hablar con un asesor
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {suggestions.length > 0 && (
                <div className="flex-shrink-0 px-4 sm:px-6 pb-3 flex flex-wrap gap-2 justify-center max-w-2xl mx-auto w-full">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage(suggestion)}
                      className="text-[10px] leading-snug text-left text-premium-gray border border-premium-border rounded-full px-3 py-2 hover:border-matte-black/30 hover:text-matte-black transition-colors bg-white"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              <form
                className="flex-shrink-0 border-t border-premium-border bg-white p-4 sm:p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
              >
                <div className="mx-auto max-w-2xl flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribí tu consulta..."
                    className="flex-1 min-w-0 rounded-lg border border-premium-border bg-ivory px-4 py-3 text-sm text-matte-black placeholder:text-premium-gray/70 focus:outline-none focus:border-matte-black/30"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="flex-shrink-0 text-[10px] tracking-luxury uppercase border border-matte-black px-6 py-3 text-matte-black hover:bg-matte-black hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-matte-black transition-all duration-500"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <>
      {fullscreen}

      {!open && (
        <button
          type="button"
          data-site-chrome
          onClick={() => setOpen(true)}
          aria-label="Asistente Maldivas"
          className="fixed bottom-6 right-4 sm:right-6 z-[45] text-[10px] tracking-luxury uppercase border border-matte-black/20 bg-white/95 backdrop-blur-sm text-matte-black px-5 py-3 rounded-full shadow-[0_4px_20px_-6px_rgba(26,26,26,0.18)] hover:bg-matte-black hover:text-white hover:border-matte-black transition-all duration-500"
        >
          Asistente Maldivas
        </button>
      )}
    </>
  );
}
