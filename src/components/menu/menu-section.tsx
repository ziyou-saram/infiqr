"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { useCart } from "@/components/cart/cart-provider"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { menu } from "@/data/menu"
import { resolveProductImage } from "@/data/product-images"
import type { Category, Product, Subcategory } from "@/types/menu"
import { Badge } from "../ui/badge"

const categories: Category[] = menu
const currencyFormatter = new Intl.NumberFormat("ru-RU")

function MenuSection() {
  const cart = useCart()
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
        () => categories[0]?.id ?? null
    )
    const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(
        () => categories[0]?.subcategories?.[0]?.id ?? null
    )

    const selectedCategory = useMemo(() => {
        if (!categories.length) {
            return undefined
        }

        return (
            categories.find((category) => category.id === activeCategoryId) ??
            categories[0]
        )
    }, [activeCategoryId])

    useEffect(() => {
        if (!selectedCategory?.subcategories?.length) {
            setActiveSubcategoryId(null)
            return
        }

        setActiveSubcategoryId((previous) => {
            const exists = selectedCategory.subcategories?.some(
                (subcategory) => subcategory.id === previous
            )

            if (exists) {
                return previous
            }

            return selectedCategory.subcategories?.[0]?.id ?? null
        })
    }, [selectedCategory])

    const selectedSubcategory: Subcategory | undefined = useMemo(() => {
        if (!selectedCategory?.subcategories?.length) {
            return undefined
        }

        return (
            selectedCategory.subcategories.find(
                (subcategory) => subcategory.id === activeSubcategoryId
            ) ?? selectedCategory.subcategories[0]
        )
    }, [activeSubcategoryId, selectedCategory])

    const products = selectedSubcategory?.products ?? []
    const [detailProduct, setDetailProduct] = useState<Product | null>(null)
    const [detailMeta, setDetailMeta] = useState<{
        categoryName?: string
        subcategoryName?: string
    } | null>(null)
    const [detailOpen, setDetailOpen] = useState(false)

    if (!categories.length) {
        return (
            <section className="flex flex-col gap-6">
                <p className="text-muted-foreground text-sm">
                    Меню пока недоступно. Попробуйте обновить страницу позже.
                </p>
            </section>
        )
    }

    return (
        <section className="space-y-12">
            <div className="space-y-6">
                <div className="-mx-4 overflow-x-auto pb-1 scrollbar-none sm:-mx-6 lg:-mx-8">
                    <div className="flex items-center gap-2 px-4 sm:px-6 lg:px-8">
                        {categories.map((category) => {
                            const isActive = category.id === selectedCategory?.id

                            return (
                                <Button
                                    key={category.id}
                                    variant={isActive ? "default" : "ghost"}
                                    onClick={() => setActiveCategoryId(category.id)}
                                    aria-pressed={isActive}
                                    className="rounded-full"
                                >
                                    {category.name}
                                </Button>
                            )
                        })}
                    </div>
                </div>

                {selectedCategory?.subcategories?.length ? (
                    <div className="-mx-4 overflow-x-auto pb-1 scrollbar-none sm:-mx-6 lg:-mx-8">
                        <div className="flex items-center gap-2 px-4 sm:px-6 lg:px-8">
                            {selectedCategory.subcategories.map((subcategory) => {
                                const isActive = subcategory.id === selectedSubcategory?.id

                                return (
                                    <Button
                                        key={subcategory.id}
                                        size="sm"
                                        variant={isActive ? "default" : "ghost"}
                                        onClick={() => setActiveSubcategoryId(subcategory.id)}
                                        aria-pressed={isActive}
                                        className="rounded-full"
                                    >
                                        {subcategory.name}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                ) : null}

                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-black">
                        {selectedCategory?.name ?? "Меню"}
                    </h2>
                    {selectedSubcategory ? (
                        <p className="text-sm text-black/50">{selectedSubcategory.name}</p>
                    ) : null}
                </div>
            </div>

            {products.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            categoryName={selectedCategory?.name}
                            subcategoryName={selectedSubcategory?.name}
                            onPreview={(target) => {
                                setDetailProduct(target)
                                setDetailMeta({
                                    categoryName: selectedCategory?.name,
                                    subcategoryName: selectedSubcategory?.name,
                                })
                                setDetailOpen(true)
                            }}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-black/40">
                    В этой категории пока нет товаров.
                </p>
            )}

      <ProductDetailsOverlay
        product={detailProduct}
        categoryName={detailMeta?.categoryName}
        subcategoryName={detailMeta?.subcategoryName}
        open={detailOpen}
        onOpenChange={(open) => {
                    setDetailOpen(open)
                    if (!open) {
                        setDetailProduct(null)
            setDetailMeta(null)
          }
        }}
        cart={cart}
      />
      <FloatingCartButton />
        </section>
    )
}

export default MenuSection

function CartDrawer({
  triggerClassName,
}: {
  triggerClassName?: string
}) {
  const {
    items,
    itemCount,
    totalPrice,
    updateQuantity,
    removeItem,
    clear,
  } = useCart()
  const hasItems = items.length > 0
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className={cn(
            "rounded-full border border-black/10 bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-black/80",
            triggerClassName
          )}
        >
          {hasItems
            ? `В корзине ${itemCount} · ${currencyFormatter.format(
                totalPrice
              )} ₸`
            : "Корзина пуста"}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className={cn(
          "bg-white",
          isMobile
            ? "h-[85vh] rounded-t-3xl border-t border-black/10"
            : "w-full sm:max-w-md border-l border-black/10"
        )}
      >
        {isMobile ? (
          <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-black/10" />
        ) : null}
        <DrawerHeader
          className={cn(
            "border-b border-black/5 pb-4",
            isMobile ? "px-5 pt-4 text-center" : undefined
          )}
        >
          <DrawerTitle className="text-lg font-semibold text-black">
            Корзина
          </DrawerTitle>
          <p className="text-sm text-black/50">
            {hasItems
              ? `${itemCount} ${
                  itemCount === 1 ? "позиция" : itemCount < 5 ? "позиции" : "позиций"
                }`
              : "Добавьте товары из меню"}
          </p>
        </DrawerHeader>

        <div
          className={cn(
            "flex flex-1 flex-col gap-4 overflow-y-auto pb-4",
            isMobile ? "px-5 pt-4" : "px-4"
          )}
        >
          {hasItems ? (
            items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex gap-3 rounded-xl border border-black/10 bg-black/[0.02] px-3 py-3",
                  isMobile ? "items-center" : undefined
                )}
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/5">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] font-medium uppercase text-muted-foreground">
                      Без фото
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-tight text-black">
                        {item.name}
                      </p>
                      {item.variantName ? (
                        <p className="text-xs font-medium text-black/60">
                          {item.variantName}
                        </p>
                      ) : null}
                      {item.variantDescription ? (
                        <p className="text-xs text-black/40">
                          {item.variantDescription}
                        </p>
                      ) : null}
                      {item.description ? (
                        <p className="text-xs leading-snug text-black/40">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-black/40 hover:text-black"
                      onClick={() => removeItem(item.id)}
                      aria-label="Удалить из корзины"
                    >
                      x
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Уменьшить количество"
                        className="border-black/10 text-black hover:border-black/30"
                      >
                        -
                      </Button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Увеличить количество"
                        className="border-black/10 text-black hover:border-black/30"
                      >
                        +
                      </Button>
                    </div>
                    <span className="text-sm font-semibold text-black">
                      {currencyFormatter.format(item.price * item.quantity)} ₸
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-black/20 py-10 text-sm text-black/40">
              Корзина пока пуста
            </div>
          )}
        </div>

        <DrawerFooter
          className={cn(
            "border-t border-black/5 pt-4",
            isMobile ? "px-5 pb-6" : undefined
          )}
        >
          <div className="flex items-center justify-between text-sm font-medium text-black">
            <span>Итого</span>
            <span>{currencyFormatter.format(totalPrice)} ₸</span>
          </div>
          <Button
            disabled={!hasItems}
            size="lg"
            className="rounded-full bg-black text-white hover:bg-black/80"
            onClick={() => {
              if (!hasItems) {
                return
              }
              setOpen(false)
              router.push("/checkout")
            }}
          >
            Перейти к оформлению
          </Button>
          <Button
            variant="ghost"
            onClick={clear}
            disabled={!hasItems}
            className="text-black/50 hover:text-black"
          >
            Очистить корзину
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ProductCard({
    product,
    categoryName,
    subcategoryName,
    onPreview,
}: {
    product: Product
    categoryName?: string
    subcategoryName?: string
    onPreview?: (product: Product) => void
}) {
    const { addItem } = useCart()
    const description = product.description ?? subcategoryName ?? categoryName
    const variants = product.variants ?? []
    const hasVariants = variants.length > 0
    const basePrice = hasVariants
        ? Math.min(...variants.map((variant) => variant.price))
        : product.price
    const priceLabel = `${hasVariants ? "от " : ""}${currencyFormatter.format(
        basePrice
    )} ₸`
    const imageSrc =
        product.image ??
        resolveProductImage({
            productName: product.name,
            categoryName,
            subcategoryName,
        })

    const handleQuickAdd = () => {
        if (hasVariants) {
            onPreview?.(product)
            return
        }

        addItem(product)
    }

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-4xl bg-white transition">
            <div className="relative">
                <AspectRatio ratio={4 / 3} className="rounded-2xl">
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 260px, (min-width: 640px) 280px, 100vw"
                    />
                </AspectRatio>
                <Badge className="absolute left-3 top-3 rounded-full bg-background" variant={'outline'}>
                    {categoryName ?? "Меню"}
                </Badge>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="text-base font-semibold text-black">
                            {product.name}
                        </h3>
                        {description ? (
                            <p className="text-sm text-black/50 line-clamp-2">{description}</p>
                        ) : null}
                    </div>
                    <Badge>
                        {priceLabel}
                    </Badge>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="rounded-full border-black/10 px-4 text-sm font-semibold text-black hover:border-black/40"
                            onClick={() => onPreview?.(product)}
                        >
                            Подробнее
                        </Button>
                        <Button
                            onClick={handleQuickAdd}
                            className="rounded-full"
                        >
                            {hasVariants ? "Выбрать" : "В корзину"}
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    )
}

function FloatingCartButton() {
    return (
        <CartDrawer triggerClassName="fixed bottom-6 right-6 z-50 px-6 py-3 text-base sm:bottom-8 sm:right-10" />
    )
}

function ProductDetailsOverlay({
  product,
  categoryName,
  subcategoryName,
  open,
  onOpenChange,
  cart,
}: {
  product: Product | null
  categoryName?: string
  subcategoryName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: ReturnType<typeof useCart>
}) {
  const { addItem } = cart
    const isMobile = useIsMobile()
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)

  const variants = useMemo(() => product?.variants ?? [], [product])

    useEffect(() => {
        if (!product) {
            setSelectedVariantId(null)
            return
        }
        if (variants.length) {
            setSelectedVariantId(variants[0]?.id ?? null)
        } else {
            setSelectedVariantId(null)
        }
    }, [product, variants])

    if (!product) {
        return null
    }

    const activeVariant = variants.find(
        (variant) => variant.id === selectedVariantId
    )

    const priceLabel = `${currencyFormatter.format(
        activeVariant?.price ?? product.price
    )} ₸`
    const description = product.description ?? subcategoryName ?? categoryName
    const variantDescription = activeVariant?.description

    const handleAddToCart = () => {
        addItem(product, activeVariant)
        onOpenChange(false)
    }

    const media = (
        <div className="overflow-hidden rounded-3xl">
            <AspectRatio ratio={4 / 3}>
                <Image
                    src={
                        product.image ??
                        resolveProductImage({
                            productName: product.name,
                            categoryName,
                            subcategoryName,
                        })
                    }
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 520px, 100vw"
                />
            </AspectRatio>
        </div>
    )

    const content = (
        <div className="flex flex-col gap-6">
            {media}
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-semibold leading-tight text-foreground">
                            {product.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {categoryName ? (
                                <span className="rounded-full bg-muted px-3 py-1">
                                    {categoryName}
                                </span>
                            ) : null}
                            {subcategoryName ? (
                                <span className="rounded-full bg-muted px-3 py-1">
                                    {subcategoryName}
                                </span>
                            ) : null}
                        </div>
                    </div>
                    <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20">
                        {priceLabel}
                    </span>
                </div>
                {variants.length ? (
                    <div className="flex flex-wrap gap-2">
                        {variants.map((variant) => {
                            const isActive = variant.id === activeVariant?.id
                            return (
                                <Button
                                    key={variant.id}
                                    variant={isActive ? "default" : "outline"}
                                    className={cn(
                                        "rounded-full border px-4 py-2 text-sm shadow-sm transition",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-primary/25"
                                            : "bg-white/80 text-muted-foreground hover:bg-white"
                                    )}
                                    onClick={() => setSelectedVariantId(variant.id)}
                                >
                                    {variant.name}
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        {currencyFormatter.format(variant.price)} ₸
                                    </span>
                                </Button>
                            )
                        })}
                    </div>
                ) : null}
                {description ? (
                    <p className="text-base leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                ) : null}
                {variantDescription ? (
                    <p className="text-sm text-muted-foreground">{variantDescription}</p>
                ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => onOpenChange(false)}
                >
                    Закрыть
                </Button>
                <Button
                    className="rounded-full bg-primary shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30"
                    onClick={handleAddToCart}
                >
                    Добавить в корзину
                </Button>
            </div>
        </div>
    )

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="h-[85vh] rounded-t-[32px] border-0 bg-white/95 backdrop-blur">
                    <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-muted-foreground/30" />
                    <div className="h-full overflow-y-auto px-6 pb-8 pt-6">{content}</div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl border-white/70 bg-white/95 shadow-[0_18px_60px_-20px_rgba(55,84,170,0.45)]">
                <DialogHeader className="sr-only">
                    <DialogTitle>{product.name}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6">
                    {content}
                </div>
                <DialogFooter className="sr-only" />
            </DialogContent>
        </Dialog>
    )
}
