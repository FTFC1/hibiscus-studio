"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Car, Tag, Palette, Box, Settings, Users, BarChart3, Home } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Brands",
    href: "/admin/brands",
    icon: Tag,
  },
  {
    title: "Models",
    href: "/admin/models",
    icon: Car,
  },
  {
    title: "Trims",
    href: "/admin/trims",
    icon: Box,
  },
  {
    title: "Colors",
    href: "/admin/colors",
    icon: Palette,
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
            pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
