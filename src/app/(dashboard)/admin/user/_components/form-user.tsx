import FormImage from "@/components/common/form-image";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ROLE_LIST } from "@/constants/auth-constant";
import { Preview } from "@/types/general";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormUser< T extends FieldValues> ({
    form, onSubmit, isLoading, type, preview, setPreview,

} :{
    form: UseFormReturn< T >;
    onSubmit: ( event: FormEvent< HTMLFormElement >) => void; 
    isLoading: boolean;
    type: 'Create' | 'Update';
    preview?: Preview;
    setPreview?: ( preview: Preview ) => void;
    
}) {
    return (
        <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
                <DialogHeader>
                    <DialogTitle>{ type } User</DialogTitle>
                    <DialogDescription >
                        {type === 'Create'
                        ? 'Register a new User'
                        : 'Make changes User here'}
                    </DialogDescription>
                </DialogHeader>
                < form onSubmit={onSubmit} className="space-y-4" >
                    <FormInput form={form} name={'name' as Path< T >} label="名前| Name" placeholder="名前を入力してください | Enter Name" />

                    {type === 'Create' && (
                    <FormInput form={form} name={'email' as Path< T >} label="電子メール | Email" placeholder="メールアドレスを入力してください | Enter Email" type="email"/>
                    )}

                    <FormImage form={form} name={'avatar_url' as Path< T >} label="アバター | Avatar" preview={preview} setPreview={setPreview} />

                    <FormSelect form={form} name={'role' as Path< T >} label="ロール | Role" selectItem={ROLE_LIST} />

                    {type === 'Create' && (
                        <FormInput form={form} name={'password' as Path< T >} label="パスワード | Password" placeholder="パスワードを入力してください | Enter Password"  type="password"/>
                    )} 


                    <DialogFooter> 
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">{ isLoading ? <Loader2 className="animate-spin" /> : type }</Button>
                    </DialogFooter>
                </form>
            </Form>  
        </DialogContent>
    )
}