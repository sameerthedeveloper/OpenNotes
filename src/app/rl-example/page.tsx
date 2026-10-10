"use client";

import { useState } from "react";
import {
  Eye,
  FolderClosed,
  FileText,
  LayoutGrid,
  List,
  MoreHorizontal,
  Palette,
  PencilLine,
  Settings,
  Trash2,
  Copy,
  User,
} from "lucide-react";
import {
  Button,
  Card,
  Chip,
  IconButton,
  Input,
  Menu,
  Modal,
  NavItem,
  Panel,
  PanelBody,
  PanelHeader,
  PanelRail,
  Reveal,
  Segmented,
  TabBar,
  Textarea,
  Tile,
  ToastProvider,
  useToast,
  InterfaceStyleSetting,
} from "@/components/rl";

type View = "edit" | "preview" | "library";

const FOLDERS = ["Algorithms", "Databases", "Networks", "Operating systems"];

function Screen() {
  const toast = useToast();
  const [view, setView] = useState<View>("edit");
  const [section, setSection] = useState("details");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsNav, setSettingsNav] = useState("appearance");

  return (
    <div className="app-canvas flex h-dvh gap-4 p-4 pb-24 md:pb-4">
      {/* edit panel — always visible on desktop, one-at-a-time on phones */}
      <Panel
        className={`${view === "edit" ? "flex" : "hidden md:flex"} w-full md:w-[420px] md:shrink-0`}
        aria-label="Note editor"
      >
        <PanelHeader
          title="New note"
          subtitle="Draft · autosaved"
          actions={
            <>
              <IconButton label="Settings" onClick={() => setSettingsOpen(true)}>
                <Settings className="size-4" />
              </IconButton>
              <Menu
                label="Note actions"
                items={[
                  { label: "Duplicate", icon: <Copy className="size-4" />, onSelect: () => toast("Note duplicated") },
                  { label: "Discard draft", icon: <Trash2 className="size-4" />, danger: true, onSelect: () => toast("Draft discarded") },
                ]}
                trigger={(p) => (
                  <button className="ui-icon-btn" aria-label="More actions" {...p}>
                    <MoreHorizontal className="size-4" />
                  </button>
                )}
              />
            </>
          }
          primary={
            <Button variant="hero" className="w-full" onClick={() => toast("Note published")}>
              Publish note
            </Button>
          }
        />
        <PanelRail
          label="Editor sections"
          value={section}
          onChange={setSection}
          tabs={[
            { value: "details", label: "Details" },
            { value: "content", label: "Content" },
            { value: "sharing", label: "Sharing" },
          ]}
        />
        <PanelBody>
          <Reveal className="flex flex-col gap-4">
            <Card title="Basics" index="01" complete={title.length > 2}>
              <Input label="Title" placeholder="Process scheduling" value={title} onChange={(e) => setTitle(e.target.value)} />
              <div className="flex flex-wrap gap-2">
                <Chip>OS</Chip>
                <Chip>Semester 4</Chip>
              </div>
            </Card>
            <Card title="Content" index="02" complete={body.length > 10}>
              <Textarea label="Body" hint="Markdown supported." placeholder="Start writing…" value={body} onChange={(e) => setBody(e.target.value)} />
            </Card>
            <Card title="Sharing" index="03">
              <Segmented
                label="Visibility"
                value="private"
                onChange={() => {}}
                options={[
                  { value: "private", label: "Private" },
                  { value: "link", label: "Link" },
                  { value: "public", label: "Public" },
                ]}
              />
            </Card>
          </Reveal>
        </PanelBody>
      </Panel>

      {/* preview / library panel */}
      <Panel className={`${view === "edit" ? "hidden md:flex" : "flex"} min-w-0 flex-1`} aria-label="Preview">
        <PanelHeader
          title={view === "library" ? "Library" : "Preview"}
          subtitle={view === "library" ? "4 folders" : "Live render"}
          actions={
            view === "library" && (
              <Segmented
                label="Layout"
                value={layout}
                onChange={setLayout}
                options={[
                  { value: "grid", label: <LayoutGrid className="size-4" />, aria: "Grid view" },
                  { value: "list", label: <List className="size-4" />, aria: "List view" },
                ]}
              />
            )
          }
        />
        <PanelBody>
          {view === "library" ? (
            <Reveal className={layout === "grid" ? "grid grid-cols-2 gap-4 lg:grid-cols-3" : "flex flex-col gap-3"}>
              {FOLDERS.map((f) => (
                <button key={f} type="button" className="ui-card flex items-center gap-3 p-4 text-left transition-all duration-200 active:scale-[0.985]">
                  <Tile>
                    <FolderClosed className="size-4" />
                  </Tile>
                  <span className="ui-title text-[15px]">{f}</span>
                </button>
              ))}
            </Reveal>
          ) : (
            <Card>
              <p className="ui-label">Preview</p>
              <h1 className="ui-title text-4xl">{title || "Untitled note"}</h1>
              <p className="whitespace-pre-wrap text-ink-soft">{body || "Your note renders here as you type."}</p>
            </Card>
          )}
        </PanelBody>
      </Panel>

      <TabBar
        value={view}
        onChange={(v) => setView(v as View)}
        tabs={[
          { value: "edit", label: "Edit", icon: <PencilLine className="size-5" /> },
          { value: "preview", label: "Preview", icon: <Eye className="size-5" /> },
          { value: "library", label: "Library", icon: <FileText className="size-5" /> },
        ]}
      />

      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
        className="sm:max-w-2xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSettingsOpen(false);
                toast("Settings saved");
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <div className="grid gap-6 sm:grid-cols-[11rem_1fr]">
          <nav aria-label="Settings sections" className="flex gap-1 sm:flex-col">
            <NavItem active={settingsNav === "appearance"} icon={<Palette className="size-4" />} onClick={() => setSettingsNav("appearance")}>
              Appearance
            </NavItem>
            <NavItem active={settingsNav === "account"} icon={<User className="size-4" />} onClick={() => setSettingsNav("account")}>
              Account
            </NavItem>
          </nav>
          <div className="flex flex-col gap-3">
            {settingsNav === "appearance" ? (
              <>
                <p className="ui-label">Interface style</p>
                <InterfaceStyleSetting />
              </>
            ) : (
              <Input label="Display name" placeholder="Your name" />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <Screen />
    </ToastProvider>
  );
}
