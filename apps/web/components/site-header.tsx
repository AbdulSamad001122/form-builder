import { SidebarTrigger } from "~/components/ui/sidebar"
import { Separator } from "~/components/ui/separator"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/dashboard/forms/new"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white transition-all"
            style={{ background: "#1A3D2B" }}
          >
            + New Form
          </Link>
        </div>
      </div>
    </header>
  )
}
