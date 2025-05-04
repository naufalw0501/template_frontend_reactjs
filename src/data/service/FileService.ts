import FetchUtils from "../../utility/FetchUtils";
import { BASE_URL } from "../../Constant";

class FileService {
    static async getFile(file_category: string, filename: string): Promise<{ message?: string, status?: number } | File> {
        const url = `${BASE_URL}/api/files/${file_category}/${filename}`;
        const result = await FetchUtils.fetchFile(url);

        if ('message' in result && 'status' in result) {
            throw new Error(result.message);  
        }

        return result;  
    }
}

export {FileService}