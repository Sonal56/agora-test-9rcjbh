import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as markerjs2 from 'markerjs2';
import { base64ToFile } from 'ngx-image-cropper';
import { fromBlob } from 'image-resize-compress';

import { BlurMarker } from './BlurMarker';

@Component({
  selector: 'app-annotate',
  templateUrl: './annotate.component.html',
  styleUrls: ['./annotate.component.scss'],
})
export class AnnotateComponent implements OnInit, AfterViewChecked {
  image: any;
  imageChangedEvent =
    'https://www.rocketmortgage.com/resources-cmsassets/RocketMortgage.com/Article_Images/Large_Images/TypesOfHomes/types-of-homes-hero.jpg';
  markerArea;
  intrinsicHeight: number | undefined;
  intrinsicWidth: number | undefined;

  get imgUrl() {
    if (this.image) {
      return this._sanitizer.bypassSecurityTrustUrl(this.image);
    } else {
      return null;
    }
  }
  constructor(private _sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.showMarkerArea();
    document.querySelector('[title="Powered by marker.js"]').remove();
  }

  ngAfterViewChecked() {
    if (
      this.intrinsicHeight === undefined &&
      this.intrinsicWidth === undefined
    ) {
      const img = document.getElementById('image') as HTMLImageElement;

      if (img?.naturalHeight !== 0 || img?.naturalWidth !== 0) {
        this.intrinsicHeight = img?.naturalHeight;
        this.intrinsicWidth = img?.naturalWidth;
      }
    }
  }

  showMarkerArea() {
    this.markerArea = new markerjs2.MarkerArea(
      document.getElementById('image') as HTMLImageElement
    );
    this.markerArea.renderAtNaturalSize = true;
    this.markerArea.renderImageQuality = 1;
    this.markerArea.availableMarkerTypes = [
      markerjs2.ArrowMarker,
      markerjs2.EllipseFrameMarker,
      markerjs2.FrameMarker,
      markerjs2.TextMarker,
      markerjs2.FreehandMarker,
      BlurMarker,
    ];

    this.markerArea.addCloseEventListener(() => {});

    this.markerArea.show();
    this.markerArea.addRenderEventListener(() => {
      console.log('save one');

      this.markerArea.getState(true);
      const parent = document.getElementsByClassName('__markerjs2_')[0];
      const child = parent.children;
      const children = child[0].children[1];
      const s = new XMLSerializer().serializeToString(children);
      const encodedData = window.btoa(s);
      const image = 'data:image/svg+xml;base64,' + encodedData;
      const blob = base64ToFile(image) as File;
      this.resizeConvert(new File([blob], 'annotated_image'));
    });
  }

  save() {
    this.markerArea.getState(true);
    const parent = document.getElementsByClassName('__markerjs2_')[0];
    const child = parent.children;
    const children = child[0].children[1];
    const s = new XMLSerializer().serializeToString(children);
    const encodedData = window.btoa(s);
    const image = 'data:image/svg+xml;base64,' + encodedData;
    console.log(image);
    const blob = base64ToFile(image) as File;
    console.log(blob);
    this.resizeConvert(new File([blob], 'annotated_image'));
  }

  private resizeConvert(blobFile: File) {
    const quality = 100;
    const width = Number(this.intrinsicWidth);
    const height = Number(this.intrinsicHeight);
    const format = 'jpeg';
    console.log(blobFile, quality, width, height, format);

    fromBlob(blobFile, quality, width, height, format)
      .then((blob: Blob) => {
        console.log(blob);
        this.image = blob as File;
        console.log(this.image);
      })
      .catch((error: string) => {
        if (error) {
        }
      });
  }

  fileChangeEvent(event: any): void {
    console.log(event);
    this.image = event.dataUrl;
  }
}
