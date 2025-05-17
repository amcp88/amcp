import { useState } from 'react';
import { Save, Database, Cloud, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [googleDriveClientId, setGoogleDriveClientId] = useState('');
  const [googleDriveClientSecret, setGoogleDriveClientSecret] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [useHybridStorage, setUseHybridStorage] = useState(true);
  const [useAIAnalysis, setUseAIAnalysis] = useState(true);
  const [documentSizeLimitMB, setDocumentSizeLimitMB] = useState(10);
  
  const { toast } = useToast();

  const handleSaveSupabaseSettings = () => {
    // Save Supabase settings
    toast({
      title: "Pengaturan Supabase disimpan",
      description: "Pengaturan Supabase telah berhasil diperbarui.",
      variant: "default",
    });
  };

  const handleSaveGoogleDriveSettings = () => {
    // Save Google Drive settings
    toast({
      title: "Pengaturan Google Drive disimpan",
      description: "Pengaturan Google Drive telah berhasil diperbarui.",
      variant: "default",
    });
  };

  const handleSaveOpenAISettings = () => {
    // Save OpenAI settings
    toast({
      title: "Pengaturan OpenAI disimpan",
      description: "Pengaturan OpenAI telah berhasil diperbarui.",
      variant: "default",
    });
  };

  const handleSaveGeneralSettings = () => {
    // Save general settings
    toast({
      title: "Pengaturan umum disimpan",
      description: "Pengaturan umum telah berhasil diperbarui.",
      variant: "default",
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-richblack">Pengaturan</h1>
        <p className="mt-1 text-sm text-gray-600">Konfigurasikan pengaturan sistem</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-8 grid grid-cols-4 mx-auto max-w-md">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="supabase">Supabase</TabsTrigger>
          <TabsTrigger value="google-drive">Google Drive</TabsTrigger>
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Umum</CardTitle>
              <CardDescription>
                Konfigurasi pengaturan umum sistem manajemen dokumen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="hybrid-storage">Penyimpanan Hybrid</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan penyimpanan hybrid (Supabase/Google Drive)
                    </p>
                  </div>
                  <Switch
                    id="hybrid-storage"
                    checked={useHybridStorage}
                    onCheckedChange={setUseHybridStorage}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ai-analysis">Analisis AI</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktifkan analisis dokumen menggunakan OpenAI
                    </p>
                  </div>
                  <Switch
                    id="ai-analysis"
                    checked={useAIAnalysis}
                    onCheckedChange={setUseAIAnalysis}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document-size-limit">Batasan Ukuran Dokumen (MB)</Label>
                  <Input
                    id="document-size-limit"
                    type="number"
                    min="1"
                    max="50"
                    value={documentSizeLimitMB}
                    onChange={(e) => setDocumentSizeLimitMB(parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Dokumen lebih besar dari nilai ini akan disimpan di Google Drive
                  </p>
                </div>
              </div>

              <Button 
                className="bg-gold hover:bg-gold-dark text-white" 
                onClick={handleSaveGeneralSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supabase Settings */}
        <TabsContent value="supabase">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Supabase</CardTitle>
              <CardDescription>
                Konfigurasikan koneksi ke Supabase untuk penyimpanan data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url">URL Supabase</Label>
                  <Input
                    id="supabase-url"
                    placeholder="https://your-project.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supabase-key">API Key Supabase</Label>
                  <Input
                    id="supabase-key"
                    type="password"
                    placeholder="supabase-anon-key"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                  />
                </div>

                <div className="flex items-center p-4 bg-amber-50 text-amber-800 rounded-md">
                  <Database className="h-5 w-5 mr-2" />
                  <p className="text-sm">
                    Pastikan Anda telah menyiapkan tabel dan bucket penyimpanan di Supabase
                  </p>
                </div>
              </div>

              <Button 
                className="bg-gold hover:bg-gold-dark text-white" 
                onClick={handleSaveSupabaseSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan Supabase
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Google Drive Settings */}
        <TabsContent value="google-drive">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Google Drive</CardTitle>
              <CardDescription>
                Konfigurasikan koneksi ke Google Drive untuk penyimpanan file besar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google-client-id">Google Client ID</Label>
                  <Input
                    id="google-client-id"
                    placeholder="your-client-id.apps.googleusercontent.com"
                    value={googleDriveClientId}
                    onChange={(e) => setGoogleDriveClientId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google-client-secret">Google Client Secret</Label>
                  <Input
                    id="google-client-secret"
                    type="password"
                    placeholder="client-secret"
                    value={googleDriveClientSecret}
                    onChange={(e) => setGoogleDriveClientSecret(e.target.value)}
                  />
                </div>

                <div className="flex items-center p-4 bg-amber-50 text-amber-800 rounded-md">
                  <Cloud className="h-5 w-5 mr-2" />
                  <p className="text-sm">
                    Buat OAuth 2.0 credentials di Google Cloud Console dan aktifkan Google Drive API
                  </p>
                </div>
              </div>

              <Button 
                className="bg-gold hover:bg-gold-dark text-white" 
                onClick={handleSaveGoogleDriveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan Google Drive
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OpenAI Settings */}
        <TabsContent value="openai">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan OpenAI</CardTitle>
              <CardDescription>
                Konfigurasikan koneksi ke OpenAI untuk analisis dokumen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-api-key">API Key OpenAI</Label>
                  <Input
                    id="openai-api-key"
                    type="password"
                    placeholder="sk-..."
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openai-prompt">Prompt OCR & Ringkasan</Label>
                  <Textarea
                    id="openai-prompt"
                    placeholder="Prompt untuk OCR dan ringkasan dokumen"
                    rows={3}
                    defaultValue="Analisis dokumen ini, ekstrak informasi penting, dan berikan ringkasan singkat dalam bahasa Indonesia."
                  />
                </div>

                <div className="flex items-center p-4 bg-amber-50 text-amber-800 rounded-md">
                  <Key className="h-5 w-5 mr-2" />
                  <p className="text-sm">
                    API Key OpenAI akan digunakan untuk OCR, ringkasan, dan kategorisasi dokumen
                  </p>
                </div>
              </div>

              <Button 
                className="bg-gold hover:bg-gold-dark text-white" 
                onClick={handleSaveOpenAISettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan OpenAI
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
