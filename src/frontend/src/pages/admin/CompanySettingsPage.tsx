import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Facebook,
  Globe,
  Instagram,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Receipt,
  Save,
  Twitter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { CompanySettings } from "../../backend.d.ts";
import {
  useGetCallerUserProfile,
  useGetCompanySettings,
  useSaveCompanySettings,
} from "../../hooks/useQueries";
import { companyStore } from "../../lib/companyStore";

const defaultSettings: CompanySettings = {
  companyName: "Memorable Holidays",
  logo: "",
  tagline: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  twitter: "",
  gstNumber: "",
};

export default function CompanySettingsPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const isAdmin = userProfile?.role === "admin";

  const { data: backendSettings, isLoading } = useGetCompanySettings();
  const { mutateAsync: saveSettings, isPending: isSaving } =
    useSaveCompanySettings();

  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (userProfile && !isAdmin) navigate({ to: "/" });
  }, [userProfile, isAdmin, navigate]);

  useEffect(() => {
    if (!isLoading) {
      if (backendSettings) {
        setSettings(backendSettings);
      } else {
        // Try to migrate from local store
        const local = companyStore.get();
        setSettings((prev) => ({
          ...prev,
          companyName: local.name || "Memorable Holidays",
          address: local.address || "",
          phone: local.phone || "",
          email: local.email || "",
          website: local.website || "",
          whatsapp: local.whatsapp || "",
          instagram: local.instagram || "",
          facebook: local.facebook || "",
          twitter: local.twitter || "",
        }));
      }
      setIsReady(true);
    }
  }, [isLoading, backendSettings]);

  const update = (key: keyof CompanySettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      // Also update local store for Header display
      companyStore.set({
        name: settings.companyName,
        logoUrl: settings.logo,
        whatsapp: settings.whatsapp,
        email: settings.email,
        instagram: settings.instagram,
        twitter: settings.twitter,
        facebook: settings.facebook,
        address: settings.address,
        phone: settings.phone,
        website: settings.website,
      });
      toast.success("Company settings saved!");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  if (!isAdmin) return null;

  if (isLoading || !isReady) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Company Settings
        </h2>
        <p className="text-sm text-muted-foreground font-sans">
          Configure your company details. These will appear on all package
          templates and shared materials.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="xl:col-span-2 space-y-6">
          {/* Company Identity */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal" />
                Company Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="font-sans text-xs">Company Name</Label>
                <Input
                  value={settings.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  placeholder="Memorable Holidays"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-sans text-xs">Tagline</Label>
                <Input
                  value={settings.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                  placeholder="Creating memories one journey at a time"
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-sans text-xs">Logo URL</Label>
                <Input
                  value={settings.logo}
                  onChange={(e) => update("logo", e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="font-sans text-sm"
                />
                <p className="text-xs text-muted-foreground font-sans">
                  Enter a public URL for your logo image
                </p>
              </div>
              <div className="space-y-1">
                <Label className="font-sans text-xs">Address</Label>
                <Textarea
                  value={settings.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="123 Travel Street, Mumbai, India"
                  rows={2}
                  className="font-sans text-sm resize-none"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-sans text-xs">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={settings.website}
                    onChange={(e) => update("website", e.target.value)}
                    placeholder="www.memorableholidays.com"
                    className="pl-9 font-sans text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="font-sans text-xs">GST Number</Label>
                <div className="relative">
                  <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={settings.gstNumber}
                    onChange={(e) => update("gstNumber", e.target.value)}
                    placeholder="27XXXXX1234Z5"
                    className="pl-9 font-sans text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Phone className="w-5 h-5 text-teal" />
                Contact Details
              </CardTitle>
              <CardDescription className="font-sans text-xs">
                These will be shown on all package templates and share messages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="font-sans text-xs">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={settings.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="pl-9 font-sans text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="font-sans text-xs">WhatsApp Number</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={settings.whatsapp}
                    onChange={(e) => update("whatsapp", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="pl-9 font-sans text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="font-sans text-xs">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="info@memorableholidays.com"
                    className="pl-9 font-sans text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="premium-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Instagram className="w-5 h-5 text-teal" />
                Social Media Handles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="font-sans text-xs">Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={settings.instagram}
                    onChange={(e) => update("instagram", e.target.value)}
                    placeholder="@memorableholidays"
                    className="pl-9 font-sans text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="font-sans text-xs">Twitter / X</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={settings.twitter}
                    onChange={(e) => update("twitter", e.target.value)}
                    placeholder="@memorableholidays"
                    className="pl-9 font-sans text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="font-sans text-xs">Facebook</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={settings.facebook}
                    onChange={(e) => update("facebook", e.target.value)}
                    placeholder="facebook.com/memorableholidays"
                    className="pl-9 font-sans text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full gradient-gold text-sidebar font-display font-bold py-3 text-base shadow-gold"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Company Settings
          </Button>
        </div>

        {/* Preview Card */}
        <div className="xl:col-span-1">
          <div className="sticky top-36">
            <p className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Preview
            </p>
            <Card className="premium-card border-gold/20">
              <CardContent className="pt-5 space-y-4">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  {settings.logo ? (
                    <img
                      src={settings.logo}
                      alt="Company logo"
                      className="w-14 h-14 rounded-xl object-contain border border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-gold/60" />
                    </div>
                  )}
                  <div>
                    <p className="font-display font-bold text-foreground text-lg leading-tight">
                      {settings.companyName || "Company Name"}
                    </p>
                    {settings.tagline && (
                      <p className="text-xs font-sans text-muted-foreground mt-0.5">
                        {settings.tagline}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm font-sans">
                  {settings.address && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-0.5">📍</span>
                      <span className="text-xs">{settings.address}</span>
                    </div>
                  )}
                  {settings.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Phone className="w-3 h-3 shrink-0" />
                      {settings.phone}
                    </div>
                  )}
                  {settings.whatsapp && (
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <MessageCircle className="w-3 h-3 shrink-0" />
                      {settings.whatsapp}
                    </div>
                  )}
                  {settings.email && (
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Mail className="w-3 h-3 shrink-0" />
                      {settings.email}
                    </div>
                  )}
                  {settings.website && (
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Globe className="w-3 h-3 shrink-0" />
                      {settings.website}
                    </div>
                  )}
                </div>

                {(settings.instagram ||
                  settings.twitter ||
                  settings.facebook) && (
                  <>
                    <Separator />
                    <div className="flex gap-3 text-xs text-muted-foreground font-sans flex-wrap">
                      {settings.instagram && (
                        <span className="flex items-center gap-1">
                          <Instagram className="w-3 h-3" />
                          {settings.instagram}
                        </span>
                      )}
                      {settings.twitter && (
                        <span className="flex items-center gap-1">
                          <Twitter className="w-3 h-3" />
                          {settings.twitter}
                        </span>
                      )}
                      {settings.facebook && (
                        <span className="flex items-center gap-1">
                          <Facebook className="w-3 h-3" />
                          {settings.facebook}
                        </span>
                      )}
                    </div>
                  </>
                )}

                {settings.gstNumber && (
                  <p className="text-[10px] font-mono text-muted-foreground pt-2 border-t border-border">
                    GST: {settings.gstNumber}
                  </p>
                )}
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground font-sans mt-3 text-center">
              This preview shows how your company details will appear on
              packages
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
