'use client';

import { Button } from '@/components/ui/button';
import { SidebarMenuKey } from '@/constants/sidebar-constant';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';

export default function Home() {

  const profile = useAuthStore((state) => state.profile);

  const roleKey = profile.role?.toLocaleLowerCase() as SidebarMenuKey;

  return (
    <div className="bg-muted flex justify-center items-center h-screen flex-col space-y-4">
      <h1 className="text-4xl font-semibold"> カフェメイド | Maid Cafe </h1>
      <Link href={roleKey === 'admin' ? '/admin' : '/order'}>
        <Button className="bg-pink-500 text-white top-10">ダッシュボードにアクセスする</Button>
      </Link>
    </div>
  );
}
