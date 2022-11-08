import { SafeUrl } from "@angular/platform-browser";

export interface Image {
  sourceId: string;
  fileStoreId: string;
  imageId: string;
  url: string;
  thumbnailUrl?: string;
  thumbnailImageId?: string;
  cachedBlobUrl?: SafeUrl;
}
