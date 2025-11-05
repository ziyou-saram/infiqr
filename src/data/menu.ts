// src/data/menu.ts

import type { Category } from "@/types/menu";
import { resolveProductImage } from "./product-images";

const baseMenu: Category[] = [
    {
        id: crypto.randomUUID(),
        name: "Алкоголь",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Вино",
                products: [
                    { id: crypto.randomUUID(), name: "Brancott Estate Pinot Noir кр.сух", price: 18000 },
                    { id: crypto.randomUUID(), name: "Campo Viejo Blanco б.сух", price: 14000 },
                    { id: crypto.randomUUID(), name: "Campo Viejo Rose", price: 15000 },
                    { id: crypto.randomUUID(), name: "Jacob's Creek Classic Chardonnay б.сух", price: 12000 },
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Ром",
                products: [
                    { id: crypto.randomUUID(), name: "Havana club 3YO", price: 1690 },
                    {
                        id: crypto.randomUUID(),
                        name: "Bacardi",
                        price: 1890,
                        variants: [
                            { id: crypto.randomUUID(), name: "Carta Blanca", price: 1890 },
                            { id: crypto.randomUUID(), name: "Carta Negra", price: 1890 },
                        ],
                    },
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Игристое вино",
                products: [
                    {
                        id: crypto.randomUUID(),
                        name: "Café de Paris",
                        price: 16500,
                        variants: [
                            { id: crypto.randomUUID(), name: "Brut", price: 16500 },
                            { id: crypto.randomUUID(), name: "Rosé", price: 16500 },
                        ],
                    },
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Виски",
                products: [
                    { id: crypto.randomUUID(), name: "Ballantine’s Finest 3 YO", price: 1900 },
                    { id: crypto.randomUUID(), name: "Jameson", price: 2300 },
                    { id: crypto.randomUUID(), name: "Chivas Regal 12YO", price: 3400 },
                    { id: crypto.randomUUID(), name: "Chivas Regal 18YO", price: 4700 },
                    { id: crypto.randomUUID(), name: "Glelivet Reserve", price: 4100 },
                    { id: crypto.randomUUID(), name: "Glelivet 12YO", price: 4500 },
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Водка",
                products: [
                    { id: crypto.randomUUID(), name: "Кызылжар 50мл", price: 1100 },
                    { id: crypto.randomUUID(), name: "Absolut Blue 50мл", price: 1500 },
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Коньяк",
                products: [
                    { id: crypto.randomUUID(), name: "Казахстан 3YO 50мл", price: 1400 },
                    { id: crypto.randomUUID(), name: "Арарат 3YO 50мл", price: 1400 },
                    { id: crypto.randomUUID(), name: "Арарат 5YO 50мл", price: 1600 },
                    { id: crypto.randomUUID(), name: "Martell V.S", price: 3300 },
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Текила",
                products: [
                    { id: crypto.randomUUID(), name: "Olmeca Blanco, Gold", price: 1800 },
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Пиво Бутылочное",
                products: [
                    { id: crypto.randomUUID(), name: "Budweiser Budvar", price: 2500 },
                    { id: crypto.randomUUID(), name: "Miller 0,5", price: 1800 },
                    { id: crypto.randomUUID(), name: "Corona Extra 0,355", price: 2500 },
                    { id: crypto.randomUUID(), name: "Heineken", price: 2000 },
                    { id: crypto.randomUUID(), name: "Guiness Draught", price: 2600 },
                    { id: crypto.randomUUID(), name: "Kozel", price: 2600 },
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Джин",
                products: [{ id: crypto.randomUUID(), name: "Beefeater", price: 1700 }],
            },
            {
                id: crypto.randomUUID(),
                name: "К пиву",
                products: [
                    { id: crypto.randomUUID(), name: "Арахис", price: 1400 },
                    { id: crypto.randomUUID(), name: "Фисташки", price: 1400 },
                    { id: crypto.randomUUID(), name: "Чечел", price: 1400 },
                    { id: crypto.randomUUID(), name: "Чипсы Lay's", price: 1400 },
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Кофе",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Горячий",
                products: [
                    {
                        id: crypto.randomUUID(),
                        name: "Американо",
                        price: 990,
                        variants: [
                            { id: crypto.randomUUID(), name: "250 мл", price: 990 },
                            { id: crypto.randomUUID(), name: "350 мл", price: 1190 },
                        ],
                    },
                    { id: crypto.randomUUID(), name: "Эспрессо", price: 790 },
                    { id: crypto.randomUUID(), name: "Эспрессо Тоник", price: 1690 },
                    {
                        id: crypto.randomUUID(),
                        name: "Капучино",
                        price: 1290,
                        variants: [
                            { id: crypto.randomUUID(), name: "Стандарт", price: 1290 },
                            { id: crypto.randomUUID(), name: "Большой", price: 1490 },
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        name: "Латте",
                        price: 1390,
                        variants: [
                            { id: crypto.randomUUID(), name: "Ванильный", price: 1390 },
                            { id: crypto.randomUUID(), name: "Карамельный", price: 1490 },
                        ],
                    },
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Айс",
                products: [
                    {
                        id: crypto.randomUUID(),
                        name: "Айс Капучино",
                        price: 1290,
                        variants: [
                            { id: crypto.randomUUID(), name: "Оригинальный", price: 1290 },
                            { id: crypto.randomUUID(), name: "Сироп карамель", price: 1490 },
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        name: "Айс Латте",
                        price: 1390,
                        variants: [
                            { id: crypto.randomUUID(), name: "Классический", price: 1390 },
                            { id: crypto.randomUUID(), name: "Кокосовый", price: 1590 },
                        ],
                    },
                    { id: crypto.randomUUID(), name: "Фраппучино", price: 1790 },
                    { id: crypto.randomUUID(), name: "Флэт Уайт", price: 1390 },
                    {
                        id: crypto.randomUUID(),
                        name: "Раф",
                        price: 1390,
                        variants: [
                            { id: crypto.randomUUID(), name: "Лавандовый", price: 1390 },
                            { id: crypto.randomUUID(), name: "Апельсиновый", price: 1490 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Чай",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Чай",
                products: [
                    { id: crypto.randomUUID(), name: "Черный", price: 300 },
                    { id: crypto.randomUUID(), name: "Зеленый", price: 300 },
                    { id: crypto.randomUUID(), name: "Марокканский", price: 2200 },
                    { id: crypto.randomUUID(), name: "Ташкентский", price: 2200 },
                    { id: crypto.randomUUID(), name: "Малина-имбирь", price: 2200 },
                    { id: crypto.randomUUID(), name: "Облепиха-апельсин", price: 2200 },
                    { id: crypto.randomUUID(), name: "Ягодный", price: 2200 },
                    { id: crypto.randomUUID(), name: "Чай с тары", price: 2200 },
                    { id: crypto.randomUUID(), name: "Молоко", price: 200 },
                    { id: crypto.randomUUID(), name: "Лимон", price: 200 },
                    { id: crypto.randomUUID(), name: "Мёд", price: 200 },
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Лимонад",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Лимонад",
                products: [
                    { id: crypto.randomUUID(), name: "Ягодный", price: 3000 },
                    {
                        id: crypto.randomUUID(),
                        name: "Манго · маракуйя",
                        price: 3000,
                        variants: [
                            { id: crypto.randomUUID(), name: "Манго", price: 3000 },
                            { id: crypto.randomUUID(), name: "Маракуйя", price: 3000 },
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        name: "Киви · лайм",
                        price: 3000,
                        variants: [
                            { id: crypto.randomUUID(), name: "Киви", price: 3000 },
                            { id: crypto.randomUUID(), name: "Лайм", price: 3000 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Соки",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Соки",
                products: [
                    {
                        id: crypto.randomUUID(),
                        name: "Свежие соки",
                        price: 900,
                        variants: [
                            { id: crypto.randomUUID(), name: "Яблоко", price: 900 },
                            { id: crypto.randomUUID(), name: "Апельсин", price: 900 },
                            { id: crypto.randomUUID(), name: "Вишня", price: 900 },
                            { id: crypto.randomUUID(), name: "Ананас", price: 900 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Вода и напитки",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Вода и напитки",
                products: [
                    {
                        id: crypto.randomUUID(),
                        name: "Минеральная вода",
                        price: 600,
                        variants: [
                            { id: crypto.randomUUID(), name: "Без газа", price: 600 },
                            { id: crypto.randomUUID(), name: "С газом", price: 600 },
                        ],
                    },
                    { id: crypto.randomUUID(), name: "Боржоми", price: 1600 },
                    {
                        id: crypto.randomUUID(),
                        name: "Прохладительные напитки",
                        price: 1200,
                        variants: [
                            { id: crypto.randomUUID(), name: "Coca-Cola", price: 1200 },
                            { id: crypto.randomUUID(), name: "Sprite", price: 1200 },
                            { id: crypto.randomUUID(), name: "Fanta", price: 1200 },
                        ],
                    },
                    { id: crypto.randomUUID(), name: "Red Bull", price: 1500 },
                    {
                        id: crypto.randomUUID(),
                        name: "Schweppes",
                        price: 1300,
                        variants: [
                            { id: crypto.randomUUID(), name: "Indian Tonic", price: 1300 },
                            { id: crypto.randomUUID(), name: "Ginger Ale", price: 1300 },
                        ],
                    },
                ],
            },
        ],
    },
];

function attachImages(categories: Category[]): Category[] {
    return categories.map((category) => ({
        ...category,
        subcategories: category.subcategories?.map((subcategory) => ({
            ...subcategory,
            products: subcategory.products.map((product) => ({
                ...product,
                image:
                    product.image ??
                    resolveProductImage({
                        productName: product.name,
                        categoryName: category.name,
                        subcategoryName: subcategory.name,
                    }),
            })),
        })),
    }));
}

export const menu: Category[] = attachImages(baseMenu);
