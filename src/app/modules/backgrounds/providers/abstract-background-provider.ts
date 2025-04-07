export abstract class AbstractBackgroundProvider {
    public abstract nextFrame(): Promise<HTMLImageElement>
}