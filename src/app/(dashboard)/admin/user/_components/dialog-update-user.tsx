import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react";
import {useForm} from "react-hook-form";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import {UpdateUserForm, updateUserSchema,  } from "@/validations/auth-validation";
import {INITIAL_STATE_UPDATE_USER, ROLE_LIST } from "@/constants/auth-constant";
import { updateUser } from "../action";
import { Preview } from "@/types/general";
import { Profile } from "@/types/auth";
import FormUser from "./form-user";

export default function DialogUpdateUser({ 
    refetch, currentData, open, handleChangeAction,

}: {

    refetch:  () => void;
    currentData?: Profile;
    open?: boolean;
    handleChangeAction?: ( open: boolean ) => void;

}) {

    const form = useForm< UpdateUserForm >({
        resolver: zodResolver(updateUserSchema),
    });


    const [ updateUserState , updateUserAction, isPendingUpdateUser ] =
    useActionState(updateUser, INITIAL_STATE_UPDATE_USER);


    const [ preview, setPreview ] = useState< Preview | undefined>(undefined);


    const onSubmit = form.handleSubmit((data) => {
        const formData = new FormData();
        if(currentData?.avatar_url !== data.avatar_url) {
            Object.entries( data ).forEach(([ key, value ]) => {
                formData.append( key, key === 'avatar_url' ? preview!.file ?? '' : value,);
            });

            formData.append('old_avatar_url', currentData?.avatar_url ?? '');
        } else {
            Object.entries( data ).forEach(([ Key, value ]) => {
                formData.append( Key, value );
            });
        }

      formData.append( 'id', currentData?.id ?? '');

      startTransition(() => {
        updateUserAction(formData);
      });
    });


    useEffect(() => {
      if (updateUserState?.status === 'error') {
        toast.error('ユーザーの更新に失敗しました | Update User Failed', {
          description: updateUserState.errors?._form?.[0],
        });
      }


      if (updateUserState?.status === 'success') {
        toast.success('ユーザーの更新に成功しました | Update User Success');
        form.reset();
        handleChangeAction?.(false);
        refetch();
      }
    }, [ updateUserState ]);


    useEffect(() => {
      if( currentData ) {
        form.setValue('name', currentData.name as string);
        form.setValue('role', currentData.role as string);
        form.setValue('avatar_url', currentData.avatar_url as string);
        setPreview({
          file: new File([], currentData.avatar_url as string), 
          displayUrl: currentData.avatar_url as string,
        });
      }
    }, [currentData]);



    return (
      <Dialog open={open} onOpenChange={handleChangeAction}>
        <FormUser form={form} onSubmit={onSubmit} isLoading={ isPendingUpdateUser } type='Update' preview={preview} setPreview={setPreview} />
      </Dialog>
    )
}

  

