"use client";

import { Fragment, useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface Segment {
  type: "text" | "inline-math" | "block-math";
  content: string;
}

// Splits on $$...$$ (display math) first, then $...$ (inline math) within the
// remaining plain-text segments, preserving order. Text with no $ delimiters
// at all is returned as a single plain-text segment untouched.
function splitMath(input: string): Segment[] {
  const segments: Segment[] = [];
  const blockRegex = /\$\$([^$]+)\$\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: input.slice(lastIndex, match.index),
      });
    }
    segments.push({ type: "block-math", content: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < input.length) {
    segments.push({ type: "text", content: input.slice(lastIndex) });
  }

  // Now split any remaining plain-text segments on inline $...$ math.
  const result: Segment[] = [];
  const inlineRegex = /\$([^$\n]+)\$/g;
  for (const seg of segments) {
    if (seg.type !== "text") {
      result.push(seg);
      continue;
    }
    let idx = 0;
    let m: RegExpExecArray | null;
    inlineRegex.lastIndex = 0;
    while ((m = inlineRegex.exec(seg.content)) !== null) {
      if (m.index > idx) {
        result.push({ type: "text", content: seg.content.slice(idx, m.index) });
      }
      result.push({ type: "inline-math", content: m[1] });
      idx = m.index + m[0].length;
    }
    if (idx < seg.content.length) {
      result.push({ type: "text", content: seg.content.slice(idx) });
    }
  }
  return result;
}

function renderKatex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode });
  } catch {
    return tex;
  }
}

export function MathText({
  text,
  className,
}: {
  text?: string | null;
  className?: string;
}) {
  const segments = useMemo(() => splitMath(text || ""), [text]);

  if (!text) return null;

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return <Fragment key={i}>{seg.content}</Fragment>;
        }
        const html = renderKatex(seg.content, seg.type === "block-math");
        return seg.type === "block-math" ? (
          <span
            key={i}
            className="my-1 block"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <span key={i} dangerouslySetInnerHTML={{ __html: html }} />
        );
      })}
    </span>
  );
}
