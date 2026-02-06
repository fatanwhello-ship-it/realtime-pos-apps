import FormImage from "@/components/common/form-image";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { AVAILABILITY_LIST } from "@/constants/auth-constant";
import { CATEGORY_LIST } from "@/constants/menu-constant";
import { Preview } from "@/types/general";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormMenu< T extends FieldValues > ({
    form, onSubmit, isLoading, type, preview, setPreview,
} : {
    form: UseFormReturn< T >;
    onSubmit: ( event: FormEvent< HTMLFormElement >)  => void;
    isLoading: boolean;
    type: 'Create' |  'Update',
    preview?: Preview;
    setPreview?: ( preview: Preview ) => void;

}) {
    return (
        <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
            <Form {...form}>
                <DialogHeader> 
                    <DialogTitle>{ type } Menu </DialogTitle>
                    <DialogDescription> 
                        { type === 'Create' ? 'ここにメニューを追加します' : 'ここでメニューを変更します' } 
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={ onSubmit } className="space-y-4"> 
                    <div className="space-y-4 max-h-[50vh] px-1 overflow-y-auto"> 
                        <FormInput form={form} name={'name' as Path< T >} label="Menu's name" placeholder="ここにメニュー名を入力してください"></FormInput>

                        <FormInput form={form} name={'description' as Path< T >} label="Description" placeholder="ここにメニューを説明してください" type="textarea"></FormInput>

                        <FormSelect form={form} name={'category' as Path< T >} label="Category" selectItem={CATEGORY_LIST}></FormSelect>

                        <FormInput form={form} name={'price' as Path< T >} label="Price" placeholder="価格を選択してください" type="number"></FormInput>

                        <FormInput form={form} name={'discount' as Path< T >} label="割引" placeholder="ここで割引を設定します" type="number"></FormInput>

                        <FormImage form={form} name={ 'image_url' as Path< T >} label="Picture" preview={preview} setPreview={ setPreview }></FormImage>

                        <FormSelect form={form} name={'is_available' as Path< T >} label="Available" selectItem={AVAILABILITY_LIST}></FormSelect>

                    </div>
                    <DialogFooter> 
                        <DialogClose asChild >
                            <Button variant="outline">Cancel</Button>                   
                        </DialogClose>
                        <Button type="submit">{ isLoading ? < Loader2 className="animate-spin" /> : type }
                        </Button>
                    </DialogFooter> 
                </form>
            </Form>
        </DialogContent>
    );
}