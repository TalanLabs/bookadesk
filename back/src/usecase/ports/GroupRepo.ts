export interface GroupRepo {
    create(name: string): Promise<string>
}