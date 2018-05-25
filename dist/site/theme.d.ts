export interface Theme {
    name: string;
    baseFolder: string;
    blocksFolder: string;
    layoutsFolder: string;
    pagesFolder: string;
    styles: {
        [name: string]: string;
    };
}
