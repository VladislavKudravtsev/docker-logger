export interface Storage {
    save(data: string): Promise<void>
}