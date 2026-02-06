import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react";
import {useForm} from "react-hook-form";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateUserForm, createUserSchema } from "@/validations/auth-validation";
import { INITIAL_CREATE_USER_FORM, INITIAL_STATE_CREATE_USER, ROLE_LIST } from "@/constants/auth-constant";
import { createUser } from "../action";
import FormSelect from "@/components/common/form-select";
import FormImage from "@/components/common/form-image";

export default function DialogCreateUser({ refetch }: { refetch : () => void }) {
    const form = useForm< CreateUserForm >({
        resolver: zodResolver(createUserSchema),
        defaultValues: INITIAL_CREATE_USER_FORM,
    });


    const [ createUserState , createUserAction, isPendingCreateUser ] =
    useActionState(createUser, INITIAL_STATE_CREATE_USER);


    const [ preview, setPreview ] = useState< {
        file: File; displayUrl: string 
    } | undefined >(undefined);


    const onSubmit = form.handleSubmit((data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, key === 'avatar_url' ? preview!.file ?? '' : value);
        });


        startTransition(() => {
            createUserAction(formData);
        });
    });

    
    useEffect(() => {
        if(createUserState?.status === 'error') {
            toast.error('ユーザーの作成に失敗しました | Create User Failed', {
                description: createUserState.errors?._form?.[0],
            });
        }


        if(createUserState?.status === 'success') {
            toast.success('ユーザーの成功を生み出す | Create User Success');
            form.reset();
            setPreview (undefined);
            document.querySelector< HTMLButtonElement >('[data-state="open"]')?.click();
            refetch();
        }
    }, [createUserState]);
    
    
    return (
        < DialogContent className="sm:max-w-[ 425px ]">
            <Form {...form}> 
                <DialogHeader> 
                    <DialogTitle> ユーザーを作成 | Create User</DialogTitle>
                    <DialogDescription> Register a New User </DialogDescription>
                </DialogHeader> 
                <form onSubmit={onSubmit} className="space-y-4">
                    <FormInput form={form} name="name" label="名前| Name" placeholder="名前を入力してください" />
                    <FormInput form={form} name="email" label="メール | Email" placeholder="メールアドレスを入力してください" />
                    <FormImage form={form} name="avatar_url" label="アバター | Avatar" preview={preview} setPreview={setPreview}  />                    <FormSelect form={form} name="role" label="役割 | Role" selectItem={ROLE_LIST} />
                    <FormInput form={form} name="password" label="パスワード | Password" placeholder="パスワードを入力してください" />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline"> キャンセル | Cancel</Button>
                        </DialogClose>
                        <Button type="submit">
                            {isPendingCreateUser ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                '作成する | Create'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </Form> 
        </DialogContent> 
    );
}