export const HEADER_TABLE_MENU = [
    'No',
    'Name',
    'Category',
    'Price',
    'Available',
    'Action',
];


export const CATEGORY_LIST = [
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
];



export const INITIAL_MENU = {
  name: '',
  description: '',
  price: '',
  discount: '',
  category: '',
  image_url: '',
  is_available: '',
};

export const INITIAL_STATE_MENU = {
  status: 'idle',
  errors: {
    id: [],
    name: [],
    description: [],
    price: [],
    discount: [],
    category: [],
    image_url: [],
    is_available: [],
    _form: [],
  },
};