import FetchUtils from "../../utility/FetchUtils";
import { BASE_URL } from "../../Constant";
import { FormUserInterface, RoleInterface, UserInterface } from "../interface/UserInterface";

class UserService {
    static async getUser( ): Promise<{ message: string, status: number, data: UserInterface[] }> {
        let query = `${BASE_URL}/api/users` 
        const resp = await FetchUtils.fetchAuth(query)

        if (resp.status != 200) { throw new Error(resp.message) }

        const data: UserInterface[] = []
        for (let i = 0; i < resp.data.length; i++) {
            data.push(({
                id: resp.data[i].id,
                role_name: resp.data[i].role_name,
                username: resp.data[i].username,
            }))
        }
        return { ...resp, data };
    }

    static async getRoles( ): Promise<{ message: string, status: number, data: RoleInterface[] }> {
        let query = `${BASE_URL}/api/users/roles` 
        const resp = await FetchUtils.fetchAuth(query)

        if (resp.status != 200) { throw new Error(resp.message) }

        const data: RoleInterface[] = []
        for (let i = 0; i < resp.data.length; i++) {
            data.push(({
                id: resp.data[i].id,
                role_name: resp.data[i].role_name,
            }))
        }
        return { ...resp, data };
    }

    static async createUser(data: FormUserInterface) {
        //TODO Add Role
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/users/add`,
            {
                method: 'POST',
                body: JSON.stringify({
                    username: data.username,
                    id_role: data.id_role,
                })
            }
        )
        if (resp.status != 201) { throw new Error(resp.message) }
        return resp;
    }

    static async updateUser(data: UserInterface, update: FormUserInterface) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/users/update`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    id: data.id,
                    username: update.username,
                    id_role: update.id_role
                })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;
    }

    static async deleteUser(data: UserInterface) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/users/delete`,
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
export { UserService }