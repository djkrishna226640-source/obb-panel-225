import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Bundle {
    id: bigint;
    name: string;
    description: string;
    imageUrl: string;
    rarity: Rarity;
}
export interface Sensitivity {
    id: bigint;
    gyroscope: bigint;
    deviceLabel: string;
    scope2x: bigint;
    scope4x: bigint;
    awmScope: bigint;
    general: bigint;
    redDot: bigint;
}
export interface HeadshotTip {
    id: bigint;
    title: string;
    displayOrder: bigint;
    description: string;
    category: Category;
}
export enum Category {
    movement = "movement",
    technique = "technique",
    settings = "settings"
}
export enum Rarity {
    epic = "epic",
    legendary = "legendary",
    rare = "rare",
    common = "common"
}
export interface backendInterface {
    addBundle(name: string, description: string, imageUrl: string, rarity: Rarity): Promise<Bundle>;
    addSensitivity(deviceLabel: string, general: bigint, redDot: bigint, scope2x: bigint, scope4x: bigint, awmScope: bigint, gyroscope: bigint): Promise<Sensitivity>;
    addTip(title: string, description: string, category: Category, displayOrder: bigint): Promise<HeadshotTip>;
    checkAdminPassword(password: string): Promise<boolean>;
    deleteBundle(id: bigint): Promise<void>;
    deleteSensitivity(id: bigint): Promise<void>;
    deleteTip(id: bigint): Promise<void>;
    getBundle(id: bigint): Promise<Bundle>;
    getBundles(): Promise<Array<Bundle>>;
    getSensitivities(): Promise<Array<Sensitivity>>;
    getStats(): Promise<{
        sensitivityCount: bigint;
        tipCount: bigint;
        bundleCount: bigint;
    }>;
    getTips(): Promise<Array<HeadshotTip>>;
    updateBundle(id: bigint, name: string, description: string, imageUrl: string, rarity: Rarity): Promise<Bundle>;
    updateSensitivity(id: bigint, deviceLabel: string, general: bigint, redDot: bigint, scope2x: bigint, scope4x: bigint, awmScope: bigint, gyroscope: bigint): Promise<Sensitivity>;
    updateTip(id: bigint, title: string, description: string, category: Category, displayOrder: bigint): Promise<HeadshotTip>;
}
