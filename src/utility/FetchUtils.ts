import Cookies from "js-cookie";

class FetchUtils {
    static async fetchAuth(address: string | URL, option?: RequestInit): Promise<{ message: string, status: number, data: any }> {
        const token = Cookies.get('token');

        if (option == null) {
            option = { headers: { Authorization: `Bearer ${token}` } };
        } else {
            option.headers = { ...option.headers, Authorization: `Bearer ${token}` };
        }
        option.headers = {...option.headers, "Content-Type": "application/json"}

        const result = await fetch(address, option);
        let data = await result.json();
        data.status = result.status;
        return data;
    }

    static async fetchAuthWithUploadFile(address: string | URL, option?: RequestInit): Promise<{ message: string, status: number, data: any }> {
        const token = Cookies.get('token');

        if (option == null) {
            option = { headers: { Authorization: `Bearer ${token}` } };
        } else {
            option.headers = { ...option.headers, Authorization: `Bearer ${token}` };
        }

        const result = await fetch(address, option);
        let data = await result.json();
        data.status = result.status;
        return data;
    }

    static async fetchFile(address: string | URL, option?: RequestInit): Promise<{ message: string, status: number } | File> {
        const token = Cookies.get('access_token');
    
        if (!option) {
            option = {};
        }
    
        option.headers = {
            ...(option.headers || {}),
            Authorization: `Bearer ${token}`,
        };
    
        const response = await fetch(address, option);
    
        if (!response.ok) { 
            try {
                const errorJson = await response.json();
                return { message: errorJson.message || 'Error', status: response.status };
            } catch {
                return { message: 'Unknown Error', status: response.status };
            }
        }
     
        const blob = await response.blob();
        const contentDisposition = response.headers.get("Content-Disposition");
        const fileName = contentDisposition
            ? contentDisposition.split("filename=")[1]?.replace(/["']/g, '')
            : 'downloaded_file';
    
        const file = new File([blob], fileName, { type: blob.type });
        return file;
    }
    
}

export default FetchUtils