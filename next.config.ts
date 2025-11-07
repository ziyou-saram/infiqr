import type { NextConfig } from "next"

type ImageRemotePattern = {
    protocol?: "http" | "https"
    hostname: string
    port?: string
    pathname?: string
}

function parseHostname(input: string): string | null {
    const trimmed = input.trim()

    if (!trimmed) {
        return null
    }

    const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)
    const urlString = hasProtocol ? trimmed : `https://${trimmed}`

    try {
        const parsed = new URL(urlString)
        return parsed.hostname
    } catch {
        return null
    }
}

function normalisePathname(pathname: string) {
    if (!pathname || pathname === "/") {
        return "/**"
    }

    const cleaned = pathname.replace(/\/+$/, "")
    return cleaned.endsWith("**") ? cleaned : `${cleaned}/**`
}

function parseRemotePattern(input: string): ImageRemotePattern | null {
    const trimmed = input.trim()

    if (!trimmed) {
        return null
    }

    const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)
    const urlString = hasProtocol ? trimmed : `https://${trimmed}`

    try {
        const parsed = new URL(urlString)
        const protocol = parsed.protocol.replace(":", "")

        if (protocol !== "http" && protocol !== "https") {
            return null
        }

        return {
            protocol,
            hostname: parsed.hostname,
            port: parsed.port || undefined,
            pathname: normalisePathname(parsed.pathname),
        }
    } catch {
        return null
    }
}

const staticImageHosts = [
    "admin.newtea.ua",
    "winexpert.kz",
    "avatars.mds.yandex.net",
    "images.deliveryhero.io",
    "elitclub.kz",
    "ndddistribution.com",
    "diceys.com",
    "alcomag.kz",
    "en.excaliburshop.com",
    "provencerose.com",
    "www.thetipplecellar.com",
    "www.pernod-ricard.com",
    "www.gourmetkava.cz",
    "tootapp.kz",
    "www.tasteofhome.com",
    "m.media-amazon.com",
    "recettes.vedrenne.fr",
    "static.insales-cdn.com",
    "cornercoffeestore.com",
    "images.ctfassets.net",
    "lonegoosebakery.com",
    "methodicalcoffee.com",
    "www.craftginclub.co.uk",
    "upload.wikimedia.org",
    "www.coca-cola.com",
    "images.albertsons-media.com",
    "luxalcomarket.kz",
    "api.technodom.kz",
    "kalam.kz",
    "img.fix-price.kz",
    "cdnn21.img.ria.ru",
    "images.gastronom.ru",
    "www.rakhat.kz",
    "minio.clevermart.kz",
    "qwintry.store",
    "arbuz.kz",
    "burninghut.ru",
    "encrypted-tbn0.gstatic.com",
    "ecomarket.ru",
    "grandkulinar.ru",
    "buloshnaya.org",
    "vkusvill.ru",
    "ic.pics.livejournal.com",
    "dikoed.ru",
    "pteat.ru",
    "images.unsplash.com",
    "cdn11.bigcommerce.com",
    "syromaniya.ru",
    "cdn.shopify.com",
    "e52e3ee2-628b-49a9-9e26-e5a61fd72b20.selcdn.net",
    "img.iamcook.ru",
    "www.osteria.ru",
    "www.redber.co.uk",
    "cheezu.ru"
]

const envHostnames =
    process.env.NEXT_IMAGE_HOSTS?.split(",")
        .map(parseHostname)
        .filter((hostname): hostname is string => Boolean(hostname)) ?? []

const imageDomains = Array.from(new Set([...staticImageHosts, ...envHostnames]))

const envRemotePatterns =
    process.env.NEXT_IMAGE_HOSTS?.split(",")
        .map(parseRemotePattern)
        .filter((pattern): pattern is ImageRemotePattern => pattern !== null) ?? []

const defaultRemotePatterns: ImageRemotePattern[] = [
    {
        protocol: "https",
        hostname: "loremflickr.com",
        pathname: "/**",
    },
]

const nextConfig: NextConfig = {
    images: {
        domains: imageDomains,
        remotePatterns: [...envRemotePatterns, ...defaultRemotePatterns],
    },
}

export default nextConfig
