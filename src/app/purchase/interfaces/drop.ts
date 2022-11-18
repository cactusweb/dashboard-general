import { User } from "src/app/tools/interfaces/user"

export interface Drop {
    Receipt: Record<any,any>,
    description: string,
    
    currency: 'RUB' | 'USD' | 'EUR',
    price: number,
    to_rub: number,

    payment_way: '' | 'Tinkoff' | 'Ameria'
    tinkoff: { terminal_key: string }

    id: string
    
    email: string,
    user: string,

    inviter: User | null
}
