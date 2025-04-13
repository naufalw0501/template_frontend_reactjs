import FetchUtils from "../../utility/FetchUtils";
import { BASE_URL } from "../../Constant";
import { AddRoomEntity, RoomEntity } from "../entity/RoomEntity";

class RoomService {
    static async getRoom(from_row?: number, limit?: number): Promise<{ message: string, status: number, data: RoomEntity[] }> {
        let query = `${BASE_URL}/api/v1/rooms`
        if (from_row != null && limit != null) {
            query += `?from_row=${from_row}&limit=${limit}`
        }
        const resp = await FetchUtils.fetchAuth(query)

        if (resp.status != 200) { throw new Error(resp.message) }

        const data: RoomEntity[] = []
        for (let i = 0; i < resp.data.length; i++) {
            data.push(new RoomEntity({
                id: resp.data[i].id,
                room: resp.data[i].room,
                tipe: resp.data[i].tipe
            }))
        }
        return { ...resp, data };
    }

    static async getTypes() {
        const resp = await FetchUtils.fetchAuth(`${BASE_URL}/api/v1/rooms/types`)
        if (resp.status != 200) { throw new Error(resp.message) }

        const data: string[] = []
        for (let i = 0; i < resp.data.length; i++) {
            data.push(resp.data[i].tipe)
        }
        return { ...resp, data }
    }

    static async createRoom(data: AddRoomEntity) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/v1/rooms/add`,
            {
                method: 'POST',
                body: JSON.stringify({
                    room: data.room,
                    tipe: data.tipe
                })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;
    }

    static async updateRoom(data: RoomEntity, update: AddRoomEntity) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/v1/rooms/update`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    id: data.id,
                    fields: {
                        room: update.room,
                        tipe: update.tipe
                    }
                })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;
    }

    static async deleteRoom(data: RoomEntity) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/v1/rooms/delete`,
            {
                method: 'DELETE',
                body: JSON.stringify({
                    id: data.id
                })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;

    }
}
export { RoomService }