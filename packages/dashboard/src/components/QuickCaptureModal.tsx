import React, { useState, useEffect } from "react";
import { parseShorthand, type ParsedShorthand } from "../utils/shorthandParser.ts";

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (parsed: ParsedShorthand) => void;
}

export function QuickCaptureModal({ isOpen, onClose, onSubmit }: QuickCaptureModalProps) {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ParsedShorthand>(() => parseShorthand(""));

  useEffect(() => {
    setParsed(parseShorthand(input));
  }, [input]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(parsed);
    setInput("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="quick-capture-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quick-capture-header">
          <h3>Quick Capture</h3>
          <button type="button" className="action-btn" onClick={onClose}>
            Esc
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="input-container">
            <input
              type="text"
              className="quick-input"
              placeholder="e.g. #work Ensure ticket x is handled @tomorrow !!! ~40min"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
          </div>

          {input.trim() && (
            <div className="tokens-preview">
              {parsed.tokens.map((token, idx) => (
                <span key={idx} className={`token token-${token.type}`}>
                  {token.text}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Syntax: <span style={{ color: "var(--accent-purple)" }}>#tag</span>{" "}
              <span style={{ color: "var(--accent-blue)" }}>@date</span>{" "}
              <span style={{ color: "var(--accent-amber)" }}>!/!!/!!!/!!!!</span>{" "}
              <span style={{ color: "var(--accent-teal)" }}>~40min</span>
            </div>
            <button type="submit" className="action-btn" style={{ backgroundColor: "var(--accent-amber)", color: "#000", fontWeight: 600 }}>
              Add Task (Enter)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
