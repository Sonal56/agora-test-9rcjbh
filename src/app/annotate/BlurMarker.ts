import {
  IPoint,
  MarkerBaseState,
  RectangleMarkerState,
  RectangularBoxMarkerBase,
  Settings,
  SvgHelper,
} from 'markerjs2';

export class BlurMarker extends RectangularBoxMarkerBase {
  public static typeName = 'BlurMarker';
  public static title = 'Blur marker';
  public static icon = `<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-3 .5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM6 5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm15 5.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5zM14 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0-3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5zm-11 10c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm7 7c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm0-17c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5zM10 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0 5.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm8 .5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3 8.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM14 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 3.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm-4-12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 8.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm4-4.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/></svg>`;

  protected strokeColor = 'transparent';
  protected strokeWidth = 0;
  protected strokeDasharray = '';
  protected opacity = 1;
  protected blur = 10;
  protected bluringFilter = null;
  protected imagePattern = null;
  protected elId = 0;
  protected selectedBlur = undefined;

  constructor(
    container: SVGGElement,
    overlayContainer: HTMLDivElement,
    settings: Settings
  ) {
    super(container, overlayContainer, settings);

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setStrokeWidth = this.setStrokeWidth.bind(this);
    this.setStrokeDasharray = this.setStrokeDasharray.bind(this);
    this.createVisual = this.createVisual.bind(this);
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   *
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || el === this.visual) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Creates the marker's rectangle visual.
   */
  protected createVisual(): void {
    this.visual = SvgHelper.createRect(1, 1, [
      ['id', 'rectangle' + this.elId],
      ['fill', 'url(#mainPattern' + this.elId + ')'],
      ['stroke-dasharray', this.strokeDasharray],
      ['opacity', this.opacity.toString()],
      ['class', 'blur-rec blur' + this.elId],
    ]);

    this.addMarkerVisualToContainer(this.visual);

    const defTag = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'defs'
    );
    this.visual.parentElement.prepend(defTag);

    const img = document.getElementById('image') as HTMLImageElement;
    const imgSrc = img.src;
    const rec = document.getElementById('rectangle' + this.elId);
    const recSize = rec.getBoundingClientRect();
    const imgSize = img.getBoundingClientRect();
    const x = (imgSize.x - recSize.x).toString();
    const y = (imgSize.y - recSize.y).toString();

    const filters =
      "<pattern id='mainPattern" +
      this.elId +
      "' patternUnits='userSpaceOnUse' x='" +
      x +
      "' y='" +
      y +
      "' width='100%' height='100%'><image preserveAspectRatio='none' width='100%' height='100%' xlink:href='" +
      imgSrc +
      "'></image></pattern>" +
      "<filter id='blurFilter" +
      this.elId +
      "' x='-20' y='-20' width='" +
      imgSize.width +
      "' height='" +
      imgSize.height +
      "'><feGaussianBlur in='SourceGraphic' stdDeviation='" +
      this.blur +
      "' /></filter>" +
      "<pattern id='displacementFilter" +
      this.elId +
      "' patternUnits='userSpaceOnUse' x='" +
      x +
      "' y='" +
      y +
      "' width='100%' height='100%'><image preserveAspectRatio='none' width='100%' height='100%' xlink:href='" +
      imgSrc +
      "'></image></pattern>";

    defTag.innerHTML = filters;

    const styleTag = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'style'
    );
    styleTag.innerHTML =
      `.blur` +
      this.elId +
      ` {
        stroke: none; 
        fill: url(#displacementFilter` +
      this.elId +
      `); 
        filter: url(#blurFilter` +
      this.elId +
      `);
        -webkit-filter: url(#blurFilter` +
      this.elId +
      `);
      }`;

    this.visual.parentElement.prepend(styleTag);
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);

    const blurArray = document.getElementsByClassName('blur-rec');
    this.elId = blurArray.length;
    this.selectedBlur = (target as HTMLElement)?.id || 'rectangle' + this.elId;

    if (this.state === 'new') {
      this.createVisual();

      this.moveVisual(point);

      this._state = 'creating';
    }
  }

  /**
   * Handles marker manipulation (move, resize, rotate, etc.).
   *
   * @param point - event coordinates.
   */
  public manipulate(point: IPoint): void {
    super.manipulate(point);
  }

  /**
   * Resizes the marker based on the pointer coordinates.
   * @param point - current pointer coordinates.
   */
  protected resize(point: IPoint): void {
    super.resize(point);
    this.setSize();
  }

  /**
   * Sets visual's width and height attributes based on marker's width and height.
   */
  protected setSize(): void {
    super.setSize();
    SvgHelper.setAttributes(this.visual, [
      ['width', this.width.toString()],
      ['height', this.height.toString()],
    ]);
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setSize();

    const rec = document
      .getElementById(this.selectedBlur)
      .getBoundingClientRect();

    const img = document.getElementById('image').getBoundingClientRect();
    const number = this.selectedBlur.match(/\d+$/);
    const filter = document.getElementById('displacementFilter' + number[0]);
    const pattern = document.getElementById('mainPattern' + number[0]);

    filter.setAttribute('x', (img.x - rec.x).toString());
    filter.setAttribute('y', (img.y - rec.y).toString());
    pattern.setAttribute('x', (img.x - rec.x).toString());
    pattern.setAttribute('y', (img.y - rec.y).toString());
  }

  /**
   * Sets rectangle's border stroke color.
   * @param color - color as string
   */
  protected setStrokeColor(color: string): void {
    this.strokeColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke', this.strokeColor]]);
    }
    this.colorChanged(color);
  }
  /**
   * Sets rectangle's border stroke (line) width.
   * @param color - color as string
   */
  protected setStrokeWidth(width: number): void {
    this.strokeWidth = width;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [
        ['stroke-width', this.strokeWidth.toString()],
      ]);
    }
  }
  /**
   * Sets rectangle's border stroke dash array.
   * @param color - color as string
   */
  protected setStrokeDasharray(dashes: string): void {
    this.strokeDasharray = dashes;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [
        ['stroke-dasharray', this.strokeDasharray],
      ]);
    }
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): RectangleMarkerState {
    const result: RectangleMarkerState = Object.assign(
      {
        fillColor: 'transparent',
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        strokeDasharray: this.strokeDasharray,
        opacity: this.opacity,
      },
      super.getState()
    );

    return result;
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const rectState = state as RectangleMarkerState;
    this.strokeColor = rectState.strokeColor;
    this.strokeWidth = rectState.strokeWidth;
    this.strokeDasharray = rectState.strokeDasharray;
    this.opacity = rectState.opacity;

    this.createVisual();
    super.restoreState(state);
    this.setSize();
  }

  /**
   * Scales marker. Used after the image resize.
   *
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.setSize();
  }
}
