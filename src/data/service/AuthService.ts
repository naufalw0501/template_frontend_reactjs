import Cookies from "js-cookie";
import FetchUtils from "../../utility/FetchUtils";
import { BASE_URL, HOME_URL } from "../../Constant";

class AuthService {
    static async login(username: string, password: string) {
        if (username === '' || password === '') throw Error("Username and password are required!");
        try {
            let resp = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });
            const body = await resp.json();
            body.status = resp.status;
            if (body.status !== 200) {
                Cookies.remove("token");
                throw Error(body.message);
            } else {
                if (body.token == null) throw Error(body.message);
                console.log("Login Success");
                Cookies.set("token", body.token);
                //TODO Role Fixing
                return ({ username: body.username, role_name: body.role_name })
            }
        } catch (error) {
            Cookies.remove("token");
            throw error;
        }
    }

    static async refreshLogin() {
        if (Cookies.get("token") == null) return;
        try {
            const resp = await FetchUtils.fetchAuth(
                `${BASE_URL}/api/auth/refresh`,
                { method: "POST" });
            if (resp.status !== 200) throw new Error("TOKEN EXPIRED");
            Cookies.set("token", resp.data.token);
            //TODO ROLE
            return ({ username: resp.data.username, role_name: resp.data.role_name });
        } catch (error) {
            Cookies.remove("token");
            throw error;
        }
    }

    static async changePass(password: string, newpassword: string) {
        let resp = await FetchUtils.fetchAuth(`${BASE_URL}/api/v1/auth/change_pass`, {
            method: "POST",
            body: JSON.stringify({ password: password, newpassword: newpassword })
        });
        if (resp.status !== 200) throw Error(resp.message);
        return resp;
    }

    static async logout() {
        window.location.href = HOME_URL;
        Cookies.remove("token");
    }
}

export { AuthService }