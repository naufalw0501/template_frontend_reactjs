import FetchUtils from "../../utility/FetchUtils";
import { BASE_URL } from "../../Constant";
import { FormProductInterface, CategoryInterface, ProductInterface } from "../interface/ProductInterface";

class ProductService {
    static async getProduct(): Promise<{ message: string, status: number, data: ProductInterface[] }> {
        let query = `${BASE_URL}/api/products`
        const resp = await FetchUtils.fetchAuth(query)

        if (resp.status != 200) { throw new Error(resp.message) }

        const data: ProductInterface[] = []
        for (let i = 0; i < resp.data.length; i++) {
            data.push(({
                id: resp.data[i].id,
                product_name: resp.data[i].product_name,
                description: resp.data[i].description,
                category_name: resp.data[i].category_name,
                lowest_price: resp.data[i].lowest_price,
                highest_price: resp.data[i].highest_price,
                size: resp.data[i].size,
                notes: resp.data[i].notes,
                link_shopee: resp.data[i].link_shopee,
                link_tokopedia: resp.data[i].link_tokopedia,
                image_file: resp.data[i].image_file,
                updated_at: resp.data[i].updated_at,
                created_at: resp.data[i].created_at,
            }))
        }
        return { ...resp, data };
    }

    static async getCategories(): Promise<{ message: string, status: number, data: CategoryInterface[] }> {
        let query = `${BASE_URL}/api/products/categories`
        const resp = await FetchUtils.fetchAuth(query)

        if (resp.status != 200) { throw new Error(resp.message) }

        const data: CategoryInterface[] = []
        for (let i = 0; i < resp.data.length; i++) {
            data.push(({
                id: resp.data[i].id,
                category_name: resp.data[i].category_name,
            }))
        }
        return { ...resp, data };
    }

    static async createProduct(data: FormProductInterface) { 
        if (
            data.product_name == null || data.product_name.trim() === '' ||
            data.description == null || data.description.trim() === '' ||
            data.id_category == null ||
            data.lowest_price == null ||
            data.highest_price == null ||
            data.size == null || data.size.trim() === '' ||
            data.notes == null || data.notes.trim() === '' ||
            data.link_shopee == null || data.link_shopee.trim() === '' ||
            data.link_tokopedia == null || data.link_tokopedia.trim() === '' ||
            data.image_file_to_upload == null
        ) {
            throw new Error('All Form must be filled !');
        }

        const formData = new FormData();
        formData.append('product_name', data.product_name);
        formData.append('description', data.description);
        formData.append('id_category', String(data.id_category));
        formData.append('lowest_price', String(data.lowest_price));
        formData.append('highest_price', String(data.highest_price));
        formData.append('size', data.size);
        formData.append('notes', data.notes);
        formData.append('link_shopee', data.link_shopee);
        formData.append('link_tokopedia', data.link_tokopedia);
        formData.append('image', data.image_file_to_upload);  

        const resp = await FetchUtils.fetchAuthWithUploadFile(
            `${BASE_URL}/api/products/add`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (resp.status != 201) {
            throw new Error(resp.message);
        }

        return resp;
    }


    static async updateProduct(data: ProductInterface, update: FormProductInterface) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/products/update`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    id: data.id,
                    product_name: update.product_name,
                    description: update.description,
                    id_category: update.id_category,
                    lowest_price: update.lowest_price,
                    highest_price: update.highest_price,
                    size: update.size,
                    notes: update.notes,
                    link_shopee: update.link_shopee,
                    link_tokopedia: update.link_tokopedia,
                    image_file: update.image_file
                })
            }
        )
        if (resp.status != 200) { throw new Error(resp.message) }
        return resp;
    }

    static async deleteProduct(data: ProductInterface) {
        const resp = await FetchUtils.fetchAuth(
            `${BASE_URL}/api/products/delete`,
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
export { ProductService }