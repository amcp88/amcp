import { useLocation, Link } from "wouter";
import { 
  FileText, Building2, BarChart3, Settings, ChevronLeft, ChevronRight,
  FileArchive, File, LayoutDashboard, Users
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ isOpen, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const mainNavItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, badge: null },
    { path: "/documents", label: "Dokumen", icon: <FileText className="h-5 w-5" />, badge: "9+" },
    { path: "/projects", label: "Proyek", icon: <Building2 className="h-5 w-5" />, badge: null },
  ];
  
  const secondaryNavItems = [
    { path: "/reports", label: "Laporan", icon: <BarChart3 className="h-5 w-5" />, badge: null },
    { path: "/templates", label: "Template", icon: <File className="h-5 w-5" />, badge: "Baru" },
    { path: "/archives", label: "Arsip", icon: <FileArchive className="h-5 w-5" />, badge: null },
    { path: "/teams", label: "Tim", icon: <Users className="h-5 w-5" />, badge: null },
    { path: "/settings", label: "Pengaturan", icon: <Settings className="h-5 w-5" />, badge: null },
  ];

  const renderNavItem = (item: typeof mainNavItems[0], isCollapsedView: boolean) => {
    const isActive = location === item.path;
    
    // Collapsed view with tooltip
    if (isCollapsedView) {
      return (
        <TooltipProvider key={item.path}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Link 
                  href={item.path}
                  className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-gold text-gray-900' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                </Link>
                {item.badge && (
                  <Badge 
                    className={`absolute -top-1.5 -right-1.5 px-1.5 py-px text-[10px] font-semibold ${
                      typeof item.badge === 'string' && (item.badge === 'Baru' || item.badge === 'New') 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gold text-gray-900'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    // Expanded view
    return (
      <Link 
        key={item.path} 
        href={item.path}
        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
          isActive ? 'bg-gold text-gray-900' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <span className="mr-3 flex-shrink-0">{item.icon}</span>
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <Badge 
            className={`ml-2 ${
              typeof item.badge === 'string' && (item.badge === 'Baru' || item.badge === 'New') 
                ? 'bg-green-500 text-white' 
                : 'bg-gold text-gray-900'
            }`}
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out bg-gray-900 text-white ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${isCollapsed && !isMobile ? 'md:w-20' : 'md:w-64'} ${isMobile ? 'w-64' : 'w-64'}`}
    >
      <div className="flex flex-col h-full relative">
        {/* Toggle collapse button (hidden on mobile) */}
        {!isMobile && (
          <button 
            onClick={onToggleCollapse}
            className="absolute -right-3 top-20 bg-gold hover:bg-gold-dark text-gray-900 rounded-full p-1 shadow-md hidden md:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? 
              <ChevronRight className="h-4 w-4" /> : 
              <ChevronLeft className="h-4 w-4" />
            }
          </button>
        )}

        {/* Logo area */}
        <div className={`flex items-center h-20 bg-gray-800 px-6 ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center w-full' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-gray-900 text-xl font-bold">E</span>
            </div>
            {(!isCollapsed || isMobile) && (
              <h1 className="text-gold font-heading font-bold text-xl tracking-wide">EDMS</h1>
            )}
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          {/* Main navigation section */}
          <div className={`${isCollapsed && !isMobile ? 'px-2' : 'px-4'} space-y-1`}>
            {mainNavItems.map((item) => (
              <div key={item.path}>
                {renderNavItem(item, isCollapsed && !isMobile)}
              </div>
            ))}
          </div>
          
          {/* Divider */}
          <div className={`my-4 ${isCollapsed && !isMobile ? 'mx-2' : 'mx-4'}`}>
            <div className="border-t border-gray-700"></div>
          </div>
          
          {/* Secondary navigation section */}
          <div className={`${isCollapsed && !isMobile ? 'px-2' : 'px-4'} space-y-1`}>
            {secondaryNavItems.map((item) => (
              <div key={item.path}>
                {renderNavItem(item, isCollapsed && !isMobile)}
              </div>
            ))}
          </div>
        </div>

        {/* User profile section */}
        <div className={`p-4 border-t border-gray-700 ${isCollapsed && !isMobile ? 'flex justify-center' : ''}`}>
          {isCollapsed && !isMobile ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center cursor-pointer">
                    <span className="text-gray-900 font-semibold">AS</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div>
                    <p className="font-medium">Admin Sistem</p>
                    <p className="text-xs">Administrator</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-900 font-semibold">AS</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin Sistem</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
