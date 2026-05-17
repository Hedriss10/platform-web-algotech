export type Room = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
};

export type CreateRoomPayload = {
  name: string;
};

export type UpdateRoomPayload = {
  name: string;
};
