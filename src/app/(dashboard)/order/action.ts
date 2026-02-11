'use server';

import { createClient } from "@/lib/supabase/server";
import { Cart, OrderFormState } from "@/types/order";
import { orderFormSchema, orderTakeawayFormSchema } from "@/validations/order-validation";
import { formState, GeneratePaymentState } from '@/types/general';
import { redirect } from "next/navigation";
import { environment } from "@/configs/environment";
import midtrans from 'midtrans-client';

export async function createOrder(
  prevState: OrderFormState,
  formData: FormData,
) {
  const validatedFields = orderFormSchema.safeParse({
    customer_name: formData.get('customer_name'),
    table_id: formData.get('table_id'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  const orderId = `MAIDCAFE-${Date.now()}`;

  const [ orderResult, tableResult ] = await Promise.all([ supabase.from('orders').insert({
    order_id: orderId,
    customer_name: validatedFields.data.customer_name,
    table_id: validatedFields.data.table_id,
    status: validatedFields.data.status,
  }),

  supabase 
    .from( 'tables' )
    .update({
        status: validatedFields.data.status === 'reserved' ? 'reserved' : 'unavailable',
    })

    .eq('id', validatedFields.data.table_id),
]);

const orderError = orderResult.error;
const tableError = tableResult.error;

if ( orderError || tableError ) {
    return {
        status: 'error',
        errors: {
            ...prevState.errors,
            _form: [
                ...( orderError? [ orderError.message ] : []),
                ...( tableError? [ tableError.message ] : []),
            ],
        },
    };
}

return {
    status: 'success',
  };
}

export async function createOrderTakeaway(
  prevState: OrderFormState,
  formData: FormData,
  
) {
  const validatedFields = orderTakeawayFormSchema.safeParse({
    customer_name: formData.get('customer_name'),
  });

  if(!validatedFields.success) {
    return {
      status: 'error',
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }


  const supabase = await createClient();

  const orderId = `MaidCafe-${Date.now()}`;


  const {error} = await supabase.from('orders').insert({
    order_id: orderId,
    customer_name: validatedFields.data.customer_name,
    status: 'process',
  });


  if (error) {
    return {
      status: 'error',
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }


  return {
    status: 'success',
  };
}

export async function updateReservation(
  prevState: formState,
  formData: FormData
): Promise<formState> {
  const supabase = await createClient();

  const orderId = formData.get('id');
  const tableId = formData.get('table_id');
  const status = formData.get('status');

  if (!orderId || !tableId || !status) {
    return {
      status: 'error',
      errors: {
        _form: ['Invalid form data'],
      },
    };
  }

  const { error: orderError } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (orderError) {
    return {
      status: 'error',
      errors: {
        _form: [orderError.message],
      },
    };
  }

  const tableStatus =
    status === 'process' ? 'unavailable' : 'available';

  const { error: tableError } = await supabase
    .from('tables')
    .update({ status: tableStatus })
    .eq('id', tableId);

  if (tableError) {
    return {
      status: 'error',
      errors: {
        _form: [tableError.message],
      },
    };
  }

  return {
    status: 'success',
    errors: {},
  };
}

export async function addOrderItem(
  prevState: OrderFormState,
  data: {
    order_id: string;
    items: Cart[];
  },
): Promise<OrderFormState> {
  const supabase = await createClient();

  if (!data.items.length) {
    return {
      status: 'error',
      errors: {
        _form: ['Cart is empty'],
      },
    };
  }

  const payload = data.items.map(({menu, ...item }) => ({
    ...item,
    order_id: item.order_id,
  }));

  const { error } = await supabase
    .from('orders_menus')
    .insert(payload);

  if (error) {
    return {
      status: 'error',
      errors: {
        _form: ['Failed to add order items'],
      },
    };
  }

 redirect(`/order/${data.order_id}`);
}

export async function updateStatusOrderItem(
  id: string,
  status: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('orders_menus')
    .update({ status })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function generatePayment(
  _prevState: GeneratePaymentState,
  formData: FormData
): Promise<GeneratePaymentState> {
  const supabase = await createClient();

  const orderId = formData.get('id');
  const grossAmount = formData.get('gross_amount');
  const customerName = formData.get('customer_name');

  if (!orderId || !grossAmount || !customerName) {
    return {
      status: 'error',
      errors: {
        _form: ['Invalid payment data'],
      },
      data: {
        payment_token: '',
      },
    };
  }

  try {
    const snap = new midtrans.Snap({
      isProduction: false,
      serverKey: environment.MIDTRANS_SERVER_KEY!,
    });

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: String(orderId),
        gross_amount: Number(grossAmount),
      },
      customer_details: {
        first_name: String(customerName),
      },
    });

   
    if (!transaction?.token) {
      return {
        status: 'error',
        errors: {
          _form: ['Failed to create Midtrans transaction'],
        },
        data: {
          payment_token: '',
        },
      };
    }

    const { error } = await supabase
      .from('orders')
      .update({ payment_token: transaction.token })
      .eq('order_id', orderId);

    
    if (error) {
      return {
        status: 'error',
        errors: {
          _form: [error.message],
        },
        data: {
          payment_token: '',
        },
      };
    }

    return {
      status: 'success',
      errors: {},
      data: {
        payment_token: transaction.token,
      },
    };
  } catch (err) {
    return {
      status: 'error',
      errors: {
        _form: ['Unexpected error occurred'],
      },
      data: {
        payment_token: '',
      },
    };
  }
}

