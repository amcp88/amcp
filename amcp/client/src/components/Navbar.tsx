import { useState } from "react";
import { Search, Bell, HelpCircle, Menu, X, File, Building2, BarChart, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation, Link } from "wouter";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  onMobileMenuToggle: () => void;
}

export default function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location] = useLocation();

  // Get current page title
  const getPageTitle = () => {
    switch(location) {
      case "/": return "Dashboard";
      case "/documents": return "Dokumen";
      case "/projects": return "Proyek";
      case "/reports": return "Laporan";
      case "/settings": return "Pengaturan";
      default: return "EDMS";
    }
  };

  const mobileNavItems = [
    { path: "/", label: "Dashboard", icon: <Menu className="h-5 w-5" /> },
    { path: "/documents", label: "Dokumen", icon: <File className="h-5 w-5" /> },
    { path: "/projects", label: "Proyek", icon: <Building2 className="h-5 w-5" /> },
    { path: "/reports", label: "Laporan", icon: <BarChart className="h-5 w-5" /> },
    { path: "/settings", label: "Pengaturan", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button 
              onClick={onMobileMenuToggle}
              className="md:hidden text-gray-900 inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page title - visible on desktop, hidden when search is active */}
            {!searchActive && (
              <h1 className="ml-2 md:ml-0 text-lg md:text-xl font-heading font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            )}
          </div>

          {/* Search toggle on mobile */}
          <button 
            onClick={() => setSearchActive(!searchActive)}
            className="md:hidden text-gray-600 p-2 rounded-full hover:bg-gray-100"
            aria-label={searchActive ? "Close search" : "Open search"}
          >
            {searchActive ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          {/* Search bar - expanded on mobile when active, always visible on desktop */}
          <div className={`${searchActive ? 'absolute inset-x-0 top-0 px-4 py-3 bg-white z-50 flex items-center' : 'hidden'} md:relative md:block md:max-w-md md:w-full`}>
            {searchActive && (
              <button
                onClick={() => setSearchActive(false)}
                className="mr-3 md:hidden"
                aria-label="Close search"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Cari dokumen, proyek, laporan..." 
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-gold focus:border-gold text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right menu */}
          <div className={`flex items-center gap-3 ${searchActive ? 'hidden md:flex' : 'flex'}`}>
            {/* Quick access menu (visible on desktop) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex text-gray-700 px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50 items-center gap-2">
                  <span>Menu Cepat</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {mobileNavItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link href={item.path} className="flex items-center cursor-pointer">
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative text-gray-600 p-1.5 rounded-full hover:bg-gray-100" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 px-1.5 py-px text-[10px] font-semibold bg-gold text-gray-900">3</Badge>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="p-2 text-sm font-medium text-gray-900 border-b">Notifikasi</div>
                <div className="py-2 px-3 text-sm">
                  <div className="py-2 border-b border-gray-100">
                    <p className="font-medium">Dokumen baru ditambahkan</p>
                    <p className="text-xs text-gray-500">2 menit yang lalu</p>
                  </div>
                  <div className="py-2 border-b border-gray-100">
                    <p className="font-medium">Proyek diperbarui</p>
                    <p className="text-xs text-gray-500">1 jam yang lalu</p>
                  </div>
                  <div className="py-2">
                    <p className="font-medium">Permintaan persetujuan</p>
                    <p className="text-xs text-gray-500">3 jam yang lalu</p>
                  </div>
                </div>
                <DropdownMenuItem className="justify-center cursor-pointer text-gold-dark font-medium">
                  Lihat semua notifikasi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-600 p-1.5 rounded-full hover:bg-gray-100" aria-label="Help and support">
                  <HelpCircle className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  <span>Panduan Pengguna</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>FAQ</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Hubungi Dukungan</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
