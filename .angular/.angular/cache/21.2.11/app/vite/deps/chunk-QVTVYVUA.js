import {
  MatTooltip,
  TooltipComponent
} from "./chunk-TUG536KZ.js";
import {
  OverlayModule
} from "./chunk-B6ROWGSR.js";
import {
  A11yModule
} from "./chunk-7B3RF7ON.js";
import {
  CdkScrollableModule
} from "./chunk-OKXYVKI5.js";
import {
  BidiModule
} from "./chunk-TGDNNDGJ.js";
import {
  NgModule,
  setClassMetadata,
  ɵɵdefineNgModule
} from "./chunk-RQIYOV7E.js";
import {
  ɵɵdefineInjector
} from "./chunk-JVWHLB3X.js";

// node_modules/@angular/material/fesm2022/tooltip.mjs
var MatTooltipModule = class _MatTooltipModule {
  static ɵfac = function MatTooltipModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatTooltipModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MatTooltipModule,
    imports: [A11yModule, OverlayModule, MatTooltip, TooltipComponent],
    exports: [MatTooltip, TooltipComponent, BidiModule, CdkScrollableModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [A11yModule, OverlayModule, BidiModule, CdkScrollableModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTooltipModule, [{
    type: NgModule,
    args: [{
      imports: [A11yModule, OverlayModule, MatTooltip, TooltipComponent],
      exports: [MatTooltip, TooltipComponent, BidiModule, CdkScrollableModule]
    }]
  }], null, null);
})();

export {
  MatTooltipModule
};
//# sourceMappingURL=chunk-QVTVYVUA.js.map
