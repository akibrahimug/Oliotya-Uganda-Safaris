"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";
import { ImagePicker } from "@/components/cms/image-picker";

interface SiteSettings {
  brand: {
    siteName: string;
    logo: string;
    tagline: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  newsletter: {
    title: string;
    description: string;
  };
  footer: {
    description: string;
    copyright: string;
  };
  meta: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
    ogType: string;
    twitterCard: string;
    favicon: string;
  };
}

export default function CMSSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    brand: { siteName: "", logo: "", tagline: "" },
    contact: { phone: "", email: "", address: "", whatsapp: "" },
    social: { facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "" },
    newsletter: { title: "", description: "" },
    footer: { description: "", copyright: "" },
    meta: { title: "", description: "", keywords: "", ogImage: "", ogType: "website", twitterCard: "summary_large_image", favicon: "" },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<"logo" | "ogImage">("logo");
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/cms/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();

      // Transform array of settings into structured object
      const transformedSettings: SiteSettings = {
        brand: { siteName: "", logo: "", tagline: "" },
        contact: { phone: "", email: "", address: "", whatsapp: "" },
        social: { facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "" },
        newsletter: { title: "", description: "" },
        footer: { description: "", copyright: "" },
        meta: { title: "", description: "", keywords: "", ogImage: "", ogType: "website", twitterCard: "summary_large_image", favicon: "" },
      };

      data.settings.forEach((setting: any) => {
        if (setting.key in transformedSettings) {
          transformedSettings[setting.key as keyof SiteSettings] = setting.value;
        }
      });

      setSettings(transformedSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (category: keyof SiteSettings) => {
    setSaving(true);
    try {
      const response = await fetch("/api/cms/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: category,
          value: settings[category],
          category,
        }),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      toast({
        title: "Success",
        description: `${category.charAt(0).toUpperCase() + category.slice(1)} settings saved successfully`,
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (
    category: keyof SiteSettings,
    field: string,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">
          Manage your website's branding, contact information, and social media links
        </p>
      </div>

      <Tabs defaultValue="brand" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="meta">SEO/Meta</TabsTrigger>
        </TabsList>

        {/* Brand Tab */}
        <TabsContent value="brand">
          <Card>
            <CardHeader>
              <CardTitle>Brand Settings</CardTitle>
              <CardDescription>
                Manage your site name, logo, and tagline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.brand.siteName}
                  onChange={(e) => updateSetting("brand", "siteName", e.target.value)}
                  placeholder="Oliotya Uganda Safaris"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex gap-4 items-start">
                  {settings.brand.logo && (
                    <img
                      src={settings.brand.logo}
                      alt="Logo"
                      className="w-20 h-20 rounded-lg object-cover border"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <Input
                      id="logo"
                      value={settings.brand.logo}
                      onChange={(e) => updateSetting("brand", "logo", e.target.value)}
                      placeholder="Logo URL"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePickerTarget("logo");
                        setImagePickerOpen(true);
                      }}
                      className="w-full"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose from Gallery
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.brand.tagline}
                  onChange={(e) => updateSetting("brand", "tagline", e.target.value)}
                  placeholder="Experience the Pearl of Africa"
                />
              </div>

              <Button
                onClick={() => handleSave("brand")}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Brand Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Update your contact details displayed in the header and footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.contact.phone}
                    onChange={(e) => updateSetting("contact", "phone", e.target.value)}
                    placeholder="+256 788048210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={settings.contact.whatsapp}
                    onChange={(e) => updateSetting("contact", "whatsapp", e.target.value)}
                    placeholder="+256 788048210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.contact.email}
                  onChange={(e) => updateSetting("contact", "email", e.target.value)}
                  placeholder="info@oliotyasafaris.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Office Address</Label>
                <Input
                  id="address"
                  value={settings.contact.address}
                  onChange={(e) => updateSetting("contact", "address", e.target.value)}
                  placeholder="Kampala, Uganda"
                />
              </div>

              <Button
                onClick={() => handleSave("contact")}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Contact Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Add your social media profile URLs (leave empty to hide)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  value={settings.social.facebook}
                  onChange={(e) => updateSetting("social", "facebook", e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  value={settings.social.instagram}
                  onChange={(e) => updateSetting("social", "instagram", e.target.value)}
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X URL</Label>
                <Input
                  id="twitter"
                  value={settings.social.twitter}
                  onChange={(e) => updateSetting("social", "twitter", e.target.value)}
                  placeholder="https://twitter.com/yourprofile"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={settings.social.linkedin}
                  onChange={(e) => updateSetting("social", "linkedin", e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input
                  id="youtube"
                  value={settings.social.youtube}
                  onChange={(e) => updateSetting("social", "youtube", e.target.value)}
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>

              <Button
                onClick={() => handleSave("social")}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Social Media Links
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Newsletter Tab */}
        <TabsContent value="newsletter">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Section</CardTitle>
              <CardDescription>
                Customize the newsletter signup section in the footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newsletterTitle">Newsletter Title</Label>
                <Input
                  id="newsletterTitle"
                  value={settings.newsletter.title}
                  onChange={(e) => updateSetting("newsletter", "title", e.target.value)}
                  placeholder="Subscribe to Our Newsletter"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newsletterDescription">Description</Label>
                <Textarea
                  id="newsletterDescription"
                  value={settings.newsletter.description}
                  onChange={(e) =>
                    updateSetting("newsletter", "description", e.target.value)
                  }
                  placeholder="Get exclusive travel tips..."
                  rows={3}
                />
              </div>

              <Button
                onClick={() => handleSave("newsletter")}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Newsletter Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Tab */}
        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Footer Settings</CardTitle>
              <CardDescription>
                Customize your footer content and copyright text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="footerDescription">Footer Description</Label>
                <Textarea
                  id="footerDescription"
                  value={settings.footer.description}
                  onChange={(e) =>
                    updateSetting("footer", "description", e.target.value)
                  }
                  placeholder="Experience the Pearl of Africa..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="copyright">Copyright Text</Label>
                <Input
                  id="copyright"
                  value={settings.footer.copyright}
                  onChange={(e) => updateSetting("footer", "copyright", e.target.value)}
                  placeholder="© 2025 Oliotya Uganda Safaris. All rights reserved."
                />
              </div>

              <Button
                onClick={() => handleSave("footer")}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Footer Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO/Meta Tab */}
        <TabsContent value="meta">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Meta Settings</CardTitle>
              <CardDescription>
                Manage your site's metadata for search engines and social media sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Page Title</Label>
                <Input
                  id="metaTitle"
                  value={settings.meta.title}
                  onChange={(e) => updateSetting("meta", "title", e.target.value)}
                  placeholder="Oliotya Uganda Safaris - Discover Uganda"
                />
                <p className="text-xs text-muted-foreground">
                  This appears in browser tabs and search results (50-60 characters recommended)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.meta.description}
                  onChange={(e) => updateSetting("meta", "description", e.target.value)}
                  placeholder="Experience the Pearl of Africa with Oliotya Uganda Safaris..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Brief summary for search results (150-160 characters recommended)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={settings.meta.keywords}
                  onChange={(e) => updateSetting("meta", "keywords", e.target.value)}
                  placeholder="Uganda safaris, Uganda tours, wildlife safaris, gorilla trekking"
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated keywords for search engines
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">Open Graph Image (Social Media)</Label>
                <div className="flex gap-4 items-start">
                  {settings.meta.ogImage && (
                    <img
                      src={settings.meta.ogImage}
                      alt="OG Image"
                      className="w-40 h-24 rounded-lg object-cover border"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <Input
                      id="ogImage"
                      value={settings.meta.ogImage}
                      onChange={(e) => updateSetting("meta", "ogImage", e.target.value)}
                      placeholder="Image URL for social media sharing"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePickerTarget("ogImage");
                        setImagePickerOpen(true);
                      }}
                      className="w-full"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Choose from Gallery
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 1200x630px for best social media display
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ogType">Open Graph Type</Label>
                  <Input
                    id="ogType"
                    value={settings.meta.ogType}
                    onChange={(e) => updateSetting("meta", "ogType", e.target.value)}
                    placeholder="website"
                  />
                  <p className="text-xs text-muted-foreground">
                    Usually "website" for most pages
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitterCard">Twitter Card Type</Label>
                  <Input
                    id="twitterCard"
                    value={settings.meta.twitterCard}
                    onChange={(e) => updateSetting("meta", "twitterCard", e.target.value)}
                    placeholder="summary_large_image"
                  />
                  <p className="text-xs text-muted-foreground">
                    Usually "summary_large_image" for images
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon Path</Label>
                <Input
                  id="favicon"
                  value={settings.meta.favicon}
                  onChange={(e) => updateSetting("meta", "favicon", e.target.value)}
                  placeholder="/fox_logo.webp"
                />
                <p className="text-xs text-muted-foreground">
                  Path to your favicon image (relative to public folder)
                </p>
              </div>

              <Button
                onClick={() => handleSave("meta")}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save SEO Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Picker Modal */}
      <ImagePicker
        open={imagePickerOpen}
        onClose={() => setImagePickerOpen(false)}
        onSelect={(imageUrl) => {
          if (imagePickerTarget === "logo") {
            updateSetting("brand", "logo", imageUrl);
          } else {
            updateSetting("meta", "ogImage", imageUrl);
          }
          setImagePickerOpen(false);
        }}
      />
    </div>
  );
}
