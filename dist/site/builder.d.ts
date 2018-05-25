import { Site, Renderable } from './interfaces';
export declare class Builder {
    static build(site: Site): Renderable[];
    private static buildStyle(style);
    private static buildEntry(site, content);
    private static getCollection(site, collection);
    private static paginate(site, collectionName, basePermalink);
    private static buildPage(site, content);
}
