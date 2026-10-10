"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Menu as MenuIcon,
  PanelLeft,
  PanelLeftOpen,
  Plus,
  Notebook,
  User,
  LogOut,
  Search,
  Bookmark,
  Settings,
  X,
  Compass,
  LayoutDashboard,
  Bell,
  Share2,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  MessagesSquare,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabBar } from "@/components/rl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import PromptBuilderModal from "@/components/PromptBuilderModal";
import OnboardingWizardModal from "@/components/OnboardingWizardModal";
import InterfaceStyleSync from "@/components/InterfaceStyleSync";
import { useAuth } from "@/context/AuthContext";
import { useNetworkStatus } from "@/utils/offlineSyncManager";
import { usePlatformSettings } from "@/context/PlatformSettingsContext";
import { isSuperAdmin } from "@/config/adminConfig";
import { cn } from "@/lib/utils";

const MOBILE_TABS = [
  { value: "/dashboard", label: "Home", Icon: LayoutDashboard },
  { value: "/notes", label: "Notes", Icon: Notebook },
  { value: "/discover", label: "Discover", Icon: Compass },
];

function useNavGroups() {
  const { currentUser } = useAuth();
  const { settings } = usePlatformSettings();

  const workspace = [
    { text: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { text: "My Notes", icon: Notebook, path: "/notes" },
    { text: "Discover", icon: Compass, path: "/discover" },
    { text: "Community", icon: MessagesSquare, path: "/community" },
    { text: "Shared Notes", icon: Share2, path: "/shared" },
    { text: "Bookmarks", icon: Bookmark, path: "/bookmarks" },
    ...(settings?.creatorMonetization?.enableCreatorMonetization !== false
      ? [{ text: "Monetization", icon: Sparkles, path: "/monetization" }]
      : []),
  ];

  const tools = [
    { text: "Search", icon: Search, path: "/search" },
    { text: "Notifications", icon: Bell, path: "/notifications", badge: 2 },
  ];

  const admin = isSuperAdmin(currentUser)
    ? [{ text: "Admin Panel", icon: ShieldCheck, path: "/admin" }]
    : [];

  return { workspace, tools, admin };
}

function NavList({ items, pathname, onNavigate, collapsed }) {
  return (
    <nav className={cn("flex flex-col gap-1", collapsed ? "items-center px-1.5" : "px-2")}>
      {items.map((item) => {
        const isSelected = Boolean(item.path) && pathname === item.path;
        const Icon = item.icon;

        const buttonClassName = cn(
          "ui-nav relative",
          collapsed && "size-11 shrink-0 justify-center !px-0"
        );

        const buttonContent = (
          <>
            <Icon className={collapsed ? "size-5 shrink-0" : "size-4.5 shrink-0"} />
            {!collapsed && <span className="flex-1">{item.text}</span>}
            {Boolean(item.badge) &&
              (collapsed ? (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
              ) : (
                <Badge className="h-5 min-w-5 justify-center px-1.5 text-[10px]">
                  {item.badge}
                </Badge>
              ))}
          </>
        );

        if (!collapsed) {
          return (
            <button
              key={item.text}
              onClick={() => (item.onClick ? item.onClick() : onNavigate(item.path))}
              className={buttonClassName}
              aria-current={isSelected ? "page" : undefined}
            >
              {buttonContent}
            </button>
          );
        }

        const button = (
          <button
            onClick={() => (item.onClick ? item.onClick() : onNavigate(item.path))}
            className={buttonClassName}
            aria-current={isSelected ? "page" : undefined}
          >
            {buttonContent}
          </button>
        );

        return (
          <Tooltip key={item.text}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right">{item.text}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}

function NavGroupLabel({ collapsed, children }) {
  if (collapsed) {
    return <div className="my-2 h-px w-8 self-center bg-black/[0.06]" />;
  }
  return (
    <p className="ui-label px-4 pt-5 pb-1.5">
      {children}
    </p>
  );
}

function SidebarNav({
  currentUser,
  initial,
  navGroups,
  pathname,
  onNavigate,
  onCreateNote,
  onHelp,
  onLogout,
  onOpenAI,
  aiEnabled,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onToggleSidebar,
  collapsed = false,
}) {
  const toolsItems = [
    ...(aiEnabled ? [{ text: "AI Assistant", icon: Sparkles, onClick: onOpenAI }] : []),
    ...navGroups.tools,
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Logo + sidebar controls */}
      <div
        className={cn(
          "flex items-center border-b border-black/[0.06] py-3",
          collapsed ? "flex-col gap-2 px-2" : "justify-between gap-2 px-3"
        )}
      >
        <Link href="/dashboard" className={cn("flex min-w-0 items-center gap-2", collapsed && "justify-center")}>
          <Image
            src="/logo.svg"
            alt="OpenNotes"
            width={28}
            height={28}
            className="shrink-0 rounded-md"
          />
          {!collapsed && (
            <span className="ui-title truncate text-[19px]">OpenNotes</span>
          )}
        </Link>
        <div className={cn("flex shrink-0 items-center gap-0.5", collapsed && "flex-col")}>
          {onToggleSidebar && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleSidebar}
                  aria-label={collapsed ? "expand sidebar" : "collapse sidebar"}
                  className="ui-icon-btn !min-h-9 !min-w-9 !p-2"
                >
                  {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeft className="size-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side={collapsed ? "right" : "bottom"}>
                {collapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Profile control */}
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center border-b border-black/[0.06] text-left transition-colors duration-200 hover:bg-black/[0.03]",
                  collapsed ? "justify-center py-3" : "gap-2.5 px-3 py-3"
                )}
              >
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={currentUser?.photoURL || undefined} />
                  <AvatarFallback className="bg-brand-soft text-sm font-bold text-brand-ink">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {currentUser?.displayName || "User"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {currentUser?.email}
                      </p>
                    </div>
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">{currentUser?.displayName || "User"}</TooltipContent>
          )}
        </Tooltip>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuItem onClick={() => onNavigate("/profile")}>
            <User />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={onLogout}>
            <LogOut />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search */}
      {!collapsed && (
        <div className="px-2 pt-2">
          <div className="flex items-center gap-2 rounded-input bg-black/[0.04] px-3 transition-all duration-200 hover:bg-black/[0.055] focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/15">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={onSearchChange}
              onKeyDown={onSearchSubmit}
              className="h-11 w-full bg-transparent text-[16px] outline-none placeholder:text-ink-soft/50 md:text-[15px]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange({ target: { value: "" } })}
                aria-label="clear search"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className={cn("mt-2", collapsed ? "flex justify-center px-1.5" : "px-2")}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" aria-label="Create note" onClick={onCreateNote}>
                <Plus className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Create Note</TooltipContent>
          </Tooltip>
        ) : (
          <Button className="w-full" size="lg" onClick={onCreateNote}>
            <Plus className="size-5" />
            Create Note
          </Button>
        )}
      </div>

      {/* Scrollable nav groups */}
      <div className={cn("flex-1 overflow-y-auto", collapsed && "flex flex-col items-center")}>
        <NavGroupLabel collapsed={collapsed}>Workspace</NavGroupLabel>
        <NavList items={navGroups.workspace} pathname={pathname} onNavigate={onNavigate} collapsed={collapsed} />

        <NavGroupLabel collapsed={collapsed}>Tools</NavGroupLabel>
        <NavList items={toolsItems} pathname={pathname} onNavigate={onNavigate} collapsed={collapsed} />

        {navGroups.admin.length > 0 && (
          <>
            <NavGroupLabel collapsed={collapsed}>Admin</NavGroupLabel>
            <NavList items={navGroups.admin} pathname={pathname} onNavigate={onNavigate} collapsed={collapsed} />
          </>
        )}
      </div>

      {/* Bottom-pinned: Settings & Help */}
      <div className={cn("border-t border-black/[0.06] py-2", collapsed && "flex flex-col items-center")}>
        <NavList
          items={[{ text: "Settings", icon: Settings, path: "/settings" }]}
          pathname={pathname}
          onNavigate={onNavigate}
          collapsed={collapsed}
        />
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onHelp}
                className="ui-nav mt-1 size-11 shrink-0 justify-center !px-0"
              >
                <HelpCircle className="size-5 shrink-0" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Help &amp; Feedback</TooltipContent>
          </Tooltip>
        ) : (
          <nav className="flex flex-col gap-1 px-2">
            <button
              onClick={onHelp}
              className="ui-nav"
            >
              <HelpCircle className="size-4.5 shrink-0" />
              Help &amp; Feedback
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

const AppLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { settings } = usePlatformSettings();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const navGroups = useNavGroups();
  const aiEnabled = settings?.ai?.enableAI !== false;

  const isViewingNote =
    pathname.startsWith("/note/") ||
    pathname.startsWith("/public/note/") ||
    pathname === "/note/new";

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const goTo = (path) => {
    router.push(path);
    setMobileNavOpen(false);
  };

  const pathnames = pathname.split("/").filter(Boolean);
  const initial = currentUser?.displayName?.charAt(0) || "U";

  return (
    <div className="app-canvas flex min-h-screen w-full">
      {/* Mobile nav sheet — always shows the full labeled nav */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-0 data-[side=left]:sm:max-w-72">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigate</SheetTitle>
          </SheetHeader>
          <SidebarNav
            currentUser={currentUser}
            initial={initial}
            navGroups={navGroups}
            pathname={pathname}
            onNavigate={goTo}
            onCreateNote={() => goTo("/note/new")}
            onHelp={() => setHelpDialogOpen(true)}
            onLogout={handleLogout}
            onOpenAI={() => setPromptModalOpen(true)}
            aiEnabled={aiEnabled}
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            onSearchSubmit={handleSearchSubmit}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar — always visible, toggles between full width and icon rail */}
      <aside
        className={cn(
          "ui-panel fixed top-4 bottom-4 left-4 z-30 hidden shrink-0 flex-col overflow-hidden transition-[width] duration-200 md:flex",
          sidebarCollapsed ? "w-[4.5rem]" : "w-64"
        )}
      >
        <SidebarNav
          currentUser={currentUser}
          initial={initial}
          navGroups={navGroups}
          pathname={pathname}
          onNavigate={goTo}
          onCreateNote={() => router.push("/note/new")}
          onHelp={() => setHelpDialogOpen(true)}
          onLogout={handleLogout}
          onOpenAI={() => setPromptModalOpen(true)}
          aiEnabled={aiEnabled}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onSearchSubmit={handleSearchSubmit}
          onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
          collapsed={sidebarCollapsed}
        />
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "flex min-h-screen w-full flex-1 flex-col px-4 pt-4 sm:px-6 md:pr-6",
          isViewingNote ? "pb-6" : "pb-28 md:pb-8",
          sidebarCollapsed ? "md:pl-28" : "md:pl-72"
        )}
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top, 0px))" }}
      >
        {/* Mobile-only top bar: menu trigger, since there is no persistent header */}
        <div className="mb-3 flex items-center justify-between md:hidden">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="open navigation menu"
            className="ui-icon-btn"
          >
            <MenuIcon className="size-5" />
          </button>
          <Link href="/dashboard" className="flex select-none items-center gap-2">
            <Image
              src="/logo.svg"
              alt="OpenNotes"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="ui-title text-[19px]">OpenNotes</span>
          </Link>
          <div className="size-11" />
        </div>

        <div className="mx-auto w-full max-w-360">
          {!isOnline && (
            <div className="ui-card mb-5 flex items-center gap-3 p-4">
              <p className="text-sm font-medium text-ink">
                Offline Mode Active — all note reads, creates, and edits are
                stored locally and will auto-sync once you&apos;re back
                online.
              </p>
            </div>
          )}

          {pathnames.length > 0 && (
            <div className="ui-label mb-4 hidden items-center gap-1.5 md:flex">
              <button
                onClick={() => router.push("/dashboard")}
                className="font-medium hover:text-foreground"
              >
                Home
              </button>
              {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                return (
                  <span key={to} className="flex items-center gap-1.5">
                    <span>/</span>
                    {last ? (
                      <span className="font-semibold text-ink capitalize">
                        {value}
                      </span>
                    ) : (
                      <button
                        onClick={() => router.push(to)}
                        className="capitalize hover:text-foreground"
                      >
                        {value}
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
          )}

          {settings?.general?.maintenanceMode && !isSuperAdmin(currentUser) ? (
            <div className="ui-card my-4 p-8 text-center">
              <h2 className="ui-title text-2xl">
                Platform Maintenance Mode
              </h2>
              <p className="mx-auto mt-2 max-w-150 text-muted-foreground">
                {settings?.general?.maintenanceMessage ||
                  "OpenNotes is currently undergoing scheduled platform maintenance. Please check back shortly."}
              </p>
            </div>
          ) : (
            <div className="px-0 md:px-2">{children}</div>
          )}
        </div>
      </main>

      {/* Mobile liquid-glass tab bar */}
      {!isViewingNote && (
        <TabBar
          value={MOBILE_TABS.find((t) => pathname === t.value)?.value ?? ""}
          onChange={(v) => router.push(v)}
          tabs={MOBILE_TABS.map((t) => ({
            ...t,
            icon: <t.Icon className="size-5" />,
          }))}
        />
      )}

      <PromptBuilderModal
        open={promptModalOpen}
        onClose={() => setPromptModalOpen(false)}
      />

      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help &amp; Feedback</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Need assistance or have feedback about OpenNotes? We are here to
            help!
          </p>
          <div className="flex flex-col gap-3">
            <div className="ui-card p-4">
              <p className="text-sm font-bold">Documentation &amp; Guides</p>
              <p className="text-xs text-muted-foreground">
                Learn how to make the most of rich text HTML note taking.
              </p>
            </div>
            <div className="ui-card p-4">
              <p className="text-sm font-bold">Contact Support</p>
              <p className="text-xs text-muted-foreground">
                Send us an email at support@opennotes.app
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full" onClick={() => setHelpDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OnboardingWizardModal />
      <InterfaceStyleSync />
    </div>
  );
};

export default AppLayout;
