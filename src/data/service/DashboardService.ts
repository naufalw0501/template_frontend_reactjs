import FetchUtils from "../../utility/FetchUtils";
import { BASE_URL } from "../../Constant";
import { format } from "date-fns";

class DashboardService {
    static async getMaxWashedLinen(): Promise<{ message: string, status: number, data: { id_linen: number, wash_count: number }[] }> {
        const query = `${BASE_URL}/api/v1/dashboards/by_expiry`
        const resp = await FetchUtils.fetchAuth(query)

        if (resp.status != 200) { throw new Error(resp.message) }

        const data: { id_linen: number, wash_count: number }[] = []
        for (let i = 0; i < resp.data.length; i++) {
            data.push({
                id_linen: resp.data[i].id_linen,
                wash_count: resp.data[i].wash_count,
            })
        }
        return { ...resp, data };
    }

    static async getLinenByStatus(start_date: Date, end_date: Date): Promise<{ message: string, status: number, data: { count: number, status: string }[] }> {
        let query = `${BASE_URL}/api/v1/dashboards/by_status`
        if (start_date != null && end_date != null) {
            query += `?start_date=${format(start_date, 'yyyy-MM-dd 00:00:00')}&end_date=${format(end_date, 'yyyy-MM-dd 23:59:59')}`
        }
        const resp = await FetchUtils.fetchAuth(query)

        if (resp.status != 200) { throw new Error(resp.message) }

        const data: { count: number, status: string }[] = []
        for (let i = 0; i < resp.data.length; i++) {
            data.push({
                count: resp.data[i].count,
                status: resp.data[i].status,
            })
        }
        return { ...resp, data };
    }

    static async getLinenByRoom(type: "asc" | "desc", room_type?: string): Promise<{ message: string, status: number, data: { count: number, room: string }[] }> {
        let query = `${BASE_URL}/api/v1/dashboards/by_room/${type}`
        if (room_type != null){
            query = `${query}?tipe=${room_type}`
        }
        const resp = await FetchUtils.fetchAuth(query)

        if (resp.status != 200) { throw new Error(resp.message) }

        const data: { count: number, room: string }[] = []
        for (let i = 0; i < resp.data.length; i++) {
            data.push({
                count: resp.data[i].count,
                room: resp.data[i].room,
            })
        }
        return { ...resp, data };
    }
}
export { DashboardService }