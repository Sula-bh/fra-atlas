import { User, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface NavbarProps {
  title?: string;
  username?: string;
  onLogout?: () => void;
}

export default function Navbar({
  title = "Admin Panel",
  username = "SDLC User",
  onLogout,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔒 Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center mb-8 relative">
      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>

      {/* Profile Section */}
      <div
        ref={dropdownRef}
        className="relative flex items-center gap-2 cursor-pointer select-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <User size={20} className="text-foreground" />
        <span className="text-foreground font-medium">{username}</span>
        <ChevronDown size={16} className="text-muted-foreground" />

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 bg-popover border border-border rounded-md shadow-lg w-44 z-[1000]">
            <button className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-muted">
              Profile
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-muted">
              Settings
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-muted">
              Help / Support
            </button>
            <hr className="border-border" />
            <button
              className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
