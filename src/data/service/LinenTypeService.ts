import FetchUtils from "../../utility/FetchUtils";
import { BASE_URL } from "../../Constant";
import { AddLinenTypeEntity, LinenTypeEntity } from "../entity/LinenTypeEntity";

class LinenTypeService {
    static async getLinenType(from_row?: number, limit?: number): Promise<{ message: string, status: number, data: LinenTypeEntity[] }> {
        let query = `${BASE_URL}/api/v1/linen_types`
        if (from_row != null && limit != null) {
            query += `?from_row=${from_row}&limit=${limit}`
        }
        const resp = await FetchUtils.fetchAuth(query)

        if (resp.status != 200) { throw new Error(resp.message) }

        const data: LinenTypeEntity[] = []
        for (let i = 0; i < resp.data.length; i++) {
            data.push(new LinenTypeEntity({
                id: resp.data[i].id,
                type: resp.data[i].type,
            }))
        }
        return { ...resp, data };
    }

    static async createLineType(data: AddLinenTypeEntity) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/v1/linen_types/add`,
            {
                method: 'POST',
                body: JSON.stringify({
                    type: data.type,
                })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;
    }

    static async updateLinenType(data: LinenTypeEntity, update: AddLinenTypeEntity) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/v1/linen_types/update`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    id: data.id,
                    fields: { 
                        type : update.type
                     }
                })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;
    }

    static async deleteLinenType(data: LinenTypeEntity) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/v1/linen_types/delete`,
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
export { LinenTypeService }