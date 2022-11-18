export interface Notification {
    text: string,
    type: 'err' | 'success' | 'primary',
    showTime: number,
    id: number
}
