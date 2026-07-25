export interface MediaSelection {
    fileType?: string;
    url?: string;
    mimeType?: string;
    originalName?: string;
    data?: {
        isImage?: boolean;
        domain?: string;
        path?: string;
        sizes?: {
            large?: {
                fileName?: string;
            };
        };
        fileName?: string;
        type?: string;
    };
}
export declare function getMediaContent(selection?: MediaSelection): string;
//# sourceMappingURL=utils.d.ts.map