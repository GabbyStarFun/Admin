'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMusic, faHome, faBroadcastTower, faChartLine, faUsers, faCog, faBars } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarItemProps {
  icon: any
  href: string
  label: string
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, href, label }) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        isActive ? "bg-lime-800 text-lime-100" : "text-lime-300 hover:bg-lime-800 hover:text-lime-100"
      }`}
    >
      <FontAwesomeIcon icon={icon} className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  )
}

const sidebarItems: SidebarItemProps[] = [
  { icon: faHome, href: "/staff/home", label: "Dashboard" },
  { icon: faMusic, href: "/staff/requests", label: "Song Requests" },
  { icon: faBroadcastTower, href: "/staff/broadcast", label: "Broadcast" },
  { icon: faChartLine, href: "/staff/analytics", label: "Analytics" },
  { icon: faUsers, href: "/staff/users", label: "User Management" },
  { icon: faCog, href: "/staff/settings", label: "Settings" },
]

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden text-lime-300">
            <FontAwesomeIcon icon={faBars} className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <nav className="flex flex-col h-full bg-lime-950 p-4 space-y-4">
            {sidebarItems.map((item, index) => (
              <SidebarItem key={index} {...item} />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="hidden lg:block w-64 bg-lime-950 p-4 space-y-4">
        <nav className="flex flex-col space-y-4">
          {sidebarItems.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </nav>
      </div>
    </>
  )
}