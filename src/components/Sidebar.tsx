import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building,
  Hammer,
  Car,
  Users,
  Calculator,
  Settings,
  Menu,
  X,
  Home
} from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Building, label: "Immobilier", path: "/immobilier" },
  { icon: Hammer, label: "BTP", path: "/btp" },
  { icon: Car, label: "Véhicules", path: "/vehicules" },
  { icon: Users, label: "Personnel", path: "/personnel" },
  { icon: Calculator, label: "Comptabilité", path: "/comptabilite" },
  { icon: BarChart3, label: "Rapports", path: "/rapports" },
  { icon: Settings, label: "Paramètres", path: "/parametres" }
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "flex flex-col h-screen bg-gradient-nav border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-nav-hover">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/8bd9de9e-3ee4-45c5-b5cf-958fb5f666c8.png" 
              alt="FADEM Logo" 
              className="w-8 h-8 object-contain"
            />
            <div className="text-nav-foreground">
              <h2 className="font-bold text-lg">FADEM</h2>
              <p className="text-xs opacity-80">SARL-U</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-nav-hover text-nav-foreground transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-nav-active text-white shadow-fadem" 
                  : "text-nav-foreground hover:bg-nav-hover hover:text-white",
                isCollapsed && "justify-center"
              )}
            >
              <Icon size={20} className={cn(
                "transition-colors",
                isActive && "text-white"
              )} />
              {!isCollapsed && (
                <span className="font-medium group-hover:translate-x-1 transition-transform">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-nav-hover">
        {!isCollapsed && (
          <div className="text-center text-nav-foreground opacity-70">
            <p className="text-xs">© 2025 FADEM SARL-U</p>
            <p className="text-xs mt-1">Gestion Intégrée</p>
          </div>
        )}
      </div>
    </div>
  );
};