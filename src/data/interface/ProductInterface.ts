interface ProductInterface {
    id : number;
    product_name : string
    description : string
    category_name : string 
    lowest_price : number
    highest_price : number
    size : string
    notes : string
    link_shopee : string
    link_tokopedia : string  
    image_file : string 
    updated_at : Date
    created_at : Date
} 

interface FormProductInterface {  
    product_name? : string
    description? : string
    id_category? : number 
    category_name? : string 
    lowest_price? : number
    highest_price? : number
    size? : string
    notes? : string
    link_shopee? : string
    link_tokopedia? : string  
    image_file? : string  
}

interface CategoryInterface {
    id: number;
    category_name: string;
}

export { ProductInterface, FormProductInterface, CategoryInterface } 