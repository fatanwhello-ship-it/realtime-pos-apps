import { AuthFormState } from "@/types/auth";

export type ActionState = {
  status: 'idle' | 'success' | 'error';
  errors: {
    _form?: string[];
  };
};

export const INITIAL_STATE_ACTION: AuthFormState = {
  status: 'idle',
  errors: {
    _form: [],
    email: [],
    password: [],
    name: [],
    role: [],
    avatar_url: [],
  },
};

export type BaseActionReservationState = {
  status: 'idle' | 'success' | 'error';
  errors: {
    _form?: string[];
  };
};

export const BASE_INITIAL_RESERVATION_STATE: BaseActionReservationState = {
  status: 'idle',
  errors: {},
};

