import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { INITIAL_STATE_GENERATE_PAYMENT } from "@/constants/order-constant";
import { usePricing } from "@/hooks/use-pricing";
import { convertJPY } from "@/lib/utils";
import { Menu } from "@/validations/menu-validation";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import { generatePayment } from "../../action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { SidebarMenuKey } from "@/constants/sidebar-constant";



export default function Summary({
    order, orderMenu, id,

} : {
    order: {
        customer_name: string;
        tables: {name : string}[];
        status: string;
    };

    orderMenu: 
        | { menus: Menu; quantity: number; status: string }[]
        | null
        | undefined;

    id: string;
    
}) {
    const { grandTotal, totalPrice, tax, service } = usePricing(orderMenu);

    const profile = useAuthStore((state) => state.profile);

    const roleKey = profile.role?.toLowerCase() as SidebarMenuKey;

    const isAllServed = useMemo(() => {
      return orderMenu?.every((item) => item.status === 'served')
    }, [orderMenu]);

    const [generatePaymentState, generatePaymentAction, isPendingGeneratePayment] = useActionState(generatePayment, INITIAL_STATE_GENERATE_PAYMENT);

    const handleGeneratePayment = () => {
    
      const formData = new FormData();
      formData.append('id', id || '');
      formData.append('gross_amount', grandTotal.toString());
      formData.append('customer_name', order.customer_name || '');

      startTransition(() => {
        generatePaymentAction(formData);
      });
    };


    useEffect(() => {
      if(generatePaymentState?.status === 'error') {
        toast.error('支払いの生成に失敗しました', {
          description: generatePaymentState.errors?._form?.[0],
        });
      }

      if(generatePaymentState?.status === 'success') {
        window.snap.pay(generatePaymentState.data.payment_token);
      }
    }, [generatePaymentState]);

    return (
    <Card className="w-full shadow-sm">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">顧客情報</h3>
        {order && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={order?.customer_name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Table</Label>
              <Input
                value={(order?.tables as unknown as { name: string })?.name || 'Takeaway'}
                disabled
              />
            </div>
          </div>
        )}
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">注文概要</h3>
          <div className="flex justify-between items-center">
            <p className="text-sm">Subtotal</p>
            <p className="text-sm">{convertJPY(totalPrice)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm">Tax (12%)</p>
            <p className="text-sm">{convertJPY(tax)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm">Service (5%)</p>
            <p className="text-sm">{convertJPY(service)}</p>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Total</p>
            <p className="text-lg font-semibold">{convertJPY(grandTotal)}</p>
          </div>

          {order?.status === 'process' && roleKey !== 'kitchen' &&  (
            <Button type="submit" onClick={handleGeneratePayment} disabled={!isAllServed || isPendingGeneratePayment || orderMenu?.length === 0} className="w-full font-semibold bg-pink-500 hover:bg-pink-600 textp-white cursor-pointer" >
              {isPendingGeneratePayment ? (
                <Loader2 className="animate-spin" />
              ) : (
                '支払う'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
