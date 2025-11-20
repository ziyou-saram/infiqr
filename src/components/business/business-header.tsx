// /src/components/business/business-header.tsx
import React from 'react'

import { Badge } from "@/components/ui/badge"

type BusinessDataType = {
    restaurantName: string
    restaurantAddress: string
    restaurantWorkingHours: string
}

const businessData: BusinessDataType = {
    restaurantName: 'Kaif',
    restaurantAddress: 'ул. Абай 63. Отель "G Empire"',
    restaurantWorkingHours: 'Круглосуточно'
}

export default function BusinessHeader() {
    return (
        <section>
            <div className='bg-background rounded-4xl p-4'>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-foreground text-2xl font-medium lg:text-3xl'>{businessData.restaurantName}</h2>
                    <p className='text-muted-foreground text-base'>{businessData.restaurantAddress}</p>
                    <Badge className='px-3 py-1.5'>{businessData.restaurantWorkingHours}</Badge>
                </div>
            </div>
        </section>
    )
}
