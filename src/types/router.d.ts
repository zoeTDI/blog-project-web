export interface MenuDataItem {
    path: string
    name: string
    component: string
    meta?: {
        title?: string
        requireLogin: boolean
    }
    children?: MenuDataItem[]
}