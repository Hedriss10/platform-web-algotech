export type Banker = {
  id: string;
  name: string;
  created_at: string;
};

export type CreateBankerPayload = {
  name: string;
};

export type UpdateBankerPayload = {
  name: string;
};
