
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { OrderTakeawayForm, orderTakeawayFormSchema } from "@/validations/order-validation";
import { INITIAL_ORDER_TAKEAWAY, INITIAL_STATE_ORDER_TAKEAWAY } from "@/constants/order-constant";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createOrderTakeaway } from "../action";


export default function DialogCreateOrderTakeaway({ closeDialog, }: {
    closeDialog: () => void;
}) {

    const form = useForm<OrderTakeawayForm>({
    resolver: zodResolver(orderTakeawayFormSchema),
    defaultValues: INITIAL_ORDER_TAKEAWAY,
    });


    const [ createOrderState, createOrderAction, isPendingCreateOrder ] = 
    useActionState( createOrderTakeaway, INITIAL_STATE_ORDER_TAKEAWAY );
    
    const onSubmit = form.handleSubmit((data) => {
        const formData  = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });


        startTransition(() => {
            createOrderAction(formData);
        });
    });


    useEffect(() => {
        if( createOrderState?.status === 'error' ) {
            toast.error('注文の作成に失敗しました' , {
                description: createOrderState.errors?._form?.[0],
            });
        } 

        if( createOrderState?.status === 'success' ) {
            toast.success('注文の作成が成功しました');
            form.reset();
            document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
        }
    }, [createOrderState]);


    return (
        <DialogContent className="sm: max-w-[425px] max-h-[90vh]">
            <Form {...form}>
                <DialogHeader> 
                    <DialogTitle>注文のテイクアウトを作成する</DialogTitle>
                    <DialogDescription>顧客からの新しい注文を追加する</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-4 max-h-[50vh] px-1 overflow-y-auto">

                    <FormInput form={form} name="customer_name" label="顧客名" placeholder="ここに顧客名を入力してください" />
                    
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button> 
                        </DialogClose>
                        <Button type="submit">
                            { isPendingCreateOrder ? (<Loader2 className="animate-spin"/> ) : ('Create')}
                        </Button>
                    </DialogFooter>
                </form> 
            </Form>
        </DialogContent>
    );
}