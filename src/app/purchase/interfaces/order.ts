import { User } from "src/app/tools/interfaces/user"
import { CryptoPaymentMethod } from "./crypto-payment-method"

export interface Order {
    Receipt: Record<any,any>,
    description: string,
    
    currency: 'RUB' | 'USD' | 'EUR',
    price: number,
    to_rub: number,

    payment_way: '' | 'Tinkoff' | 'Ameria' | 'Stripe' | 'Crypto'
    tinkoff: { terminal_key: string }
    crypto: CryptoPaymentMethod[]

    id: string
    
    email: string,
    user: string,

    inviter: User | null
}
