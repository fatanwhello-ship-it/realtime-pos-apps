import { GeneratePaymentState } from "@/types/general";


export const HEADER_TABLE_ORDER = [
    'No',
    'Order ID',
    'Customer Name',
    'Table',
    'Status',
    'Action',
];

export const INITIAL_ORDER = {
    customer_name: '',
    table_id: '',
    status: '',
};

export const INITIAL_STATE_ORDER = {
  status: 'idle',
  errors: {
    customer_name: [],
    table_id: [],
    status: [],
    _form: [],
  },
};

export const INITIAL_ORDER_TAKEAWAY = {
  customer_name: '',
};

export const STATUS_CREATE_ORDER = [
  {
    value: 'settled',
    label: 'Settled',
  },
  {
    value: 'process',
    label: 'Process',
  },

    {
    value: 'reserved',
    label: 'Reserved',
  },

    {
    value: 'canceled',
    label: 'Canceled',
  },
];

export const HEADER_TABLE_DETAIL_ORDER = [
  'No',
  'Menu',
  'Total',
  'Status',
  'Action',
];

export const FILTER_MENU = [

  {
  value: 'Coffee & Espresso',
  label: 'コーヒー＆エスプレッソ | Coffee',
  },

  {
    value: 'Non-Coffee & Tea',
    label: 'コーヒー＆紅茶以外 | Non Coffee',
  },

  {
    value: 'Snacks & Light Bites',
    label: 'スナックと軽食 | Snack',
  },
]

export const INITIAL_STATE_GENERATE_PAYMENT: GeneratePaymentState = {
  status: 'idle',
  errors: {},
  data: {
    payment_token: '',
  },
};
