import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "./chunk-UPTN5NLX.js";
import {
  ObserversModule
} from "./chunk-3Y5ZGEWK.js";
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

// node_modules/@angular/material/fesm2022/form-field.mjs
var import_rxjs = __toESM(require_cjs(), 1);
var import_operators = __toESM(require_operators(), 1);
var MatFormFieldModule = class _MatFormFieldModule {
  static ɵfac = function MatFormFieldModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFormFieldModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MatFormFieldModule,
    imports: [ObserversModule, MatFormField, MatLabel, MatError, MatHint, MatPrefix, MatSuffix],
    exports: [MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, BidiModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [ObserversModule, MatFormField, BidiModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormFieldModule, [{
    type: NgModule,
    args: [{
      imports: [ObserversModule, MatFormField, MatLabel, MatError, MatHint, MatPrefix, MatSuffix],
      exports: [MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, BidiModule]
    }]
  }], null, null);
})();

export {
  MatFormFieldModule
};
//# sourceMappingURL=chunk-A6HBZWXX.js.map
