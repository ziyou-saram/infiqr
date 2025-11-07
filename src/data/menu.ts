// src/data/menu.ts

import type { Category, Product, ProductVariant } from "@/types/menu"
import { resolveProductImage } from "./product-images"

type ProductOverrides = Partial<Omit<Product, "id" | "name" | "price" | "variants">> & {
    variants?: Array<Omit<ProductVariant, "id"> & Partial<Pick<ProductVariant, "id">>>
}

const manualProductImages: Record<string, string> = {
    "Absolut Blue 50мл": "https://static.insales-cdn.com/images/products/1/7075/988969891/img_products_absolut-vodka-500ml-scaled.webp",
    "Asti Martini Ice/Rose": "https://elitclub.kz/upload/images/83286_6081_09.jpeg",
    "Bacardi Carta Blanca/Negra": "https://elitclub.kz/upload/images/18288_108412_14.jpg",
    "Beefeater": "https://www.pernod-ricard.com/sites/default/files/styles/brand_tile_3_in_row_desktop_958x1048_/public/2021-05/Beefeater_KV_958x1048_0.jpg.jpg?itok=Oc4MUxL3",
    "Brancott Estate Pinot Noir кр.сух": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4p7-s2l_RBrIsDdkrYdpydHS7-EteTkF3JQ&s",
    "Budweiser Budvar": "https://diceys.com/wp-content/uploads/2020/11/Budejovicky-Budvar.jpg",
    "Café de Paris Brut/Rose": "https://provencerose.com/cdn/shop/files/CafedeParisbrutrose-old.png?v=1753997884",
    "Campo Viejo Blanco б.сух": "https://elitclub.kz/upload/images/91231_964060_14.jpg",
    "Campo Viejo Rose": "https://ndddistribution.com/inc/i04/media/u3/1702484096894.jpg",
    "Chivas Regal 12YO": "https://elitclub.kz/upload/images/37801_307340_14.jpg",
    "Chivas Regal 18YO": "https://m.media-amazon.com/images/I/71Ig+3pzW0L.jpg",
    "Coca-Cola / Sprite / Fanta": "https://upload.wikimedia.org/wikipedia/commons/2/27/Coca_Cola_Flasche_-_Original_Taste.jpg",
    "Corona Extra 0,355": "https://alcomag.kz/assets/2020/10/11/17/30/2020_10_11_17_30_21_.jpg",
    "Glelivet 12YO": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0qs5Y-Q-j00b5NBhEzqo5ziMXTO4i6PwH5A&s",
    "Glelivet Reserve": "https://static.insales-cdn.com/r/SR9XLCTVFeY/rs:fit:1000:0:1/q:100/plain/images/products/1/5042/1014420402/img_products_kk.webp@webp",
    "Gray Goose 50мл": "https://www.craftginclub.co.uk/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fcgc-web%2FOTc0MDZmYTQtZmJmMC00ZmY5LWE4NWQtMDM0NjM0MTg4Nzdj_greygoosevodka.jpg%3Fauto%3Dcompress%2Cformat%26rect%3D0%2C0%2C640%2C400%26w%3D640%26h%3D400&w=2058&q=75",
    "Guiness Draught": "https://static.insales-cdn.com/r/UfN91YI07Sk/rs:fit:1000:0:1/q:100/plain/images/products/1/2477/1004513709/5000213101872.jpg@jpg",
    "Havana club 3YO": "https://www.thetipplecellar.com/image_resize/back/w1500/products/4194/4275670276.png",
    "Heineken": "https://elitclub.kz/upload/images/11333_134586_14.jpeg",
    "Jacob's Creek Classic Chardonnay б.сух": "https://elitclub.kz/upload/images/18777_584320_14.jpg",
    "Jacob's Creek Shiraz Cabernet кр.п/сух": "https://images.deliveryhero.io/image/darkstores/hk/QX817K.jpg?height=480",
    "Jameson": "https://tootapp.kz/wp-content/uploads/2023/12/312123-816.png",
    "Kozel": "https://cdn11.bigcommerce.com/s-55de4/images/stencil/original/products/3884/10717/Koze__06834.1757573163.jpg?c=2",
    "Lambrusco Bianco/Rossato": "https://winexpert.kz/48-large_default/lambrusco-rose-di-bacco-bianco-ламбруско-розе-ди-бакко-бьянко.jpg",
    "Martell V.S": "https://elitclub.kz/upload/images/26061_877885_04.jpg",
    "Martini Bianco": "https://alcomag.kz/assets/2020/10/11/17/15/2020_10_11_17_15_31_.jpg",
    "Miller 0,5": "https://elitclub.kz/upload/images/54679_474731_14.jpeg",
    "Niko Pirosmani Киндзмараули кр.п/сл": "https://winexpert.kz/374-large_default/пиросмани-.jpg",
    "Olmeca Blanco, Gold": "https://static.insales-cdn.com/r/mLP40axvMtg/rs:fit:1000:0:1/q:100/plain/images/products/1/1921/2035287937/72848_381689_14.jpg@jpg",
    "Pavao Loureiro б.п/сух": "https://elitclub.kz/upload/images/30376_141287_14.jpg",
    "Prosecco Martini": "https://en.excaliburshop.com/uploads/item/12961/template/108/images/0-martini-prosecco-rose-11-5-obj-0-75-l-170224-martiniproseccorose.jpg",
    "Red Bull": "https://images.albertsons-media.com/is/image/ABS/108102209-C1N1?$ng-ecom-pdp-desktop$&defaultImage=Not_Available",
    "Schweppes": "https://www.coca-cola.com/content/dam/onexp/in/en/brands/schweppes/schweppes_range_shot_updated.png",
    "Айс Капучино": "https://images.ctfassets.net/v601h1fyjgba/1eje3eJjFrd8FkYxT2jniv/1bd8c902f5e48d95fdd3183c9993ed04/Lite_Iced_Cappuccino_Hi__1_.jpg",
    "Айс Латте": "https://images.ctfassets.net/v601h1fyjgba/1eje3eJjFrd8FkYxT2jniv/1bd8c902f5e48d95fdd3183c9993ed04/Lite_Iced_Cappuccino_Hi__1_.jpg",
    "Американо": "https://www.gourmetkava.cz/modules/ph_simpleblog/featured/82.jpg",
    "Арарат 3YO 50мл": "https://static.insales-cdn.com/images/products/1/3443/988654963/img_products_ararat-3yo-500ml.webp",
    "Арарат 5YO 50мл": "https://static.insales-cdn.com/images/products/1/3703/988655223/img_products_ararat-5yo-500ml-1.webp",
    "Арахис": "https://cdnn21.img.ria.ru/images/07e5/03/0b/1600796096_437:0:1717:1280_1920x0_80_0_0_9d1ced8bf7b0e3a8faeea1794d590a27.jpg",
    "Боржоми": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Borjomi_1%2C0L.tif/lossy-page1-847px-Borjomi_1%2C0L.tif.jpg",
    "Ванильный / шоколадный / клубничный": "https://images.unsplash.com/photo-1648580967100-436583074ea0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1760",
    "Зеленый": "https://admin.newtea.ua/files/styles/blog_mobile_webp/public/blog/zeleniy-chay-korist-dlya-shkiri.png.webp?itok=3wZ79aHX",
    "Казахстан 3YO 50мл": "https://luxalcomarket.kz/assets/images/products/4870044001310.jpg",
    "Капучино": "https://recettes.vedrenne.fr/1269-large_default/gingerbread-cappuccino.jpg",
    "Киви · лайм": "https://images.unsplash.com/photo-1754594537133-796eb54f206c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340",
    "Клаб сендвич": "https://burninghut.ru/wp-content/uploads/2025/01/s-5.jpeg",
    "Круассан с курицей": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO7ggBfjSd8lqBNflb-P4Zq6JFRVPFonxlMQ&s",
    "Круассан с семгой": "https://ecomarket.ru/imgs/products/18147/kruassan-s-semgoy-1.jpg",
    "Кызылжар 50мл": "https://elitclub.kz/upload/images/37498_380255_09.jpeg",
    "Латте": "https://cornercoffeestore.com/wp-content/uploads/2020/01/how-to-make-a-latte-at-home.jpg",
    "Лимон": "https://images.gastronom.ru/XctNomD4T0ZvEooL-1Val5vxtQnZ8pSb7KbQLde11mQ/pr:product-preview-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzLzcxNWU0MDk3LWE3M2MtNGFhMS1hZTI2LWU5YzkxNGZlNTNhZC5qcGc.webp",
    "Малина-имбирь": "https://www.osteria.ru/upload/resize_cache/webp/iblock/141/bgq3pmpdndwzqr14cokqszbrkkpedg6d/малина%20имбирь%20копия.webp",
    "Манго · маракуйя": "https://images.unsplash.com/photo-1754594537133-796eb54f206c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340",
    "Марокканский": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkYdTbWrog9WpGh1d0sF8ETSkA4HbLY8-_nw&s",
    "Минеральная вода (без газа / с газом)": "https://img.fix-price.kz/insecure/rs:fit:800:800/plain/bit/_marketplace/images/origin/8c/8cbda56efbf843888fdf8d3bbf7f908e.jpg",
    "Молоко": "https://syromaniya.ru/upload/iblock/947/uzewxab5phe3iwkn2b79af7vypbqfhsd/Без%20имени-1.jpg",
    "Мёд": "https://qwintry.store/images/ck/photo-1587049352851-8d4e89133924_1627053828.jpg",
    "Облепиха-апельсин": "https://img.iamcook.ru/2023/upl/recipes/cat/u-c3107a8569884c21b5c4efb758e4c0c7.jpg",
    "Панини с индейкой": "https://grandkulinar.ru/uploads/posts/2012-11/1353989945_panini-s-indeykoy-salatom-romen.jpg",
    "Панна-котта": "https://dikoed.ru/upload/iblock/74e/15598-klubnichnaya-panna-kotta.jpg",
    "Печенье Chunky": "https://api.technodom.kz/f3/api/v1/images/800/800/af_68f1e8f7295e61b0041841fa06fbebdf.jpg",
    "Раф": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTolIAZ9NHmQ5bDhzR_XC_nGyFcKpcQVNj7HA&s",
    "Сироп в ассортименте": "https://www.redber.co.uk/cdn/shop/products/simply-syrups-coffee-standard-caramel-vanilla-hazelnut-3x-1L.jpg?v=1655364356&width=1200",
    "Ташкентский": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSasOXgOrrJXGeyyJ5Gkiw31x9FFx1e-MNd0A&s",
    "Тирамису классика": "https://vkusvill.ru/upload/resize/667645/tiramisu-klassicheskiy_588x409x90_c.webp",
    "Тирамису фисташка": "https://ic.pics.livejournal.com/anti_pasto/76822948/26506/26506_900.jpg",
    "Фисташки": "https://minio.clevermart.kz/food/images/2022/5/17/3e80820b-e53d-480e-afb9-33a475b0ee50/M_2103666_1.jpg",
    "Флэт Уайт": "https://methodicalcoffee.com/cdn/shop/articles/Flat_white_sitting_on_a_table_af78d6b5-75ea-4f88-bec7-6505412042f8.jpg?v=1761756646&width=1200",
    "Фраппучино": "https://lonegoosebakery.com/wp-content/uploads/2025/04/main-caramel-frappuccino-image-500x375.jpg",
    "Чай с тары": "https://avatars.mds.yandex.net/i?id=8ca3d25ddd01ae3c06112af17f7b386910f57b64-10153545-images-thumbs&n=13",
    "Черный": "https://cdn.shopify.com/s/files/1/0022/1393/7252/articles/Benefits-of-Drinking-Black-Tea-thumbnail.jpg?v=1660832924",
    "Черный бургер": "https://buloshnaya.org/wp-content/uploads/2018/07/черный-бургер2.jpg",
    "Чечел": "https://cheezu.ru/wp-content/uploads/2020/09/cheezu-chechil.jpg",
    "Чипсы Lay's": "https://arbuz.kz/image/s3/arbuz-kz-products/image__266836-chipsy_lays_riflenye_lobster_140_g.jpg?_c=1760617929",
    "Шоколад плитка Alpin Gold": "https://img.fix-price.kz/insecure/rs:fit:800:800/plain/bit/_marketplace/images/origin/da/da65c62260b922970a46a65c13bd8977.jpg",
    "Шоколад плитка Казахстан": "https://kalam.kz/upload/iblock/e4e/hxy5zapcaovtmybhqao10kfl1t2ij40w/kalam_kz_shokolad_rakhat_100gr_kazakhstanskiy_plitka.png",
    "Шоколад плитка Рахат Perfection": "https://www.rakhat.kz/app/uploads/cache/2022/08/Rahat-80-Perfectio100g400h300-800x600-c-default.jpg",
    "Эспрессо": "https://www.tasteofhome.com/wp-content/uploads/2023/03/TOH-espresso-GettyImages-1291298315-JVcrop.jpg?fit=700",
    "Эспрессо Тоник": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7Ok06Pr24o4GN8RfBS9kRfjhVES0Zmwp-Nw&s",
    "Ягодный": "https://e52e3ee2-628b-49a9-9e26-e5a61fd72b20.selcdn.net/upload/resize_cache/iblock/35e/1920_1080_1/ЯГОДНЫЙ%20ЧАЙ.jpg",
    "Ягодный лимонад": "https://images.unsplash.com/photo-1754594537133-796eb54f206c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340",
    "Кесадилья с курицей": "https://nasha.severnaya.ru/upload/iblock/7f2/8gmobweyxbhm2v1ierwerm4m7327nsxc.jpg",
    "Клаб сэндвич с курицей": "https://cdnn21.img.ria.ru/images/07e9/02/0e/1999408821_0:0:3072:1728_1920x0_80_0_0_ee6beb282d3084c50ee494a3b3c46580.jpg"
}

const fallbackMenuImage =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200"

function createProduct(
    name: string,
    price: number,
    overrides: ProductOverrides = {}
): Product {
    const { variants: overrideVariants, image, ...rest } = overrides

    const variants =
        overrideVariants?.map((variant) => ({
            id: variant.id ?? crypto.randomUUID(),
            ...variant,
        })) ?? undefined

    const resolvedImage = image ?? manualProductImages[name]

    return {
        id: crypto.randomUUID(),
        name,
        price,
        variants,
        image: resolvedImage,
        ...rest,
    }
}

const baseMenu: Category[] = [
    {
        id: crypto.randomUUID(),
        name: "Алкоголь",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Вино (бут.)",
                products: [
                    createProduct("Niko Pirosmani Киндзмараули кр.п/сл", 0, {
                        priceLabel: "—",
                        available: false,
                    }),
                    createProduct("Jacob's Creek Shiraz Cabernet кр.п/сух", 0, {
                        priceLabel: "—",
                        available: false,
                    }),
                    createProduct("Pavao Loureiro б.п/сух", 0, {
                        priceLabel: "—",
                        available: false,
                    }),
                    createProduct("Brancott Estate Pinot Noir кр.сух", 18000),
                    createProduct("Campo Viejo Blanco б.сух", 14000),
                    createProduct("Campo Viejo Rose", 15000),
                    createProduct("Jacob's Creek Classic Chardonnay б.сух", 12000),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Игристое вино",
                products: [
                    createProduct("Lambrusco Bianco/Rossato", 0, {
                        priceLabel: "—",
                        available: false,
                    }),
                    createProduct("Prosecco Martini", 0, {
                        priceLabel: "—",
                        available: false,
                    }),
                    createProduct("Asti Martini Ice/Rose", 0, {
                        priceLabel: "—",
                        available: false,
                    }),
                    createProduct("Café de Paris Brut/Rose", 16500),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Ром (50мл)",
                products: [
                    createProduct("Havana club 3YO", 1690),
                    createProduct("Bacardi Carta Blanca/Negra", 1890, {
                        description: "Carta Blanca, Carta Negra",
                    }),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Джин",
                products: [
                    createProduct("Beefeater", 1700),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Пиво Бутылочное",
                products: [
                    createProduct("Budweiser Budvar", 2500),
                    createProduct("Miller 0,5", 1800),
                    createProduct("Corona Extra 0,355", 2500),
                    createProduct("Heineken", 2000),
                    createProduct("Guiness Draught", 2600),
                    createProduct("Kozel", 2600),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Виски (50мл)",
                products: [
                    createProduct("Ballantine’s Finest 3 YO", 1900),
                    createProduct("Jameson", 2300),
                    createProduct("Chivas Regal 12YO", 3400),
                    createProduct("Chivas Regal 18YO", 4700),
                    createProduct("Glelivet Reserve", 4100),
                    createProduct("Glelivet 12YO", 4500),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Водка (50мл)",
                products: [
                    createProduct("Кызылжар 50мл", 1100),
                    createProduct("Absolut Blue 50мл", 1500),
                    createProduct("Gray Goose 50мл", 0, {
                        priceLabel: "—",
                        available: false,
                    }),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Вермуты (100мл)",
                products: [
                    createProduct("Martini Bianco", 0, {
                        priceLabel: "—",
                        available: false,
                    }),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Коньяк (50мл)",
                products: [
                    createProduct("Казахстан 3YO 50мл", 1400),
                    createProduct("Арарат 3YO 50мл", 1400),
                    createProduct("Арарат 5YO 50мл", 1600),
                    createProduct("Martell V.S", 3300),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Текила (50мл)",
                products: [
                    createProduct("Olmeca Blanco, Gold", 1800, {
                        description: "Доступны Blanco и Gold",
                    }),
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
                    createProduct("Американо", 990),
                    createProduct("Эспрессо", 790),
                    createProduct("Эспрессо Тоник", 1690),
                    createProduct("Капучино", 1290),
                    createProduct("Латте", 1390),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Айс",
                products: [
                    createProduct("Айс Капучино", 1290),
                    createProduct("Айс Латте", 1390),
                    createProduct("Фраппучино", 1790),
                    createProduct("Флэт Уайт", 1390),
                    createProduct("Раф", 1390),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Добавки",
                products: [
                    createProduct("Сироп в ассортименте", 150, {
                        description: "Выберите любимый сироп к кофейному напитку",
                    }),
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
                    createProduct("Черный", 300, {
                        variants: [
                            { name: "0,25 л", price: 300 },
                            { name: "0,7 л", price: 800 },
                        ],
                    }),
                    createProduct("Зеленый", 300, {
                        variants: [
                            { name: "0,25 л", price: 300 },
                            { name: "0,7 л", price: 800 },
                        ],
                    }),
                    createProduct("Марокканский", 2200),
                    createProduct("Ташкентский", 2200),
                    createProduct("Малина-имбирь", 2200),
                    createProduct("Облепиха-апельсин", 2200),
                    createProduct("Ягодный", 2200),
                    createProduct("Чай с тары", 2200),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Дополнительно",
                products: [
                    createProduct("Молоко", 200),
                    createProduct("Лимон", 200),
                    createProduct("Мёд", 200),
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Милкшейк",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Милкшейк",
                products: [
                    createProduct("Ванильный / шоколадный / клубничный", 0, {
                        available: false,
                        priceLabel: "—",
                        description: "Вкусы: ванильный, шоколадный, клубничный",
                    }),
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
                name: "Лимонад (1 л)",
                products: [
                    createProduct("Ягодный лимонад", 3000),
                    createProduct("Манго · маракуйя", 3000),
                    createProduct("Киви · лайм", 3000),
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
                name: "Свежие соки",
                products: [
                    createProduct("Сок яблоко / апельсин / вишня / ананас", 900, {
                        description: "Вкусы: яблоко, апельсин, вишня, ананас",
                        variants: [
                            { name: "0,25 л", price: 900 },
                            { name: "1 л", price: 2000 },
                        ],
                    }),
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
                name: "Вода и прохладительные напитки",
                products: [
                    createProduct("Минеральная вода (без газа / с газом)", 600),
                    createProduct("Боржоми", 1600),
                    createProduct("Coca-Cola / Sprite / Fanta", 1200, {
                        description: "Классические прохладительные напитки",
                    }),
                    createProduct("Red Bull", 1500),
                    createProduct("Schweppes", 1300),
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Снеки и десерты",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "К пиву",
                products: [
                    createProduct("Арахис", 1400),
                    createProduct("Фисташки", 1400),
                    createProduct("Чечел", 1400),
                    createProduct("Чипсы Lay's", 1400),
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "К чаю",
                products: [
                    createProduct("Шоколад мини", 0, {
                        available: false,
                        priceLabel: "—",
                    }),
                    createProduct("Печенье Chunky", 0, {
                        available: false,
                        priceLabel: "—",
                    }),
                    createProduct("Шоколад плитка Казахстан", 0, {
                        available: false,
                        priceLabel: "—",
                    }),
                    createProduct("Шоколад плитка Alpin Gold", 0, {
                        available: false,
                        priceLabel: "—",
                    }),
                    createProduct("Шоколад плитка Рахат Perfection", 0, {
                        available: false,
                        priceLabel: "—",
                    }),
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Выпечка",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Выпечка",
                products: [
                    createProduct("Кесадилья с курицей", 1950),
                    createProduct("Клаб сэндвич с курицей", 1950),
                    createProduct("Круассан с курицей", 1950),
                    createProduct("Круассан с семгой", 2250),
                    createProduct("Панини с индейкой", 1950),
                    createProduct("Черный бургер", 3000),
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Десерты",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Десерты",
                products: [
                    createProduct("Тирамису классика", 2400),
                    createProduct("Тирамису фисташка", 2500),
                    createProduct("Панна-котта", 2000),
                    createProduct('Павлова', 2750),
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Салаты",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Салаты",
                products: [
                    createProduct("Хрустящие баклажаны", 3500, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("С рукколой, креветками и кремом из авокадо", 3900, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Микс-салат с запечёнными овощами с твороженным сыром и апельсином", 3800, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Теплый салат из телятины", 4000, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("«Цезарь» с курицей", 3600, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("«Цезарь» с лососем", 4000, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Греческий с фирменной заправкой", 3500, {
                        image: fallbackMenuImage,
                    }),
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Закуски",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Закуски",
                products: [
                    createProduct("Крылья с соусом BBQ", 3500, {
                        image: fallbackMenuImage,
                    }),
                    createProduct(
                        "Колбаски с капустой и горчицей в ассортименте (говядина, баранина, конина, курица)",
                        3900,
                        { image: fallbackMenuImage }
                    ),
                    createProduct("Лосось собственного посола с манго и авокадо", 4200, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Креветки жаренные в пикантном соусе", 4600, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Мидии в створках под сливочным соусом", 4900, {
                        image: fallbackMenuImage,
                    }),
                    createProduct(
                        "Сет к пенному (креветки, баранье семечки, луковые кольца, кольца кальмара, чесночные гренки, чечил жареный, мини чебуреки, сырные палочки, 3 соуса) на компанию 5-6 чел",
                        19000,
                        { image: fallbackMenuImage }
                    ),
                    createProduct("Мини сет к пенному (на 2 человека)", 8000, {
                        image: fallbackMenuImage,
                    }),
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Супы",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Супы",
                products: [
                    createProduct("Том-ям с морепродуктами", 4300, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Рамен (говядина, курица)", 3600, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Солянка сборная мясная", 3900, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Крем-суп чечевичный с гренками и зеленым маслом", 3200, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Крем-суп «Капучино» грибной с эспума из сливок", 3400, {
                        image: fallbackMenuImage,
                    }),
                ],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "Вторые блюда",
        subcategories: [
            {
                id: crypto.randomUUID(),
                name: "Вторые блюда",
                products: [
                    createProduct("Стейк из лосося (соус, лимон, маслины)", 7500, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Рибай (микс салата, жареные черри, соус)", 8000, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Ростбиф с клюквенным соусом", 7500, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Феттучини с морепродуктами", 5500, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Карбонара", 4500, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Паста «Альфредо»", 4300, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Пад тай (рис, овощи, говядина)", 4500, {
                        image: fallbackMenuImage,
                    }),
                    createProduct("Вок удон", 0, {
                        image: fallbackMenuImage,
                        variants: [
                            { name: 'Курица', price: 3800 },
                            { name: 'Говядина', price: 4000 }
                        ]
                    }),
                    createProduct("Манты рубленые", 4500, {
                        image: fallbackMenuImage,
                    }),
                ],
            },
        ],
    },
]

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
    }))
}

export const menu: Category[] = attachImages(baseMenu)
