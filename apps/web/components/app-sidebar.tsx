"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconDashboard,
  IconClipboardText,
  IconSettings,
  IconCompass,
  IconArchive,
  IconPalette,
} from "@tabler/icons-react"

import { NavMain } from "~/components/nav-main"
import { NavSecondary } from "~/components/nav-secondary"
import { NavUser } from "~/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { useUser } from "~/hooks/api/auth"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Forms",
    url: "/dashboard/forms",
    icon: IconClipboardText,
  },
  {
    title: "Explore",
    url: "/dashboard/explore",
    icon: IconCompass,
  },
  {
    title: "Branding",
    url: "/dashboard/branding",
    icon: IconPalette,
  },
  {
    title: "Archive",
    url: "/dashboard/archive",
    icon: IconArchive,
  },
]

const navSecondary = [
  {
    title: "Settings",
    url: "#",
    icon: IconSettings,
  },
]

function FormitLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser() as any

  const userData = {
    name: user?.fullName ?? user?.name ?? "User",
    email: user?.email ?? "",
    avatar: "",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                <FormitLogo />
                <span className="text-base font-semibold" style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: "-0.01em" }}>
                  Formit
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
