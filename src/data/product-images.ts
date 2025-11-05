const keywordImages: Array<{ keywords: string[]; src: string }> = [
  {
    keywords: ["вино", "pinot", "campo", "шардоне", "cabernet", "merlot", "brancott"],
    src: "/images/wine.svg",
  },
  {
    keywords: ["ром", "rum", "bacardi", "havana"],
    src: "/images/rum.svg",
  },
  {
    keywords: ["игрист", "sparkling", "brut", "rose", "шампан"],
    src: "/images/sparkling.svg",
  },
  {
    keywords: ["виски", "whisky", "scotch", "ballantine", "jameson", "chivas", "glelivet"],
    src: "/images/whisky.svg",
  },
  {
    keywords: ["водк", "vodka", "absolut", "кызылжар"],
    src: "/images/vodka.svg",
  },
  {
    keywords: ["конья", "cognac", "brandy", "martell", "арарат"],
    src: "/images/brandy.svg",
  },
  {
    keywords: ["текил", "olmeca"],
    src: "/images/tequila.svg",
  },
  {
    keywords: ["пиво", "beer", "bud", "heineken", "corona", "guiness", "kozel", "miller"],
    src: "/images/beer.svg",
  },
  {
    keywords: ["джин", "gin", "beefeater"],
    src: "/images/gin.svg",
  },
  {
    keywords: ["закус", "snack", "арахис", "фисташ", "чипсы", "чечел"],
    src: "/images/snack.svg",
  },
  {
    keywords: ["кофе", "эспрессо", "американо", "капучино", "латте", "раф", "флэт"],
    src: "/images/coffee.svg",
  },
  {
    keywords: ["айс", "ice", "cold", "фраппучино"],
    src: "/images/iced-coffee.svg",
  },
  {
    keywords: ["чай"],
    src: "/images/tea.svg",
  },
  {
    keywords: ["лимонад"],
    src: "/images/lemonade.svg",
  },
  {
    keywords: ["сок"],
    src: "/images/juice.svg",
  },
  {
    keywords: ["вода", "боржоми", "borjomi", "cola", "sprite", "fanta", "red bull", "schweppes"],
    src: "/images/water.svg",
  },
]

const defaultImage = "/images/water.svg"

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

  for (const entry of keywordImages) {
    if (
      entry.keywords.some((keyword) =>
        haystacks.some((haystack) => haystack.includes(keyword))
      )
    ) {
      return entry.src
    }
  }

  return defaultImage
}
