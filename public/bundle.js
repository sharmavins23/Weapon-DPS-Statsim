/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/calc/Quantization.ts":
/*!**********************************!*\
  !*** ./src/calc/Quantization.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   quantizeCritMultiplier: () => (/* binding */ quantizeCritMultiplier),\n/* harmony export */   quantizeElements: () => (/* binding */ quantizeElements),\n/* harmony export */   quantizeIPS: () => (/* binding */ quantizeIPS)\n/* harmony export */ });\nfunction quantizeIPS(ips, scale, enableQuantization = true) {\n    if (!enableQuantization)\n        return ips;\n    return {\n        impact: Math.round(ips.impact / scale) * scale,\n        puncture: Math.round(ips.puncture / scale) * scale,\n        slash: Math.round(ips.slash / scale) * scale,\n    };\n}\nfunction quantizeElements(elements, scale, enableQuantization = true) {\n    if (!enableQuantization)\n        return elements;\n    return {\n        heat: Math.round(elements.heat / scale) * scale,\n        cold: Math.round(elements.cold / scale) * scale,\n        electricity: Math.round(elements.electricity / scale) * scale,\n        toxin: Math.round(elements.toxin / scale) * scale,\n        blast: Math.round(elements.blast / scale) * scale,\n        radiation: Math.round(elements.radiation / scale) * scale,\n        gas: Math.round(elements.gas / scale) * scale,\n        magnetic: Math.round(elements.magnetic / scale) * scale,\n        viral: Math.round(elements.viral / scale) * scale,\n        corrosive: Math.round(elements.corrosive / scale) * scale,\n    };\n}\nfunction quantizeCritMultiplier(critMultiplier, enableQuantization = true) {\n    if (!enableQuantization)\n        return critMultiplier;\n    return Math.round(critMultiplier / (32 / 4095)) * (32 / 4095);\n}\n\n\n//# sourceURL=webpack://weapon-dps-statsim/./src/calc/Quantization.ts?");

/***/ }),

/***/ "./src/formats/Secondary.ts":
/*!**********************************!*\
  !*** ./src/formats/Secondary.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Secondary: () => (/* binding */ Secondary),\n/* harmony export */   SecondaryFiringModes: () => (/* binding */ SecondaryFiringModes)\n/* harmony export */ });\n/* harmony import */ var _calc_Quantization__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @calc/Quantization */ \"./src/calc/Quantization.ts\");\n\nvar SecondaryFiringModes;\n(function (SecondaryFiringModes) {\n    SecondaryFiringModes[SecondaryFiringModes[\"PRIMARY\"] = 0] = \"PRIMARY\";\n    SecondaryFiringModes[SecondaryFiringModes[\"INCARNON\"] = 1] = \"INCARNON\";\n})(SecondaryFiringModes || (SecondaryFiringModes = {}));\n// ===== Class definition ======================================================\nclass Secondary {\n    name;\n    constructor(name) {\n        this.name = name;\n    }\n    calculateRawDamagePerShot(mode = SecondaryFiringModes.PRIMARY, enableQuantization = true) {\n        // * Get the stats\n        if (!this.stats[mode])\n            throw new Error(\"Invalid firing mode\");\n        let stats = this.stats[mode];\n        // * Compute scale\n        let baseIPS = stats.ips.impact + stats.ips.puncture + stats.ips.slash;\n        let scale = baseIPS / 16; // Quantization factor\n        // * Quantize elements\n        let quantizedElements = (0,_calc_Quantization__WEBPACK_IMPORTED_MODULE_0__.quantizeElements)(stats.elements, scale, enableQuantization);\n        // * Quantize IPS\n        let quantizedIPS = (0,_calc_Quantization__WEBPACK_IMPORTED_MODULE_0__.quantizeIPS)(stats.ips, scale, enableQuantization);\n        // * Add above\n        let totalIPS = quantizedIPS.impact + quantizedIPS.puncture + quantizedIPS.slash;\n        let totalEle = quantizedElements.heat +\n            quantizedElements.cold +\n            quantizedElements.electricity +\n            quantizedElements.toxin +\n            quantizedElements.blast +\n            quantizedElements.radiation +\n            quantizedElements.gas +\n            quantizedElements.magnetic +\n            quantizedElements.viral +\n            quantizedElements.corrosive;\n        let totalDamage = totalIPS + totalEle;\n        // * Apply other multipliers\n        // Critical hits\n        let totalCritChance = stats.critical.chance / 100.0;\n        let quantizedCritMulti = (0,_calc_Quantization__WEBPACK_IMPORTED_MODULE_0__.quantizeCritMultiplier)(stats.critical.multiplier, enableQuantization);\n        let totalCritMulti = quantizedCritMulti;\n        let avgCritMulti = 1 + totalCritChance * (totalCritMulti - 1);\n        totalDamage *= avgCritMulti;\n        return totalDamage;\n    }\n}\n\n\n//# sourceURL=webpack://weapon-dps-statsim/./src/formats/Secondary.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _weapons_secondary_LexPrime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @weapons/secondary/LexPrime */ \"./src/weapons/secondary/LexPrime.ts\");\n\nfunction transformTextLines(text) {\n    return text.join(\"<br>\");\n}\nfunction updateTextOnScreen() {\n    const element = document.getElementById(\"container\");\n    let weapon = new _weapons_secondary_LexPrime__WEBPACK_IMPORTED_MODULE_0__.LexPrime();\n    let text = transformTextLines([\n        `Simulated DPS for ${weapon.name}: ${weapon\n            .simulateDPS(false)\n            .toFixed(2)} DPS`,\n    ]);\n    if (element) {\n        element.innerHTML = text;\n    }\n}\nupdateTextOnScreen();\n\n\n//# sourceURL=webpack://weapon-dps-statsim/./src/index.ts?");

/***/ }),

/***/ "./src/weapons/secondary/LexPrime.ts":
/*!*******************************************!*\
  !*** ./src/weapons/secondary/LexPrime.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LexPrime: () => (/* binding */ LexPrime)\n/* harmony export */ });\n/* harmony import */ var _formats_Secondary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @formats/Secondary */ \"./src/formats/Secondary.ts\");\n\nclass LexPrime extends _formats_Secondary__WEBPACK_IMPORTED_MODULE_0__.Secondary {\n    stats;\n    constructor() {\n        super(\"Lex Prime\");\n        this.stats = {\n            [_formats_Secondary__WEBPACK_IMPORTED_MODULE_0__.SecondaryFiringModes.PRIMARY]: {\n                accuracy: 16.0,\n                critical: {\n                    chance: 25.0,\n                    multiplier: 2.0,\n                },\n                fireRate: 2.08,\n                magazine: {\n                    cost: 1,\n                    size: 8,\n                    max: 210,\n                },\n                multishot: 1.0,\n                reload: 2.35,\n                statusChance: 25.0,\n                ips: {\n                    impact: 18.0,\n                    puncture: 144.0,\n                    slash: 18.0,\n                },\n                elements: {\n                    heat: 0.0,\n                    cold: 0.0,\n                    electricity: 0.0,\n                    toxin: 0.0,\n                    blast: 0.0,\n                    radiation: 0.0,\n                    gas: 0.0,\n                    magnetic: 0.0,\n                    viral: 0.0,\n                    corrosive: 0.0,\n                },\n            },\n            [_formats_Secondary__WEBPACK_IMPORTED_MODULE_0__.SecondaryFiringModes.INCARNON]: {\n                accuracy: 16.0,\n                critical: {\n                    chance: 35.0,\n                    multiplier: 3.0,\n                },\n                fireRate: 0.67,\n                magazine: {\n                    cost: 1,\n                    size: 20,\n                    max: 20,\n                },\n                multishot: 1.0,\n                reload: -1.0,\n                statusChance: 44.0,\n                ips: {\n                    impact: 400.0,\n                    puncture: 0.0,\n                    slash: 0.0,\n                },\n                elements: {\n                    heat: 0.0,\n                    cold: 0.0,\n                    electricity: 0.0,\n                    toxin: 0.0,\n                    blast: 0.0,\n                    radiation: 800.0,\n                    gas: 0.0,\n                    magnetic: 0.0,\n                    viral: 0.0,\n                    corrosive: 0.0,\n                },\n            },\n        };\n    }\n    simulateDPS(enableQuantization = true) {\n        // Get our stats\n        let stats = {\n            primary: this.stats[_formats_Secondary__WEBPACK_IMPORTED_MODULE_0__.SecondaryFiringModes.PRIMARY],\n            incarnon: this.stats[_formats_Secondary__WEBPACK_IMPORTED_MODULE_0__.SecondaryFiringModes.INCARNON],\n        };\n        let timestep = 0.01;\n        let totalSimTime = 1_000_000.0;\n        let lastFiredTime = 0.0;\n        let reloadTriggeredTime = 0.0;\n        let isReloading = false;\n        let remainingAmmoInMag = stats.primary.magazine.size;\n        let totalDamageDealt = 0.0;\n        let totalNumberOfShots = 0;\n        // Simulate for 1,000 seconds\n        for (let time = 0.0; time < totalSimTime; time += timestep) {\n            // Skip if reloading\n            if (isReloading) {\n                // If we're done reloading, reset the flag\n                if (time - reloadTriggeredTime >= stats.primary.reload) {\n                    isReloading = false;\n                    remainingAmmoInMag = stats.primary.magazine.size;\n                }\n                // Either way, move on\n                continue;\n            }\n            // If we're out of ammo, trigger reload\n            if (remainingAmmoInMag <= 0) {\n                isReloading = true;\n                reloadTriggeredTime = time;\n                continue;\n            }\n            // If we can fire, fire!\n            if (time - lastFiredTime >= 1.0 / stats.primary.fireRate) {\n                // Fire the primary\n                totalDamageDealt += this.calculateRawDamagePerShot(_formats_Secondary__WEBPACK_IMPORTED_MODULE_0__.SecondaryFiringModes.PRIMARY, enableQuantization);\n                totalNumberOfShots++;\n                // Update last fired time\n                lastFiredTime = time;\n                // Reduce ammo\n                remainingAmmoInMag -= stats.primary.magazine.cost;\n            }\n        }\n        return totalDamageDealt / totalSimTime;\n    }\n}\n\n\n//# sourceURL=webpack://weapon-dps-statsim/./src/weapons/secondary/LexPrime.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;