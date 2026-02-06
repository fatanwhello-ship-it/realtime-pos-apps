import z from "zod";

export const tableSchema = z.object({
    name: z.string(),
    description: z.string(),
    capacity: z.number(),
    status: z.string(),
});


export const tableFormSchema = z.object({
    name: z.string().min(1, 'Name Is Required'),
    description: z.string().min(1, 'Input The Description Please'),
    capacity: z.string().min(1, 'Insert The Capacity Please'),
    status: z.string().min(1, 'Confirm The Status'),
});

export type Table = z.infer< typeof tableSchema > & { id: string };

export type TableForm = z.infer< typeof tableFormSchema>;