export type formState = {
  status: 'idle' | 'success' | 'error';
  errors: {
    _form?: string[];
  };
};


export type GeneratePaymentState = {
    status: 'idle' | 'success' | 'error';
  errors: {
    _form?: string[];
  };
  data: {
    payment_token: string,
  },
};

export type Preview = { file: File; displayUrl: string };