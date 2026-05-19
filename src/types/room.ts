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

/** Item de `GET /api/v2/rooms/{room_id}/employees` (join com funcionários). */
export type RoomEmployeeListItem = {
  id: string;
  room_id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
};

/** Resposta de `POST /api/v2/rooms/{room_id}/employees`. */
export type RoomEmployeeOut = {
  id: string;
  room_id: string;
  employee_id: string;
};

export type LinkRoomEmployeePayload = {
  employee_id: string;
};
