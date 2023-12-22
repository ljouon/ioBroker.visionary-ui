export abstract class VisionaryUiServer {
    abstract start(port: number, socketPort: number): Promise<void>;

    abstract stop(): Promise<void>;
}
