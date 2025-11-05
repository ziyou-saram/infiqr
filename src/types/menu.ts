// src/types/menu.ts

export interface Category {
    id: string
    name: string
    subcategories?: Subcategory[]
}

export interface Subcategory {
    id: string
    name: string
    products: Product[]
}

export interface Product {
    id: string
    name: string
    price: number
    image?: string
    description?: string
    variants?: ProductVariant[]
}

export interface ProductVariant {
    id: string
    name: string
    price: number
    description?: string
}
