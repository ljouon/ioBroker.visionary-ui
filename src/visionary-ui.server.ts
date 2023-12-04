export abstract class VisionaryUiServer {
    abstract start(port: number): Promise<void>;

    abstract stop(): Promise<void>;
}
