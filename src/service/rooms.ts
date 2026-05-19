import type {
  CreateRoomPayload,
  LinkRoomEmployeePayload,
  Room,
  RoomEmployeeListItem,
  RoomEmployeeOut,
  UpdateRoomPayload,
} from "../types/room";
import { apiClient } from "./api-base-client";

export async function fetchRooms(): Promise<Room[]> {
  const { data } = await apiClient.get<Room[]>("/api/v2/rooms");
  return Array.isArray(data) ? data : [];
}

export async function createRoom(payload: CreateRoomPayload): Promise<Room> {
  const { data } = await apiClient.post<Room>("/api/v2/rooms", payload);
  return data;
}

export async function updateRoom(
  id: string,
  payload: UpdateRoomPayload
): Promise<Room> {
  const { data } = await apiClient.patch<Room>(
    `/api/v2/rooms/${id}`,
    payload
  );
  return data;
}

export async function deleteRoom(id: string): Promise<void> {
  await apiClient.delete(`/api/v2/rooms/${id}`);
}

export async function fetchRoomEmployees(
  roomId: string
): Promise<RoomEmployeeListItem[]> {
  const { data } = await apiClient.get<RoomEmployeeListItem[]>(
    `/api/v2/rooms/${roomId}/employees`
  );
  return Array.isArray(data) ? data : [];
}

export async function linkRoomEmployee(
  roomId: string,
  payload: LinkRoomEmployeePayload
): Promise<RoomEmployeeOut> {
  const { data } = await apiClient.post<RoomEmployeeOut>(
    `/api/v2/rooms/${roomId}/employees`,
    payload
  );
  return data;
}

export async function unlinkRoomEmployee(
  roomId: string,
  employeeId: string
): Promise<void> {
  await apiClient.delete(
    `/api/v2/rooms/${roomId}/employees/${employeeId}`
  );
}
