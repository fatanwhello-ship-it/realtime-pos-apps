
import { INITIAL_STATE_MENU } from "@/constants/menu-constant";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { deleteMenu } from "../action";
import DialogDelete from "@/components/common/dialog-delete";
import { Menu } from "@/validations/menu-validation";

export default function DialogDeleteMenu({
    open, refetch, currentData, handleChangeAction,
} : {
    refetch: () => void;
    currentData?: Menu;
    open: boolean;
    handleChangeAction: ( open: boolean  ) => void;

}) {
    const [ deleteMenuState, deleteMenuAction, isPendingDeleteMenu ] =
    useActionState( deleteMenu, INITIAL_STATE_MENU );


    const onSubmit = () => {
        const formData = new FormData();
        formData.append( 'id', currentData!.id as string );
        formData.append( 'image_url', currentData!.image_url as string ); 
        startTransition(() => {
            deleteMenuAction( formData );
        });
    };


    useEffect(() => {
        if(deleteMenuState?.status === 'error' ) {
            toast.error( 'メニューの削除に失敗しました | Delete Menu Failed', {
                description: deleteMenuState.errors?._form?.[0],
            });
        }

        if (deleteMenuState?.status === 'success' ){
            toast.success( 'メニューが正常に削除されました | Menu Deleted Successfully' );
            handleChangeAction?.(false);
            refetch();
        }
    }, [deleteMenuState]);

    return (
        <DialogDelete open={open}  onOpenChange={handleChangeAction} isLoading={isPendingDeleteMenu} onSubmit={onSubmit} title="User" />
    );
}