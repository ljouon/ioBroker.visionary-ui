export type VisionaryUiServer = {
    start: (port: number) => Promise<void>;
    stop: () => Promise<void>;
};
