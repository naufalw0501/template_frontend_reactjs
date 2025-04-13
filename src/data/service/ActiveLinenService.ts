import FetchUtils from "../../utility/FetchUtils";
import { BASE_URL } from "../../Constant";
import { ActiveLinenEntity, AddActiveLinenEntity, UpdateActiveLinenEntity } from "../entity/ActiveLinenEntity";
import { format } from "date-fns";

class ActiveLinenService {
    static async getActiveLinen(from_row: number, limit: number, start_date?: Date, end_date?: Date) {
        let query = `${BASE_URL}/api/v1/linens`
        if (from_row != null && limit != null) {
            query += `?from_row=${from_row}&limit=${limit}`
        }
        if (start_date != null && end_date != null) {
            query += `?start_date=${format(start_date, 'yyyy-MM-dd')}&end_date=${format(end_date, 'yyyy-MM-dd')}`
        }
        const resp = await FetchUtils.fetchAuth(query)

        if (resp.status != 200) { throw new Error(resp.message) }
        const data: { count: number, linens: ActiveLinenEntity[] } = { count: resp.data.count, linens: [] }
        for (let i = 0; i < resp.data.linens.length; i++) {
            data.linens.push(new ActiveLinenEntity({
                id: resp.data.linens[i].id,
                rfid: resp.data.linens[i].rfid,
                room: resp.data.linens[i].room,
                type: resp.data.linens[i].type,
                wash_count: resp.data.linens[i].wash_count,
            }))
        }
        return { ...resp, data };
    }

    static async getActiveLinenByRoom(from_row: number, limit: number, id_room : number ) {
        let query = `${BASE_URL}/api/v1/linens/by_room?from_row=${from_row}&limit=${limit}&id_room=${id_room}`
        const resp = await FetchUtils.fetchAuth(query)

        if (resp.status != 200) { throw new Error(resp.message) }
        const data: { count: number, linens: ActiveLinenEntity[] } = { count: resp.data.count, linens: [] }
        for (let i = 0; i < resp.data.linens.length; i++) {
            data.linens.push(new ActiveLinenEntity({
                id: resp.data.linens[i].id,
                rfid: resp.data.linens[i].rfid,
                room: resp.data.linens[i].room,
                type: resp.data.linens[i].type,
                wash_count: resp.data.linens[i].wash_count,
            }))
        }
        return { ...resp, data };
    }

    static async createActiveLinen(data: AddActiveLinenEntity) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/v1/linens/add`,
            {
                method: 'POST',
                body: JSON.stringify({
                    rfid: data.rfid,
                    type: data.type,
                    id_room: data.id_room
                })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;
    }

    static async updateActiveLinen(id: number, fields: UpdateActiveLinenEntity) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/v1/linens/update`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    id: id,
                    fields: {
                        id_room: fields.id_room,
                        type: fields.type
                    }
                })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;
    }

    static async disableLinens(data: string[]) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/v1/linens/disable`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    batch: data
                })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;
    }

    static async changeRFIDLinen(old_rfid: string, new_rfid: string) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/v1/linens/change_rfid`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    old_rfid, new_rfid
                })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;
    }
}
export { ActiveLinenService }