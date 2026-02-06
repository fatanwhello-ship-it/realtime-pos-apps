
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createTable } from "../actions";
import { toast } from "sonner";
import { INITIAL_STATE_TABLE, INITIAL_TABLE } from "@/constants/table-constant";
import { TableForm, tableFormSchema} from "@/validations/table-validation";
import FormTable from "./form-table";

export default function DialogCreateTable({ refetch }: { refetch: () => void; }) {

    const form = useForm<TableForm>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: INITIAL_TABLE,
    });


    const [ createTableState, createTableAction, isPendingCreateTable ] = 
    useActionState( createTable, INITIAL_STATE_TABLE );
    
    const onSubmit = form.handleSubmit((data) => {
        const formData  = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });


        startTransition(() => {
            createTableAction(formData);
        });
    });


    useEffect(() => {
        if( createTableState?.status === 'error' ) {
            toast.error('テーブルの作成に失敗しました' , {
                description: createTableState.errors?._form?.[0],
            });
        } 

        if( createTableState?.status === 'success' ) {
            toast.success('テーブルの作成が成功しました');
            form.reset();
            document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
            refetch();
        }
    }, [createTableState]);


    return (
        <FormTable form={form} onSubmit={onSubmit} isLoading={isPendingCreateTable} type="Create"></FormTable>
    );
}