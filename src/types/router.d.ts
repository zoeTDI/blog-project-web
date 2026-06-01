export interface MenuDataItem {
    path: string
    name: string
    component: string // 后端返回字符串，如 'managementPage/UserManage'
    meta?: {
        title?: string
        requireLogin: boolean
    }
    children?: MenuDataItem[]
}