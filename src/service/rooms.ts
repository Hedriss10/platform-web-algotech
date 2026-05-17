import type { CreateRoomPayload, Room, UpdateRoomPayload } from "../types/room";
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
