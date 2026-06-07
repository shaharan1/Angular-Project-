import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  MatTooltip,
  TooltipComponent
} from "./chunk-GET7KTQZ.js";
import {
  OverlayModule
} from "./chunk-6DZY6BHK.js";
import {
  A11yModule
} from "./chunk-3Y5ZGEWK.js";
import {
  CdkScrollableModule
} from "./chunk-WRKSGXSL.js";
import {
  BidiModule
} from "./chunk-Z56JTB3K.js";
import {
  NgModule,
  setClassMetadata,
  ɵɵdefineNgModule
} from "./chunk-WPMJUUGM.js";
import {
  ɵɵdefineInjector
} from "./chunk-OYJPIVQR.js";
import {
  require_cjs
} from "./chunk-DXHO3GNR.js";
import {
  require_operators
} from "./chunk-KCAUP5L5.js";
import {
  __toESM
} from "./chunk-SOE35BD4.js";

// node_modules/@angular/material/fesm2022/tooltip.mjs
var import_operators = __toESM(require_operators(), 1);
var import_rxjs = __toESM(require_cjs(), 1);
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
//# sourceMappingURL=chunk-TAO2LZTN.js.map
