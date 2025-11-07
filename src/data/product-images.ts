const keywordTopics: Array<{ keywords: string[]; topics: string[] }> = [
    {
        keywords: ["вино", "pinot", "campo", "шардоне", "cabernet", "merlot", "brancott"],
        topics: ["wine", "red wine"],
    },
    {
        keywords: ["ром", "rum", "bacardi", "havana"],
        topics: ["rum", "cocktail"],
    },
    {
        keywords: ["игрист", "sparkling", "brut", "rose", "шампан"],
        topics: ["sparkling wine", "champagne"],
    },
    {
        keywords: ["виски", "whisky", "scotch", "ballantine", "jameson", "chivas", "glelivet"],
        topics: ["whisky", "scotch"],
    },
    {
        keywords: ["водк", "vodka", "absolut", "кызылжар"],
        topics: ["vodka", "shots"],
    },
    {
        keywords: ["конья", "cognac", "brandy", "martell", "арарат"],
        topics: ["cognac", "brandy"],
    },
    {
        keywords: ["текил", "olmeca"],
        topics: ["tequila", "agave"],
    },
    {
        keywords: ["пиво", "beer", "bud", "heineken", "corona", "guiness", "kozel", "miller"],
        topics: ["beer", "pint"],
    },
    {
        keywords: ["джин", "gin", "beefeater"],
        topics: ["gin", "cocktail"],
    },
    {
        keywords: ["закус", "snack", "арахис", "фисташ", "чипсы", "чечел"],
        topics: ["bar snacks", "nuts"],
    },
    {
        keywords: ["кофе", "эспрессо", "американо", "капучино", "латте", "раф", "флэт"],
        topics: ["coffee", "barista"],
    },
    {
        keywords: ["айс", "ice", "cold", "фраппучино"],
        topics: ["iced coffee", "frappe"],
    },
    {
        keywords: ["чай"],
        topics: ["tea", "teapot"],
    },
    {
        keywords: ["лимонад"],
        topics: ["lemonade", "citrus"],
    },
    {
        keywords: ["сок"],
        topics: ["fresh juice", "fruit juice"],
    },
    {
        keywords: ["вода", "боржоми", "borjomi", "cola", "sprite", "fanta", "red bull", "schweppes"],
        topics: ["soft drink", "sparkling water"],
    },
]

const defaultTopics = ["drink", "bar"]
const imageWidth = 800
const imageHeight = 600

function buildSeed(...parts: Array<string | undefined>) {
    return parts
        .filter((part) => Boolean(part && part.trim().length))
        .join("|")
        .toLowerCase()
}

function createStableLock(seed: string) {
    let hash = 0

    for (const char of seed) {
        hash = (hash * 131 + char.charCodeAt(0)) % 997
    }

    const normalized = (hash + 997) % 997
    return normalized === 0 ? 1 : normalized
}

function sanitiseTopics(topics: string[]) {
    return topics
        .map((topic) =>
            topic
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
        )
        .filter((topic) => topic.length > 0)
}

function buildImagePath(topics: string[], seed: string) {
    const safeTopics = sanitiseTopics(topics)
    const topicPath = safeTopics.length ? safeTopics.join(",") : "menu"
    const lock = createStableLock(seed)

    return `https://loremflickr.com/${imageWidth}/${imageHeight}/${topicPath}?lock=${lock}`
}

export function resolveProductImage({
    productName,
    categoryName,
    subcategoryName,
}: {
    productName: string
    categoryName?: string
    subcategoryName?: string
}) {
    const haystacks = [
        productName,
        categoryName ?? "",
        subcategoryName ?? "",
    ].map((value) => value.toLowerCase())
    const seed = buildSeed(productName, categoryName, subcategoryName)

    for (const entry of keywordTopics) {
        const hasMatch = entry.keywords.some((keyword) =>
            haystacks.some((haystack) => haystack.includes(keyword))
        )

        if (hasMatch) {
            return buildImagePath(entry.topics, seed)
        }
    }

    return buildImagePath(defaultTopics, seed)
}
