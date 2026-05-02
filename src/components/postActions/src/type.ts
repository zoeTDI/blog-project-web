import {HandThumbUpIcon, StarIcon, ShareIcon} from '@heroicons/vue/24/outline'
import type {Component} from "vue";

export interface ActionItem {
    key: 'like' | 'collect' | 'share';
    label: string;
    icon: Component,
    enabled: boolean;
}

export const defaultActions: ActionItem[] = [
    { key: 'like', label: '点赞', icon: HandThumbUpIcon, enabled: true },
    { key: 'collect', label: '收藏', icon: StarIcon, enabled: true },
    { key: 'share', label: '分享', icon: ShareIcon, enabled: true },
];