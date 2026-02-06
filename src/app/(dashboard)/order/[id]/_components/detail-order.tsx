'use client';

import Image from 'next/image';
import Link from 'next/link';
import { startTransition, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EllipsisVertical } from 'lucide-react';
import { toast } from 'sonner';

import DataTable from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { HEADER_TABLE_DETAIL_ORDER } from '@/constants/order-constant';
import { SidebarMenuKey } from '@/constants/sidebar-constant';

import useDataTable from '@/hooks/use-datatable';
import { useAuthStore } from '@/stores/auth-store';

import { cn, convertJPY } from '@/lib/utils';
import { createClientSupabase } from '@/lib/supabase/default';

import Summary from './summary';
import { updateStatusOrderItem } from '../../action';

export default function DetailOrder({ id }: { id: string }) {
  const supabase = createClientSupabase();

  const {
    currentPage,
    currentLimit,
    handleChangePage,
    handleChangeLimit,
  } = useDataTable();

  const profile = useAuthStore((state) => state.profile);
  const roleKey = profile.role?.toLowerCase() as SidebarMenuKey;

  const { data: order } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const result = await supabase
        .from('orders')
        .select('id, customer_name, status, payment_token, tables ( name, id )')
        .eq('order_id', id)
        .single();

      if (result.error) {
        toast.error('注文データの取得に失敗しました', {
          description: result.error.message,
        });
      }

      return result.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!order?.id) return;

    const channel = supabase
      .channel('change-order')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders_menus',
          filter: `order_id=eq.${order.id}`,
        },
        () => {
          refetchOrderMenu();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.id]);

  const {
    data: orderMenu,
    isLoading: isLoadingOrderMenu,
    refetch: refetchOrderMenu,
  } = useQuery({
    queryKey: ['orders_menu', order?.id, currentPage, currentLimit],
    queryFn: async () => {
      const result = await supabase
        .from('orders_menus')
        .select('*, menus ( id, name, image_url, price )', { count: 'exact' })
        .eq('order_id', order?.id)
        .order('status');

      if (result.error) {
        toast.error('注文データの取得に失敗しました', {
          description: result.error.message,
        });
      }

      return result;
    },
    enabled: !!order?.id,
  });

  const handleUpdateStatusOrder = (data: { id: string; status: string }) => {
    startTransition(async () => {
      try {
        await updateStatusOrderItem(data.id, data.status);
        toast.success('ステータスの更新 注文成功');
      } catch {
        toast.error('ステータスの更新注文に失敗しました');
      }
    });
  };

  const filteredData = useMemo(() => {
    return (orderMenu?.data || []).map((item, index) => [
      currentLimit * (currentPage - 1) + index + 1,

      <div key={`menu-${item.id}`} className="flex items-center gap-2">
        <Image
          src={item.menus.image_url}
          alt={item.menus.name}
          width={40}
          height={40}
          className="rounded"
        />
        <div className="flex flex-col">
          {item.menus.name} x {item.quantity}
          <span className="text-xs text-muted-foreground">
            {item.notes || 'メモなし'}
          </span>
        </div>
      </div>,

      <div>{convertJPY(item.menus.price * item.quantity)}</div>,

      <div
        className={cn(
          'px-2 py-1 rounded-full text-white w-fit capitalize',
          {
            'bg-gray-500': item.status === 'pending',
            'bg-yellow-500': item.status === 'process',
            'bg-blue-500': item.status === 'ready',
            'bg-green-500': item.status === 'served',
          }
        )}
      >
        {item.status}
      </div>,

      <DropdownMenu key={`action-${item.id}`}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'data-[state=open]:bg-muted text-muted-foreground flex size-8',
              { hidden: item.status === 'served' }
            )}
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          {['pending', 'process', 'ready'].map((status, index) => {
            const nextStatus = ['process', 'ready', 'served'][index];

            return (
              item.status === status && (
                <DropdownMenuItem
                  key={status}
                  onClick={() =>
                    handleUpdateStatusOrder({
                      id: item.id,
                      status: nextStatus,
                    })
                  }
                  className="capitalize"
                >
                  {nextStatus}
                </DropdownMenuItem>
              )
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>,
    ]);
  }, [orderMenu?.data, currentLimit, currentPage]);

  const totalPages = useMemo(() => {
    return orderMenu && orderMenu.count !== null
      ? Math.ceil(orderMenu.count / currentLimit)
      : 0;
  }, [orderMenu, currentLimit]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4 w-full">
        <h1 className="text-2xl font-bold">詳細注文 | Detail Order</h1>

        {roleKey !== 'kitchen' && (
          <Link href={`/order/${id}/add`}>
            <Button>注文アイテムの追加</Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="lg:w-2/3">
          <DataTable
            header={HEADER_TABLE_DETAIL_ORDER}
            data={filteredData}
            isLoading={isLoadingOrderMenu}
            totalPages={totalPages}
            currentPage={currentPage}
            currentLimit={currentLimit}
            onChangePage={handleChangePage}
            onChangeLimit={handleChangeLimit}
          />
        </div>

        <div className="lg:w-1/3">
          {order && (
            <Summary order={order} orderMenu={orderMenu?.data} id={id} />
          )}
        </div>
      </div>
    </div>
  );
}