import FetchUtils from "../../utility/FetchUtils";
import { BASE_URL } from "../../Constant";

class WashingService {
    static async getWashingDetail(rfid: string) {
        let query = `${BASE_URL}/api/v1/washings?rfid=${rfid}`
        const resp = await FetchUtils.fetchAuth(query)

        if (resp.status != 200) { throw new Error(resp.message) }

        const data: {
            id_linen: number;
            type: string;
            created_at: string;
            wash_count: number;
            last_wash: {
                status: string;
                from_room: string;
                created_at: string;
                finished_at: string | null;
            } | null;
        } = {
            id_linen: resp.data.id_linen,
            type: resp.data.type,
            created_at: resp.data.created_at,
            wash_count: resp.data.wash_count,
            last_wash: resp.data.last_wash == null
                ? null
                : {
                    status: resp.data.last_wash.status,
                    from_room: resp.data.last_wash.from_room,
                    created_at: resp.data.last_wash.created_at,
                    finished_at: resp.data.last_wash.finished_at,
                },
        }

        return { ...resp, data };
    }

    static async checkOutRoom(rfid: string) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/v1/washings/check_out_room`,
            {
                method: 'POST',
                body: JSON.stringify({ rfid: rfid, })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;
    }

    static async checkInRoom(id_room: number, rfid: string) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/v1/washings/check_in_room`,
            {
                method: 'POST',
                body: JSON.stringify({ id_room: id_room, rfid: rfid, })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;
    }
}
export { WashingService }