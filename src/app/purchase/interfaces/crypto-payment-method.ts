export interface CryptoPaymentMethod extends PaymentType{
    amount: number,
    recipient: string
}


interface PaymentType{
    id: number,
    network: string,
    coin: Coin
}

interface Coin{
    fullname: string,
    name: string,
    image: string
}