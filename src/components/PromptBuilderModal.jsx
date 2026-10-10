"use client";

import { useRef, useState } from "react";
import { Sparkles, Copy, Check, ArrowRightToLine, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { generateNoteContent, PUTER_MODELS } from "@/lib/puter";
import { convertMarkdownToSanitizedHtml } from "@/utils/markdownToHtml";

const PRESET_TEMPLATES = [
  {
    id: "edu_html_master",
    title: "Master Study Notes (Semantic HTML)",
    category: "Education",
    promptText: `Convert the topic or content into university-grade, professionally structured study notes returning ONLY semantic HTML. Include Introduction, Core Concepts, Architecture, Algorithms, Syntax, Comparison Tables, Real-world Applications, Formulas, Exam Focus (2/5/10 marks), Interview Q&A, and Quick Revision Summary. Use clean semantic tags (<article>, <header>, <h1>-<h4>, <strong>, <mark>, <div class="note">, <div class="important">, <div class="definition">).`,
  },
  {
    id: "summarize",
    title: "Executive Summary",
    category: "Productivity",
    promptText:
      "Summarize the key takeaways of the following note into a concise executive summary with bullet points for action items.",
  },
  {
    id: "outline",
    title: "Detailed Study Outline",
    category: "Learning",
    promptText:
      "Structure the provided topic into a comprehensive study outline with clear heading hierarchies (H1, H2, H3), key concepts, and real-world examples.",
  },
  {
    id: "polish",
    title: "Grammar & Professional Tone",
    category: "Writing",
    promptText:
      "Rewrite and polish the following text to enhance readability, correct grammar, and adopt a professional, engaging tone while preserving the original meaning.",
  },
  {
    id: "code_explain",
    title: "Code Explanation & Refactoring",
    category: "Coding",
    promptText:
      "Explain the provided code step-by-step, highlight potential edge cases, suggest performance optimizations, and provide clean refactored HTML code blocks.",
  },
  {
    id: "flashcards",
    title: "Q&A Flashcard Generator",
    category: "Study",
    promptText:
      "Convert the key facts and definitions from this content into a list of 5-10 Question & Answer flashcard pairs formatted cleanly for study revision.",
  },
];

export default function PromptBuilderModal({ open, onClose, onInsertIntoEditor }) {
  const [selectedTemplate, setSelectedTemplate] = useState("edu_html_master");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [outputFormat, setOutputFormat] = useState("HTML Rich Text");
  const [customInstructions, setCustomInstructions] = useState("");
  const [copied, setCopied] = useState(false);
  const [model, setModel] = useState("auto");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [view, setView] = useState("prompt");
  const cancelled = useRef(false);

  const activePreset = PRESET_TEMPLATES.find((t) => t.id === selectedTemplate) || PRESET_TEMPLATES[0];

  const generatedPrompt = `[ROLE & GOAL]
Act as an expert content editor and subject specialist.

[TASK INSTRUCTION]
${activePreset.promptText}

[TOPIC / CONTEXT]
${topic.trim() ? topic.trim() : "Insert document text or topic context here..."}

[FORMATTING REQUIREMENTS]
- Tone: ${tone}
- Preferred Output Structure: ${outputFormat}
${customInstructions.trim() ? `- Additional Constraints: ${customInstructions.trim()}` : ""}

Please generate clean, structured content ready for note taking.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic first");
      return;
    }
    cancelled.current = false;
    setGenerating(true);
    setResult("");
    setView("result");
    try {
      const html = outputFormat === "HTML Rich Text";
      const text = await generateNoteContent({
        prompt: generatedPrompt,
        model,
        html,
        onChunk: setResult,
        isCancelled: () => cancelled.current,
      });
      if (!cancelled.current) setResult(text);
    } catch (err) {
      toast.error(err?.message || "AI generation failed");
      setView("prompt");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success("Result copied to clipboard!");
  };

  const handleClose = () => {
    cancelled.current = true;
    setGenerating(false);
    onClose?.();
  };

  const handleInsert = () => {
    if (onInsertIntoEditor && result) {
      onInsertIntoEditor(convertMarkdownToSanitizedHtml(result));
      toast.success("Generated content inserted!");
      handleClose();
      return;
    }
    if (onInsertIntoEditor) {
      const htmlToInsert = `
        <div class="callout callout-info">
          <strong>AI Prompt Context:</strong> ${activePreset.title} (${tone} tone)
        </div>
        <p>${generatedPrompt.replace(/\n/g, "<br/>")}</p>
      `;
      onInsertIntoEditor(htmlToInsert);
      toast.success("Prompt inserted into editor!");
    } else {
      handleCopy();
    }
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent className="sm:max-w-3xl p-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI Note Generator
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-3">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold text-muted-foreground">1. Select Prompt Preset</p>

            <div className="flex flex-wrap gap-1.5 ">
              {PRESET_TEMPLATES.map((tmpl) => (
                <Badge
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  variant={selectedTemplate === tmpl.id ? "default" : "outline"}
                  className={cn("cursor-pointer font-semibold px-3 py-3", selectedTemplate === tmpl.id && "")}
                >
                  {tmpl.title}
                </Badge>
              ))}
            </div>

            <Input
              placeholder="Enter The Topic "
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <div className="flex gap-2">
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Casual & Conversational">Casual</SelectItem>
                  <SelectItem value="Academic & Technical">Academic</SelectItem>
                  <SelectItem value="Concise & Direct">Concise</SelectItem>
                </SelectContent>
              </Select>

              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HTML Rich Text">HTML Rich Text</SelectItem>
                  <SelectItem value="Markdown">Markdown</SelectItem>
                  <SelectItem value="Bullet Points List">Bullet Points List</SelectItem>
                  <SelectItem value="Q&A Pairs">Q&amp;A Pairs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="e.g., Use bullet points for key facts, keep under 300 words..."
              rows={2}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
            />

            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-full" aria-label="AI model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PUTER_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="ui-label normal-case tracking-normal">
              Powered by Puter.js — sign in once, no API key needed.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="ui-seg w-fit p-0.5" role="group" aria-label="Preview">
              <button type="button" className="ui-seg-item" aria-pressed={view === "prompt"} onClick={() => setView("prompt")}>
                Prompt
              </button>
              <button type="button" className="ui-seg-item" aria-pressed={view === "result"} onClick={() => setView("result")}>
                {generating && <Loader2 className="size-3.5 animate-spin" />}
                Result
              </button>
            </div>
            <pre className="ui-card max-h-80 flex-1 overflow-y-auto bg-black/[0.03] p-3 font-mono text-[13px] whitespace-pre-wrap">
              {view === "prompt"
                ? generatedPrompt
                : result || (generating ? "Generating…" : "Press Generate to write this note with AI.")}
            </pre>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={handleCopy}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied!" : "Copy Prompt"}
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button variant="outline" onClick={handleGenerate} disabled={generating}>
              {generating ? <Loader2 className="animate-spin" /> : <Wand2 />}
              {generating ? "Generating" : result ? "Regenerate" : "Generate"}
            </Button>
            <Button onClick={result && !onInsertIntoEditor ? handleCopyResult : handleInsert} disabled={generating}>
              {onInsertIntoEditor ? <ArrowRightToLine /> : result ? <Copy /> : <Sparkles />}
              {onInsertIntoEditor ? "Insert into Editor" : result ? "Copy Result" : "Use Prompt"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
