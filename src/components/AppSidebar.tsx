import {
  Gauge,
  FileText,
  CheckSquare,
  MapPinned,
  HelpCircle,
  Phone,
  MessageCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  role?: "admin" | "member";
}

export function AppSidebar({ role = "admin" }: AppSidebarProps) {
  const { open } = useSidebar();

  const adminLinks = [
    {
      to: "/",
      label: "Dashboard",
      icon: Gauge,
    },
    { to: "/claims", label: "Claims", icon: FileText },
    {
      to: "/verification",
      label: "Verification",
      icon: CheckSquare,
    },
    { to: "/map", label: "Map", icon: MapPinned },
    { to: "/analysis", label: "Analysis", icon: MapPinned },
    {
      to: "/patta",
      label: "Patta Digitalizer",
      icon: MapPinned,
    },
  ];

  const memberLinks = [
    {
      to: "/",
      label: "Dashboard",
      icon: Gauge,
    },
    { to: "/claims", label: "Claims", icon: FileText },
    {
      to: "/verification",
      label: "Verification",
      icon: CheckSquare,
    },
  ];

  const helpLinks = [
    { to: "/faq", label: "FAQ", icon: HelpCircle },
    { to: "/help", label: "Need Help?", icon: MessageCircle },
    { to: "/contact", label: "Contact Us", icon: Phone },
  ];

  const linksToRender = role === "member" ? memberLinks : adminLinks;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="FRA Logo"
              className="w-10 h-10 object-contain"
            />
            {open && (
              <span className="font-bold text-sm tracking-wide text-foreground">
                FRA Digitizer
              </span>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {linksToRender.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-muted"
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {open && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Help & Support Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Help & Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {helpLinks.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.to} className="hover:bg-muted">
                      <item.icon className="h-5 w-5" />
                      {open && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
