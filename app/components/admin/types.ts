export type AnyObject = Record<string, any>;

export type UserItem = {
  id?: number | string;
  name?: string;
  email?: string;
  active_status?: boolean;
  two_fa_enabled?: boolean;
  last_login_at?: string;
  created_at?: string;
};

export type UserForm = {
  name: string;
  email: string;
  password: string;
  active_status: boolean;
};

export type PageItem = {
  id?: number | string;
  slug?: string;
  title?: string;
  page_type?: string;
  status?: string;
  meta_title?: string;
  meta_description?: string;
};

export type MediaUploadResponse = {
  success?: boolean;
  data?: {
    url?: string;
    image_url?: string;
    secure_url?: string;
  };
  url?: string;
  image_url?: string;
  secure_url?: string;
};
