import z from 'zod';

export const orderFormSchema = z.object({
      customer_name: z.string().min(1, 'Please input the customer name'),
      table_id: z.string().min(1, 'Choose the table'),
      status: z.string().min(1, 'Whats the status'),
});

export type OrderForm = z.infer< typeof orderFormSchema >;