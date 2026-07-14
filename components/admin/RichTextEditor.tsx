"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered,
  Link2, ImagePlus, Code, Undo, Redo, Pilcrow,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// Lightweight HTML rich-text editor (no external deps). Emits HTML string.
export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [showHtml, setShowHtml] = useState(false);

  // Sync incoming value into the editor without stealing the caret while typing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement !== el && el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

  function emit() {
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function exec(command: string, arg?: string) {
    document.execCommand(command, false, arg);
    ref.current?.focus();
    emit();
  }

  function formatBlock(tag: string) {
    document.execCommand("formatBlock", false, tag);
    ref.current?.focus();
    emit();
  }

  function addLink() {
    const url = prompt("Link URL (https://…)");
    if (!url) return;
    exec("createLink", url);
  }

  function addImage() {
    const url = prompt("Image URL");
    if (!url) return;
    const alt = prompt("Image alt text (for SEO)") || "";
    exec("insertHTML", `<img src="${url}" alt="${alt}" style="max-width:100%;border-radius:8px;margin:8px 0" />`);
  }

  const Btn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#0A65AB] transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <Btn onClick={() => exec("bold")} title="Bold"><Bold size={15} /></Btn>
        <Btn onClick={() => exec("italic")} title="Italic"><Italic size={15} /></Btn>
        <Btn onClick={() => exec("underline")} title="Underline"><Underline size={15} /></Btn>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <Btn onClick={() => formatBlock("h2")} title="Heading 2"><Heading2 size={15} /></Btn>
        <Btn onClick={() => formatBlock("h3")} title="Heading 3"><Heading3 size={15} /></Btn>
        <Btn onClick={() => formatBlock("p")} title="Paragraph"><Pilcrow size={15} /></Btn>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <Btn onClick={() => exec("insertUnorderedList")} title="Bullet list"><List size={15} /></Btn>
        <Btn onClick={() => exec("insertOrderedList")} title="Numbered list"><ListOrdered size={15} /></Btn>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <Btn onClick={addLink} title="Insert link"><Link2 size={15} /></Btn>
        <Btn onClick={addImage} title="Insert image"><ImagePlus size={15} /></Btn>
        <span className="w-px h-5 bg-gray-200 mx-1" />
        <Btn onClick={() => exec("undo")} title="Undo"><Undo size={15} /></Btn>
        <Btn onClick={() => exec("redo")} title="Redo"><Redo size={15} /></Btn>
        <div className="ml-auto">
          <Btn onClick={() => setShowHtml((s) => !s)} title="Toggle HTML"><Code size={15} /></Btn>
        </div>
      </div>

      {showHtml ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={14}
          spellCheck={false}
          className="w-full px-4 py-3 text-sm font-mono text-gray-800 focus:outline-none resize-y"
          placeholder="<h2>Heading</h2><p>…</p>"
        />
      ) : (
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          data-placeholder={placeholder || "Write content here…"}
          className="rte-content min-h-[280px] px-4 py-3 text-sm text-gray-800 leading-relaxed focus:outline-none"
        />
      )}

      <style>{`
        .rte-content:empty:before { content: attr(data-placeholder); color: #9ca3af; }
        .rte-content h2 { font-size: 1.25rem; font-weight: 700; color: #1f2937; margin: 1rem 0 .5rem; }
        .rte-content h3 { font-size: 1.05rem; font-weight: 700; color: #374151; margin: .875rem 0 .375rem; }
        .rte-content p { margin: 0 0 .625rem; }
        .rte-content ul { list-style: disc; padding-left: 1.25rem; margin: 0 0 .625rem; }
        .rte-content ol { list-style: decimal; padding-left: 1.25rem; margin: 0 0 .625rem; }
        .rte-content a { color: #0A65AB; text-decoration: underline; }
        .rte-content strong { font-weight: 700; }
      `}</style>
    </div>
  );
}
