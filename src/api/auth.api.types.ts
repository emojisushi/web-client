export type IRainLabUser = {
  id: number;
  name: string | null;
  email: string;
  permissions: string | null;
  is_activated: boolean;
  activated_at: null | string;
  last_login: string | null;
  created_at: string | null;
  updated_at: string | null;
  username: string | null;
  surname: string | null;
  deleted_at: null | string;
  last_seen: string | null;
  is_guest: 0 | 1;
  is_superuser: 0 | 1;
  created_ip_address: null | string;
  last_ip_address: null | string;
}

export type IOfflineMallCustomer = {
  firstname: string;
  lastname: string;
  is_guest: boolean;
  default_shipping_address_id: number | null;
  default_billing_address_id: number | null;
}

export type IOfflineMallUser = IRainLabUser & {
  offline_mall_customer_group_id: number | null;
  customer: IOfflineMallCustomer | null;
}