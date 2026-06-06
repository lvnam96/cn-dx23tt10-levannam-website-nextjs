'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Landmark, DoorOpen, Images, Users, Mail, ExternalLink } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';

const ITEMS = [
  { href: '/admin', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Bài viết', icon: FileText },
  { href: '/admin/artifacts', label: 'Hiện vật', icon: Landmark },
  { href: '/admin/rooms', label: 'Phòng', icon: DoorOpen },
  { href: '/admin/exhibitions', label: 'Triển lãm', icon: Images },
  { href: '/admin/tours', label: 'Đoàn tham quan', icon: Users },
  { href: '/admin/contacts', label: 'Liên hệ', icon: Mail },
];

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <p className="font-heading text-base font-bold leading-tight">Đền thờ Bác</p>
        <p className="text-xs text-muted-foreground">Trang quản trị</p>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(pathname, item.href)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                <span>Xem trang web</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
