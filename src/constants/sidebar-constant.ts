import { Album, Armchair, LayoutDashboard, SquareMenu, Users } from "lucide-react";

export const SIDEBAR_MENU_LIST = {
    admin: [
    {
        title: 'ダッシュボード',
        url: '/admin',
        icon: LayoutDashboard,
    },

    {
        title: '注文 | Order',
        url: '/order',
        icon: Album,
    },

    {
        title: 'メニュー | Menu',
        url: '/admin/menu',
        icon: SquareMenu,
    },

    {
        title: 'テーブル | Table',
        url: '/admin/table',
        icon: Armchair,
    },

    {
        title: 'ユーザー | User',
        url: '/admin/user',
        icon: Users,
    },
  ],

  cashier: [
    {
        title: '注文 | Order',
        url: '/order',
        icon: Album,
    },
  ],
  kitchen: [
    {
        title: '注文 | Order',
        url: '/order',
        icon: Album,
    },
  ],

};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;