// lib/products.ts (or directly in your page.tsx)
export interface Product {
    image_url: string;
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    isNew?: boolean;
    isSale?: boolean;
    sizes?: string[];
    colors?: string[];
}
  
export async function getAllProducts(): Promise<Product[]> {
    // Replace this with your actual database fetching logic
    const response = await fetch("api/products");
    const products = await response.json();
    return products;
}
  