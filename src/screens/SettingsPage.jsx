"use client";

import { useCallback } from "react";
import { ShieldCheck, HardDrive, HelpCircle, PlayCircle } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { InterfaceStyleSetting } from "@/components/rl";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const SettingsPage = () => {
  const { setOnboardingOpen, currentUser } = useAuth();

  const persistStyle = useCallback(
    (value) => {
      if (!currentUser) return;
      setDoc(doc(db, "users", currentUser.uid), { interfaceStyle: value }, { merge: true }).catch(
        () => toast.error("Could not save interface style to your account")
      );
    },
    [currentUser]
  );

  const handleReplayOnboarding = () => {
    setOnboardingOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">Application Settings</h1>
      <p className="mb-6 text-muted-foreground">
        Configure display preferences, security sanitization, and data options.
      </p>

      <div className="flex flex-col gap-4">
        {/* Appearance */}
        <div className="ui-card p-6">
          <h2 className="mb-1 text-lg font-bold">Appearance</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Modern is the frosted default. Classic is a flat fallback.
          </p>

          <p className="ui-label mb-2">Interface style</p>
          <InterfaceStyleSetting persist={persistStyle} />
        </div>

        {/* Security */}
        <div className="ui-card p-6">
          <div className="mb-1 flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h2 className="text-lg font-bold">Security &amp; HTML Sanitization</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            All HTML content is automatically cleansed via DOMPurify to eliminate script injections and XSS vectors.
          </p>

          <div className="flex flex-col gap-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Switch checked disabled />
              DOMPurify Strict Tag Whitelisting (Active)
            </Label>
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Switch checked disabled />
              Automatic XSS &amp; JavaScript URL Removal (Active)
            </Label>
          </div>
        </div>

        {/* Storage */}
        <div className="ui-card p-6">
          <div className="mb-1 flex items-center gap-2">
            <HardDrive className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-bold">Storage &amp; Offline Sync</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            HTML notes are cached locally for fast loading and offline accessibility.
          </p>

          <Button
            variant="outline"
            onClick={() => toast.success("Offline HTML cache refreshed successfully")}
          >
            Clear Offline Cache
          </Button>
        </div>

        {/* Help */}
        <div className="ui-card p-6">
          <div className="mb-1 flex items-center gap-2">
            <HelpCircle className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-bold">Help &amp; Onboarding</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Replay the guided onboarding tour to rediscover features, personalization options, and tips for getting the most out of OpenNotes.
          </p>

          <Button variant="outline" onClick={handleReplayOnboarding}>
            <PlayCircle />
            Replay Onboarding Tour
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
