export interface ServerInterface {
    init: (port: number) => Promise<number>;
}