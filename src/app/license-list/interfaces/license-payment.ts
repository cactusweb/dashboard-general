export interface LicensePayment {
    toRub: number

    price: number
    currency: string

    email: string

    last_4: string
    exp_date: string

    way: '' | 'Tinkoff' | 'Ameria'
}
