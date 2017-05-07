webpackJsonp([1,5],{

/***/ 165:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_ajax_service__ = __webpack_require__(57);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GeojsonLayerComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var GeojsonLayerComponent = (function () {
    function GeojsonLayerComponent(queryParamsHelperService, ajaxService) {
        this.queryParamsHelperService = queryParamsHelperService;
        this.ajaxService = ajaxService;
        this.examples$ = this.ajaxService.getGeoJsonExam();
        this.submitGeoJsonEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.add_geojson = {
            geojson: "",
            edit_index: -1,
            onEdit: function () {
                return this.edit_index != -1;
            },
            init: function () {
                this.edit_index = -1;
                this.geojson = "";
            }
        };
    }
    Object.defineProperty(GeojsonLayerComponent.prototype, "geojson", {
        get: function () {
            return this._geojson;
        },
        set: function (geojson) {
            this._geojson = geojson;
            this.initializeGeojsonArray();
        },
        enumerable: true,
        configurable: true
    });
    GeojsonLayerComponent.prototype.initializeGeojsonArray = function (geojson) {
        if (geojson === void 0) { geojson = this.geojson; }
        this.geojson_array = this.queryParamsHelperService.queryGeoJson({ geojson: geojson });
    };
    GeojsonLayerComponent.prototype.submitAddGeojson = function (input) {
        if (this.add_geojson.onEdit()) {
            this.geojson_array[this.add_geojson.edit_index] = input;
        }
        else {
            this.geojson_array.push(input);
        }
        if (input != "") {
            this.add_geojson.init();
            this.defaultModal.hide();
        }
    };
    GeojsonLayerComponent.prototype.addGeojsonExample = function (input) {
        this.geojson_array.push(input);
        this.defaultModal.hide();
    };
    GeojsonLayerComponent.prototype.submitGeoJson = function () {
        var $event = {
            hide: true,
            modal: this.geoJsonModal,
            parsed_geojson: this.queryParamsHelperService.geojsonArrayToStr(this.geojson_array)
        };
        this.submitGeoJsonEmitter.emit($event);
    };
    GeojsonLayerComponent.prototype.removeAllLayers = function () {
        this.geojson_array = [];
    };
    GeojsonLayerComponent.prototype.removeGeojson = function (index) {
        this.geojson_array.splice(index, 1);
    };
    GeojsonLayerComponent.prototype.editModal = function (index) {
        this.add_geojson.geojson = __WEBPACK_IMPORTED_MODULE_3_lodash__["cloneDeep"](this.geojson_array[index]);
        this.add_geojson.edit_index = index;
        this.defaultModal.show();
    };
    return GeojsonLayerComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('geoJsonModal'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */]) === "function" && _a || Object)
], GeojsonLayerComponent.prototype, "geoJsonModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('defaultModal'),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */]) === "function" && _b || Object)
], GeojsonLayerComponent.prototype, "defaultModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])("geojson"),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], GeojsonLayerComponent.prototype, "geojson", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], GeojsonLayerComponent.prototype, "submitGeoJsonEmitter", void 0);
GeojsonLayerComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-geojson-layer',
        template: __webpack_require__(695),
        styles: [__webpack_require__(642)]
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__services_query_params_helper_service__["a" /* QueryParamsHelperService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_query_params_helper_service__["a" /* QueryParamsHelperService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__services_ajax_service__["a" /* AjaxService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__services_ajax_service__["a" /* AjaxService */]) === "function" && _d || Object])
], GeojsonLayerComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/geojson-layer.component.js.map

/***/ }),

/***/ 166:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__position_form_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MarkersComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MarkersComponent = (function () {
    function MarkersComponent(queryParamsHelperService, route, positionFormService, mapMipService) {
        var _this = this;
        this.queryParamsHelperService = queryParamsHelperService;
        this.route = route;
        this.positionFormService = positionFormService;
        this.mapMipService = mapMipService;
        this.submitMarkersEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.edit_obj = {
            marker: {
                position: '',
                colorIndex: 0
            },
            edit_index: -1,
            onEdit: function () {
                return this.edit_index != -1;
            },
            init: function () {
                this.marker = {
                    position: '',
                    colorIndex: 0
                };
                this.edit_index = -1;
            }
        };
        this.queryParams = function (params) {
            _this.markers_array = _this.queryParamsHelperService.queryMarkers({ markers: params['markers'] });
            _this.markers_array = _this.markers_array.map(function (marker) {
                var color = marker['color'] ? marker['color'] : "blue";
                var colorIndex = _this.positionFormService.getSelectedColorIndex(color);
                var position = marker['position'].toString();
                return { position: position, colorIndex: colorIndex };
            });
            _this.cloneEditedMarkers();
        };
    }
    MarkersComponent.prototype.ngOnInit = function () {
        this.route.queryParams.subscribe(this.queryParams);
    };
    MarkersComponent.prototype.cloneEditedMarkers = function () {
        this.edited_markers_array = __WEBPACK_IMPORTED_MODULE_2_lodash__["cloneDeep"](this.markers_array);
    };
    MarkersComponent.prototype.rmvMarker = function (index) {
        this.edited_markers_array.splice(index, 1);
    };
    MarkersComponent.prototype.parseMarkers = function (edited_markers_array) {
        var _this = this;
        var markersArrayToStr = edited_markers_array.map(function (marker) {
            var position = marker.position.split(",");
            var color = _this.positionFormService.getSelectedColor(marker.colorIndex);
            var map_marker = { position: position };
            if (color != 'blue')
                map_marker['color'] = color;
            return map_marker;
        });
        return this.queryParamsHelperService.markersArrayToStr(markersArrayToStr);
    };
    MarkersComponent.prototype.canApply = function () {
        return !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEqual"](this.edited_markers_array, this.markers_array);
    };
    MarkersComponent.prototype.submitMarkers = function (hide) {
        if (hide === void 0) { hide = false; }
        !this.canApply() ? this.smModal.hide() : this.submitMarkersEmitter.emit({ parsed_markers: this.parseMarkers(this.edited_markers_array), smModal: this.smModal, hide: hide });
    };
    MarkersComponent.prototype.submitAddMarkers = function (markerObj) {
        if (this.edit_obj.onEdit()) {
            this.edited_markers_array[this.edit_obj.edit_index] = markerObj;
        }
        else {
            this.edited_markers_array.push(markerObj);
        }
        this.addModal.hide();
    };
    MarkersComponent.prototype.markerStrRegex = function (position) {
        var a = position.split(",");
        if (a.length != 3 && a.length != 2)
            return false;
        return !a.some(function (o) { return !o || Number.isNaN(+o); });
    };
    MarkersComponent.prototype.markerCenter = function () {
        var position = [this.lng, this.lat];
        var center_marker = { position: position };
        if (this.positionFormService.getSelectedColor() != "blue") {
            center_marker['color'] = this.positionFormService.getSelectedColor();
        }
        this.mapMipService.addMarker(center_marker);
    };
    MarkersComponent.prototype.togglePicked = function (onPicked) {
        this.positionFormService.onPicked = onPicked;
        this.positionFormService.markerPickerEmitter.emit(this.positionFormService.onPicked);
    };
    MarkersComponent.prototype.removeAllMarkers = function () {
        this.edited_markers_array = [];
    };
    MarkersComponent.prototype.editMarker = function (index) {
        this.edit_obj.marker = __WEBPACK_IMPORTED_MODULE_2_lodash__["cloneDeep"](this.edited_markers_array[index]);
        this.edit_obj.edit_index = index;
        this.addModal.show();
    };
    return MarkersComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('smModal'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */]) === "function" && _a || Object)
], MarkersComponent.prototype, "smModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('addModal'),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */]) === "function" && _b || Object)
], MarkersComponent.prototype, "addModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], MarkersComponent.prototype, "submitMarkersEmitter", void 0);
MarkersComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-markers',
        template: __webpack_require__(701),
        styles: [__webpack_require__(648)],
        inputs: ["lng", "lat"]
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__services_query_params_helper_service__["a" /* QueryParamsHelperService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__services_query_params_helper_service__["a" /* QueryParamsHelperService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["d" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_router__["d" /* ActivatedRoute */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__position_form_service__["a" /* PositionFormService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__position_form_service__["a" /* PositionFormService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_6__api_map_mip_service__["a" /* MapMipService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__api_map_mip_service__["a" /* MapMipService */]) === "function" && _f || Object])
], MarkersComponent);

var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/markers.component.js.map

/***/ }),

/***/ 23:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_position_form_position_form_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapMipService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MapMipService = (function () {
    function MapMipService(positionFormService, router, location, queryParamsHelperService) {
        var _this = this;
        this.positionFormService = positionFormService;
        this.router = router;
        this.location = location;
        this.queryParamsHelperService = queryParamsHelperService;
        this._skipLocationChange = false;
        this.default_state = '/leaflet';
        this.gotoEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.router.events.filter(function (e) { return e['url'] === '/'; }).subscribe(function (e) {
            _this.navigate([_this.default_state]);
        });
        this.router.events.filter(function (e) { return e instanceof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* NavigationCancel */]; }).subscribe(function (e) {
        });
    }
    Object.defineProperty(MapMipService.prototype, "skipLocationChange", {
        get: function () {
            return this._skipLocationChange;
        },
        set: function (value) {
            if (value) {
                this.location.go('');
            }
            this._skipLocationChange = value;
        },
        enumerable: true,
        configurable: true
    });
    MapMipService.prototype.togglePositionForm = function (status) {
        if (status)
            this.positionFormService.hideComponent = status;
        else
            this.positionFormService.hideComponent = !this.positionFormService.hideComponent;
    };
    MapMipService.prototype.positionFormHidden = function () {
        return this.positionFormService.hideComponent;
    };
    MapMipService.prototype.goTo = function (state) {
        if (!this.isActive(state)) {
            this.gotoEmitter.emit(state);
        }
    };
    MapMipService.prototype.navigate = function (commands, extras) {
        if (extras === void 0) { extras = {}; }
        extras.skipLocationChange = this.skipLocationChange;
        return this.router.navigate(commands, extras);
    };
    MapMipService.prototype.navigateByUrl = function (url, extras) {
        if (extras === void 0) { extras = {}; }
        extras.skipLocationChange = this.skipLocationChange;
        return this.router.navigateByUrl(url, extras);
    };
    MapMipService.prototype.isActive = function (state) {
        return this.router.isActive("/" + state, false);
    };
    MapMipService.prototype.changePosition = function (lng, lat) {
        var urlTree = this.router.parseUrl(this.router.url);
        urlTree.queryParams["lng"] = lng;
        urlTree.queryParams["lat"] = lat;
        this.navigateByUrl(urlTree.toString());
    };
    MapMipService.prototype.addMarker = function (marker) {
        var urlTree = this.router.parseUrl(this.router.url);
        var markers_array = this.queryParamsHelperService.markersStrToArray(urlTree.queryParams['markers']);
        markers_array.push(marker);
        urlTree.queryParams['markers'] = this.queryParamsHelperService.markersArrayToStr(markers_array);
        this.navigateByUrl(urlTree.toString());
    };
    /*  addMarker(marker){
        this.queryParamsHelperService.addMarker(marker);
      }*/
    //cesium specific
    MapMipService.prototype.cesiumChangeHeight = function (height) {
        var urlTree = this.router.parseUrl(this.router.url);
        if (!urlTree.queryParams.hasOwnProperty("height"))
            return;
        urlTree.queryParams["height"] = height;
        this.navigateByUrl(urlTree.toString());
    };
    //cesium & OL3 specific
    MapMipService.prototype.ChangeHeading = function (heading) {
        var urlTree = this.router.parseUrl(this.router.url);
        if (!urlTree.queryParams.hasOwnProperty("heading"))
            return;
        urlTree.queryParams["heading"] = heading;
        this.navigateByUrl(urlTree.toString());
    };
    MapMipService.prototype.cesiumChangePitch = function (pitch) {
        var urlTree = this.router.parseUrl(this.router.url);
        if (!urlTree.queryParams.hasOwnProperty("pitch"))
            return;
        urlTree.queryParams["pitch"] = pitch;
        this.navigateByUrl(urlTree.toString());
    };
    MapMipService.prototype.cesiumChangeRoll = function (roll) {
        var urlTree = this.router.parseUrl(this.router.url);
        if (!urlTree.queryParams.hasOwnProperty("roll"))
            return;
        urlTree.queryParams["roll"] = roll;
        this.navigateByUrl(urlTree.toString());
    };
    MapMipService.prototype.cesiumChangeMode3d = function (mode3d) {
        var urlTree = this.router.parseUrl(this.router.url);
        if (!urlTree.queryParams.hasOwnProperty("mode3d") && mode3d != "0" || mode3d == "")
            return;
        urlTree.queryParams["mode3d"] = mode3d;
        this.navigateByUrl(urlTree.toString());
    };
    MapMipService.prototype.cesiumRotate = function (rotate) {
        var urlTree = this.router.parseUrl(this.router.url);
        if (urlTree.queryParams["mode3d"] != "0")
            return;
        if (rotate != "1") {
            delete urlTree.queryParams["rotate"];
            this.navigateByUrl(urlTree.toString());
            return;
        }
        urlTree.queryParams["rotate"] = rotate;
        this.navigateByUrl(urlTree.toString());
    };
    MapMipService.prototype.cesiumChangeTerrain = function (terrain) {
        var urlTree = this.router.parseUrl(this.router.url);
        urlTree.queryParams["terrain"] = terrain;
        this.navigateByUrl(urlTree.toString());
    };
    MapMipService.prototype.cesiumChangeLighting = function (lighting) {
        var urlTree = this.router.parseUrl(this.router.url);
        urlTree.queryParams["lighting"] = lighting;
        this.navigateByUrl(urlTree.toString());
    };
    MapMipService.prototype.Ol3Rotate = function (rotate) {
        var urlTree = this.router.parseUrl(this.router.url);
        if (!urlTree.queryParams.hasOwnProperty("rotate") && rotate != "0" || rotate == "")
            return;
        urlTree.queryParams["rotate"] = rotate;
        this.navigateByUrl(urlTree.toString());
    };
    MapMipService.prototype.changeSize = function (width, height) {
        var urlTree = this.router.parseUrl(this.router.url);
        urlTree.queryParams["size"] = width + "," + height;
        this.navigateByUrl(urlTree.toString());
    };
    MapMipService.prototype.changeMapPositionInPage = function (width, height) {
        var urlTree = this.router.parseUrl(this.router.url);
        urlTree.queryParams["position"] = width + "," + height;
        this.navigateByUrl(urlTree.toString());
    };
    MapMipService.prototype.leafletChangeZoom = function (zoom) {
        var urlTree = this.router.parseUrl(this.router.url);
        urlTree.queryParams["zoom"] = zoom.toString();
        this.navigateByUrl(urlTree.toString());
    };
    MapMipService.prototype.Ol3changeZoom = function (zoom) {
        var urlTree = this.router.parseUrl(this.router.url);
        urlTree.queryParams["zoom"] = (zoom < 20 ? zoom : 19).toString();
        this.navigateByUrl(urlTree.toString());
    };
    /*removeMarkerByPosition(marker){
      this.queryParamsHelperService.removeMarker(marker);
    }*/
    MapMipService.prototype.removeMarker = function (marker) {
        var urlTree = this.router.parseUrl(this.router.url);
        var markers_array = this.queryParamsHelperService.markersStrToArray(urlTree.queryParams['markers']);
        __WEBPACK_IMPORTED_MODULE_5_lodash__["forEach"](markers_array, function (m, index) {
            if (marker.position[0] == m.position[0] && marker.position[1] == m.position[1] && marker.color == m.color) {
                markers_array.splice(index, 1);
            }
        });
        urlTree.queryParams['markers'] = this.queryParamsHelperService.markersArrayToStr(markers_array);
        this.navigateByUrl(urlTree.toString());
    };
    /*
      addGeojson(geojson){
        this.queryParamsHelperService.addGeojson(geojson);
      }*/
    MapMipService.prototype.addGeojson = function (geojson) {
        var urlTree = this.router.parseUrl(this.router.url);
        var geojson_array = this.queryParamsHelperService.geojsonStrToArray(urlTree.queryParams['geojson']);
        geojson_array.push(geojson);
        urlTree.queryParams['geojson'] = this.queryParamsHelperService.geojsonArrayToStr(geojson_array);
        this.navigateByUrl(urlTree.toString());
    };
    return MapMipService;
}());
MapMipService.LEAFLET_PATH = '/leaflet';
MapMipService.OPENLAYERS_PATH = '/openlayers';
MapMipService.CESIUM_PATH = '/cesium';
MapMipService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__components_position_form_position_form_service__["a" /* PositionFormService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__components_position_form_position_form_service__["a" /* PositionFormService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_common__["b" /* Location */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_common__["b" /* Location */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__services_query_params_helper_service__["a" /* QueryParamsHelperService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__services_query_params_helper_service__["a" /* QueryParamsHelperService */]) === "function" && _d || Object])
], MapMipService);

var _a, _b, _c, _d;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/map-mip.service.js.map

/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__calc_service__ = __webpack_require__(65);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QueryParamsHelperService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var QueryParamsHelperService = (function () {
    function QueryParamsHelperService(calcService, router) {
        this.calcService = calcService;
        this.router = router;
    }
    QueryParamsHelperService.prototype.queryBounds = function (params) {
        var boundsString = params['bounds'];
        var bounds = boundsString.split(',').map(function (strToNum) { return +strToNum; });
        return bounds;
    };
    QueryParamsHelperService.prototype.hasQueryBounds = function (params) {
        var boundsString = params['bounds'];
        return !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](boundsString);
    };
    QueryParamsHelperService.prototype.queryLat = function (params) {
        return +params['lat'] || 0;
    };
    QueryParamsHelperService.prototype.queryLng = function (params) {
        return +params['lng'] || 0;
    };
    QueryParamsHelperService.prototype.queryZoom = function (params) {
        return +params['zoom'] || 0;
    };
    QueryParamsHelperService.prototype.queryHeading = function (params) {
        return +params['heading'] || 0;
    };
    QueryParamsHelperService.prototype.queryRoll = function (params) {
        return +params['roll'] || 0;
    };
    QueryParamsHelperService.prototype.queryHeight = function (params) {
        return +params["height"] || 0;
    };
    QueryParamsHelperService.prototype.queryPitch = function (params) {
        return +params['pitch'] || -90;
    };
    QueryParamsHelperService.prototype.queryMode3d = function (params) {
        return +params['mode3d'] == 0 ? 0 : 1;
    };
    QueryParamsHelperService.prototype.queryRotate = function (params) {
        return +params['rotate'];
    };
    QueryParamsHelperService.prototype.querySize = function (params) {
        var size = params['size'];
        if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](size))
            return [100, 100];
        return size.split(",").map(function (str) { return +str; });
    };
    QueryParamsHelperService.prototype.queryTerrain = function (params) {
        return params['terrain'];
    };
    QueryParamsHelperService.prototype.queryGeoJson = function (params) {
        return this.geojsonStrToArray(params['geojson']);
    };
    QueryParamsHelperService.prototype.queryLighting = function (params) {
        if (+params['lighting'] != 1)
            return 0;
        return 1;
    };
    QueryParamsHelperService.prototype.queryPosition = function (params) {
        var position = params['position'];
        if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](position))
            return [50, 50];
        return position.split(",").map(function (str) { return +str; });
    };
    QueryParamsHelperService.prototype.anySizeChange = function (prevParams, currentParams) {
        var prevSize = this.querySize(prevParams);
        var currentSize = this.querySize(currentParams);
        return !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEqual"](prevSize, currentSize);
    };
    QueryParamsHelperService.prototype.anyTerrainChange = function (prevParams, currentParams) {
        var prevSize = this.queryTerrain(prevParams);
        var currentSize = this.queryTerrain(currentParams);
        return !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEqual"](prevSize, currentSize);
    };
    QueryParamsHelperService.prototype.anyGeoJsonChange = function (prevParams, currentParams) {
        var prevSize = this.queryGeoJson(prevParams);
        var currentSize = this.queryGeoJson(currentParams);
        return !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEqual"](prevSize, currentSize);
    };
    QueryParamsHelperService.prototype.anyLightingChange = function (prevParams, currentParams) {
        var prevLighting = this.queryLighting(prevParams);
        var currentLighting = this.queryLighting(currentParams);
        return !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEqual"](prevLighting, currentLighting);
    };
    QueryParamsHelperService.prototype.anyPositionChange = function (prevParams, currentParams) {
        var prevSize = this.queryPosition(prevParams);
        var currentSize = this.queryPosition(currentParams);
        return !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEqual"](prevSize, currentSize);
    };
    /*addMarker(marker){
      let urlTree:UrlTree = this.router.parseUrl(this.router.url);
      let markers_array:Array<any> = this.markersStrToArray(urlTree.queryParams['markers']);
      markers_array.push(marker);
      urlTree.queryParams['markers'] = this.markersArrayToStr(markers_array);
      this.mapMipService.navigateByUrl(urlTree.toString())
    }*/
    /* addGeojson(geojson){
       let urlTree:UrlTree = this.router.parseUrl(this.router.url);
       let geojson_array:Array<any> = this.geojsonStrToArray(urlTree.queryParams['geojson']);
       geojson_array.push(geojson);
       urlTree.queryParams['geojson'] = this.geojsonArrayToStr(geojson_array);
       this.mapMipService.navigateByUrl(urlTree.toString())
     }*/
    QueryParamsHelperService.prototype.queryMarkers = function (params) {
        return this.markersStrToArray(params['markers']);
    };
    QueryParamsHelperService.prototype.anyLayersChanges = function (prev, current) {
        var currentLayers = this.queryLayers(current);
        var prevLayers = this.queryLayers(prev);
        return !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEqual"](currentLayers, prevLayers);
    };
    QueryParamsHelperService.prototype.queryLayers = function (params) {
        var decode_array = this.queryLayersStrings(params);
        decode_array.forEach(function (layer_obj) {
            __WEBPACK_IMPORTED_MODULE_2_lodash__["forEach"](layer_obj, function (val, key, obj) { obj[key] = decodeURIComponent(val); });
        });
        return decode_array;
    };
    QueryParamsHelperService.prototype.queryLayersStrings = function (params) {
        return this.queryLayersStringToObjects(params);
    };
    QueryParamsHelperService.prototype.queryLayersStringToObjects = function (params) {
        var layer_to_decode = params['layers'];
        if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](layer_to_decode))
            layer_to_decode = '';
        layer_to_decode = layer_to_decode.split(" ").join("");
        return rison.decode_array(layer_to_decode);
    };
    QueryParamsHelperService.prototype.queryGeojsonStringToObjects = function (params) {
        var geojson_to_decode = params['geojson'];
        if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](geojson_to_decode))
            geojson_to_decode = '';
        geojson_to_decode = geojson_to_decode.split(" ").join("");
        return rison.decode_array(geojson_to_decode);
    };
    QueryParamsHelperService.prototype.queryLayersObjectToString = function (tms_obj) {
        if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](tms_obj))
            return "";
        return rison.encode_array(tms_obj);
    };
    QueryParamsHelperService.prototype.queryGeoJsonObjectToString = function (tms_obj) {
        if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](tms_obj))
            return "";
        return rison.encode_array(tms_obj);
    };
    QueryParamsHelperService.prototype.layerObjecttToUrl = function (layer_obj) {
        var obj = __WEBPACK_IMPORTED_MODULE_2_lodash__["cloneDeep"](layer_obj);
        var url = obj.url;
        delete obj.url;
        Object.keys(obj).forEach(function (val, index, array) {
            if (index == 0) {
                url += '?';
            }
            else {
                url += '&';
            }
            url += val + "=" + obj[val];
        });
        return url;
    };
    QueryParamsHelperService.prototype.queryMarkersNoHeight = function (params) {
        var markers = this.queryMarkers(params);
        markers.forEach(function (marker) { marker.position = [marker.position[0], marker.position[1]]; });
        return markers;
    };
    QueryParamsHelperService.prototype.markersStrToArray = function (markersStr) {
        if (markersStr === void 0) { markersStr = ""; }
        if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](markersStr))
            return [];
        var markersArrayStr = markersStr.split(" ").join("").split("),(").map(function (str, index, array) {
            if (index == 0) {
                str = str.replace("(", "");
            }
            if (index == array.length - 1) {
                str = str.replace(")", "");
            }
            return str;
        });
        var markersArrayObject = markersArrayStr.map(function (one) {
            var split_array = one.split(",");
            var position = split_array.filter(function (i) { return !isNaN(+i); }).map(function (i) { return +(+i).toFixed(7); });
            var color = split_array.find(function (i) { return isNaN(+i); });
            var marker_obj = { position: position };
            if (color)
                marker_obj['color'] = color;
            return marker_obj;
        });
        return markersArrayObject;
    };
    QueryParamsHelperService.prototype.geojsonStrToArray = function (geojsonStr) {
        if (geojsonStr === void 0) { geojsonStr = ""; }
        if (__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](geojsonStr))
            return [];
        var geojsonArrayStr = geojsonStr.split(" ").join("").split("),(").map(function (str, index, array) {
            if (index == 0) {
                str = str.replace("(", "");
            }
            if (index == array.length - 1) {
                str = str.replace(")", "");
            }
            return str;
        });
        return geojsonArrayStr;
    };
    QueryParamsHelperService.prototype.markersArrayToStr = function (markersArray) {
        var url_str = "";
        markersArray.forEach(function (markersObj, index, array) {
            var one_array_str = "";
            one_array_str += markersObj.position;
            one_array_str = markersObj.color ? one_array_str + "," + markersObj.color : one_array_str;
            one_array_str = "(" + one_array_str + "),";
            one_array_str = index == (array.length - 1) ? one_array_str.replace("),", ")") : one_array_str;
            url_str += one_array_str;
        });
        return url_str;
    };
    QueryParamsHelperService.prototype.geojsonArrayToStr = function (geojsonArray) {
        var url_str = "";
        geojsonArray.forEach(function (geojsonObj, index, array) {
            var one_array_str = "";
            one_array_str += geojsonObj;
            one_array_str = "(" + geojsonObj + "),";
            one_array_str = index == (array.length - 1) ? one_array_str.replace("),", ")") : one_array_str;
            url_str += one_array_str;
        });
        return url_str;
    };
    QueryParamsHelperService.prototype.anyMarkersParamsChanges = function (prevParams, currentParams) {
        var currentMarkers = this.queryMarkers(currentParams);
        var prevMarkers = this.queryMarkers(prevParams);
        return !__WEBPACK_IMPORTED_MODULE_2_lodash__["isEqual"](currentMarkers, prevMarkers);
    };
    QueryParamsHelperService.prototype.getQuery = function (queryObj) {
        queryObj.roll = queryObj.roll % 360 == 0 ? undefined : queryObj.roll;
        queryObj.heading = queryObj.heading % 360 == 0 ? undefined : queryObj.heading;
        queryObj.pitch = queryObj.pitch == -90 ? undefined : queryObj.pitch;
        queryObj.mode3d = queryObj.mode3d == 0 ? queryObj.mode3d : undefined;
        // queryObj.rotate  = queryObj.rotate == 1 ? 1 : undefined;
        queryObj.markers = __WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](queryObj.markers) ? undefined : queryObj.markers;
        queryObj.layers = __WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](queryObj.layers) ? undefined : queryObj.layers;
        queryObj.size = __WEBPACK_IMPORTED_MODULE_2_lodash__["isEqual"](queryObj.size, "100,100") ? undefined : queryObj.size;
        queryObj.position = __WEBPACK_IMPORTED_MODULE_2_lodash__["isNil"](queryObj.size) || __WEBPACK_IMPORTED_MODULE_2_lodash__["isEqual"](queryObj.position, "50,50") ? undefined : queryObj.position;
        queryObj.terrain = __WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](queryObj.terrain) ? undefined : queryObj.terrain;
        queryObj.lighting = __WEBPACK_IMPORTED_MODULE_2_lodash__["isEqual"](this.queryLighting({ lighting: queryObj.lighting }), 1) ? queryObj.lighting : undefined;
        queryObj.geojson = __WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](this.queryGeoJson({ geojson: queryObj.geojson })) ? undefined : queryObj.geojson;
        return {
            queryParams: queryObj
        };
    };
    return QueryParamsHelperService;
}());
QueryParamsHelperService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__calc_service__["a" /* CalcService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__calc_service__["a" /* CalcService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _b || Object])
], QueryParamsHelperService);

var _a, _b;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/query-params-helper.service.js.map

/***/ }),

/***/ 37:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(40);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MARKER_COLORS; });
/* unused harmony export MARKER_COLORS_HEX */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PositionFormService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MARKER_COLORS = [
    { color: 'blue', width: 36, height: 48 }, { color: 'black', width: 36, height: 48 }, { color: 'green', width: 36, height: 48 },
    { color: 'gray', width: 36, height: 48 }, { color: 'orange', width: 36, height: 48 }, { color: 'yellow', width: 36, height: 48 },
    { color: 'red', width: 36, height: 48 }, { color: 'violet', width: 36, height: 48 }, { color: 'coffee', width: 36, height: 48 },
    { color: 'star', width: 36, height: 48 }, { color: 'home', width: 36, height: 48 }, { color: 'airport', width: 36, height: 48 },
    { color: 'tools', width: 36, height: 48 }, { color: 'train', width: 36, height: 48 }, { color: 'tree', width: 36, height: 48 },
    { color: 'lock', width: 36, height: 48 }, { color: 'hazard', width: 36, height: 48 }, { color: 'hotel', width: 36, height: 48 },
    { color: 'gov', width: 36, height: 48 }, { color: 'dollar', width: 36, height: 48 }, { color: 'conversation', width: 36, height: 48 },
    { color: 'rest', width: 36, height: 48 }, { color: 'man', width: 36, height: 48 }, { color: 'fire', width: 36, height: 48 },
    { color: 'coffee2', width: 36, height: 48 },
    { color: 'conversation2', width: 36, height: 48 },
    { color: 'dollar2', width: 36, height: 48 },
    { color: 'fire2', width: 36, height: 48 },
    { color: 'gov2', width: 36, height: 48 },
    { color: 'hazard2', width: 36, height: 48 },
    { color: 'home2', width: 36, height: 48 },
    { color: 'hotel2', width: 36, height: 48 },
    { color: 'lock2', width: 36, height: 48 },
    { color: 'man2', width: 36, height: 48 },
    { color: 'rest2', width: 36, height: 48 },
    { color: 'star2', width: 36, height: 48 },
    { color: 'tools2', width: 36, height: 48 },
    { color: 'train2', width: 36, height: 48 },
    { color: 'tree2', width: 36, height: 48 },
    { color: 'fire_', width: 36, height: 48 },
    { color: 'fire1a', width: 60, height: 80 },
    { color: 'fire1b', width: 60, height: 80 },
    { color: 'fire4a', width: 36, height: 48 },
    { color: 'fire4b', width: 36, height: 48 },
    { color: 'fire5', width: 36, height: 48 },
    { color: 'lock1a', width: 60, height: 80 },
    { color: 'lock1b', width: 60, height: 80 },
    { color: 'lock4a', width: 36, height: 48 },
    { color: 'lock4b', width: 36, height: 48 },
    { color: 'lock5', width: 36, height: 48 },
    { color: 'lock5c', width: 36, height: 48 }
];
var MARKER_COLORS_HEX = ['#277fca', '#3c3c3c', '#23aa1f', '#777777', '#cb832c', '#cbc32c', '#c92139', '#9b29ca'];
var PositionFormService = (function () {
    function PositionFormService(domSanitizer) {
        this.domSanitizer = domSanitizer;
        this.selectedColorIndex = 0;
        this.markerPickerEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.hideComponent = true;
    }
    PositionFormService.prototype.getSelectedMarkerWidth = function () {
        return MARKER_COLORS[this.getSelectedColorIndex()].width;
    };
    PositionFormService.prototype.getSelectedMarkerHeight = function () {
        return MARKER_COLORS[this.getSelectedColorIndex()].height;
    };
    PositionFormService.prototype.getSelectedColor = function (index) {
        if (index === void 0) { index = this.selectedColorIndex; }
        return MARKER_COLORS[index].color;
    };
    PositionFormService.prototype.getSelectedColorIndex = function (color) {
        if (color === void 0) { color = this.getSelectedColor(); }
        //return MARKER_COLORS.indexOf(color);
        return this.search(color, MARKER_COLORS);
    };
    PositionFormService.prototype.search = function (nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].color === nameKey) {
                return i;
            }
        }
    };
    PositionFormService.prototype.getSelectedColorHEX = function (index) {
        if (index === void 0) { index = this.selectedColorIndex; }
        return MARKER_COLORS_HEX[index];
    };
    PositionFormService.prototype.getMarkerCursorStyle = function () {
        return this.domSanitizer.bypassSecurityTrustStyle("url(http://mapmip.webiks.com/assets/Markers/marker-icon-" + this.getSelectedColor() + ".cur), default");
    };
    PositionFormService.prototype.getMarkerUrlByColor = function (color, format) {
        if (color === void 0) { color = "blue"; }
        if (format === void 0) { format = "png"; }
        return "http://mapmip.webiks.com/assets/Markers/marker-icon-" + color + "." + format;
    };
    PositionFormService.prototype.getMarkerColorByUrl = function (url) {
        // return url.replace(location.origin, "").replace("/assets/Markers/marker-icon-", "").replace(".png","");
        return url.replace("http://mapmip.webiks.com", "").replace("/assets/Markers/marker-icon-", "").replace(".png", "");
    };
    return PositionFormService;
}());
PositionFormService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["DomSanitizer"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["DomSanitizer"]) === "function" && _a || Object])
], PositionFormService);

var _a;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/position-form.service.js.map

/***/ }),

/***/ 431:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 431;


/***/ }),

/***/ 432:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(438);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__(483);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__(441);




if (__WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["enableProdMode"])();
}
var MapmipApi = (function () {
    function MapmipApi(element) {
        this.initMapmip(element, { skipLocationChange: false });
    }
    MapmipApi.prototype.initMapmip = function (element, options) {
        var _this = this;
        if (options === void 0) { options = { skipLocationChange: false }; }
        var app_root = document.createElement("app-root");
        element = element instanceof HTMLElement ? element : document.querySelector("#" + element);
        element.appendChild(app_root);
        var m = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */]);
        m.then(function (appModuleRef) {
            console.log(appModuleRef.instance.mapmipService);
            _this.mapMipService = appModuleRef.instance.mapmipService;
            appModuleRef.instance.mapmipService.skipLocationChange = options.skipLocationChange;
        });
    };
    MapmipApi.prototype.goToComponent = function (state) {
        this.mapMipService.goTo(state);
    };
    MapmipApi.prototype.urlOverride = function () {
        this.mapMipService.skipLocationChange = true;
    };
    MapmipApi.prototype.changePosition = function (lat, lon) {
        this.mapMipService.changePosition(lat, lon);
    };
    return MapmipApi;
}());
window['Mapmip'] = MapmipApi;
// WEBPACK FOOTER //
// ./src/main.ts
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/main.js.map

/***/ }),

/***/ 440:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_mip_api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = (function () {
    function AppComponent(router, mapmip) {
        this.router = router;
        this.mapmip = mapmip;
        router.events.filter(function (e) { return e instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["e" /* NavigationEnd */]; }).subscribe(function (e) {
            parent.postMessage(window.location.href, "*");
        });
    }
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(689),
        styles: [__webpack_require__(636)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__map_mip_api_map_mip_service__["a" /* MapMipService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__map_mip_api_map_mip_service__["a" /* MapMipService */]) === "function" && _b || Object])
], AppComponent);

var _a, _b;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/app.component.js.map

/***/ }),

/***/ 441:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(440);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__navbar_navbar_component__ = __webpack_require__(482);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__map_mip_api_map_mip_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_common__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__map_mip_map_mip_module__ = __webpack_require__(480);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__angular_material__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_platform_browser_animations__ = __webpack_require__(439);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var AppModule = (function () {
    function AppModule(mapmipService) {
        this.mapmipService = mapmipService;
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_6__navbar_navbar_component__["a" /* NavbarComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["BrowserModule"],
            __WEBPACK_IMPORTED_MODULE_8__angular_common__["a" /* CommonModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_5_ng2_bootstrap__["a" /* Ng2BootstrapModule */],
            __WEBPACK_IMPORTED_MODULE_9__map_mip_map_mip_module__["a" /* MapMipModule */],
            __WEBPACK_IMPORTED_MODULE_10__angular_material__["a" /* MaterialRootModule */],
            __WEBPACK_IMPORTED_MODULE_11__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */]
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_7__map_mip_api_map_mip_service__["a" /* MapMipService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7__map_mip_api_map_mip_service__["a" /* MapMipService */]) === "function" && _a || Object])
], AppModule);

var _a;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/app.module.js.map

/***/ }),

/***/ 442:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_take__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_take___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_take__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__classes_cesium_component_layers__ = __webpack_require__(444);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classes_cesium_component_markers__ = __webpack_require__(449);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__position_form_position_form_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__classes_cesium_component_map_view__ = __webpack_require__(448);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__classes_cesium_component_map_size__ = __webpack_require__(447);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__classes_cesium_component_map_position__ = __webpack_require__(446);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__classes_cesium_component_terrain__ = __webpack_require__(450);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__classes_cesium_component_map_lighting__ = __webpack_require__(445);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_cesium_Build_Cesium_Cesium_js__ = __webpack_require__(484);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_cesium_Build_Cesium_Cesium_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_cesium_Build_Cesium_Cesium_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__classes_cesium_component_geojson__ = __webpack_require__(443);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__map_mip_component__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__services_calc_service__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CesiumComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

















var CesiumComponent = (function () {
    function CesiumComponent(queryParamsHelperService, activatedRoute, router, calcService, positionFormService, mapMipService) {
        this.queryParamsHelperService = queryParamsHelperService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.calcService = calcService;
        this.positionFormService = positionFormService;
        this.mapMipService = mapMipService;
        this.prevParams = {};
        this.currentParams = {};
        this.queryParamsSubscriber = activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
        window['current'] = this;
    }
    CesiumComponent.prototype.ngOnDestroy = function () {
        this.queryParamsSubscriber.unsubscribe();
        this.map_view.destroy();
        this.layers.destroy();
        this.markers.destroy();
    };
    CesiumComponent.prototype.ngOnInit = function () {
        this.initializeMap();
        this.markers = new __WEBPACK_IMPORTED_MODULE_4__classes_cesium_component_markers__["a" /* CesiumMarkers */](this);
        this.layers = new __WEBPACK_IMPORTED_MODULE_3__classes_cesium_component_layers__["a" /* CesiumLayers */](this);
        this.map_size = new __WEBPACK_IMPORTED_MODULE_7__classes_cesium_component_map_size__["a" /* CesiumMapSize */](this);
        this.map_view = new __WEBPACK_IMPORTED_MODULE_6__classes_cesium_component_map_view__["a" /* CesiumMapView */](this);
        this.map_position = new __WEBPACK_IMPORTED_MODULE_8__classes_cesium_component_map_position__["a" /* CesiumMapPosition */](this);
        this.terrain = new __WEBPACK_IMPORTED_MODULE_9__classes_cesium_component_terrain__["a" /* CesiumTerrian */](this);
        this.map_lighting = new __WEBPACK_IMPORTED_MODULE_10__classes_cesium_component_map_lighting__["a" /* CesiumMapLighting */](this);
        this.geojson = new __WEBPACK_IMPORTED_MODULE_12__classes_cesium_component_geojson__["a" /* CesiumGeoJson */](this);
    };
    ;
    CesiumComponent.prototype.queryParams = function (params) {
        this.prevParams = this.currentParams;
        this.currentParams = params;
    };
    ;
    CesiumComponent.prototype.initializeMap = function () {
        window['CESIUM_BASE_URL'] = 'http://cesiumjs.org/releases/1.30/Build/Cesium';
        Cesium.BingMapsApi.defaultKey = "AnjT_wAj_juA_MsD8NhcEAVSjCYpV-e50lUypkWm1JPxVu0XyVqabsvD3r2DQpX-";
        this.viewer = new Cesium.Viewer(this.container.nativeElement, {
            baseLayerPicker: false,
        });
    };
    return CesiumComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('container'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]) === "function" && _a || Object)
], CesiumComponent.prototype, "container", void 0);
CesiumComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        host: __WEBPACK_IMPORTED_MODULE_13__map_mip_component__["b" /* host */],
        selector: 'app-cesium',
        template: __webpack_require__(690),
        styles: [__webpack_require__(637)],
        animations: __WEBPACK_IMPORTED_MODULE_13__map_mip_component__["c" /* animations */]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_14__services_query_params_helper_service__["a" /* QueryParamsHelperService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_14__services_query_params_helper_service__["a" /* QueryParamsHelperService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["d" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["d" /* ActivatedRoute */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_15__services_calc_service__["a" /* CalcService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_15__services_calc_service__["a" /* CalcService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_5__position_form_position_form_service__["a" /* PositionFormService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__position_form_position_form_service__["a" /* PositionFormService */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_16__api_map_mip_service__["a" /* MapMipService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_16__api_map_mip_service__["a" /* MapMipService */]) === "function" && _g || Object])
], CesiumComponent);

var _a, _b, _c, _d, _e, _f, _g;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/cesium.component.js.map

/***/ }),

/***/ 443:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CesiumGeoJson; });

var CesiumGeoJson = (function () {
    function CesiumGeoJson(cesium) {
        this.cesium = cesium;
        this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    CesiumGeoJson.prototype.queryParams = function (params) {
        if (this.cesium.queryParamsHelperService.anyGeoJsonChange(this.cesium.prevParams, this.cesium.currentParams)) {
            var urls = this.cesium.queryParamsHelperService.queryGeoJson(params);
            var that_1 = this;
            //remove all
            this.cesium.viewer.dataSources.removeAll();
            //then add the current
            __WEBPACK_IMPORTED_MODULE_0_lodash__["forEach"](urls, function (url) {
                var promise = Cesium.GeoJsonDataSource.load(url, {
                    stroke: Cesium.Color.DEEPSKYBLUE,
                    fill: Cesium.Color.DEEPSKYBLUE.withAlpha(0.1),
                    strokeWidth: 3
                });
                promise.then(function (dataSource) {
                    that_1.cesium.viewer.dataSources.add(dataSource);
                    var entities = dataSource.entities.values;
                    __WEBPACK_IMPORTED_MODULE_0_lodash__["forEach"](entities, function (ent) {
                        ent.billboard.image = "http://mapmip.webiks.com/assets/Markers/marker-icon-blue.png";
                    });
                });
            });
        }
    };
    return CesiumGeoJson;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/cesium.component.geojson.js.map

/***/ }),

/***/ 444:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CesiumLayers; });

var CesiumLayers = (function () {
    function CesiumLayers(cesium) {
        this.cesium = cesium;
        this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    CesiumLayers.prototype.queryParams = function (params) {
        if (this.cesium.queryParamsHelperService.anyLayersChanges(this.cesium.prevParams, this.cesium.currentParams) || this.noTileLayer()) {
            this.setLayersChanges(params);
        }
    };
    CesiumLayers.prototype.destroy = function () {
        this.queryParamsSubscriber.unsubscribe();
    };
    CesiumLayers.prototype.getLayerFromLayerObj = function (layer_obj) {
        switch (layer_obj.source) {
            case 'mapbox':
                return this.getMapboxLayer(layer_obj);
            case 'openstreetmap':
                return this.getOpenstreetmapLayer(layer_obj);
            case 'bing':
                return this.getBingLayer(layer_obj);
            case 'tms':
                return this.getTmsLayer(layer_obj);
            default:
                return this.getUrlTemplateLayer(layer_obj);
        }
    };
    CesiumLayers.prototype.getBingLayer = function (layer_obj) {
        return new Cesium.BingMapsImageryProvider({
            url: layer_obj['url'],
            key: layer_obj['key'],
            mapStyle: layer_obj['style'],
        });
    };
    CesiumLayers.prototype.getMapboxLayer = function (layer_obj) {
        var _this = this;
        return new Cesium.MapboxImageryProvider({
            url: layer_obj['url'],
            mapId: layer_obj['mapid'],
            accessToken: layer_obj['access_token'],
            format: layer_obj['format'] ? layer_obj['format'] : undefined,
            proxy: {
                getURL: function (url) { return _this.parseMapBoxUrl(layer_obj, url); }
            }
        });
    };
    CesiumLayers.prototype.getTmsLayer = function (layer_obj) {
        return new Cesium.createTileMapServiceImageryProvider({
            url: layer_obj['url'],
            fileExtension: layer_obj['format']
        });
    };
    CesiumLayers.prototype.getOpenstreetmapLayer = function (layer_obj) {
        var _this = this;
        return new Cesium.createOpenStreetMapImageryProvider({
            url: layer_obj['url'],
            format: layer_obj['format'],
            proxy: {
                getURL: function (url) { return _this.parseMapBoxUrl(layer_obj, url); }
            }
        });
    };
    CesiumLayers.prototype.getUrlTemplateLayer = function (default_obj) {
        return new Cesium.UrlTemplateImageryProvider({
            url: this.cesium.queryParamsHelperService.layerObjecttToUrl(default_obj)
        });
    };
    CesiumLayers.prototype.setLayersChanges = function (params) {
        var params_tms_array = this.cesium.queryParamsHelperService.queryLayers(params);
        var imageryLayers = this.cesium.viewer.imageryLayers._layers;
        this.removeLayersViaUrl(imageryLayers);
        this.addLayersViaUrl(params_tms_array);
        if (this.noTileLayer())
            this.addBaseLayer();
    };
    CesiumLayers.prototype.addLayersViaUrl = function (params_layers_array) {
        var _this = this;
        params_layers_array.forEach(function (layer_obj, index) {
            var _imageryProvider = _this.getLayerFromLayerObj(layer_obj);
            if (!_this.layerExistOnMap(_imageryProvider, index)) {
                _this.cesium.viewer.imageryLayers.addImageryProvider(_imageryProvider, index);
            }
        });
    };
    CesiumLayers.prototype.removeLayersViaUrl = function (map_imageryLayers) {
        var _this = this;
        var layers_to_remove = map_imageryLayers.filter(function (imageryLayer) { return !_this.layerExistOnParams(imageryLayer); });
        layers_to_remove.forEach(function (imageryLayer) { _this.cesium.viewer.imageryLayers.remove(imageryLayer); });
    };
    CesiumLayers.prototype.noTileLayer = function () {
        return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](this.cesium.viewer.imageryLayers._layers);
    };
    CesiumLayers.prototype.layerExistOnMap = function (_imageryProvider, index) {
        var _this = this;
        var map_imagery_layers = this.cesium.viewer.imageryLayers._layers;
        var exist_on_map = map_imagery_layers.find(function (imageryLayer) {
            return _this.imageryProvidersEqual(imageryLayer, _imageryProvider, index);
        });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isNil"](exist_on_map);
    };
    CesiumLayers.prototype.layerExistOnParams = function (imageryLayer) {
        var _this = this;
        var params_layers = this.cesium.queryParamsHelperService.queryLayers(this.cesium.currentParams);
        var exist_on_params = params_layers.find(function (layer_obj, index) {
            var _imageryProvider = _this.getLayerFromLayerObj(layer_obj);
            return _this.imageryProvidersEqual(imageryLayer, _imageryProvider, index);
        });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isNil"](exist_on_params);
    };
    CesiumLayers.prototype.imageryProvidersEqual = function (imageryLayer, _imageryProvider, index) {
        var imageryProvider = imageryLayer.imageryProvider;
        return imageryProvider instanceof _imageryProvider.constructor
            && index == imageryLayer._layerIndex
            && imageryProvider['_url'] == _imageryProvider['_url']
            && imageryProvider['_accessToken'] == _imageryProvider['_accessToken'] // MapboxImageryProvider
            && imageryProvider['_mapId'] == _imageryProvider['_mapId'] // MapboxImageryProvider
            && imageryProvider['_mapStyle'] == _imageryProvider['_mapStyle'] // BingImageryProvider
            && imageryProvider['_key'] == _imageryProvider['_key']; // BingImageryProvider
    };
    CesiumLayers.prototype.parseMapBoxUrl = function (layer_obj, url) {
        if (__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](layer_obj.format))
            url = url.replace(".png", "");
        if (__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](layer_obj.mapid))
            url = url.replace("undefined/", "");
        return url;
    };
    CesiumLayers.prototype.addBaseLayer = function () {
        var bing_layer = this.getBingLayer({ url: 'https://dev.virtualearth.net', key: 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq', style: 'Aerial' });
        this.cesium.viewer.imageryLayers.addImageryProvider(bing_layer);
    };
    return CesiumLayers;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/cesium.component.layers.js.map

/***/ }),

/***/ 445:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CesiumMapLighting; });
var CesiumMapLighting = (function () {
    function CesiumMapLighting(cesium) {
        this.cesium = cesium;
        this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    CesiumMapLighting.prototype.queryParams = function (params) {
        if (this.cesium.queryParamsHelperService.anyLightingChange(this.cesium.prevParams, this.cesium.currentParams)) {
            var state = this.cesium.queryParamsHelperService.queryLighting(params);
            if (state == 1) {
                this.cesium.viewer.scene.globe.enableLighting = true;
            }
            else {
                this.cesium.viewer.scene.globe.enableLighting = false;
            }
        }
    };
    return CesiumMapLighting;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/cesium.component.map-lighting.js.map

/***/ }),

/***/ 446:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CesiumMapPosition; });
var CesiumMapPosition = (function () {
    function CesiumMapPosition(cesium) {
        this.cesium = cesium;
        this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    CesiumMapPosition.prototype.queryParams = function (params) {
        if (this.cesium.queryParamsHelperService.anySizeChange(this.cesium.prevParams, this.cesium.currentParams) || this.cesium.queryParamsHelperService.anyPositionChange(this.cesium.prevParams, this.cesium.currentParams)) {
            var positionArr = this.cesium.queryParamsHelperService.queryPosition(params);
            var sizeArr = this.cesium.queryParamsHelperService.querySize(params);
            var pixels_map_width = Math.floor(+(this.cesium.positionFormService.mapsCont.nativeElement.offsetWidth * (sizeArr[0] / 100)).toFixed(2));
            var pixels_map_height = Math.floor(+(this.cesium.positionFormService.mapsCont.nativeElement.offsetHeight * (sizeArr[1] / 100)).toFixed(2));
            var max_width = this.cesium.positionFormService.mapsCont.nativeElement.offsetWidth - pixels_map_width;
            var max_height = this.cesium.positionFormService.mapsCont.nativeElement.offsetHeight - pixels_map_height;
            var left_style = Math.floor(+(max_width * positionArr[0] / 100).toFixed(2));
            var top_style = Math.floor(+(max_height * positionArr[1] / 100).toFixed(2));
            this.cesium.container.nativeElement.style.left = left_style + "px";
            this.cesium.container.nativeElement.style.top = top_style + "px";
        }
    };
    return CesiumMapPosition;
}());

/**
 * Created by yairT on 05/02/2017.
 */
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/cesium.component.map-position.js.map

/***/ }),

/***/ 447:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CesiumMapSize; });
var CesiumMapSize = (function () {
    function CesiumMapSize(cesium) {
        this.cesium = cesium;
        this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    CesiumMapSize.prototype.queryParams = function (params) {
        var width_or_height_are_nil = this.cesium.container.nativeElement.style.width == "" || this.cesium.container.nativeElement.style.height == "";
        if (this.cesium.queryParamsHelperService.anySizeChange(this.cesium.prevParams, this.cesium.currentParams) || width_or_height_are_nil) {
            var sizeArr = this.cesium.queryParamsHelperService.querySize(params);
            this.cesium.container.nativeElement.style.width = sizeArr[0] + "%";
            this.cesium.container.nativeElement.style.height = sizeArr[1] + "%";
        }
    };
    return CesiumMapSize;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/cesium.component.map-size.js.map

/***/ }),

/***/ 448:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(375);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CesiumMapView; });



var CesiumMapView = (function () {
    function CesiumMapView(cesium) {
        this.cesium = cesium;
        cesium.viewer.camera.moveEnd.addEventListener(this.moveEnd.bind(this));
        this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
        this.gotoEmitterSubscriber = cesium.mapMipService.gotoEmitter.subscribe(this.setQueryBoundsOnNavigationEnd.bind(this));
    }
    CesiumMapView.prototype.destroy = function () {
        this.queryParamsSubscriber.unsubscribe();
    };
    CesiumMapView.prototype.queryParams = function (params) {
        if (this.cesium.queryParamsHelperService.hasQueryBounds(params)) {
            this.setMapBounds(params);
        }
        else if (this.anyParamChanges(params)) {
            this.setMapView(params);
        }
    };
    CesiumMapView.prototype.anyParamChanges = function (params) {
        var longitudeP = this.cesium.queryParamsHelperService.queryLng(params); // || this.getCenter().lng;
        var latitudeP = this.cesium.queryParamsHelperService.queryLat(params); // || this.getCenter().lat;
        var heightP = this.cesium.queryParamsHelperService.queryHeight(params); // || this.viewer.camera.positionCartographic.height;
        var headingRadiansP = this.cesium.queryParamsHelperService.queryHeading(params) % 360;
        var pitchRadiansP = this.cesium.queryParamsHelperService.queryPitch(params) % 360;
        var rollRadiansP = this.cesium.queryParamsHelperService.queryRoll(params) % 360;
        var mode3dP = this.cesium.queryParamsHelperService.queryMode3d(params);
        var rotateP = this.cesium.queryParamsHelperService.queryRotate(params);
        var lightingP = this.cesium.queryParamsHelperService.queryLighting(params);
        var arrayP = [longitudeP, latitudeP, heightP, headingRadiansP, pitchRadiansP, rollRadiansP, mode3dP, rotateP, lightingP];
        var longitude = this.getCenter().lng;
        var latitude = this.getCenter().lat;
        var height = this.cesium.viewer.camera.positionCartographic.height;
        var headingRadians = +Cesium.Math.toDegrees(this.cesium.viewer.camera.heading) % 360;
        var pitchRadians = +Cesium.Math.toDegrees(this.cesium.viewer.camera.pitch) % 360;
        var rollRadians = +Cesium.Math.toDegrees(this.cesium.viewer.camera.roll) % 360;
        var mode3d = this.cesium.viewer.scene.mode == Cesium.SceneMode.SCENE3D ? 1 : 0;
        var rotate;
        var lighting = this.cesium.viewer.scene.globe.enableLighting ? 1 : 0;
        if (this.cesium.viewer.scene.mode == Cesium.SceneMode.SCENE3D || this.cesium.viewer.scene._mapMode2D == 1) {
            rotate = NaN;
        }
        else {
            rotate = 1;
        }
        var array = [longitude, latitude, height, headingRadians, pitchRadians, rollRadians, mode3d, rotate, lighting];
        arrayP = this.cesium.calcService.toFixes7Obj(arrayP);
        array = this.cesium.calcService.toFixes7Obj(array);
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](arrayP, array);
    };
    CesiumMapView.prototype.setMapView = function (params) {
        var longitude = this.cesium.queryParamsHelperService.queryLng(params) || this.getCenter().lng;
        var latitude = this.cesium.queryParamsHelperService.queryLat(params) || this.getCenter().lat;
        var height = this.cesium.queryParamsHelperService.queryHeight(params) || this.cesium.viewer.camera.positionCartographic.height;
        var headingRadians = Cesium.Math.toRadians(this.cesium.queryParamsHelperService.queryHeading(params));
        var pitchRadians = Cesium.Math.toRadians(this.cesium.queryParamsHelperService.queryPitch(params));
        var rollRadians = Cesium.Math.toRadians(this.cesium.queryParamsHelperService.queryRoll(params));
        var mode3d = this.cesium.queryParamsHelperService.queryMode3d(params);
        var rotate = isNaN(this.cesium.queryParamsHelperService.queryRotate(params)) ? 1 : 0;
        this.cesium.viewer.scene.mode = mode3d == 0 ? Cesium.SceneMode.SCENE2D : Cesium.SceneMode.SCENE3D;
        this.cesium.viewer.scene._mapMode2D = rotate;
        this.cesium.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
            orientation: {
                heading: headingRadians,
                pitch: pitchRadians,
                roll: rollRadians
            }
        });
    };
    CesiumMapView.prototype.moveEnd = function (e) {
        if (!this.anyParamChanges(this.cesium.currentParams))
            return;
        var center = this.getCenter();
        if (!center)
            return;
        var lat = center.lat;
        var lng = center.lng;
        var height = this.cesium.viewer.camera.positionCartographic.height; //.toFixed(7);
        var heading = +Cesium.Math.toDegrees(this.cesium.viewer.camera.heading); //.toFixed(7);
        var pitch = +Cesium.Math.toDegrees(this.cesium.viewer.camera.pitch); //.toFixed(7);
        var roll = +Cesium.Math.toDegrees(this.cesium.viewer.camera.roll); //.toFixed(7);
        var mode3d = this.cesium.viewer.scene.mode == Cesium.SceneMode.SCENE2D ? 0 : 1;
        var markers = this.cesium.currentParams['markers'];
        var layers = this.cesium.currentParams['layers'];
        var rotate = this.cesium.currentParams['rotate'];
        var size = this.cesium.currentParams['size'];
        var position = this.cesium.currentParams['position'];
        var terrain = this.cesium.currentParams['terrain'];
        var lighting = this.cesium.currentParams['lighting'];
        var geojson = this.cesium.currentParams['geojson'];
        rotate = this.cesium.viewer.scene.mode != Cesium.SceneMode.SCENE2D || rotate != 1 ? undefined : 1;
        var navigationExtras = this.cesium.queryParamsHelperService.getQuery({ lng: lng, lat: lat, height: height, heading: heading, pitch: pitch, roll: roll, mode3d: mode3d, markers: markers, rotate: rotate, layers: layers, size: size, position: position, terrain: terrain, lighting: lighting, geojson: geojson });
        return this.cesium.mapMipService.navigate([], navigationExtras);
    };
    ;
    CesiumMapView.prototype.getCenter = function () {
        var lat = Cesium.Math.toDegrees(this.cesium.viewer.camera.positionCartographic.latitude);
        var lng = Cesium.Math.toDegrees(this.cesium.viewer.camera.positionCartographic.longitude);
        return this.cesium.calcService.toFixes7Obj({ lat: lat, lng: lng });
    };
    CesiumMapView.prototype.getBounds = function () {
        var current_mode = this.cesium.viewer.scene.mode;
        var current_heading = this.cesium.viewer.camera.heading;
        var current_mapMode2D = this.cesium.viewer.scene.mapMode2D;
        this.cesium.viewer.scene.mode = Cesium.SceneMode.SCENE2D;
        this.cesium.viewer.scene._mapMode2D = 0;
        this.cesium.viewer.camera.setView({
            orientation: {
                heading: 0
            }
        });
        var bounds = this.calcBounds();
        bounds = bounds.map(function (value) { return Cesium.Math.toDegrees(value); });
        // let bounds: [number,number,number,number] = this.viewer.camera.computeViewRectangle();
        // if(isUndefined(bounds)) bounds = this.calcBounds();
        this.cesium.viewer.scene.mode = current_mode;
        this.cesium.viewer.scene._mapMode2D = current_mapMode2D;
        this.cesium.viewer.camera.setView({
            orientation: {
                heading: current_heading
            }
        });
        return bounds;
    };
    CesiumMapView.prototype.calcBounds = function () {
        var bounds;
        var leftTopCartesian2 = new Cesium.Cartesian2(0, 0);
        var leftTopCartesian3 = this.cesium.viewer.camera.pickEllipsoid(leftTopCartesian2);
        var rightBottomCartesian2 = new Cesium.Cartesian2(this.cesium.viewer.canvas.width, this.cesium.viewer.canvas.height);
        var rightBottomCartesian3 = this.cesium.viewer.camera.pickEllipsoid(rightBottomCartesian2);
        if (__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](leftTopCartesian3) || __WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](rightBottomCartesian3)) {
            var o_bounds = this.cesium.viewer.camera.computeViewRectangle();
            return [o_bounds.west, o_bounds.north, o_bounds.east, o_bounds.south];
        }
        var cartographicLeftTop = Cesium.Cartographic.fromCartesian(leftTopCartesian3);
        var cartographicRightBottom = Cesium.Cartographic.fromCartesian(rightBottomCartesian3);
        bounds = [cartographicRightBottom.longitude, cartographicLeftTop.latitude, cartographicLeftTop.longitude, cartographicRightBottom.latitude];
        return bounds;
    };
    CesiumMapView.prototype.setMapBounds = function (params) {
        var bounds = this.cesium.queryParamsHelperService.queryBounds(params);
        var heading = Cesium.Math.toRadians(this.cesium.queryParamsHelperService.queryHeading(params));
        this.cesium.viewer.camera.setView({
            destination: (_a = Cesium.Rectangle).fromDegrees.apply(_a, bounds),
            orientation: {
                heading: heading
            }
        });
        var _a;
    };
    CesiumMapView.prototype.onLeave = function (go_north) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].create(function (observer) {
            _this.flyToCenterAndGetBounds(go_north).subscribe(function (bool) {
                observer.next(bool);
            });
        });
    };
    ;
    CesiumMapView.prototype.flyToCenterAndGetBounds = function (go_north) {
        var _this = this;
        this.cesium.viewer.scene._mapMode2D == 0;
        var headingDeg = Cesium.Math.toDegrees(this.cesium.viewer.camera.heading);
        var pitchDeg = Cesium.Math.toDegrees(this.cesium.viewer.camera.pitch);
        var rollDeg = Cesium.Math.toDegrees(this.cesium.viewer.camera.roll);
        var on_d3 = headingDeg % 360 === 0 && pitchDeg === -90 && rollDeg % 360 === 0;
        var on_d2 = this.cesium.viewer.scene.mode == Cesium.SceneMode.SCENE2D;
        if (on_d3 || on_d2) {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(true);
        }
        else {
            var position_1, that_1 = this;
            return new __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"](function (obs) {
                var heading = _this.cesium.viewer.camera.heading;
                if (Math.cos(that_1.cesium.viewer.camera.pitch) < 0.001) {
                    position_1 = that_1.cesium.viewer.camera.position;
                }
                else {
                    try {
                        var rect = that_1.cesium.viewer.canvas.getBoundingClientRect();
                        var center = new Cesium.Cartesian2(rect.width / 2, rect.height / 2);
                        position_1 = that_1.cesium.viewer.camera.pickEllipsoid(center, that_1.cesium.viewer.scene.globe.ellipsoid);
                        var cartographic = Cesium.Cartographic.fromCartesian(position_1);
                        cartographic.height = that_1.cesium.viewer.camera.positionCartographic.height;
                        position_1 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
                    }
                    catch (err) {
                        position_1 = that_1.cesium.viewer.camera.position;
                    }
                }
                var flyToObj = {
                    destination: position_1,
                    easingFunction: Cesium.EasingFunction.LINEAR_NONE,
                    orientation: {
                        heading: go_north ? 0 : heading,
                        pitch: Cesium.Math.toRadians(-90.0),
                        roll: 0.0 //no change
                    },
                    duration: 0.5,
                    complete: function () {
                        obs.next(true);
                    }
                };
                that_1.cesium.viewer.camera.flyTo(flyToObj);
            });
        }
    };
    // setQueryBoundsOnNavigationEnd: (NavigationEnd) => void = (event):void => {
    //   let urlTree:UrlTree = this.cesium.router.parseUrl(event);
    //   urlTree.queryParams['bounds'] = this.getBounds().toString();
    //   this.cesium.mapMipService.navigateByUrl(urlTree.toString());
    // };
    CesiumMapView.prototype.setQueryBoundsOnNavigationEnd = function (state) {
        var _this = this;
        var extras = {};
        var go_north = state == __WEBPACK_IMPORTED_MODULE_2__api_map_mip_service__["a" /* MapMipService */].LEAFLET_PATH ? true : false;
        this.onLeave(go_north).subscribe(function () {
            var bounds = _this.getBounds().toString();
            var markers = _this.cesium.currentParams['markers'];
            var layers = _this.cesium.currentParams['layers'];
            var size = _this.cesium.currentParams['size'];
            var position = _this.cesium.currentParams['position'];
            var geojson = _this.cesium.currentParams['geojson'];
            extras.queryParams = { bounds: bounds, markers: markers, layers: layers, size: size, position: position, geojson: geojson };
            if (state == __WEBPACK_IMPORTED_MODULE_2__api_map_mip_service__["a" /* MapMipService */].OPENLAYERS_PATH) {
                var heading = _this.cesium.queryParamsHelperService.queryHeading(_this.cesium.currentParams);
                extras.queryParams['heading'] = heading;
            }
            _this.cesium.mapMipService.navigate([state], extras).then(function () {
                _this.cesium.viewer.camera.moveEnd._listeners.pop();
                _this.gotoEmitterSubscriber.unsubscribe();
            });
        });
    };
    return CesiumMapView;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/cesium.component.map-view.js.map

/***/ }),

/***/ 449:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CesiumMarkers; });

var CesiumMarkers = (function () {
    function CesiumMarkers(cesium) {
        this.cesium = cesium;
        //  public cesiumHandler = new Cesium.ScreenSpaceEventHandler(this.cesium.container.nativeElement);
        this.cesiumHandler = new Cesium.ScreenSpaceEventHandler(this.cesium.viewer.scene.canvas);
        this.marker_picker = {
            not_allowed: false
        };
        this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
        cesium.positionFormService.markerPickerEmitter.subscribe(this.toggleMarkerPicker.bind(this));
        if (cesium.positionFormService.onPicked)
            this.toggleMarkerPicker.bind(this)(true);
    }
    CesiumMarkers.prototype.destroy = function () {
        this.queryParamsSubscriber.unsubscribe();
        this.cesiumHandler.destroy();
    };
    CesiumMarkers.prototype.queryParams = function (params) {
        var params_changes = this.cesium.queryParamsHelperService.anyMarkersParamsChanges(this.cesium.prevParams, this.cesium.currentParams);
        var map_changes = this.anyMarkersMapChanges(params);
        if (params_changes && map_changes) {
            this.setMarkersChanges(params);
        }
    };
    CesiumMarkers.prototype.getCursorStyle = function () {
        if (this.cesium.positionFormService.onPicked) {
            if (this.marker_picker.not_allowed) {
                return "not-allowed";
            }
            else {
                return this.cesium.positionFormService.getMarkerCursorStyle();
            }
        }
    };
    CesiumMarkers.prototype.toggleMarkerPicker = function (checked) {
        if (checked) {
            this.cesiumHandler.setInputAction(this.leftClickInputAction.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.cesiumHandler.setInputAction(this.mouseMoveInputAction.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
        else {
            this.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.cesiumHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
    };
    CesiumMarkers.prototype.mouseMoveInputAction = function (event) {
        var positionCartesian3Result = this.cesium.viewer.camera.pickEllipsoid(event.endPosition);
        this.marker_picker.not_allowed = __WEBPACK_IMPORTED_MODULE_0_lodash__["isNil"](positionCartesian3Result);
    };
    CesiumMarkers.prototype.leftClickInputAction = function (event) {
        //event.position.x+=18;
        if (this.cesium.positionFormService.getSelectedMarkerWidth() == 36) {
            event.position.x += this.cesium.positionFormService.getSelectedMarkerWidth() / 2;
            event.position.y += this.cesium.positionFormService.getSelectedMarkerHeight();
        }
        else {
            event.position.x += 3.5 + this.cesium.positionFormService.getSelectedMarkerWidth() / 2;
            event.position.y += this.cesium.positionFormService.getSelectedMarkerHeight();
        }
        if (this.marker_picker.not_allowed)
            return;
        var position;
        // terrain case
        if (this.cesium.viewer.terrainProvider.hasOwnProperty("_url")) {
            var pickedObject = this.cesium.viewer.scene.pick(event.position); // Tr
            var positionCartesian3 = this.cesium.viewer.scene.pickPosition(event.position); // Tr
            var positionCartographic = Cesium.Cartographic.fromCartesian(positionCartesian3);
            var lngDeg = Cesium.Math.toDegrees(positionCartographic.longitude);
            var latDeg = Cesium.Math.toDegrees(positionCartographic.latitude);
            position = [lngDeg, latDeg];
        }
        else {
            var positionCartesian3 = this.cesium.viewer.camera.pickEllipsoid(event.position);
            var positionCartographic = Cesium.Cartographic.fromCartesian(positionCartesian3);
            var lngDeg = Cesium.Math.toDegrees(positionCartographic.longitude);
            var latDeg = Cesium.Math.toDegrees(positionCartographic.latitude);
            position = [lngDeg, latDeg];
        }
        var color = this.cesium.positionFormService.getSelectedColor();
        var marker_picker = { position: position };
        if (color != "blue")
            marker_picker['color'] = color;
        this.cesium.mapMipService.addMarker(marker_picker);
    };
    CesiumMarkers.prototype.anyMarkersMapChanges = function (params) {
        var _this = this;
        var queryMarkersCartographicDegreesPositions = this.cesium.queryParamsHelperService.queryMarkers(params);
        var mapMarkerCartesienPositions = this.getMarkersPosition();
        queryMarkersCartographicDegreesPositions.forEach(function (paramMarkerObj) {
            paramMarkerObj.position = _this.cesium.calcService.toFixes7Obj((_a = Cesium.Cartesian3).fromDegrees.apply(_a, paramMarkerObj.position));
            paramMarkerObj.color = paramMarkerObj.color ? paramMarkerObj.color : "blue";
            var _a;
        });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](mapMarkerCartesienPositions, queryMarkersCartographicDegreesPositions);
    };
    CesiumMarkers.prototype.getMarkersPosition = function () {
        var _this = this;
        var points = this.cesium.viewer.entities.values.filter(function (one) { return one.billboard; });
        var cartesianPositions = points.map(function (entity) {
            var position = _this.cesium.calcService.toFixes7Obj(entity.position.getValue());
            var color = _this.getColorFromBillboardEntity(entity);
            return { position: position, color: color };
        });
        return cartesianPositions;
    };
    CesiumMarkers.prototype.setMarkersChanges = function (params) {
        var params_markers = this.cesium.queryParamsHelperService.queryMarkers(params);
        var map_markers = this.getMarkersPosition();
        this.addMarkersViaUrl(params_markers, map_markers);
        this.removeMarkersViaUrl(params_markers, map_markers);
    };
    CesiumMarkers.prototype.addMarkersViaUrl = function (params_markers, map_markers) {
        var _this = this;
        params_markers.forEach(function (marker) {
            if (!_this.markerExistOnMap(map_markers, marker)) {
                _this.addMarker(marker);
            }
        });
    };
    CesiumMarkers.prototype.removeMarkersViaUrl = function (params_markers, map_markers) {
        var _this = this;
        map_markers.forEach(function (mapMarkerObj) {
            if (!_this.markerExistOnParams(params_markers, mapMarkerObj)) {
                _this.removeMarker(mapMarkerObj);
            }
        });
    };
    CesiumMarkers.prototype.addMarker = function (marker) {
        this.cesium.viewer.entities.add({
            position: (_a = Cesium.Cartesian3).fromDegrees.apply(_a, marker.position),
            billboard: {
                image: this.cesium.positionFormService.getMarkerUrlByColor(marker.color),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        var _a;
    };
    CesiumMarkers.prototype.removeMarker = function (marker) {
        var entity_to_remove = this.getEntityByPositionAndColor(marker);
        this.cesium.viewer.entities.remove(entity_to_remove);
    };
    CesiumMarkers.prototype.getEntityByPositionAndColor = function (mapMarkerObj) {
        var _this = this;
        return this.cesium.viewer.entities.values.find(function (entity) {
            var e_position = _this.cesium.calcService.toFixes7Obj(entity.position.getValue());
            var e_color = _this.getColorFromBillboardEntity(entity);
            mapMarkerObj.position = _this.cesium.calcService.toFixes7Obj(mapMarkerObj.position);
            return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](e_position, mapMarkerObj.position) && __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](e_color, mapMarkerObj.color);
        });
    };
    CesiumMarkers.prototype.getColorFromBillboardEntity = function (entity) {
        return this.cesium.positionFormService.getMarkerColorByUrl(entity.billboard.image.getValue());
    };
    CesiumMarkers.prototype.markerExistOnMap = function (map_markers, paramsMarker) {
        var paramObjToCheck = {
            position: this.cesium.calcService.toFixes7Obj((_a = Cesium.Cartesian3).fromDegrees.apply(_a, paramsMarker.position)),
            color: paramsMarker.color ? paramsMarker.color : "blue"
        };
        var exist_point = map_markers.find(function (markerObj) { return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](paramObjToCheck, markerObj); });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](exist_point);
        var _a;
    };
    CesiumMarkers.prototype.markerExistOnParams = function (markers_params_positions, mapMarkerObj) {
        var _this = this;
        var exist_marker = markers_params_positions.find(function (paramsMarkerObj) {
            var paramPosition = (_a = Cesium.Cartesian3).fromDegrees.apply(_a, paramsMarkerObj.position);
            var paramColor = paramsMarkerObj.color ? paramsMarkerObj.color : "blue";
            var mapPosition = mapMarkerObj.position;
            var mapColor = mapMarkerObj.color;
            paramPosition = _this.cesium.calcService.toFixes7Obj(paramPosition);
            mapPosition = _this.cesium.calcService.toFixes7Obj(mapPosition);
            return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](mapPosition, paramPosition) && __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](paramColor, mapColor);
            var _a;
        });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isNil"](exist_marker);
    };
    return CesiumMarkers;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/cesium.component.markers.js.map

/***/ }),

/***/ 450:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CesiumTerrian; });
var CesiumTerrian = (function () {
    function CesiumTerrian(cesium) {
        this.cesium = cesium;
        this.queryParamsSubscriber = cesium.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    CesiumTerrian.prototype.queryParams = function (params) {
        if (this.cesium.queryParamsHelperService.anyTerrainChange(this.cesium.prevParams, this.cesium.currentParams)) {
            var url = this.cesium.queryParamsHelperService.queryTerrain(params);
            if (url) {
                this.cesium.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({ url: url });
                this.cesium.viewer.scene.globe.depthTestAgainstTerrain = true;
            }
            else {
                this.cesium.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
                this.cesium.viewer.scene.globe.depthTestAgainstTerrain = false;
            }
        }
    };
    return CesiumTerrian;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/cesium.component.terrain.js.map

/***/ }),

/***/ 451:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LeafletGeoJson; });

var LeafletGeoJson = (function () {
    function LeafletGeoJson(leaflet) {
        this.leaflet = leaflet;
        this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    LeafletGeoJson.prototype.popUp = function (f, l) {
        var out = [];
        if (f.properties) {
            for (var key in f.properties) {
                out.push(key + ": " + f.properties[key]);
            }
            l.bindPopup(out.join("<br />"));
        }
    };
    LeafletGeoJson.prototype.queryParams = function (params) {
        var that = this;
        if (this.leaflet.queryParamsHelperService.anyGeoJsonChange(this.leaflet.prevParams, this.leaflet.currentParams)) {
            this.geoJsonLayers = [];
            //for case when moving from other component
            if (!this.assetLayerGroup) {
                this.assetLayerGroup = new this.leaflet.L.LayerGroup();
            }
            this.assetLayerGroup.clearLayers();
            var urls = this.leaflet.queryParamsHelperService.queryGeoJson(params);
            __WEBPACK_IMPORTED_MODULE_0_lodash__["forEach"](urls, function (url, index) {
                that.geoJsonLayers[index] = that.leaflet.L.geoJSON['ajax'](url, { onEachFeature: that.popUp });
                that.assetLayerGroup.addLayer(that.geoJsonLayers[index]);
            });
            // add the whole group to map
            this.assetLayerGroup.addTo(this.leaflet.map);
        }
    };
    return LeafletGeoJson;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/leaflet.component.geojson.js.map

/***/ }),

/***/ 452:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LeafletLayers; });
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var LeafletLayers = (function () {
    function LeafletLayers(leaflet) {
        this.leaflet = leaflet;
        if (this.noTileLayer())
            this.addBaseLayer();
        this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    LeafletLayers.prototype.queryParams = function (params) {
        if (this.leaflet.queryParamsHelperService.anyLayersChanges(this.leaflet.prevParams, this.leaflet.currentParams)) {
            this.setLayersChanges(params);
        }
    };
    LeafletLayers.prototype.destroy = function () {
        this.queryParamsSubscriber.unsubscribe();
    };
    LeafletLayers.prototype.setLayersChanges = function (params) {
        var params_layers_array = this.leaflet.queryParamsHelperService.queryLayers(params);
        var map_tile_layers_array = this.getTileLayersArray();
        this.addLayersViaUrl(params_layers_array);
        this.removeLayersViaUrl(map_tile_layers_array);
        this.sortLayers(params_layers_array);
        if (this.noTileLayer())
            this.addBaseLayer();
    };
    LeafletLayers.prototype.sortLayers = function (params_layers_array) {
        var _this = this;
        params_layers_array.forEach(function (layer_obj, index) {
            var map_l = _this.getTileLayersArray().find(function (layer) { return _this.layersEqual(layer, layer_obj); });
            map_l.setZIndex(index);
        });
    };
    LeafletLayers.prototype.addBaseLayer = function () {
        this.getBingLayer({ key: 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq', style: 'Aerial' }).addTo(this.leaflet.map);
    };
    LeafletLayers.prototype.addLayersViaUrl = function (params_layers_array) {
        var _this = this;
        var map_tile_layers = this.getTileLayersArray();
        params_layers_array.forEach(function (layer_obj) { return __awaiter(_this, void 0, void 0, function () {
            var layer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.layerExistOnMap(map_tile_layers, layer_obj)) return [3 /*break*/, 3];
                        layer = this.getLayerFromLayerObj(layer_obj);
                        if (!(layer_obj.source == 'tms')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setTmsOptions(layer_obj['url'], layer)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        layer.addTo(this.leaflet.map);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    LeafletLayers.prototype.getLayerFromLayerObj = function (layer_obj) {
        switch (layer_obj.source) {
            case "mapbox":
                return this.getMapboxLayer(layer_obj);
            case "openstreetmap":
                return this.getOpenstreetmapLayer(layer_obj);
            case "bing":
                return this.getBingLayer(layer_obj);
            case "tms":
                return this.getTmsLayer(layer_obj);
            default:
                return this.getDefaultLayer(layer_obj);
        }
    };
    LeafletLayers.prototype.getMapboxLayer = function (mapbox_obj) {
        var mapbox_url = this.parseMapboxUrl(mapbox_obj);
        return L.tileLayer(mapbox_url);
    };
    LeafletLayers.prototype.removeLayersViaUrl = function (map_tile_layers_array) {
        var _this = this;
        var params_layers_urls = this.leaflet.queryParamsHelperService.queryLayers(this.leaflet.currentParams);
        var layers_to_remove = map_tile_layers_array.filter(function (layer) { return !_this.layerExistOnParams(params_layers_urls, layer); });
        layers_to_remove.forEach(function (layer) { _this.leaflet.map.removeLayer(layer); });
    };
    LeafletLayers.prototype.getTileLayersArray = function () {
        return this.getLayersArray().filter(function (layer) { return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isNil"](layer.getTileSize); });
    };
    LeafletLayers.prototype.layerExistOnMap = function (map_tile_layers, layer_obj) {
        var _this = this;
        var exist_on_map = map_tile_layers.find(function (layer) { return _this.layersEqual(layer, layer_obj); });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isNil"](exist_on_map);
    };
    LeafletLayers.prototype.layerExistOnParams = function (params_tile_layers, layer) {
        var _this = this;
        var exist_on_params = params_tile_layers.find(function (layer_obj) { return _this.layersEqual(layer, layer_obj); });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isNil"](exist_on_params);
    };
    LeafletLayers.prototype.layersEqual = function (layer, layer_obj) {
        var _layer = this.getLayerFromLayerObj(layer_obj);
        switch (layer_obj.source) {
            case "bing":
                return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](__WEBPACK_IMPORTED_MODULE_0_lodash__["pick"](layer['options'], ['bingMapsKey', 'imagerySet']), __WEBPACK_IMPORTED_MODULE_0_lodash__["pick"](_layer['options'], ['bingMapsKey', 'imagerySet']));
            default:
                return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](_layer['_url'], layer['_url']) && __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](__WEBPACK_IMPORTED_MODULE_0_lodash__["pickBy"](layer['options'], function (val, key) { return key != "zIndex"; }), __WEBPACK_IMPORTED_MODULE_0_lodash__["pickBy"](_layer['options'], function (val, key) { return key != "zIndex"; }));
        }
    };
    LeafletLayers.prototype.getLayersArray = function () {
        var layers = [];
        this.leaflet.map.eachLayer(function (l) { return layers.push(l); });
        return layers;
    };
    LeafletLayers.prototype.parseMapboxUrl = function (mapbox_obj) {
        return "" + mapbox_obj['url'] + (mapbox_obj['mapid'] ? mapbox_obj['mapid'] + '/' : "") + "{z}/{x}/{y}" + (mapbox_obj['format'] ? '.' + mapbox_obj['format'] : '') + "?access_token=" + mapbox_obj['access_token'];
    };
    LeafletLayers.prototype.getOpenstreetmapLayer = function (osm_obj) {
        var osm_url = this.parseOpenstreetmapUrl(osm_obj);
        return L.tileLayer(osm_url);
    };
    LeafletLayers.prototype.getBingLayer = function (bing_obj) {
        return L.tileLayer['bing']({ bingMapsKey: bing_obj['key'], imagerySet: bing_obj['style'] });
    };
    LeafletLayers.prototype.getJson = function (geoJsonUrl) {
        return L.GeoJSON['AJAX'](geoJsonUrl);
    };
    LeafletLayers.prototype.getTmsLayer = function (tms_obj) {
        var tms_url = this.parseTmsUrl(tms_obj);
        return L.tileLayer(tms_url, { tms: true });
    };
    LeafletLayers.prototype.getDefaultLayer = function (default_obj) {
        return L.tileLayer(this.leaflet.queryParamsHelperService.layerObjecttToUrl(default_obj));
    };
    LeafletLayers.prototype.parseTmsUrl = function (osm_obj) {
        return osm_obj['url'] + "/{z}/{x}/{y}" + (osm_obj['format'] ? '.' + osm_obj['format'] : '');
    };
    LeafletLayers.prototype.parseOpenstreetmapUrl = function (osm_obj) {
        return osm_obj['url'] + "/{z}/{x}/{y}" + (osm_obj['format'] ? '.' + osm_obj['format'] : '');
    };
    LeafletLayers.prototype.setTmsOptions = function (url, layer) {
        return new Promise(function (res) {
            var cesium_tms_layer = Cesium.createTileMapServiceImageryProvider({ url: url });
            cesium_tms_layer.readyPromise.then(function (response) {
                var bounds = __WEBPACK_IMPORTED_MODULE_0_lodash__["map"](cesium_tms_layer.rectangle, function (a) { return Cesium.Math.toDegrees(a); });
                layer['options'].bounds = L.latLngBounds(L.latLng(bounds[1], bounds[0]), L.latLng(bounds[3], bounds[2]));
                layer['options'].maxZoom = cesium_tms_layer.maximumLevel;
                layer['options'].minZoom = cesium_tms_layer.minimumLevel;
                res(response);
            });
        });
    };
    LeafletLayers.prototype.noTileLayer = function () {
        return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](this.getTileLayersArray());
    };
    return LeafletLayers;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/leaflet.component.layers.js.map

/***/ }),

/***/ 453:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LeafletMapPosition; });
var LeafletMapPosition = (function () {
    function LeafletMapPosition(leaflet) {
        this.leaflet = leaflet;
        this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    LeafletMapPosition.prototype.queryParams = function (params) {
        if (this.leaflet.queryParamsHelperService.anySizeChange(this.leaflet.prevParams, this.leaflet.currentParams) || this.leaflet.queryParamsHelperService.anyPositionChange(this.leaflet.prevParams, this.leaflet.currentParams)) {
            var positionArr = this.leaflet.queryParamsHelperService.queryPosition(params);
            var sizeArr = this.leaflet.queryParamsHelperService.querySize(params);
            var pixels_map_width = Math.floor(+(this.leaflet.positionFormService.mapsCont.nativeElement.offsetWidth * (sizeArr[0] / 100)).toFixed(2));
            var pixels_map_height = Math.floor(+(this.leaflet.positionFormService.mapsCont.nativeElement.offsetHeight * (sizeArr[1] / 100)).toFixed(2));
            var max_width = this.leaflet.positionFormService.mapsCont.nativeElement.offsetWidth - pixels_map_width;
            var max_height = this.leaflet.positionFormService.mapsCont.nativeElement.offsetHeight - pixels_map_height;
            var left_style = Math.floor(+(max_width * positionArr[0] / 100).toFixed(2));
            var top_style = Math.floor(+(max_height * positionArr[1] / 100).toFixed(2));
            this.leaflet.container.nativeElement.style.left = left_style + "px";
            this.leaflet.container.nativeElement.style.top = top_style + "px";
        }
    };
    return LeafletMapPosition;
}());

/**
 * Created by yairT on 05/02/2017.
 */
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/leaflet.component.map-position.js.map

/***/ }),

/***/ 454:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LeafletMapSize; });
var LeafletMapSize = (function () {
    function LeafletMapSize(leaflet) {
        this.leaflet = leaflet;
        this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    LeafletMapSize.prototype.queryParams = function (params) {
        var width_or_height_are_nil = this.leaflet.container.nativeElement.style.width == "" || this.leaflet.container.nativeElement.style.height == "";
        if (this.leaflet.queryParamsHelperService.anySizeChange(this.leaflet.prevParams, this.leaflet.currentParams) || width_or_height_are_nil) {
            var sizeArr = this.leaflet.queryParamsHelperService.querySize(params);
            this.leaflet.container.nativeElement.style.width = sizeArr[0] + "%";
            this.leaflet.container.nativeElement.style.height = sizeArr[1] + "%";
            var options = { options: this.leaflet.map.getZoom };
            this.leaflet.map.invalidateSize(options);
        }
    };
    return LeafletMapSize;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/leaflet.component.map-size.js.map

/***/ }),

/***/ 455:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LeafletMapView; });


var LeafletMapView = (function () {
    function LeafletMapView(leaflet) {
        this.leaflet = leaflet;
        leaflet.map.on('moveend', this.moveEnd.bind(this));
        this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
        this.gotoEmitterSubscriber = leaflet.mapMipService.gotoEmitter.subscribe(this.setQueryBoundsOnNavigationEnd.bind(this));
    }
    LeafletMapView.prototype.queryParams = function (params) {
        if (this.leaflet.queryParamsHelperService.hasQueryBounds(params)) {
            this.setMapBounds(params);
        }
        else {
            if (this.anyParamChanges(params)) {
                this.setMapView(params);
            }
        }
    };
    LeafletMapView.prototype.destroy = function () {
        this.queryParamsSubscriber.unsubscribe();
    };
    LeafletMapView.prototype.moveEnd = function (event) {
        if (!this.anyParamChanges(this.leaflet.currentParams))
            return;
        var lng = event.target.getCenter().lng;
        var lat = event.target.getCenter().lat;
        var zoom = event.target.getZoom();
        var markers = this.leaflet.currentParams['markers'];
        var layers = this.leaflet.currentParams['layers'];
        var size = this.leaflet.currentParams['size'];
        var position = this.leaflet.currentParams['position'];
        var geojson = this.leaflet.currentParams['geojson'];
        var navigationExtras = this.leaflet.queryParamsHelperService.getQuery({ lng: lng, lat: lat, zoom: zoom, markers: markers, layers: layers, size: size, position: position, geojson: geojson });
        return this.leaflet.mapMipService.navigate([], navigationExtras);
    };
    ;
    LeafletMapView.prototype.setMapView = function (params) {
        var longitude = this.leaflet.queryParamsHelperService.queryLng(params);
        var latitude = this.leaflet.queryParamsHelperService.queryLat(params);
        var zoom = this.leaflet.queryParamsHelperService.queryZoom(params);
        this.leaflet.map.setView([latitude, longitude], zoom);
    };
    LeafletMapView.prototype.setMapBounds = function (params) {
        var bounds = this.leaflet.queryParamsHelperService.queryBounds(params);
        this.leaflet.map.fitBounds([[bounds[1], bounds[0]], [bounds[3], bounds[2]]], null);
    };
    LeafletMapView.prototype.anyParamChanges = function (params) {
        var longitudeP = this.leaflet.queryParamsHelperService.queryLng(params);
        var latitudeP = this.leaflet.queryParamsHelperService.queryLat(params);
        var zoomP = this.leaflet.queryParamsHelperService.queryZoom(params);
        var arrayP = [longitudeP, latitudeP, zoomP];
        var longitude;
        var latitude;
        var zoom;
        try {
            longitude = this.leaflet.map.getCenter().lng;
            latitude = this.leaflet.map.getCenter().lat;
            zoom = this.leaflet.map.getZoom();
        }
        catch (e) {
            return true;
        }
        var array = [longitude, latitude, zoom];
        arrayP = this.leaflet.calcService.toFixes7Obj(arrayP);
        array = this.leaflet.calcService.toFixes7Obj(array);
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](arrayP, array);
    };
    LeafletMapView.prototype.getBounds = function () {
        var leaflet_bounds = this.leaflet.map.getBounds();
        var saved_bounds = [leaflet_bounds.getNorthWest().lng, leaflet_bounds.getNorthWest().lat, leaflet_bounds.getSouthEast().lng, leaflet_bounds.getSouthEast().lat];
        return saved_bounds;
    };
    LeafletMapView.prototype.setQueryBoundsOnNavigationEnd = function (state) {
        var _this = this;
        var extras = {};
        switch (state) {
            case __WEBPACK_IMPORTED_MODULE_1__api_map_mip_service__["a" /* MapMipService */].CESIUM_PATH:
                var bounds = this.getBounds().toString();
                var markers = this.leaflet.currentParams['markers'];
                var layers = this.leaflet.currentParams['layers'];
                var size = this.leaflet.currentParams['size'];
                var position = this.leaflet.currentParams['position'];
                var geojson = this.leaflet.currentParams['geojson'];
                extras.queryParams = { bounds: bounds, markers: markers, layers: layers, size: size, position: position, geojson: geojson };
                break;
            case __WEBPACK_IMPORTED_MODULE_1__api_map_mip_service__["a" /* MapMipService */].OPENLAYERS_PATH:
                var preserveQueryParams = true;
                extras = { preserveQueryParams: preserveQueryParams };
                break;
        }
        this.leaflet.mapMipService.navigate([state], extras).then(function () {
            _this.leaflet.map.off("moveend");
            _this.gotoEmitterSubscriber.unsubscribe();
        });
    };
    return LeafletMapView;
}());

// let urlTree:UrlTree = this.leaflet.router.parseUrl(event);
// urlTree.queryParams['bounds'] = this.getBounds().toString();
// this.leaflet.mapMipService.navigateByUrl(urlTree.toString());
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/leaflet.component.map-view.js.map

/***/ }),

/***/ 456:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LeafletMarkers; });

var LeafletMarkers = (function () {
    function LeafletMarkers(leaflet) {
        this.leaflet = leaflet;
        this.queryParamsSubscriber = leaflet.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
        leaflet.positionFormService.markerPickerEmitter.subscribe(this.toggleMarkerPicker.bind(this));
        if (leaflet.positionFormService.onPicked)
            this.toggleMarkerPicker.bind(this)(true);
    }
    LeafletMarkers.prototype.queryParams = function (params) {
        var params_changes = this.leaflet.queryParamsHelperService.anyMarkersParamsChanges(this.leaflet.prevParams, this.leaflet.currentParams);
        var map_changes = this.anyMarkersMapChanges(params);
        if (params_changes && map_changes) {
            this.setMarkersChanges(params);
        }
    };
    LeafletMarkers.prototype.destroy = function () {
        this.queryParamsSubscriber.unsubscribe();
    };
    LeafletMarkers.prototype.getCursorStyle = function () {
        if (this.leaflet.positionFormService.onPicked) {
            return this.leaflet.positionFormService.getMarkerCursorStyle();
        }
    };
    LeafletMarkers.prototype.toggleMarkerPicker = function (checked) {
        if (checked) {
            this.leaflet.map.on("click", this.leftClickInputAction.bind(this));
        }
        else {
            this.leaflet.map.off("click");
        }
    };
    LeafletMarkers.prototype.leftClickInputAction = function (event) {
        var fix_point = L.point(event.layerPoint.x + this.leaflet.positionFormService.getSelectedMarkerWidth() / 2, event.layerPoint.y + this.leaflet.positionFormService.getSelectedMarkerHeight());
        var fix_latlng = this.leaflet.map.layerPointToLatLng(fix_point);
        var position = [fix_latlng.lng, fix_latlng.lat];
        var color = this.leaflet.positionFormService.getSelectedColor();
        this.leaflet.mapMipService.addMarker({ position: position, color: color });
    };
    LeafletMarkers.prototype.anyMarkersMapChanges = function (params) {
        var queryMarkersPositions = this.leaflet.queryParamsHelperService.queryMarkersNoHeight(params);
        var mapMarkerPositions = this.getMarkersPosition();
        queryMarkersPositions.forEach(function (Pmarker) { Pmarker.color = Pmarker.color ? Pmarker.color : "blue"; });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](mapMarkerPositions, queryMarkersPositions);
    };
    LeafletMarkers.prototype.getMarkersPosition = function () {
        var _this = this;
        return this.getMarkerLayersArray().map(function (layer) {
            var latlng = layer.getLatLng();
            var position = [+latlng.lng.toFixed(7), +latlng.lat.toFixed(7)];
            var color = _this.leaflet.positionFormService.getMarkerColorByUrl(layer['_icon'].src);
            return { position: position, color: color };
        });
    };
    LeafletMarkers.prototype.setMarkersChanges = function (params) {
        var params_markers_position = this.leaflet.queryParamsHelperService.queryMarkersNoHeight(params);
        var map_markers_positions = this.getMarkersPosition();
        this.addMarkersViaUrl(params_markers_position, map_markers_positions);
        this.removeMarkersViaUrl(params_markers_position, map_markers_positions);
    };
    LeafletMarkers.prototype.addMarkersViaUrl = function (params_markers_position, map_markers_positions) {
        var _this = this;
        params_markers_position.forEach(function (marker) {
            if (!_this.markerExistOnMap(map_markers_positions, marker)) {
                _this.getBaseMarker(marker).addTo(_this.leaflet.map);
            }
        });
    };
    LeafletMarkers.prototype.removeMarkersViaUrl = function (params_markers_position, map_markers_positions) {
        var _this = this;
        map_markers_positions.forEach(function (markerObj) {
            if (!_this.markerExistOnParams(params_markers_position, markerObj)) {
                var marker_to_remove = _this.getMarkerViaMarkerObj(markerObj);
                _this.leaflet.map.removeLayer(marker_to_remove);
            }
        });
    };
    LeafletMarkers.prototype.getBaseMarker = function (marker) {
        var icon = L.icon({
            iconUrl: this.leaflet.positionFormService.getMarkerUrlByColor(marker.color),
            //shadowUrl: '/assets/Markers/marker-shadow.png',
            iconAnchor: [this.leaflet.positionFormService.getSelectedMarkerWidth() / 2, this.leaflet.positionFormService.getSelectedMarkerHeight()]
        });
        return L.marker([marker.position[1], marker.position[0]], { icon: icon });
    };
    LeafletMarkers.prototype.getMarkerViaMarkerObj = function (markerObj) {
        var _this = this;
        return this.getMarkerLayersArray().find(function (layer) {
            var position = [layer.getLatLng().lng, layer.getLatLng().lat];
            var color = _this.leaflet.positionFormService.getMarkerColorByUrl(layer["_icon"].src);
            return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](markerObj, { position: position, color: color });
        });
    };
    LeafletMarkers.prototype.getMarkerLayersArray = function () {
        return __WEBPACK_IMPORTED_MODULE_0_lodash__["filter"](this.leaflet.map['_layers'], function (l) { return l['getLatLng'] && !l.hasOwnProperty("feature") && !l.hasOwnProperty("_closeButton"); });
    };
    LeafletMarkers.prototype.markerExistOnMap = function (markers_map_positions, paramMarker) {
        paramMarker.color = paramMarker.color ? paramMarker.color : "blue";
        var exist_point = markers_map_positions.find(function (mapMarker) { return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](mapMarker, paramMarker); });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](exist_point);
    };
    LeafletMarkers.prototype.markerExistOnParams = function (params_markers_position, mapMarker) {
        var exist_point = params_markers_position.find(function (paramMarker) {
            paramMarker.color = paramMarker.color ? paramMarker.color : "blue";
            return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](paramMarker, mapMarker);
        });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](exist_point);
    };
    return LeafletMarkers;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/leaflet.component.markers.js.map

/***/ }),

/***/ 457:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__ = __webpack_require__(394);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_take__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_take___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_take__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_filter__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_leaflet__ = __webpack_require__(662);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_leaflet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_leaflet__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_leaflet_bing_layer_leaflet_bing_layer__ = __webpack_require__(661);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_leaflet_bing_layer_leaflet_bing_layer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_leaflet_bing_layer_leaflet_bing_layer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_leaflet_ajax_dist_leaflet_ajax__ = __webpack_require__(660);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_leaflet_ajax_dist_leaflet_ajax___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_leaflet_ajax_dist_leaflet_ajax__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__classes_leaflet_component_layers__ = __webpack_require__(452);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__classes_leaflet_component_markers__ = __webpack_require__(456);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__position_form_position_form_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__classes_leaflet_component_map_view__ = __webpack_require__(455);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__classes_leaflet_component_map_size__ = __webpack_require__(454);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__classes_leaflet_component_map_position__ = __webpack_require__(453);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__classes_leaflet_component_geojson__ = __webpack_require__(451);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__services_calc_service__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__services_ajax_service__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__map_mip_component__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LeafletComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





















var LeafletComponent = (function () {
    function LeafletComponent(router, activatedRoute, queryParamsHelperService, calcService, ajaxService, positionFormService, mapMipService) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.queryParamsHelperService = queryParamsHelperService;
        this.calcService = calcService;
        this.ajaxService = ajaxService;
        this.positionFormService = positionFormService;
        this.mapMipService = mapMipService;
        this.currentParams = {};
        this.prevParams = {};
        window['current'] = this;
        this.queryParamsSubscriber = this.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    LeafletComponent.prototype.ngOnInit = function () {
        this.initializeMap();
        this.layers = new __WEBPACK_IMPORTED_MODULE_9__classes_leaflet_component_layers__["a" /* LeafletLayers */](this);
        this.markers = new __WEBPACK_IMPORTED_MODULE_10__classes_leaflet_component_markers__["a" /* LeafletMarkers */](this);
        this.map_size = new __WEBPACK_IMPORTED_MODULE_13__classes_leaflet_component_map_size__["a" /* LeafletMapSize */](this);
        this.map_view = new __WEBPACK_IMPORTED_MODULE_12__classes_leaflet_component_map_view__["a" /* LeafletMapView */](this);
        this.map_position = new __WEBPACK_IMPORTED_MODULE_14__classes_leaflet_component_map_position__["a" /* LeafletMapPosition */](this);
        this.geojson = new __WEBPACK_IMPORTED_MODULE_15__classes_leaflet_component_geojson__["a" /* LeafletGeoJson */](this);
    };
    LeafletComponent.prototype.initializeMap = function () {
        this.map = __WEBPACK_IMPORTED_MODULE_6_leaflet__["map"](this.container.nativeElement);
        this.L = __WEBPACK_IMPORTED_MODULE_6_leaflet__;
    };
    LeafletComponent.prototype.ngOnDestroy = function () {
        this.queryParamsSubscriber.unsubscribe();
        this.map_view.destroy();
        this.layers.destroy();
        this.markers.destroy();
    };
    LeafletComponent.prototype.queryParams = function (params) {
        this.prevParams = this.currentParams;
        this.currentParams = params;
    };
    Object.defineProperty(LeafletComponent.prototype, "map", {
        get: function () {
            return this._map;
        },
        set: function (value) {
            this._map = value;
        },
        enumerable: true,
        configurable: true
    });
    return LeafletComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])("container"),
    __metadata("design:type", Object)
], LeafletComponent.prototype, "container", void 0);
LeafletComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        host: __WEBPACK_IMPORTED_MODULE_19__map_mip_component__["b" /* host */],
        selector: 'app-leaflet',
        template: __webpack_require__(691),
        styles: [__webpack_require__(638)],
        animations: __WEBPACK_IMPORTED_MODULE_19__map_mip_component__["c" /* animations */]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["d" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["d" /* ActivatedRoute */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_16__services_query_params_helper_service__["a" /* QueryParamsHelperService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_16__services_query_params_helper_service__["a" /* QueryParamsHelperService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_17__services_calc_service__["a" /* CalcService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_17__services_calc_service__["a" /* CalcService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_18__services_ajax_service__["a" /* AjaxService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_18__services_ajax_service__["a" /* AjaxService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_11__position_form_position_form_service__["a" /* PositionFormService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_11__position_form_position_form_service__["a" /* PositionFormService */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_20__api_map_mip_service__["a" /* MapMipService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_20__api_map_mip_service__["a" /* MapMipService */]) === "function" && _g || Object])
], LeafletComponent);

var _a, _b, _c, _d, _e, _f, _g;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/leaflet.component.js.map

/***/ }),

/***/ 458:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpenlayersGeoJson; });

var OpenlayersGeoJson = (function () {
    function OpenlayersGeoJson(openlayers) {
        this.openlayers = openlayers;
        this.myMultiStyle = {
            'Point': new this.openlayers.ol.style.Style({
                image: new this.openlayers.ol.style.Icon({
                    src: 'http://mapmip.webiks.com/assets/Markers/marker-icon-blue.png',
                    anchor: [0.5, 1]
                })
            }),
            'MultiPoint': new this.openlayers.ol.style.Style({
                image: new this.openlayers.ol.style.Icon({
                    src: 'http://mapmip.webiks.com/assets/Markers/marker-icon-blue.png',
                    anchor: [0.5, 1]
                })
            }),
            'LineString': new this.openlayers.ol.style.Style({
                stroke: new this.openlayers.ol.style.Stroke({
                    color: '#3388ff',
                    width: 3
                })
            }),
            'MultiLineString': new this.openlayers.ol.style.Style({
                stroke: new this.openlayers.ol.style.Stroke({
                    color: '#3388ff',
                    width: 3
                })
            }),
            'Polygon': new this.openlayers.ol.style.Style({
                fill: new this.openlayers.ol.style.Fill({
                    color: 'rgba(51,136,255,0.2)'
                }),
                stroke: new this.openlayers.ol.style.Stroke({
                    color: '#3388ff',
                    width: 1
                })
            }),
            'MultiPolygon': new this.openlayers.ol.style.Style({
                fill: new this.openlayers.ol.style.Fill({
                    color: 'rgba(51,136,255,0.2)'
                }),
                stroke: new this.openlayers.ol.style.Stroke({
                    color: '#3388ff',
                    width: 1
                })
            })
        };
        this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    OpenlayersGeoJson.prototype.queryParams = function (params) {
        var _this = this;
        var that = this;
        if (this.openlayers.queryParamsHelperService.anyGeoJsonChange(this.openlayers.prevParams, this.openlayers.currentParams)) {
            var urls = this.openlayers.queryParamsHelperService.queryGeoJson(params);
            // remove all layers first by take from array
            __WEBPACK_IMPORTED_MODULE_0_lodash__["forEach"](this.geojsonLayers, function (geojsonLayer) {
                _this.openlayers.map.removeLayer(geojsonLayer);
            });
            this.geojsonLayers = [];
            // then add the new geojson layers from the url into the array
            __WEBPACK_IMPORTED_MODULE_0_lodash__["forEach"](urls, function (url, index) {
                that.geojsonLayers[index] = new that.openlayers.ol.layer.Vector({
                    source: new that.openlayers.ol.source.Vector({
                        format: new that.openlayers.ol.format.GeoJSON(),
                        url: url
                    }),
                    style: that.myStyleFunction.bind(that)
                });
                // add each elem of the array
                that.openlayers.map.addLayer(that.geojsonLayers[index]);
            });
        }
        /* this.openlayers.map.on('click', function(evt) {
           var ft = that.openlayers.map.forEachFeatureAtPixel(evt.pixel, function(f, l){return f;});
           if (ft) {
     
             for(var propertyName in ft.getProperties()) {
     
                 console.log(ft.getProperties()[propertyName])
               var popup = new ol.Overlay({
                 element: this.element,
                 positioning: 'bottom-center',
                 stopEvent: false,
     
               });
               this.openlayers.map.addOverlay(popup);
     
             };
           }
         });*/
    };
    OpenlayersGeoJson.prototype.myStyleFunction = function (feature, resolution) {
        var that = this;
        if (feature.getGeometry().getType() == "GeometryCollection") {
            var geoColStyle_1 = [];
            __WEBPACK_IMPORTED_MODULE_0_lodash__["forEach"](feature.getGeometry().getGeometries(), function (geometry) {
                geoColStyle_1.push(that.myMultiStyle[geometry.getType()]);
            });
            return geoColStyle_1;
        }
        else
            return this.myMultiStyle[feature.getGeometry().getType()];
    };
    return OpenlayersGeoJson;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/openlayers.component.geojson.js.map

/***/ }),

/***/ 459:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_openlayers__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_openlayers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_openlayers__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpenlayersLayers; });
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var OpenlayersLayers = (function () {
    function OpenlayersLayers(openlayers) {
        this.openlayers = openlayers;
        this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
        if (this.noTileLayer())
            this.addBaseLayer();
    }
    OpenlayersLayers.prototype.queryParams = function (params) {
        if (this.openlayers.queryParamsHelperService.anyLayersChanges(this.openlayers.prevParams, this.openlayers.currentParams)) {
            this.setLayersChanges(params);
        }
    };
    OpenlayersLayers.prototype.destroy = function () {
        this.queryParamsSubscriber.unsubscribe();
    };
    OpenlayersLayers.prototype.noTileLayer = function () {
        return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](this.getTileLayersArray());
    };
    OpenlayersLayers.prototype.setLayersChanges = function (params) {
        var params_layers_array = this.openlayers.queryParamsHelperService.queryLayers(params);
        var map_layers_array = this.getTileLayersArray();
        this.addLayersViaUrl(params_layers_array);
        this.removeLayersViaUrl(map_layers_array);
        this.sortLayers(params_layers_array);
        if (this.noTileLayer())
            this.addBaseLayer();
    };
    OpenlayersLayers.prototype.sortLayers = function (params_layers_array) {
        var _this = this;
        params_layers_array.forEach(function (layer_obj, index) {
            var layer = _this.getLayerFromLayerObj(layer_obj);
            var map_l = _this.getTileLayersArray().find(function (_layer) { return _this.layersEqual(layer, _layer); });
            map_l.setZIndex(index);
        });
    };
    OpenlayersLayers.prototype.addBaseLayer = function () {
        var bing_layer = this.getBingLayer({ key: 'Ag9RlBTbfJQMhFG3fxO9fLAbYMO8d5sevTe-qtDsAg6MjTYYFMFfFFrF2SrPIZNq', style: 'Aerial' });
        this.openlayers.map.addLayer(bing_layer);
    };
    OpenlayersLayers.prototype.addLayersViaUrl = function (params_layers_array) {
        var _this = this;
        var map_tile_layers = this.getTileLayersArray();
        params_layers_array.forEach(function (layer_obj, index) { return __awaiter(_this, void 0, void 0, function () {
            var layer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.layerExistOnMap(map_tile_layers, layer_obj)) return [3 /*break*/, 3];
                        layer = this.getLayerFromLayerObj(layer_obj);
                        if (!(layer_obj.source == 'tms')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.setTmsOptions(layer_obj['url'], layer)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.openlayers.map.addLayer(layer);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    OpenlayersLayers.prototype.getLayerFromLayerObj = function (layer_obj) {
        switch (layer_obj.source) {
            case "mapbox":
                return this.getMapboxLayer(layer_obj);
            case "openstreetmap":
                return this.getOpenstreetmapLayer(layer_obj);
            case "bing":
                return this.getBingLayer(layer_obj);
            case "tms":
                return this.getTmsLayer(layer_obj);
            default:
                return this.getDefaultLayer(layer_obj);
        }
    };
    OpenlayersLayers.prototype.parseMapboxUrl = function (mapbox_obj) {
        return "" + mapbox_obj['url'] + (mapbox_obj['mapid'] ? mapbox_obj['mapid'] + '/' : "") + "{z}/{x}/{y}" + (mapbox_obj['format'] ? '.' + mapbox_obj['format'] : '') + "?access_token=" + mapbox_obj['access_token'];
    };
    OpenlayersLayers.prototype.parseOpenstreetmapUrl = function (osm_obj) {
        return osm_obj['url'] + "/{z}/{x}/{y}" + (osm_obj['format'] ? '.' + osm_obj['format'] : "");
    };
    OpenlayersLayers.prototype.parseTmsUrl = function (layer_obj) {
        return layer_obj['url'] + "/{z}/{x}/{-y}" + (layer_obj['format'] ? '.' + layer_obj['format'] : "");
    };
    OpenlayersLayers.prototype.setTmsOptions = function (url, layer) {
        var _this = this;
        return new Promise(function (res) {
            var cesium_tms_layer = Cesium.createTileMapServiceImageryProvider({ url: url });
            cesium_tms_layer.readyPromise.then(function (response) {
                var bounds = __WEBPACK_IMPORTED_MODULE_0_lodash__["map"](cesium_tms_layer.rectangle, function (a) { return Cesium.Math.toDegrees(a); });
                var minZoom = cesium_tms_layer.minimumLevel;
                var maxZoom = cesium_tms_layer.maximumLevel;
                var extent = _this.openlayers.transformExtent(bounds);
                layer.setExtent(extent);
                layer.setSource(new __WEBPACK_IMPORTED_MODULE_1_openlayers__["source"].XYZ({
                    url: layer.getSource().jc,
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                }));
                res(response);
            });
        });
    };
    OpenlayersLayers.prototype.removeLayersViaUrl = function (map_tile_layers_array) {
        var _this = this;
        var params_layers_urls = this.openlayers.queryParamsHelperService.queryLayers(this.openlayers.currentParams);
        var layers_to_remove = map_tile_layers_array.filter(function (layer) { return (!_this.layerExistOnParams(params_layers_urls, layer)); });
        layers_to_remove.forEach(function (layer) { _this.openlayers.map.removeLayer(layer); });
    };
    OpenlayersLayers.prototype.getTileLayersArray = function () {
        return this.openlayers.LayersArray.filter(function (layer) { return layer instanceof __WEBPACK_IMPORTED_MODULE_1_openlayers__["layer"].Tile; });
    };
    OpenlayersLayers.prototype.layerExistOnMap = function (map_tile_layers, layer_obj) {
        var _this = this;
        var _layer = this.getLayerFromLayerObj(layer_obj);
        var exist_on_map = map_tile_layers.find(function (layer) {
            return _this.layersEqual(_layer, layer);
        });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isNil"](exist_on_map);
    };
    OpenlayersLayers.prototype.layerExistOnParams = function (params_tile_layers, _layer) {
        var _this = this;
        var exist_on_params = params_tile_layers.find(function (layer_obj) {
            var layer = _this.getLayerFromLayerObj(layer_obj);
            return _this.layersEqual(_layer, layer);
        });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isNil"](exist_on_params);
    };
    OpenlayersLayers.prototype.layersEqual = function (layer_a, layer_b) {
        var source = layer_a.getSource();
        var _source = layer_b.getSource();
        var equal_source = source instanceof _source.constructor;
        var api_key = _source['c'] == source['c'];
        var url = _source['jc'] == source['jc'];
        var style = _source['o'] == source['o'];
        return equal_source && api_key && url && style;
    };
    OpenlayersLayers.prototype.getOpenstreetmapLayer = function (oms_layer) {
        var osm_url = this.parseOpenstreetmapUrl(oms_layer);
        return new __WEBPACK_IMPORTED_MODULE_1_openlayers__["layer"].Tile({
            source: new __WEBPACK_IMPORTED_MODULE_1_openlayers__["source"].XYZ({
                url: osm_url
            })
        });
    };
    OpenlayersLayers.prototype.getMapboxLayer = function (layer_obj) {
        var mapbox_url = this.parseMapboxUrl(layer_obj);
        return new __WEBPACK_IMPORTED_MODULE_1_openlayers__["layer"].Tile({
            source: new __WEBPACK_IMPORTED_MODULE_1_openlayers__["source"].XYZ({
                url: mapbox_url
            })
        });
    };
    OpenlayersLayers.prototype.getBingLayer = function (bing_obj) {
        return new __WEBPACK_IMPORTED_MODULE_1_openlayers__["layer"].Tile({
            source: new __WEBPACK_IMPORTED_MODULE_1_openlayers__["source"].BingMaps({
                key: bing_obj['key'],
                imagerySet: bing_obj['style']
            })
        });
    };
    OpenlayersLayers.prototype.getTmsLayer = function (layer_obj) {
        var tms_url = this.parseTmsUrl(layer_obj);
        var layer = new __WEBPACK_IMPORTED_MODULE_1_openlayers__["layer"].Tile({
            source: new __WEBPACK_IMPORTED_MODULE_1_openlayers__["source"].XYZ({
                url: tms_url
            })
        });
        return layer;
    };
    OpenlayersLayers.prototype.getDefaultLayer = function (default_obj) {
        return new __WEBPACK_IMPORTED_MODULE_1_openlayers__["layer"].Tile({
            source: new __WEBPACK_IMPORTED_MODULE_1_openlayers__["source"].XYZ({
                url: "" + this.openlayers.calcService.getParsedUrlWithSubdomain(default_obj['url'])
            })
        });
    };
    return OpenlayersLayers;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/openlayers.component.layers.js.map

/***/ }),

/***/ 460:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpenlayersMapPosition; });
var OpenlayersMapPosition = (function () {
    function OpenlayersMapPosition(openlayers) {
        this.openlayers = openlayers;
        this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    OpenlayersMapPosition.prototype.queryParams = function (params) {
        if (this.openlayers.queryParamsHelperService.anySizeChange(this.openlayers.prevParams, this.openlayers.currentParams) || this.openlayers.queryParamsHelperService.anyPositionChange(this.openlayers.prevParams, this.openlayers.currentParams)) {
            var positionArr = this.openlayers.queryParamsHelperService.queryPosition(params);
            var sizeArr = this.openlayers.queryParamsHelperService.querySize(params);
            var pixels_map_width = Math.floor(+(this.openlayers.positionFormService.mapsCont.nativeElement.offsetWidth * (sizeArr[0] / 100)).toFixed(2));
            var pixels_map_height = Math.floor(+(this.openlayers.positionFormService.mapsCont.nativeElement.offsetHeight * (sizeArr[1] / 100)).toFixed(2));
            var max_width = this.openlayers.positionFormService.mapsCont.nativeElement.offsetWidth - pixels_map_width;
            var max_height = this.openlayers.positionFormService.mapsCont.nativeElement.offsetHeight - pixels_map_height;
            var left_style = Math.floor(+(max_width * positionArr[0] / 100).toFixed(2));
            var top_style = Math.floor(+(max_height * positionArr[1] / 100).toFixed(2));
            this.openlayers.container.nativeElement.style.left = left_style + "px";
            this.openlayers.container.nativeElement.style.top = top_style + "px";
        }
    };
    return OpenlayersMapPosition;
}());

/**
 * Created by yairT on 05/02/2017.
 */
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/openlayers.component.map-position.js.map

/***/ }),

/***/ 461:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpenLayersMapSize; });
var OpenLayersMapSize = (function () {
    function OpenLayersMapSize(openlayers) {
        this.openlayers = openlayers;
        this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    OpenLayersMapSize.prototype.queryParams = function (params) {
        var width_or_height_are_nil = this.openlayers.container.nativeElement.style.width == "" || this.openlayers.container.nativeElement.style.height == "";
        if (this.openlayers.queryParamsHelperService.anySizeChange(this.openlayers.prevParams, this.openlayers.currentParams) || width_or_height_are_nil) {
            var sizeArr = this.openlayers.queryParamsHelperService.querySize(params);
            this.openlayers.container.nativeElement.style.width = sizeArr[0] + "%";
            this.openlayers.container.nativeElement.style.height = sizeArr[1] + "%";
            this.openlayers.map.updateSize();
        }
    };
    return OpenLayersMapSize;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/openlayers.component.map-size.js.map

/***/ }),

/***/ 462:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs__ = __webpack_require__(375);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_openlayers__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_openlayers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_openlayers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpenlayersMapView; });




var OpenlayersMapView = (function () {
    function OpenlayersMapView(openlayers) {
        this.openlayers = openlayers;
        this.go_north = false;
        this.DragRotateInteractions = openlayers.map.getInteractions().getArray().find(function (i) { return i instanceof __WEBPACK_IMPORTED_MODULE_2_openlayers__["interaction"].DragRotate; });
        this.moveEndEvent = openlayers.map.on('moveend', this.moveEnd.bind(this));
        this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
        this.gotoEmitterSubscriber = openlayers.mapMipService.gotoEmitter.subscribe(this.setQueryBoundsOnNavigationEnd.bind(this));
    }
    OpenlayersMapView.prototype.queryParams = function (params) {
        if (this.openlayers.queryParamsHelperService.hasQueryBounds(params)) {
            this.setMapBounds(params);
        }
        else if (this.anyParamChanges(params)) {
            this.setMapView(params);
        }
    };
    OpenlayersMapView.prototype.destroy = function () {
        this.queryParamsSubscriber.unsubscribe();
    };
    OpenlayersMapView.prototype.onLeaveToLeaflet = function () {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_0_rxjs__["Observable"].create(function (observer) {
            _this.andRotation = function (complete) {
                observer.next(complete);
            };
            if (_this.openlayers.map.getView().getRotation() == 0) {
                observer.next(true);
            }
            else {
                var radian_rotation = _this.openlayers.map.getView().getRotation();
                var north = _this.openlayers.calcService.toDegrees(radian_rotation) < 180 ? 0 : Cesium.Math.toRadians(360);
                _this.openlayers.map.getView().animate({ rotation: north, duration: 500 }, _this.andRotation);
            }
        });
    };
    ;
    OpenlayersMapView.prototype.setMapView = function (params) {
        var rotate = isNaN(this.openlayers.queryParamsHelperService.queryRotate(params)) ? true : false;
        this.openlayers.map.setView(new __WEBPACK_IMPORTED_MODULE_2_openlayers__["View"]({
            center: __WEBPACK_IMPORTED_MODULE_2_openlayers__["proj"].fromLonLat([this.openlayers.queryParamsHelperService.queryLng(params), this.openlayers.queryParamsHelperService.queryLat(params)]),
            zoom: this.openlayers.queryParamsHelperService.queryZoom(params),
            rotation: this.openlayers.calcService.toRadians(360 - this.openlayers.queryParamsHelperService.queryHeading(params))
        }));
        this.DragRotateInteractions.setActive(rotate);
    };
    OpenlayersMapView.prototype.setMapBounds = function (params) {
        var bounds = this.openlayers.queryParamsHelperService.queryBounds(params);
        var heading = this.openlayers.calcService.toRadians(360 - this.openlayers.queryParamsHelperService.queryHeading(params));
        this.openlayers.map.getView().fit(this.openlayers.transformExtent(bounds), this.openlayers.map.getSize());
        this.openlayers.map.getView().setRotation(heading);
    };
    OpenlayersMapView.prototype.anyParamChanges = function (params) {
        var longitudeP = this.openlayers.queryParamsHelperService.queryLng(params);
        var latitudeP = this.openlayers.queryParamsHelperService.queryLat(params);
        var zoomP = this.openlayers.queryParamsHelperService.queryZoom(params);
        var headingP = 360 - this.openlayers.queryParamsHelperService.queryHeading(params);
        var rotateP = isNaN(this.openlayers.queryParamsHelperService.queryRotate(params)) ? 1 : 0;
        var arrayP = [longitudeP, latitudeP, zoomP, headingP, rotateP];
        var longitude;
        var latitude;
        var zoom;
        var heading;
        var rotate;
        try {
            longitude = this.openlayers.map.getView().getCenter()[0];
            latitude = this.openlayers.map.getView().getCenter()[1];
            zoom = this.openlayers.map.getView().getZoom();
            heading = this.openlayers.calcService.toDegrees(this.openlayers.map.getView().getRotation());
            rotate = this.DragRotateInteractions.getActive() ? 1 : 0;
        }
        catch (e) {
            return true;
        }
        var array = [longitude, latitude, zoom, heading, rotate];
        arrayP = this.openlayers.calcService.toFixes7Obj(arrayP);
        array = this.openlayers.calcService.toFixes7Obj(array);
        return !__WEBPACK_IMPORTED_MODULE_1_lodash__["isEqual"](arrayP, array);
    };
    OpenlayersMapView.prototype.moveEnd = function (event) {
        var centerCord = __WEBPACK_IMPORTED_MODULE_2_openlayers__["proj"].transform(event.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
        var lng = centerCord[0];
        var lat = centerCord[1];
        var zoom = event.map.getView().getZoom();
        var heading = 360 - this.openlayers.calcService.toDegrees(event.map.getView().getRotation());
        var markers = this.openlayers.currentParams['markers'];
        var layers = this.openlayers.currentParams['layers'];
        var rotate = this.openlayers.currentParams['rotate'];
        var size = this.openlayers.currentParams['size'];
        var position = this.openlayers.currentParams['position'];
        var geojson = this.openlayers.currentParams['geojson'];
        rotate = rotate == 0 ? 0 : undefined;
        var navigationExtras = this.openlayers.queryParamsHelperService.getQuery({ lng: lng, lat: lat, zoom: zoom, heading: heading, markers: markers, layers: layers, rotate: rotate, size: size, position: position, geojson: geojson });
        return this.openlayers.mapMipService.navigate([], navigationExtras);
    };
    ;
    OpenlayersMapView.prototype.getBounds = function () {
        var current_rotation = this.openlayers.map.getView().getRotation();
        this.openlayers.map.getView().setRotation(0);
        var bounds = this.openlayers.map.getView().calculateExtent(this.openlayers.map.getSize());
        this.openlayers.map.getView().setRotation(current_rotation);
        var t_bounds = __WEBPACK_IMPORTED_MODULE_2_openlayers__["proj"].transformExtent(bounds, 'EPSG:3857', 'EPSG:4326');
        var saved_bounds = t_bounds;
        return saved_bounds;
    };
    OpenlayersMapView.prototype.setQueryBoundsOnNavigationEnd = function (state) {
        var _this = this;
        var extras = {};
        switch (state) {
            case __WEBPACK_IMPORTED_MODULE_3__api_map_mip_service__["a" /* MapMipService */].CESIUM_PATH:
                var bounds = this.getBounds().toString();
                var heading = this.openlayers.queryParamsHelperService.queryHeading(this.openlayers.currentParams);
                var markers = this.openlayers.currentParams['markers'];
                var layers = this.openlayers.currentParams['layers'];
                var size = this.openlayers.currentParams['size'];
                var position = this.openlayers.currentParams['position'];
                var geojson = this.openlayers.currentParams['geojson'];
                extras.queryParams = { bounds: bounds, heading: heading, markers: markers, layers: layers, size: size, position: position, geojson: geojson };
                this.openlayers.mapMipService.navigate([state], extras).then(function () {
                    _this.gotoEmitterSubscriber.unsubscribe();
                });
                break;
            case __WEBPACK_IMPORTED_MODULE_3__api_map_mip_service__["a" /* MapMipService */].LEAFLET_PATH:
                this.onLeaveToLeaflet().subscribe(function () {
                    var preserveQueryParams = true;
                    extras = { preserveQueryParams: preserveQueryParams };
                    _this.openlayers.mapMipService.navigate([state], extras).then(function () {
                        _this.gotoEmitterSubscriber.unsubscribe();
                    });
                });
                break;
        }
    };
    return OpenlayersMapView;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/openlayers.component.map-view.js.map

/***/ }),

/***/ 463:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_openlayers__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_openlayers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_openlayers__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpenlayersMarkers; });


var OpenlayersMarkers = (function () {
    function OpenlayersMarkers(openlayers) {
        this.openlayers = openlayers;
        this.queryParamsSubscriber = openlayers.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
        openlayers.positionFormService.markerPickerEmitter.subscribe(this.toggleMarkerPicker.bind(this));
        if (openlayers.positionFormService.onPicked)
            this.toggleMarkerPicker.bind(this)(true);
    }
    OpenlayersMarkers.prototype.queryParams = function (params) {
        var params_changes = this.openlayers.queryParamsHelperService.anyMarkersParamsChanges(this.openlayers.prevParams, params);
        var map_changes = this.anyMarkersMapChanges(params);
        if (params_changes && map_changes) {
            this.setMarkersChanges(params);
        }
    };
    OpenlayersMarkers.prototype.destroy = function () {
        this.queryParamsSubscriber.unsubscribe();
    };
    OpenlayersMarkers.prototype.getCursorStyle = function () {
        if (this.openlayers.positionFormService.onPicked) {
            return this.openlayers.positionFormService.getMarkerCursorStyle();
        }
    };
    OpenlayersMarkers.prototype.toggleMarkerPicker = function (checked) {
        if (checked) {
            this.leftClickHandler = this.openlayers.map.on("click", this.leftClickInputAction.bind(this));
        }
        else {
            this.openlayers.map.unByKey(this.leftClickHandler);
        }
    };
    OpenlayersMarkers.prototype.leftClickInputAction = function (event) {
        var fix_pixel;
        if (this.openlayers.positionFormService.getSelectedMarkerWidth() == 60) {
            fix_pixel = [event.pixel[0] + 3.5 + this.openlayers.positionFormService.getSelectedMarkerWidth() / 2,
                event.pixel[1] + this.openlayers.positionFormService.getSelectedMarkerHeight()];
        }
        else {
            fix_pixel = [event.pixel[0] + this.openlayers.positionFormService.getSelectedMarkerWidth() / 2,
                event.pixel[1] + this.openlayers.positionFormService.getSelectedMarkerHeight()];
        }
        var fix_coordinate = this.openlayers.map.getCoordinateFromPixel(fix_pixel);
        var position = __WEBPACK_IMPORTED_MODULE_1_openlayers__["proj"].toLonLat(fix_coordinate);
        var color = this.openlayers.positionFormService.getSelectedColor();
        this.openlayers.mapMipService.addMarker({ position: position, color: color });
    };
    OpenlayersMarkers.prototype.anyMarkersMapChanges = function (params) {
        var queryMarkersPositions = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(params);
        var mapMarkerPositions = this.getMarkersPosition();
        queryMarkersPositions.forEach(function (Pmarker) { Pmarker.color = Pmarker.color ? Pmarker.color : "blue"; });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](mapMarkerPositions, queryMarkersPositions);
    };
    OpenlayersMarkers.prototype.getMarkersPosition = function () {
        var _this = this;
        return this.openlayers.LayersArray.filter(function (layer) {
            var geom;
            if (layer.getSource && layer.getSource().getFeatures && !layer.getSource().Z)
                geom = layer.getSource().getFeatures()[0].getGeometry();
            return geom instanceof __WEBPACK_IMPORTED_MODULE_1_openlayers__["geom"].Point;
        }).map(function (layer) {
            layer.getSource().getFeatures;
            var position = layer.getSource().getFeatures()[0].getGeometry()['getCoordinates']();
            position = __WEBPACK_IMPORTED_MODULE_1_openlayers__["proj"].transform(position, 'EPSG:3857', 'EPSG:4326');
            position = _this.openlayers.calcService.toFixes7Obj(position);
            var color = _this.openlayers.positionFormService.getMarkerColorByUrl(layer.getStyle().getImage().getSrc());
            return { position: position, color: color };
        });
    };
    OpenlayersMarkers.prototype.setMarkersChanges = function (params) {
        var params_markers_positions = this.openlayers.queryParamsHelperService.queryMarkersNoHeight(params);
        var map_markers_positions = this.getMarkersPosition();
        this.addMarkersViaUrl(params_markers_positions, map_markers_positions);
        this.removeMarkersViaUrl(params_markers_positions, map_markers_positions);
    };
    OpenlayersMarkers.prototype.addMarkersViaUrl = function (params_markers_positions, map_markers_positions) {
        var _this = this;
        params_markers_positions.forEach(function (marker) {
            if (!_this.markerExistOnMap(map_markers_positions, marker)) {
                _this.addIcon(marker);
            }
        });
    };
    OpenlayersMarkers.prototype.removeMarkersViaUrl = function (params_markers_positions, map_markers_positions) {
        var _this = this;
        map_markers_positions.forEach(function (mapMarker) {
            if (!_this.markerExistOnParams(params_markers_positions, mapMarker)) {
                _this.removeIcon(mapMarker);
            }
        });
    };
    OpenlayersMarkers.prototype.markerExistOnMap = function (markers_map_positions, paramMarker) {
        paramMarker.color = paramMarker.color ? paramMarker.color : "blue";
        var exist_point = markers_map_positions.find(function (positionArray) { return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](positionArray, paramMarker); });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](exist_point);
    };
    OpenlayersMarkers.prototype.markerExistOnParams = function (params_markers_position, mapMarker) {
        var exist_point = params_markers_position.find(function (paramMarker) {
            paramMarker.color = paramMarker.color ? paramMarker.color : "blue";
            return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](paramMarker, mapMarker);
        });
        return !__WEBPACK_IMPORTED_MODULE_0_lodash__["isEmpty"](exist_point);
    };
    OpenlayersMarkers.prototype.addIcon = function (marker) {
        var iconFeature = new __WEBPACK_IMPORTED_MODULE_1_openlayers__["Feature"]({
            geometry: new __WEBPACK_IMPORTED_MODULE_1_openlayers__["geom"].Point(__WEBPACK_IMPORTED_MODULE_1_openlayers__["proj"].transform(marker.position, 'EPSG:4326', 'EPSG:3857'))
        });
        var vectorSource = new __WEBPACK_IMPORTED_MODULE_1_openlayers__["source"].Vector({
            features: [iconFeature]
        });
        var iconStyle = new __WEBPACK_IMPORTED_MODULE_1_openlayers__["style"].Style({
            image: new __WEBPACK_IMPORTED_MODULE_1_openlayers__["style"].Icon({
                anchor: [0.5, 1],
                src: this.openlayers.positionFormService.getMarkerUrlByColor(marker.color)
            }),
        });
        var vectorLayer = new __WEBPACK_IMPORTED_MODULE_1_openlayers__["layer"].Vector({
            source: vectorSource,
            style: iconStyle
        });
        vectorLayer.setZIndex(200);
        this.openlayers.map.addLayer(vectorLayer);
    };
    OpenlayersMarkers.prototype.removeIcon = function (mapMarker) {
        var _this = this;
        var marker_to_remove = this.openlayers.LayersArray.find(function (layer) {
            var geom;
            if (layer.getSource().getFeatures)
                geom = layer.getSource().getFeatures()[0].getGeometry();
            if (!(geom instanceof __WEBPACK_IMPORTED_MODULE_1_openlayers__["geom"].Point))
                return false;
            var position = layer.getSource().getFeatures()[0].getGeometry()['getCoordinates']();
            position = __WEBPACK_IMPORTED_MODULE_1_openlayers__["proj"].transform(position, 'EPSG:3857', 'EPSG:4326');
            position = _this.openlayers.calcService.toFixes7Obj(position);
            if (layer.getSource()["Z"])
                if (layer.getSource()["Z"].includes("geojson"))
                    return false;
            var color = _this.openlayers.positionFormService.getMarkerColorByUrl(layer.getStyle().getImage().getSrc());
            return __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](position, mapMarker.position) && __WEBPACK_IMPORTED_MODULE_0_lodash__["isEqual"](color, mapMarker.color);
        });
        this.openlayers.map.removeLayer(marker_to_remove);
    };
    return OpenlayersMarkers;
}());

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/openlayers.component.markers.js.map

/***/ }),

/***/ 464:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_openlayers__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_openlayers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_openlayers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_take__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_take___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_take__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classes_openlayers_component_layers__ = __webpack_require__(459);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__classes_openlayers_component_markers__ = __webpack_require__(463);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__classes_openlayers_component_map_view__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__classes_openlayers_component_map_size__ = __webpack_require__(461);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__position_form_position_form_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__classes_openlayers_component_map_position__ = __webpack_require__(460);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__classes_openlayers_component_geojson__ = __webpack_require__(458);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_calc_service__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__map_mip_component__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__services_ajax_service__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpenlayersComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
















var OpenlayersComponent = (function () {
    function OpenlayersComponent(activatedRoute, queryParamsHelperService, router, calcService, ajaxService, positionFormService, mapMipService) {
        this.activatedRoute = activatedRoute;
        this.queryParamsHelperService = queryParamsHelperService;
        this.router = router;
        this.calcService = calcService;
        this.ajaxService = ajaxService;
        this.positionFormService = positionFormService;
        this.mapMipService = mapMipService;
        this.currentParams = {};
        this.prevParams = {};
        window['current'] = this;
        this.queryParamsSubscriber = this.activatedRoute.queryParams.subscribe(this.queryParams.bind(this));
    }
    OpenlayersComponent.prototype.ngOnInit = function () {
        this.initializeMap();
    };
    OpenlayersComponent.prototype.transformExtent = function (extent) {
        return __WEBPACK_IMPORTED_MODULE_1_openlayers__["proj"].transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
    };
    OpenlayersComponent.prototype.ngOnDestroy = function () {
        this.queryParamsSubscriber.unsubscribe();
        this.map_view.destroy();
        this.layers.destroy();
        this.markers.destroy();
    };
    OpenlayersComponent.prototype.queryParams = function (params) {
        this.prevParams = this.currentParams;
        this.currentParams = params;
    };
    OpenlayersComponent.prototype.initializeMap = function () {
        this.map = new __WEBPACK_IMPORTED_MODULE_1_openlayers__["Map"]({
            target: this.container.nativeElement,
            projection: new __WEBPACK_IMPORTED_MODULE_1_openlayers__["proj"].Projection({ code: "EPSG:4326", extent: [-180.0000, -90.0000, 180.0000, 90.0000] }),
        });
        this.ol = __WEBPACK_IMPORTED_MODULE_1_openlayers__;
        this.layers = new __WEBPACK_IMPORTED_MODULE_4__classes_openlayers_component_layers__["a" /* OpenlayersLayers */](this);
        this.markers = new __WEBPACK_IMPORTED_MODULE_5__classes_openlayers_component_markers__["a" /* OpenlayersMarkers */](this);
        this.map_size = new __WEBPACK_IMPORTED_MODULE_7__classes_openlayers_component_map_size__["a" /* OpenLayersMapSize */](this);
        this.map_position = new __WEBPACK_IMPORTED_MODULE_9__classes_openlayers_component_map_position__["a" /* OpenlayersMapPosition */](this);
        this.map_view = new __WEBPACK_IMPORTED_MODULE_6__classes_openlayers_component_map_view__["a" /* OpenlayersMapView */](this);
        this.geojson = new __WEBPACK_IMPORTED_MODULE_10__classes_openlayers_component_geojson__["a" /* OpenlayersGeoJson */](this);
    };
    Object.defineProperty(OpenlayersComponent.prototype, "LayersArray", {
        get: function () {
            return this.map.getLayers().getArray();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OpenlayersComponent.prototype, "map", {
        get: function () {
            return this._map;
        },
        set: function (value) {
            this._map = value;
        },
        enumerable: true,
        configurable: true
    });
    return OpenlayersComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])("container"),
    __metadata("design:type", Object)
], OpenlayersComponent.prototype, "container", void 0);
OpenlayersComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        host: __WEBPACK_IMPORTED_MODULE_13__map_mip_component__["b" /* host */],
        selector: 'app-openlayers',
        template: __webpack_require__(692),
        styles: [__webpack_require__(639)],
        animations: __WEBPACK_IMPORTED_MODULE_13__map_mip_component__["c" /* animations */]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["d" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["d" /* ActivatedRoute */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_11__services_query_params_helper_service__["a" /* QueryParamsHelperService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_11__services_query_params_helper_service__["a" /* QueryParamsHelperService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_12__services_calc_service__["a" /* CalcService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_12__services_calc_service__["a" /* CalcService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_14__services_ajax_service__["a" /* AjaxService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_14__services_ajax_service__["a" /* AjaxService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_8__position_form_position_form_service__["a" /* PositionFormService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_8__position_form_position_form_service__["a" /* PositionFormService */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_15__api_map_mip_service__["a" /* MapMipService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_15__api_map_mip_service__["a" /* MapMipService */]) === "function" && _g || Object])
], OpenlayersComponent);

var _a, _b, _c, _d, _e, _f, _g;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/openlayers.component.js.map

/***/ }),

/***/ 465:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__position_form_service__ = __webpack_require__(37);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ColorPickerComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ColorPickerComponent = (function () {
    function ColorPickerComponent(positionFormService) {
        this.positionFormService = positionFormService;
        this.togglePickedEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.selectedIndexChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    ColorPickerComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(ColorPickerComponent.prototype, "selectedIndex", {
        get: function () {
            return this._selectedIndex;
        },
        set: function (value) {
            this._selectedIndex = value;
            this.selectedIndexChange.emit(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorPickerComponent.prototype, "selectedColor", {
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_1__position_form_service__["b" /* MARKER_COLORS */][this.selectedIndex]["color"];
        },
        enumerable: true,
        configurable: true
    });
    ColorPickerComponent.prototype.changeMarkerColor = function (selectedColorIndex) {
        this.selectedIndex = selectedColorIndex;
        if (!this.Active)
            this.togglePickedEmitter.emit(true);
    };
    ColorPickerComponent.prototype.markerColors = function () {
        return __WEBPACK_IMPORTED_MODULE_1__position_form_service__["b" /* MARKER_COLORS */];
    };
    ColorPickerComponent.prototype.getMarkerUrlByColor = function (color) {
        return this.positionFormService.getMarkerUrlByColor(color);
    };
    ColorPickerComponent.prototype.calcIndex = function (parentIndex, childIndex, iconsPerRow) {
        if (iconsPerRow === void 0) { iconsPerRow = 1; }
        return (iconsPerRow * parentIndex) + childIndex;
    };
    return ColorPickerComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])("selectedIndex"),
    __metadata("design:type", Number)
], ColorPickerComponent.prototype, "_selectedIndex", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])("Active"),
    __metadata("design:type", Object)
], ColorPickerComponent.prototype, "Active", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])("togglePickedEmitter"),
    __metadata("design:type", Object)
], ColorPickerComponent.prototype, "togglePickedEmitter", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])("selectedIndexChange"),
    __metadata("design:type", Object)
], ColorPickerComponent.prototype, "selectedIndexChange", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])("disabledAction"),
    __metadata("design:type", Boolean)
], ColorPickerComponent.prototype, "disabledAction", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])("iconsPerRow"),
    __metadata("design:type", Number)
], ColorPickerComponent.prototype, "iconsPerRow", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])("backdrop"),
    __metadata("design:type", Boolean)
], ColorPickerComponent.prototype, "backdrop", void 0);
ColorPickerComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-color-picker',
        template: __webpack_require__(693),
        styles: [__webpack_require__(640)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__position_form_service__["a" /* PositionFormService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__position_form_service__["a" /* PositionFormService */]) === "function" && _a || Object])
], ColorPickerComponent);

var _a;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/color-picker.component.js.map

/***/ }),

/***/ 466:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ColorPickerPipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ColorPickerPipe = (function () {
    function ColorPickerPipe() {
    }
    ColorPickerPipe.prototype.transform = function (value, iconsPerRow) {
        // if(iconsPerRow  == 1) {
        //   return value;
        // }
        if (iconsPerRow === void 0) { iconsPerRow = 1; }
        var rowsArray = [];
        var rowArray = [];
        value.forEach(function (value, index, array) {
            rowArray.push(value);
            if ((index + 1) % iconsPerRow == 0) {
                rowsArray.push(rowArray);
                rowArray = [];
            }
            else if (index == (array.length - 1)) {
                rowsArray.push(rowArray);
            }
        });
        return rowsArray;
    };
    return ColorPickerPipe;
}());
ColorPickerPipe = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({
        name: 'colorPicker'
    })
], ColorPickerPipe);

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/color-picker.pipe.js.map

/***/ }),

/***/ 467:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlipSwitchComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FlipSwitchComponent = (function () {
    function FlipSwitchComponent(mapmipService) {
        this.mapmipService = mapmipService;
    }
    FlipSwitchComponent.prototype.ngOnInit = function () {
    };
    return FlipSwitchComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])("state"),
    __metadata("design:type", Boolean)
], FlipSwitchComponent.prototype, "state", void 0);
FlipSwitchComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-flip-switch',
        template: __webpack_require__(694),
        styles: [__webpack_require__(641)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__api_map_mip_service__["a" /* MapMipService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__api_map_mip_service__["a" /* MapMipService */]) === "function" && _a || Object])
], FlipSwitchComponent);

var _a;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/flip-switch.component.js.map

/***/ }),

/***/ 468:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DragItemDirective; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DragItemDirective = (function () {
    function DragItemDirective(el) {
        this.el = el;
        this.onDrop = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.shift_down = false;
        this.draggable = true;
    }
    DragItemDirective.prototype.dragstart = function ($event) {
        var dragIndex = this.data[0].toString();
        $event.dataTransfer.setData("dragIndex", dragIndex);
        this.el.nativeElement.classList.add("dragged");
    };
    DragItemDirective.prototype.dragend = function () {
        this.el.nativeElement.classList.remove("dragged");
    };
    DragItemDirective.prototype.dragover = function ($event) {
        $event.preventDefault();
        this.el.nativeElement.classList.add("dragovered");
    };
    DragItemDirective.prototype.dragleave = function () {
        this.el.nativeElement.classList.remove("dragovered");
    };
    DragItemDirective.prototype.drop = function ($event) {
        var dropIndex = this.data[0];
        var dragIndex = +$event.dataTransfer.getData("dragIndex");
        var array = this.data[1];
        this.el.nativeElement.classList.remove("dragovered");
        if (dropIndex != dragIndex) {
            var temp = array[dragIndex];
            array[dragIndex] = array[dropIndex];
            array[dropIndex] = temp;
            this.onDrop.emit(array);
        }
    };
    DragItemDirective.prototype.keyup = function ($event) {
        switch ($event.which) {
            case 16:
                this.shift_down = false;
                break;
        }
    };
    DragItemDirective.prototype.keydown = function ($event) {
        switch ($event.which) {
            case 38:
                this.keydownDown();
                break;
            case 40:
                this.keydownUp();
                break;
            case 16:
                this.shift_down = true;
                break;
        }
    };
    DragItemDirective.prototype.keydownDown = function () {
        if (this.shift_down) {
            this.switchNext();
        }
        else {
            this.focusNext();
        }
    };
    DragItemDirective.prototype.keydownUp = function () {
        if (this.shift_down) {
            this.switchPrev();
        }
        else {
            this.focusPrev();
        }
    };
    DragItemDirective.prototype.switchNext = function () {
        var _this = this;
        var dropIndex = this.data[0];
        var array = this.data[1];
        var swapIndex, temp;
        swapIndex = (dropIndex + 1) % array.length;
        temp = array[dropIndex];
        array[dropIndex] = array[swapIndex];
        array[swapIndex] = temp;
        setTimeout(function () {
            _this.el.nativeElement.focus();
        }, 0);
    };
    DragItemDirective.prototype.switchPrev = function () {
        var _this = this;
        var dropIndex = this.data[0];
        var array = this.data[1];
        var swapIndex, temp;
        swapIndex = (dropIndex - 1) % array.length;
        if (swapIndex < 0)
            swapIndex += array.length;
        temp = array[dropIndex];
        array[dropIndex] = array[swapIndex];
        array[swapIndex] = temp;
        setTimeout(function () {
            _this.el.nativeElement.focus();
        }, 0);
    };
    DragItemDirective.prototype.focusNext = function () {
        var elem = this.el.nativeElement;
        var brothers = elem.parentElement.children;
        var array = [].slice.call(brothers);
        var myindex = array.indexOf(this.el.nativeElement);
        var prev_index = (myindex - 1) < 0 ? array.length + (myindex - 1) : (myindex - 1);
        array[prev_index].focus();
    };
    DragItemDirective.prototype.focusPrev = function () {
        var elem = this.el.nativeElement;
        var brothers = elem.parentElement.children;
        var array = [].slice.call(brothers);
        var myindex = array.indexOf(this.el.nativeElement);
        var next_index = (myindex + 1) % array.length;
        array[next_index].focus();
    };
    return DragItemDirective;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])("appDragItem"),
    __metadata("design:type", Array)
], DragItemDirective.prototype, "data", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], DragItemDirective.prototype, "onDrop", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('dragstart', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DragItemDirective.prototype, "dragstart", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"])('draggable'),
    __metadata("design:type", Object)
], DragItemDirective.prototype, "draggable", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('dragend'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DragItemDirective.prototype, "dragend", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('dragover', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DragItemDirective.prototype, "dragover", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('dragleave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DragItemDirective.prototype, "dragleave", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('drop', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DragItemDirective.prototype, "drop", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('keyup', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DragItemDirective.prototype, "keyup", null);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DragItemDirective.prototype, "keydown", null);
DragItemDirective = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
        selector: '[appDragItem]'
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]) === "function" && _a || Object])
], DragItemDirective);

var _a;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/drag-item.directive.js.map

/***/ }),

/***/ 469:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_ajax_service__ = __webpack_require__(57);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LayersComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var LayersComponent = (function () {
    function LayersComponent(queryParamsHelperService, ajaxService) {
        this.queryParamsHelperService = queryParamsHelperService;
        this.ajaxService = ajaxService;
        this.submitLayersEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.layersArray = [];
        this.Object = Object;
        this.examples$ = this.ajaxService.getLayerExam();
        this.source_images = {
            mapbox: 'http://2rct3i2488gxf9jvb1lqhek9-wpengine.netdna-ssl.com/wp-content/uploads/2016/06/mapbox-logo-256.png',
            bing: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Bing_logo_(2013).svg/2000px-Bing_logo_(2013).svg.png',
            tms: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/GDALLogoColor.svg/150px-GDALLogoColor.svg.png',
            openstreetmap: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/256px-Openstreetmap_logo.svg.png'
        };
        this.addObject = {
            mapbox: {
                obj: {
                    source: 'mapbox',
                    format: '',
                    access_token: '',
                    mapid: '',
                    url: 'https://api.mapbox.com/v4/'
                },
                required: {
                    format: false,
                    mapid: false,
                    access_token: false
                },
                edit_index: -1,
                modal: 'mapboxModal',
                init: function () {
                    this.obj = {
                        source: 'mapbox',
                        format: '',
                        url: 'https://api.mapbox.com/v4/',
                        access_token: '',
                        mapid: ''
                    };
                    this.required = {
                        format: false,
                        mapid: false,
                        access_token: false
                    };
                    this.edit_index = -1;
                },
                onEdit: function () {
                    return this.edit_index != -1;
                }
            },
            openstreetmap: {
                obj: {
                    source: 'openstreetmap',
                    format: '',
                    url: ''
                },
                required: {
                    format: false,
                },
                edit_index: -1,
                modal: 'osmModal',
                init: function () {
                    this.obj = {
                        source: 'openstreetmap',
                        format: '',
                        url: '',
                    };
                    this.required = {
                        format: false,
                    };
                    this.edit_index = -1;
                },
                onEdit: function () {
                    return this.edit_index != -1;
                }
            },
            tms: {
                obj: {
                    source: 'tms',
                    format: '',
                    url: ''
                },
                required: {
                    format: false,
                },
                edit_index: -1,
                modal: 'tmsModal',
                init: function () {
                    this.obj = {
                        source: 'tms',
                        format: '',
                        url: ''
                    };
                    this.required = {
                        format: false,
                    };
                    this.edit_index = -1;
                },
                onEdit: function () {
                    return this.edit_index != -1;
                }
            },
            bing: {
                obj: {
                    source: 'bing',
                    url: '',
                    key: '',
                    style: Cesium.BingMapsStyle.AERIAL
                },
                required: {},
                styles: __WEBPACK_IMPORTED_MODULE_3_lodash__["map"](Cesium.BingMapsStyle, function (bing_style) { return bing_style; }),
                edit_index: -1,
                modal: 'bingModal',
                init: function () {
                    this.obj = {
                        source: 'bing',
                        url: '',
                        key: '',
                        style: Cesium.BingMapsStyle.AERIAL
                    };
                    this.required = {};
                    this.edit_index = -1;
                },
                onEdit: function () {
                    return this.edit_index != -1;
                }
            },
            default: {
                obj: {
                    url: ''
                },
                edit_index: -1,
                modal: 'defaultModal',
                required: {},
                init: function () {
                    this.obj = {
                        url: ''
                    };
                    this.required = {};
                    this.edit_index = -1;
                },
                onEdit: function () {
                    return this.edit_index != -1;
                }
            }
        };
    }
    LayersComponent.prototype.submitLayers = function (hide) {
        if (hide === void 0) { hide = false; }
        var modal = this.layersModal;
        if (this.canApply()) {
            var parsed_layer = this.queryParamsHelperService.queryLayersObjectToString(this.layersArray.map(function (tmsArrayObj) { return tmsArrayObj['layer_obj']; }));
            this.submitLayersEmitter.emit({ hide: hide, modal: modal, parsed_layer: parsed_layer });
        }
        else {
            if (hide) {
                modal.hide();
            }
        }
    };
    LayersComponent.prototype.onKeyPress = function ($event) {
        if ($event.which == 13) {
            this.submitLayers();
        }
    };
    LayersComponent.prototype.ngOnChanges = function (changes) {
        if (!__WEBPACK_IMPORTED_MODULE_3_lodash__["isNil"](changes['layersString'])) {
            this.initLayersArray();
        }
    };
    LayersComponent.prototype.editModal = function (layer_item, index) {
        var source = layer_item.layer_obj.source ? layer_item.layer_obj.source : "default";
        var add_obj = this.addObject[source];
        add_obj.obj = __WEBPACK_IMPORTED_MODULE_3_lodash__["cloneDeep"](layer_item.layer_obj);
        add_obj.edit_index = index;
        __WEBPACK_IMPORTED_MODULE_3_lodash__["forEach"](add_obj.required, function (val, key, obj) { obj[key] = !__WEBPACK_IMPORTED_MODULE_3_lodash__["isEmpty"](add_obj.obj[key]); });
        this[add_obj.modal].show();
    };
    LayersComponent.prototype.submitAddLayer = function (layer_obj) {
        var source = layer_obj.source ? layer_obj.source : "default";
        var add_obj = this.addObject[source];
        if (layer_obj.source == "default")
            delete layer_obj.source;
        __WEBPACK_IMPORTED_MODULE_3_lodash__["forEach"](layer_obj, function (val, key, obj) {
            if (!__WEBPACK_IMPORTED_MODULE_3_lodash__["isNil"](add_obj.required[key]) && !add_obj.required[key]) {
                delete obj[key];
            }
        });
        if (add_obj.onEdit()) {
            this.layersArray[add_obj.edit_index]['layer_obj'] = layer_obj;
        }
        else {
            this.layersArray.push({ layer_obj: layer_obj });
        }
        this[add_obj.modal].hide();
    };
    LayersComponent.prototype.expandParams = function (layer_item) {
        layer_item.expand = !layer_item.expand;
    };
    LayersComponent.prototype.initLayersArray = function () {
        var layersArray = this.queryParamsHelperService.queryLayersStringToObjects({ layers: this.layersString });
        layersArray = layersArray.map(function (layer_obj) { return new Object({ layer_obj: layer_obj }); });
        if (!__WEBPACK_IMPORTED_MODULE_3_lodash__["isEqual"](this.layersArray, layersArray)) {
            this.layersArray = layersArray;
        }
    };
    LayersComponent.prototype.removeTms = function (index) {
        this.layersArray.splice(index, 1);
    };
    LayersComponent.prototype.canApply = function () {
        var before_change = this.queryParamsHelperService.queryLayersStringToObjects({ layers: this.layersString });
        var after_change = this.layersArray.map(function (layerItem) { return layerItem['layer_obj']; });
        return !__WEBPACK_IMPORTED_MODULE_3_lodash__["isEqual"](before_change, after_change);
    };
    LayersComponent.prototype.deleteKey = function (obj, key) {
        delete obj[key];
    };
    LayersComponent.prototype.removeAllLayers = function () {
        this.layersArray = [];
    };
    LayersComponent.prototype.ngOnInit = function () {
    };
    return LayersComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('layersModal'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */]) === "function" && _a || Object)
], LayersComponent.prototype, "layersModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('addModal'),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */]) === "function" && _b || Object)
], LayersComponent.prototype, "addModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('addQueryModal'),
    __metadata("design:type", typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */]) === "function" && _c || Object)
], LayersComponent.prototype, "addQueryModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('mapboxModal'),
    __metadata("design:type", typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */]) === "function" && _d || Object)
], LayersComponent.prototype, "mapboxModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('tmsModal'),
    __metadata("design:type", typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */]) === "function" && _e || Object)
], LayersComponent.prototype, "tmsModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('bingModal'),
    __metadata("design:type", typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */]) === "function" && _f || Object)
], LayersComponent.prototype, "bingModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('osmModal'),
    __metadata("design:type", typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */]) === "function" && _g || Object)
], LayersComponent.prototype, "osmModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('defaultModal'),
    __metadata("design:type", typeof (_h = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ng2_bootstrap__["b" /* ModalDirective */]) === "function" && _h || Object)
], LayersComponent.prototype, "defaultModal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])('layersString'),
    __metadata("design:type", String)
], LayersComponent.prototype, "layersString", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], LayersComponent.prototype, "submitLayersEmitter", void 0);
LayersComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        animations: [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('error', [
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])(':enter', [
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0 }),
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('250ms', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 1 }))
                ]),
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])(':leave', [
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 1 }),
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('250ms', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0 }))
                ])
            ])
        ],
        selector: 'app-layers',
        template: __webpack_require__(696),
        styles: [__webpack_require__(643)]
    }),
    __metadata("design:paramtypes", [typeof (_j = typeof __WEBPACK_IMPORTED_MODULE_2__services_query_params_helper_service__["a" /* QueryParamsHelperService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_query_params_helper_service__["a" /* QueryParamsHelperService */]) === "function" && _j || Object, typeof (_k = typeof __WEBPACK_IMPORTED_MODULE_4__services_ajax_service__["a" /* AjaxService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__services_ajax_service__["a" /* AjaxService */]) === "function" && _k || Object])
], LayersComponent);

var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/layers.component.js.map

/***/ }),

/***/ 470:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SwitchLayersComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SwitchLayersComponent = (function () {
    function SwitchLayersComponent() {
        this._active = false;
        this.alert = false;
        this.layersArrayChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.submitLayersEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    SwitchLayersComponent.prototype.keypress = function ($event) {
        if ($event.which == 32 && this.active) {
            this.switch();
            this.submitLayersEmitter.emit();
        }
    };
    SwitchLayersComponent.prototype.toggleSwitchBtn = function (btn) {
        btn.blur();
        this.active = !this.active;
    };
    SwitchLayersComponent.prototype.switch = function () {
        var newLayersArray = this.layersArray.map(function (val, index, array) {
            var prev = (index - 1) < 0 ? array.length + (index - 1) : (index - 1);
            return array[prev];
        });
        this.layersArrayChange.emit(newLayersArray);
    };
    Object.defineProperty(SwitchLayersComponent.prototype, "active", {
        get: function () {
            return this._active;
        },
        set: function (value) {
            var _this = this;
            clearTimeout(this.timeoutEvent);
            if (value) {
                this.alert = true;
                this.timeoutEvent = setTimeout(function () {
                    _this.alert = false;
                }, 2000);
            }
            else {
                this.alert = false;
            }
            this._active = value;
        },
        enumerable: true,
        configurable: true
    });
    return SwitchLayersComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], SwitchLayersComponent.prototype, "layersArray", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], SwitchLayersComponent.prototype, "layersArrayChange", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], SwitchLayersComponent.prototype, "submitLayersEmitter", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])("window:keypress", ["$event"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SwitchLayersComponent.prototype, "keypress", null);
SwitchLayersComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-switch-layers',
        template: __webpack_require__(697),
        styles: [__webpack_require__(644)],
        animations: [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('fadeInOut', [
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])(':enter', [
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0 }),
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('0.25s', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 1 }))
                ]),
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])(':leave', [
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 1 }),
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('0.25s', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0 }))
                ])
            ])
        ]
    }),
    __metadata("design:paramtypes", [])
], SwitchLayersComponent);

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/switch-layers.component.js.map

/***/ }),

/***/ 471:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapLightingComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MapLightingComponent = (function () {
    function MapLightingComponent(queryParamsHelperService, router, mapMipService) {
        this.queryParamsHelperService = queryParamsHelperService;
        this.router = router;
        this.mapMipService = mapMipService;
    }
    MapLightingComponent.prototype.ngOnChanges = function (changes) {
        if (changes['lighting']) {
            var lighting = this.lighting;
            this.lighting_value = this.queryParamsHelperService.queryLighting({ lighting: lighting });
        }
    };
    MapLightingComponent.prototype.toggleLight = function () {
        this.lighting_value = 1 - this.lighting_value;
        var urlTree = this.router.parseUrl(this.router.url);
        urlTree.queryParams['lighting'] = this.lighting_value.toString();
        if (this.lighting_value != 1)
            delete urlTree.queryParams['lighting'];
        this.mapMipService.navigateByUrl(urlTree.toString());
    };
    return MapLightingComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], MapLightingComponent.prototype, "lighting", void 0);
MapLightingComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-map-lighting',
        template: __webpack_require__(698),
        styles: [__webpack_require__(645)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_query_params_helper_service__["a" /* QueryParamsHelperService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_query_params_helper_service__["a" /* QueryParamsHelperService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__api_map_mip_service__["a" /* MapMipService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__api_map_mip_service__["a" /* MapMipService */]) === "function" && _c || Object])
], MapLightingComponent);

var _a, _b, _c;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/map-lighting.component.js.map

/***/ }),

/***/ 472:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__position_form_service__ = __webpack_require__(37);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapPositionComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MapPositionComponent = (function () {
    function MapPositionComponent(queryParamsHelperService, positionFormService) {
        var _this = this;
        this.queryParamsHelperService = queryParamsHelperService;
        this.positionFormService = positionFormService;
        this.positionChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.submitPositionEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.popViewStyle = {
            width: "100px",
            height: "100px"
        };
        this.dragStyle = {
            left: '0px',
            top: '0px',
            height: '0%',
            width: '0%'
        };
        this.mouseDown = false;
        this.drag_obj = {
            posX: null,
            posY: null,
        };
        this.onMouseMove = function (event) {
            if (!_this.mouseDown || event.which != 1)
                return;
            _this.dragStyle.left = Math.max(0, Math.min(event.clientX - _this.drag_obj.posX, _this.maxBoundX())) + "px";
            _this.dragStyle.top = Math.max(0, Math.min(event.clientY - _this.drag_obj.posY, _this.maxBoundY())) + "px";
        };
    }
    MapPositionComponent.prototype.ngOnChanges = function (changes) {
        if (changes['size']) {
            this.onSizeChanges();
            this.onPositionChanges();
        }
        if (changes['position']) {
            this.onPositionChanges();
        }
    };
    MapPositionComponent.prototype.onPositionChanges = function () {
        var position = this.position;
        this.positionArr = this.queryParamsHelperService.queryPosition({ position: position });
        var pixelLeft = this.maxBoundX() * this.positionArr[0] / 100;
        var pixelTop = this.maxBoundY() * this.positionArr[1] / 100;
        pixelLeft = Math.max(pixelLeft, 0);
        pixelTop = Math.max(pixelTop, 0);
        pixelLeft = Math.min(pixelLeft, this.maxBoundX());
        pixelTop = Math.min(pixelTop, this.maxBoundY());
        this.dragStyle.left = pixelLeft + "px";
        this.dragStyle.top = pixelTop + "px";
    };
    MapPositionComponent.prototype.onSizeChanges = function () {
        var size = this.size;
        var sizeArr = this.queryParamsHelperService.querySize({ size: size });
        this.dragStyle.width = sizeArr[0] + "%";
        this.dragStyle.height = sizeArr[1] + "%";
    };
    MapPositionComponent.prototype.onResize = function () {
        this.popViewStyle.width = (this.positionFormService.mapsCont.nativeElement.offsetWidth) / 8 + "px";
        this.onPositionChanges();
    };
    MapPositionComponent.prototype.onMouseDown = function (event) {
        if (event.which != 1)
            return;
        this.drag_obj.posX = event.clientX - event.target.offsetLeft;
        this.drag_obj.posY = event.clientY - event.target.offsetTop;
        this.mouseDown = true;
    };
    MapPositionComponent.prototype.mouseUp = function (event) {
        if (event.which != 1)
            return;
        //click event
        if (!this.mouseDown && event.target == this.popView.nativeElement) {
            var left = parseFloat(event.offsetX) - (this.drag.nativeElement.clientWidth / 2) + "px";
            var top = parseFloat(event.offsetY) - (this.drag.nativeElement.clientHeight / 2) + "px";
            this.position = this.convertPixelsToPrecnt(left, top).toString();
            this.positionChange.emit(this.position);
            this.submitPositionEmitter.emit();
            return;
        }
        //drag event
        this.mouseDown = false;
        var new_position = this.convertPixelsToPrecnt().toString();
        if (new_position != this.position) {
            this.position = new_position;
            this.positionChange.emit(new_position);
            this.submitPositionEmitter.emit();
        }
    };
    MapPositionComponent.prototype.convertPixelsToPrecnt = function (left, top) {
        if (left === void 0) { left = this.dragStyle.left; }
        if (top === void 0) { top = this.dragStyle.top; }
        var _maxBoundX = this.maxBoundX();
        if (_maxBoundX == 0) {
            _maxBoundX = 100;
        }
        var _maxBoundY = this.maxBoundY();
        if (_maxBoundY == 0) {
            _maxBoundY = 100;
        }
        var precent_left = parseFloat(parseFloat(left) / _maxBoundX * 100 + "");
        var precent_top = parseFloat(parseFloat(top) / _maxBoundY * 100 + "");
        precent_left = Math.max(0, Math.min(100, precent_left));
        precent_top = Math.max(0, Math.min(100, precent_top));
        return [parseInt(precent_left.toString()), parseInt(precent_top.toString())];
    };
    MapPositionComponent.prototype.maxBoundX = function () {
        var pixelWidth = parseFloat(this.popViewStyle.width) * parseFloat(this.dragStyle.width) / 100;
        pixelWidth = Math.floor(+pixelWidth.toFixed(2));
        return parseFloat(this.popViewStyle.width) - pixelWidth;
    };
    MapPositionComponent.prototype.maxBoundY = function () {
        var pixelHeight = parseFloat(this.popViewStyle.height) * parseFloat(this.dragStyle.height) / 100;
        pixelHeight = Math.floor(+pixelHeight.toFixed(2));
        return parseFloat(this.popViewStyle.height) - pixelHeight;
    };
    MapPositionComponent.prototype.ngOnInit = function () {
        this.onResize();
    };
    MapPositionComponent.prototype.centerPosition = function () {
        this.position = "50,50";
        this.positionChange.emit(this.position);
        this.submitPositionEmitter.emit();
    };
    return MapPositionComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])("popView"),
    __metadata("design:type", Object)
], MapPositionComponent.prototype, "popView", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])("drag"),
    __metadata("design:type", Object)
], MapPositionComponent.prototype, "drag", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], MapPositionComponent.prototype, "position", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], MapPositionComponent.prototype, "positionChange", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], MapPositionComponent.prototype, "submitPositionEmitter", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], MapPositionComponent.prototype, "size", void 0);
MapPositionComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-map-position',
        template: __webpack_require__(699),
        styles: [__webpack_require__(646)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_query_params_helper_service__["a" /* QueryParamsHelperService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_query_params_helper_service__["a" /* QueryParamsHelperService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__position_form_service__["a" /* PositionFormService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__position_form_service__["a" /* PositionFormService */]) === "function" && _b || Object])
], MapPositionComponent);

var _a, _b;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/map-position.component.js.map

/***/ }),

/***/ 473:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapSizeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MapSizeComponent = (function () {
    function MapSizeComponent(queryParamsHelperService) {
        this.queryParamsHelperService = queryParamsHelperService;
        this.sizeChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.submitSizeEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    MapSizeComponent.prototype.ngOnInit = function () {
        this.setSizeArr();
    };
    MapSizeComponent.prototype.onSizeChange = function () {
        this.sizeChange.emit(this.sizeArr.toString());
        this.submitSizeEmitter.emit();
    };
    MapSizeComponent.prototype.ngOnChanges = function (changes) {
        if (changes["size"]) {
            this.setSizeArr();
        }
    };
    MapSizeComponent.prototype.setSizeArr = function () {
        var size = this.size;
        this.sizeArr = this.queryParamsHelperService.querySize({ size: size });
    };
    return MapSizeComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], MapSizeComponent.prototype, "size", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], MapSizeComponent.prototype, "sizeChange", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], MapSizeComponent.prototype, "submitSizeEmitter", void 0);
MapSizeComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-map-size',
        template: __webpack_require__(700),
        styles: [__webpack_require__(647)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_query_params_helper_service__["a" /* QueryParamsHelperService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_query_params_helper_service__["a" /* QueryParamsHelperService */]) === "function" && _a || Object])
], MapSizeComponent);

var _a;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/map-size.component.js.map

/***/ }),

/***/ 474:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(31);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewTabComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NewTabComponent = (function () {
    function NewTabComponent(router) {
        this.router = router;
    }
    NewTabComponent.prototype.ngOnInit = function () {
    };
    NewTabComponent.prototype.open = function () {
        location.href = 'http://mapmip.webiks.com' + this.router.url;
    };
    return NewTabComponent;
}());
NewTabComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-new-tab',
        template: __webpack_require__(702),
        styles: [__webpack_require__(649)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object])
], NewTabComponent);

var _a;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/new-tab.component.js.map

/***/ }),

/***/ 475:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Permissions; });
var Permissions;
(function (Permissions) {
    Permissions[Permissions["/cesium"] = 1] = "/cesium";
    Permissions[Permissions["/leaflet"] = 2] = "/leaflet";
    Permissions[Permissions["/openlayers"] = 3] = "/openlayers";
    Permissions[Permissions["/cesium?mode3d=0"] = 4] = "/cesium?mode3d=0";
})(Permissions || (Permissions = {}));
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/permissions.enum.js.map

/***/ }),

/***/ 476:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__permissions_enum__ = __webpack_require__(475);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__position_form_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PositionFormComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var position_form_animations = [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('showTools', [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])(':enter', [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ maxHeight: '0', opacity: 0 }),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('0.3s', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ maxHeight: '500px', opacity: 1 }))
        ]),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])(':leave', [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ maxHeight: '500px', opacity: 1 }),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])('0.3s', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ maxHeight: '0', opacity: 0 }))
        ])])];
var PositionFormComponent = (function () {
    function PositionFormComponent(router, route, queryParamsHelperService, positionFormService, mapMipService) {
        this.router = router;
        this.route = route;
        this.queryParamsHelperService = queryParamsHelperService;
        this.positionFormService = positionFormService;
        this.mapMipService = mapMipService;
        this.showTools = "false";
        this.params = {
            lng: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/leaflet'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/openlayers']] },
            lat: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/leaflet'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/openlayers']] },
            zoom: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/leaflet'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/openlayers']] },
            heading: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/openlayers']] },
            pitch: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium']] },
            roll: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium']] },
            height: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium']] },
            mode3d: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium']], input_type: 'Bswitch' },
            rotate: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/openlayers'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium?mode3d=0']], input_type: 'Bswitch' },
            markers: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/leaflet'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/openlayers']], input_type: 'app-markers' },
            layers: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/leaflet'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/openlayers'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium']], input_type: 'app-layers' },
            size: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/leaflet'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/openlayers'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium']], input_type: 'app-map-size' },
            position: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/leaflet'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/openlayers'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium']], input_type: 'app-map-position' },
            terrain: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium']], input_type: 'app-terrain' },
            geojson: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/leaflet'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/openlayers'], __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium']], input_type: 'app-geojson-layer' },
            lighting: { permissions: [__WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */]['/cesium']], input_type: 'app-map-lighting' }
        };
    }
    PositionFormComponent.prototype.submitLayers = function ($event) {
        var _this = this;
        this.params.layers.val = $event.parsed_layer;
        this.submitForm().then(function () {
            if ($event.hide || __WEBPACK_IMPORTED_MODULE_3_lodash__["isNil"](_this.params.layers.val))
                $event.modal.hide();
        });
    };
    PositionFormComponent.prototype.submitMarkers = function ($event) {
        var _this = this;
        this.params.markers.val = $event.parsed_markers;
        this.submitForm().then(function () {
            if ($event.hide || __WEBPACK_IMPORTED_MODULE_3_lodash__["isNil"](_this.params.markers.val))
                $event.smModal.hide();
        });
    };
    PositionFormComponent.prototype.submitGeojsons = function ($event) {
        var _this = this;
        this.params.geojson.val = $event.parsed_geojson;
        this.submitForm().then(function () {
            if ($event.hide || __WEBPACK_IMPORTED_MODULE_3_lodash__["isNil"](_this.params.markers.val))
                $event.modal.hide();
        });
    };
    PositionFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.queryParams.subscribe(function (params) {
            //params
            __WEBPACK_IMPORTED_MODULE_3_lodash__["forEach"](_this.params, function (obj, key) {
                switch (key) {
                    case "mode3d":
                        obj.val = params['mode3d'] == 0 ? false : true;
                        break;
                    case "rotate":
                        if (_this.router.isActive("/openlayers", false)) {
                            obj.val = params['rotate'] == 0 ? false : true;
                        }
                        else {
                            obj.val = params['rotate'] == 1 ? true : false;
                        }
                        break;
                    default:
                        obj.val = params[key] || undefined;
                }
            });
        });
    };
    PositionFormComponent.prototype.submitForm = function () {
        var _this = this;
        var queryParams = {};
        __WEBPACK_IMPORTED_MODULE_3_lodash__["forEach"](this.params, function (obj, key) {
            var val = obj.val;
            switch (key) {
                case 'mode3d':
                    val = obj.val == false ? 0 : 1;
                    break;
                case 'rotate':
                    if (_this.router.isActive("/openlayers", false)) {
                        val = obj.val == false ? 0 : undefined;
                    }
                    else {
                        val = obj.val == true ? 1 : undefined;
                    }
                    break;
            }
            queryParams[key] = val;
        });
        var navigationExtras = this.queryParamsHelperService.getQuery(queryParams);
        return this.mapMipService.navigate([], navigationExtras);
    };
    PositionFormComponent.prototype.havePermission = function (obj) {
        var _this = this;
        var urlTreeCurrent = this.router.parseUrl(this.router.url);
        var havePermission = false;
        __WEBPACK_IMPORTED_MODULE_3_lodash__["forEach"](obj.permissions, function (num) {
            var url = __WEBPACK_IMPORTED_MODULE_4__permissions_enum__["a" /* Permissions */][num];
            var urlTreeCheck = _this.router.parseUrl(url);
            var path_premission = urlTreeCheck.root.children['primary'].segments[0].path;
            var url_router = _this.router.url;
            var urlTreeCheckRouter = _this.router.parseUrl(url_router);
            var path_router = urlTreeCheckRouter.root.children['primary'].segments[0].path;
            if (path_router.includes(path_premission)) {
                havePermission = true;
                __WEBPACK_IMPORTED_MODULE_3_lodash__["forEach"](urlTreeCheck.queryParams, function (val, key) {
                    if (urlTreeCheck.queryParams[key] != urlTreeCurrent.queryParams[key])
                        havePermission = false;
                });
            }
        });
        return havePermission;
    };
    PositionFormComponent.prototype.close = function () {
        this.positionFormService.hideComponent = true;
    };
    PositionFormComponent.prototype.keys = function (obj) {
        return Object.keys(obj);
    };
    return PositionFormComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"])('@showTools'),
    __metadata("design:type", Object)
], PositionFormComponent.prototype, "showTools", void 0);
PositionFormComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-position-form',
        template: __webpack_require__(703),
        styles: [__webpack_require__(650)],
        animations: position_form_animations
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["d" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["d" /* ActivatedRoute */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__services_query_params_helper_service__["a" /* QueryParamsHelperService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_query_params_helper_service__["a" /* QueryParamsHelperService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_5__position_form_service__["a" /* PositionFormService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__position_form_service__["a" /* PositionFormService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_6__api_map_mip_service__["a" /* MapMipService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__api_map_mip_service__["a" /* MapMipService */]) === "function" && _e || Object])
], PositionFormComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/position-form.component.js.map

/***/ }),

/***/ 477:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__position_form_component__ = __webpack_require__(476);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__markers_markers_component__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_jw_bootstrap_switch_ng2__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_jw_bootstrap_switch_ng2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_jw_bootstrap_switch_ng2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__layers_layers_component__ = __webpack_require__(469);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__position_form_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__color_picker_color_picker_component__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__map_size_map_size_component__ = __webpack_require__(473);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_ng_click_outside__ = __webpack_require__(665);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_ng_click_outside___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_ng_click_outside__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__map_position_map_position_component__ = __webpack_require__(472);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__terrain_terrain_component__ = __webpack_require__(479);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__layers_drag_item_directive__ = __webpack_require__(468);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__reverse_pipe__ = __webpack_require__(478);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__layers_switch_layers_switch_layers_component__ = __webpack_require__(470);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__map_lighting_map_lighting_component__ = __webpack_require__(471);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__angular_material__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__color_picker_color_picker_pipe__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__geojson_layer_geojson_layer_component__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__flip_switch_flip_switch_component__ = __webpack_require__(467);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PositionFormModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






















var PositionFormModule = (function () {
    function PositionFormModule() {
    }
    return PositionFormModule;
}());
PositionFormModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_common__["a" /* CommonModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
            __WEBPACK_IMPORTED_MODULE_3_ng2_bootstrap__["a" /* Ng2BootstrapModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_6_jw_bootstrap_switch_ng2__["JWBootstrapSwitchModule"],
            __WEBPACK_IMPORTED_MODULE_11_ng_click_outside__["ClickOutsideModule"],
            __WEBPACK_IMPORTED_MODULE_18__angular_material__["b" /* MaterialModule */]
        ],
        declarations: [__WEBPACK_IMPORTED_MODULE_4__position_form_component__["a" /* PositionFormComponent */], __WEBPACK_IMPORTED_MODULE_5__markers_markers_component__["a" /* MarkersComponent */], __WEBPACK_IMPORTED_MODULE_7__layers_layers_component__["a" /* LayersComponent */], __WEBPACK_IMPORTED_MODULE_9__color_picker_color_picker_component__["a" /* ColorPickerComponent */], __WEBPACK_IMPORTED_MODULE_10__map_size_map_size_component__["a" /* MapSizeComponent */], __WEBPACK_IMPORTED_MODULE_12__map_position_map_position_component__["a" /* MapPositionComponent */], __WEBPACK_IMPORTED_MODULE_13__terrain_terrain_component__["a" /* TerrainComponent */], __WEBPACK_IMPORTED_MODULE_14__layers_drag_item_directive__["a" /* DragItemDirective */], __WEBPACK_IMPORTED_MODULE_15__reverse_pipe__["a" /* ReversePipe */], __WEBPACK_IMPORTED_MODULE_16__layers_switch_layers_switch_layers_component__["a" /* SwitchLayersComponent */], __WEBPACK_IMPORTED_MODULE_17__map_lighting_map_lighting_component__["a" /* MapLightingComponent */], __WEBPACK_IMPORTED_MODULE_19__color_picker_color_picker_pipe__["a" /* ColorPickerPipe */], __WEBPACK_IMPORTED_MODULE_20__geojson_layer_geojson_layer_component__["a" /* GeojsonLayerComponent */], __WEBPACK_IMPORTED_MODULE_21__flip_switch_flip_switch_component__["a" /* FlipSwitchComponent */]],
        exports: [__WEBPACK_IMPORTED_MODULE_4__position_form_component__["a" /* PositionFormComponent */]],
        providers: [__WEBPACK_IMPORTED_MODULE_8__position_form_service__["a" /* PositionFormService */]]
    })
], PositionFormModule);

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/position-form.module.js.map

/***/ }),

/***/ 478:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReversePipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ReversePipe = (function () {
    function ReversePipe() {
    }
    ReversePipe.prototype.transform = function (value, args) {
        return value.slice().reverse();
    };
    return ReversePipe;
}());
ReversePipe = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({
        name: 'reverse',
        pure: false
    })
], ReversePipe);

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/reverse.pipe.js.map

/***/ }),

/***/ 479:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_ajax_service__ = __webpack_require__(57);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TerrainComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TerrainComponent = (function () {
    function TerrainComponent(queryParamsHelperService, ajaxService) {
        this.queryParamsHelperService = queryParamsHelperService;
        this.ajaxService = ajaxService;
        this.terrainChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.submitTerrainEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.examples$ = this.ajaxService.getTerrainsExam();
    }
    TerrainComponent.prototype.ngOnInit = function () {
        this.setTerrain();
    };
    TerrainComponent.prototype.onShownPopover = function () {
        var element = document.querySelector("app-terrain input");
        element.focus();
    };
    TerrainComponent.prototype.submitTerrain = function (popDirective) {
        this.terrainChange.emit(this.terrainUrl);
        this.submitTerrainEmitter.emit();
        popDirective.hide();
    };
    TerrainComponent.prototype.ngOnChanges = function (changes) {
        if (changes["terrain"]) {
            this.setTerrain();
        }
    };
    TerrainComponent.prototype.setTerrain = function () {
        var terrain = this.terrain;
        this.terrainUrl = this.queryParamsHelperService.queryTerrain({ terrain: terrain });
    };
    return TerrainComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], TerrainComponent.prototype, "terrain", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], TerrainComponent.prototype, "terrainChange", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], TerrainComponent.prototype, "submitTerrainEmitter", void 0);
TerrainComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-terrain',
        template: __webpack_require__(704),
        styles: [__webpack_require__(651)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_query_params_helper_service__["a" /* QueryParamsHelperService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_query_params_helper_service__["a" /* QueryParamsHelperService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_ajax_service__["a" /* AjaxService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_ajax_service__["a" /* AjaxService */]) === "function" && _b || Object])
], TerrainComponent);

var _a, _b;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/terrain.component.js.map

/***/ }),

/***/ 480:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_mip_component__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_cesium_cesium_component__ = __webpack_require__(442);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_leaflet_leaflet_component__ = __webpack_require__(457);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_openlayers_openlayers_component__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_query_params_helper_service__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_forms__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_calc_service__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_jw_bootstrap_switch_ng2__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_jw_bootstrap_switch_ng2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_jw_bootstrap_switch_ng2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ng2_bootstrap__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_position_form_position_form_module__ = __webpack_require__(477);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_ajax_service__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__angular_http__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__angular_material__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__services_map_layer_api_service__ = __webpack_require__(481);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__angular_router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__api_map_mip_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_position_form_new_tab_new_tab_component__ = __webpack_require__(474);
/* unused harmony export MapMipChildren */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapMipModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



















var MapMipChildren = [
    {
        path: 'cesium',
        component: __WEBPACK_IMPORTED_MODULE_3__components_cesium_cesium_component__["a" /* CesiumComponent */]
    },
    {
        path: 'openlayers',
        component: __WEBPACK_IMPORTED_MODULE_5__components_openlayers_openlayers_component__["a" /* OpenlayersComponent */]
    },
    {
        path: 'leaflet',
        component: __WEBPACK_IMPORTED_MODULE_4__components_leaflet_leaflet_component__["a" /* LeafletComponent */]
    }
];
var MapMipModule = (function () {
    function MapMipModule() {
    }
    return MapMipModule;
}());
MapMipModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_common__["a" /* CommonModule */],
            __WEBPACK_IMPORTED_MODULE_7__angular_forms__["FormsModule"],
            __WEBPACK_IMPORTED_MODULE_16__angular_router__["c" /* RouterModule */].forRoot(MapMipChildren, { useHash: false }),
            __WEBPACK_IMPORTED_MODULE_10_ng2_bootstrap__["a" /* Ng2BootstrapModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_9_jw_bootstrap_switch_ng2__["JWBootstrapSwitchModule"],
            __WEBPACK_IMPORTED_MODULE_11__components_position_form_position_form_module__["a" /* PositionFormModule */],
            __WEBPACK_IMPORTED_MODULE_13__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_14__angular_material__["b" /* MaterialModule */]
        ],
        declarations: [__WEBPACK_IMPORTED_MODULE_2__map_mip_component__["a" /* MapLayerComponent */], __WEBPACK_IMPORTED_MODULE_3__components_cesium_cesium_component__["a" /* CesiumComponent */], __WEBPACK_IMPORTED_MODULE_4__components_leaflet_leaflet_component__["a" /* LeafletComponent */], __WEBPACK_IMPORTED_MODULE_5__components_openlayers_openlayers_component__["a" /* OpenlayersComponent */], __WEBPACK_IMPORTED_MODULE_18__components_position_form_new_tab_new_tab_component__["a" /* NewTabComponent */]],
        exports: [__WEBPACK_IMPORTED_MODULE_2__map_mip_component__["a" /* MapLayerComponent */]],
        providers: [__WEBPACK_IMPORTED_MODULE_6__services_query_params_helper_service__["a" /* QueryParamsHelperService */], __WEBPACK_IMPORTED_MODULE_8__services_calc_service__["a" /* CalcService */], __WEBPACK_IMPORTED_MODULE_12__services_ajax_service__["a" /* AjaxService */], __WEBPACK_IMPORTED_MODULE_15__services_map_layer_api_service__["a" /* MapLayerApiService */], __WEBPACK_IMPORTED_MODULE_17__api_map_mip_service__["a" /* MapMipService */]]
    })
], MapMipModule);

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/map-mip.module.js.map

/***/ }),

/***/ 481:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_position_form_markers_markers_component__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_position_form_geojson_layer_geojson_layer_component__ = __webpack_require__(165);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapLayerApiService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MapLayerApiService = (function () {
    function MapLayerApiService(/*private queryParamsHelperService:QueryParamsHelperService,*/ router /*,private mapmipService:MapMipService*/, markersComponent, geojsonComponent) {
        this.router = router; /*,private mapmipService:MapMipService*/
        this.markersComponent = markersComponent;
        this.geojsonComponent = geojsonComponent;
    }
    return MapLayerApiService;
}());
MapLayerApiService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] /*,private mapmipService:MapMipService*/ !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] /*,private mapmipService:MapMipService*/) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__components_position_form_markers_markers_component__["a" /* MarkersComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__components_position_form_markers_markers_component__["a" /* MarkersComponent */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__components_position_form_geojson_layer_geojson_layer_component__["a" /* GeojsonLayerComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__components_position_form_geojson_layer_geojson_layer_component__["a" /* GeojsonLayerComponent */]) === "function" && _c || Object])
], MapLayerApiService);

var _a, _b, _c;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/map-layer-api.service.js.map

/***/ }),

/***/ 482:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__map_mip_api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavbarComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NavbarComponent = (function () {
    function NavbarComponent(renderer, mapMipService) {
        this.renderer = renderer;
        this.mapMipService = mapMipService;
        this.isCollapsed = true;
    }
    NavbarComponent.prototype.togglePositionForm = function () {
        this.mapMipService.togglePositionForm();
        this.isCollapsed = true;
    };
    NavbarComponent.prototype.setHeight = function (el, height) {
        this.renderer.setElementStyle(el, 'height', height + 'px');
    };
    Object.defineProperty(NavbarComponent.prototype, "CESIUM_PATH", {
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_1__map_mip_api_map_mip_service__["a" /* MapMipService */].CESIUM_PATH;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavbarComponent.prototype, "LEAFLET_PATH", {
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_1__map_mip_api_map_mip_service__["a" /* MapMipService */].LEAFLET_PATH;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavbarComponent.prototype, "OPENLAYERS_PATH", {
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_1__map_mip_api_map_mip_service__["a" /* MapMipService */].OPENLAYERS_PATH;
        },
        enumerable: true,
        configurable: true
    });
    return NavbarComponent;
}());
NavbarComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-navbar',
        template: __webpack_require__(706),
        styles: [__webpack_require__(653)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["Renderer"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__map_mip_api_map_mip_service__["a" /* MapMipService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__map_mip_api_map_mip_service__["a" /* MapMipService */]) === "function" && _b || Object])
], NavbarComponent);

var _a, _b;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/navbar.component.js.map

/***/ }),

/***/ 483:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/environment.js.map

/***/ }),

/***/ 57:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_firebase__ = __webpack_require__(656);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_firebase__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AjaxService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AjaxService = (function () {
    function AjaxService() {
        if (__WEBPACK_IMPORTED_MODULE_1_firebase__["apps"].length === 0) {
            this.initFirebase();
        }
    }
    AjaxService.prototype.initFirebase = function () {
        var config = {
            apiKey: "AIzaSyCWOLHmczhM7SBQIq6XZ3f4sPFyMObJRLs",
            authDomain: "mapmip-6c74a.firebaseapp.com",
            databaseURL: "https://mapmip-6c74a.firebaseio.com"
        };
        __WEBPACK_IMPORTED_MODULE_1_firebase__["initializeApp"](config);
    };
    // getTmsmapresource(url:string) : Observable<any>{
    //   return new Observable(obs => {
    //     this.http.get(`${url}/tilemapresource.xml`).subscribe(response => {
    //       xml2js.parseString(response['_body'], (err, res) => {
    //         obs.next(res);
    //       });
    //     });
    //   })
    // }
    AjaxService.prototype.getLayerExam = function () {
        return __WEBPACK_IMPORTED_MODULE_1_firebase__["database"]().ref("array").once("value").then(function (snapshot) { return snapshot.val(); });
    };
    AjaxService.prototype.getTerrainsExam = function () {
        return __WEBPACK_IMPORTED_MODULE_1_firebase__["database"]().ref("terrains").once("value").then(function (snapshot) { return snapshot.val(); });
    };
    AjaxService.prototype.getGeoJsonExam = function () {
        return __WEBPACK_IMPORTED_MODULE_1_firebase__["database"]().ref("geojsons").once("value").then(function (snapshot) { return snapshot.val(); });
    };
    return AjaxService;
}());
AjaxService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [])
], AjaxService);

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/ajax.service.js.map

/***/ }),

/***/ 636:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, "div.page-container {\n  position: relative;\n  width: 100%;\n  padding: 0 5vw;\n  height: calc(100vh - 76px); }\n\n@media (max-width: 767px) {\n  div.page-container {\n    height: calc(100vh - 72px);\n    padding: 0 3vw; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 637:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, "div {\n  height: 800px;\n  width: 100%;\n  position: absolute; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 638:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, "div {\n  height: 100%;\n  width: 100%;\n  position: absolute; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 639:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, "div {\n  height: 800px;\n  width: 100%;\n  position: absolute; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 640:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, ".picked-group button.picked-button img {\n  height: 18px; }\n\n.picked-group button.picked-button.active {\n  background: rgba(50, 134, 203, 0.35); }\n\n.picked-group button.glyphicon-option-vertical {\n  position: relative;\n  top: 0px;\n  margin: 0px; }\n\nul {\n  min-width: inherit;\n  max-height: 270px;\n  overflow: auto;\n  -webkit-padding-start: 0px; }\n  ul li {\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex; }\n    ul li a {\n      padding: 1px 1px;\n      border: 1px solid transparent;\n      border-radius: 4px; }\n      ul li a:hover {\n        border-color: #cccccc;\n        background-color: #337ab7; }\n      ul li a.is-selected {\n        border-color: #cccccc;\n        background-color: #337ab7; }\n      ul li a img {\n        width: 29px;\n        height: 38px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 641:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, ".onoffswitch {\n  position: relative;\n  width: 90px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none; }\n\n.onoffswitch-checkbox {\n  display: none; }\n\n.onoffswitch-label {\n  display: block;\n  overflow: hidden;\n  cursor: pointer;\n  border: 2px solid #999999;\n  border-radius: 20px; }\n\n.onoffswitch-inner {\n  display: block;\n  width: 200%;\n  margin-left: -100%;\n  transition: margin 0.3s ease-in 0s; }\n\n.onoffswitch-inner:before, .onoffswitch-inner:after {\n  display: block;\n  float: left;\n  width: 50%;\n  height: 30px;\n  padding: 0;\n  line-height: 30px;\n  font-size: 12px;\n  color: white;\n  font-family: Trebuchet, Arial, sans-serif;\n  font-weight: bold;\n  box-sizing: border-box; }\n\n.onoffswitch-inner:before {\n  content: \"Fixed URL\";\n  padding-left: 5px;\n  background-color: #34A7C1;\n  color: #FFFFFF; }\n\n.onoffswitch-inner:after {\n  content: \"OFF\";\n  padding-right: 10px;\n  background-color: #EEEEEE;\n  color: #999999;\n  text-align: center; }\n\n.onoffswitch-switch {\n  display: block;\n  width: 18px;\n  margin: 6px;\n  background: #FFFFFF;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 56px;\n  border: 2px solid #999999;\n  border-radius: 20px;\n  transition: all 0.3s ease-in 0s; }\n\n.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {\n  margin-left: 0; }\n\n.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {\n  right: 0px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 642:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, ".control-buttons {\n  margin: 10px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n  .control-buttons button {\n    margin: 0 10px; }\n\nbutton.center-btn {\n  color: #277fca;\n  margin: 0px 10px;\n  top: 0px; }\n\nbutton.top-button {\n  margin: 10px 0; }\n\ndiv.modal-body button {\n  margin: 10px 0; }\n\ndiv.modal-body div.li-row {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative; }\n  div.modal-body div.li-row input.form-control {\n    width: 75%;\n    height: 100%;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none; }\n  div.modal-body div.li-row img {\n    height: 100%;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none; }\n  div.modal-body div.li-row span.url {\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    width: calc(100% - 125px);\n    overflow: hidden;\n    -webkit-box-flex: 10;\n        -ms-flex-positive: 10;\n            flex-grow: 10;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    margin: 0 10px; }\n  div.modal-body div.li-row button {\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    -webkit-box-flex: 0;\n        -ms-flex-positive: 0;\n            flex-grow: 0;\n    opacity: 1;\n    padding: 5px 10px;\n    margin: 0 5px;\n    font-size: 12px; }\n    div.modal-body div.li-row button.glyphicon-chevron-right {\n      -webkit-transform: rotate(0deg);\n              transform: rotate(0deg);\n      transition: .2s;\n      -webkit-user-select: none;\n         -moz-user-select: none;\n          -ms-user-select: none;\n              user-select: none; }\n    div.modal-body div.li-row button:disabled {\n      opacity: .5; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 643:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, "button.layer-btn {\n  background: #a20aa2;\n  border-color: purple; }\n\nh4 {\n  color: #a20aa2; }\n\n.layers-modal .modal-body .body-header {\n  padding: 15px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center; }\n  .layers-modal .modal-body .body-header button {\n    margin: 0 5px; }\n    .layers-modal .modal-body .body-header button img {\n      height: 40px; }\n    .layers-modal .modal-body .body-header button.tms-btn {\n      background: #a20aa2;\n      border-color: purple; }\n\n.layers-modal .modal-body .remove-all-btn-area {\n  margin: 10px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n.layers-modal .modal-body ul li.list-group-item {\n  padding: 6px;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  cursor: pointer; }\n  .layers-modal .modal-body ul li.list-group-item:focus {\n    outline: 2px dashed lightblue;\n    border-color: transparent;\n    z-index: 1; }\n  .layers-modal .modal-body ul li.list-group-item.dragovered {\n    outline: 2px dashed lightblue;\n    border-color: transparent;\n    z-index: 1; }\n  .layers-modal .modal-body ul li.list-group-item.dragged {\n    background: #5bc0de;\n    opacity: .2; }\n  .layers-modal .modal-body ul li.list-group-item div.li-row {\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    height: 35px;\n    position: relative; }\n    .layers-modal .modal-body ul li.list-group-item div.li-row input.form-control {\n      width: 75%;\n      height: 100%;\n      -webkit-user-select: none;\n         -moz-user-select: none;\n          -ms-user-select: none;\n              user-select: none; }\n    .layers-modal .modal-body ul li.list-group-item div.li-row img {\n      height: 100%;\n      -webkit-user-select: none;\n         -moz-user-select: none;\n          -ms-user-select: none;\n              user-select: none; }\n    .layers-modal .modal-body ul li.list-group-item div.li-row span.url {\n      -webkit-user-select: none;\n         -moz-user-select: none;\n          -ms-user-select: none;\n              user-select: none;\n      width: calc(100% - 125px);\n      overflow: hidden;\n      -webkit-box-flex: 10;\n          -ms-flex-positive: 10;\n              flex-grow: 10;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-orient: vertical;\n      -webkit-box-direction: normal;\n          -ms-flex-direction: column;\n              flex-direction: column;\n      -webkit-box-pack: center;\n          -ms-flex-pack: center;\n              justify-content: center;\n      margin: 0 10px; }\n    .layers-modal .modal-body ul li.list-group-item div.li-row button {\n      -webkit-user-select: none;\n         -moz-user-select: none;\n          -ms-user-select: none;\n              user-select: none;\n      -webkit-box-flex: 0;\n          -ms-flex-positive: 0;\n              flex-grow: 0;\n      opacity: 1;\n      padding: 5px 10px;\n      margin: 0 5px;\n      font-size: 12px; }\n      .layers-modal .modal-body ul li.list-group-item div.li-row button.glyphicon-chevron-right {\n        -webkit-transform: rotate(0deg);\n                transform: rotate(0deg);\n        transition: .2s;\n        -webkit-user-select: none;\n           -moz-user-select: none;\n            -ms-user-select: none;\n                user-select: none; }\n      .layers-modal .modal-body ul li.list-group-item div.li-row button:disabled {\n        opacity: .5; }\n  .layers-modal .modal-body ul li.list-group-item .params {\n    display: none;\n    margin: 1% 0; }\n    .layers-modal .modal-body ul li.list-group-item .params table {\n      width: 90%;\n      margin: 0 5%; }\n  .layers-modal .modal-body ul li.list-group-item.show-params div.li-row button {\n    opacity: 1; }\n    .layers-modal .modal-body ul li.list-group-item.show-params div.li-row button.glyphicon-chevron-right {\n      -webkit-transform: rotate(90deg);\n              transform: rotate(90deg); }\n  .layers-modal .modal-body ul li.list-group-item.show-params .params {\n    display: block; }\n\n.layers-modal .modal-footer .dropdown {\n  float: left; }\n\n.modal-dialog.modal-sm.add-tms .modal-body .url-group {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex; }\n  .modal-dialog.modal-sm.add-tms .modal-body .url-group label {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1; }\n  .modal-dialog.modal-sm.add-tms .modal-body .url-group button {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-flex: 0;\n        -ms-flex-positive: 0;\n            flex-grow: 0;\n    color: white;\n    margin: 0px 0 0 5px;\n    padding: 4px 6px;\n    height: 100%;\n    font-size: 15px; }\n  .modal-dialog.modal-sm.add-tms .modal-body .url-group input {\n    -webkit-box-flex: 2;\n        -ms-flex-positive: 2;\n            flex-grow: 2;\n    width: auto; }\n\n.modal-dialog.modal-sm.add-tms .modal-body ul {\n  max-height: 105px;\n  overflow: auto; }\n  .modal-dialog.modal-sm.add-tms .modal-body ul li {\n    font-size: 15px;\n    padding: 4px;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex; }\n    .modal-dialog.modal-sm.add-tms .modal-body ul li span {\n      -webkit-box-flex: 4;\n          -ms-flex-positive: 4;\n              flex-grow: 4;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-pack: center;\n          -ms-flex-pack: center;\n              justify-content: center;\n      -webkit-box-orient: vertical;\n      -webkit-box-direction: normal;\n          -ms-flex-direction: column;\n              flex-direction: column; }\n    .modal-dialog.modal-sm.add-tms .modal-body ul li button {\n      -webkit-box-flex: 0;\n          -ms-flex-positive: 0;\n              flex-grow: 0;\n      border-radius: 7px;\n      margin: 0 2px;\n      padding: 3px 8px; }\n\n.add-query .add-query-control {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex; }\n  .add-query .add-query-control button {\n    margin: 0 5px; }\n\n.modal-body.default-modal-body {\n  max-height: 306px;\n  overflow: auto; }\n  .modal-body.default-modal-body button.glyphicon.glyphicon-remove {\n    color: darkred; }\n  .modal-body.default-modal-body span.glyphicon.glyphicon-exclamation-sign.pull-left {\n    margin: 9px; }\n\n@media screen and (max-width: 767px) {\n  app-switch-layers {\n    display: none; }\n  .layers-modal .modal-body .body-header {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .layers-modal .modal-body .body-header button {\n      margin: 5px; }\n  .layers-modal .modal-footer .btn {\n    margin-top: 5px; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 644:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, "button.switch-layer-btn {\n  color: #a20aa2; }\n  button.switch-layer-btn.selected {\n    background: #f5e7f6; }\n\n.layers-alert {\n  position: fixed;\n  z-index: 2000;\n  width: 100%;\n  left: 0;\n  top: 0;\n  /* background: rgb(255, 0, 0); */\n  margin: 0;\n  color: #a20aa2;\n  background-color: #f0e0f0;\n  border-color: #f0e0f0; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 645:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, "button.active {\n  color: gold; }\n  button.active:focus {\n    color: gold; }\n\n#light {\n  margin-left: -52px;\n  margin-top: -1px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 646:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, "div div.popView {\n  height: 100px;\n  position: relative;\n  box-shadow: 0px 0px 1px 1px #3db5c0;\n  cursor: pointer; }\n  div div.popView .drag {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    background: rgba(61, 181, 192, 0.55);\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none; }\n    div div.popView .drag:active {\n      background: #3db5c0; }\n    div div.popView .drag:hover {\n      cursor: -webkit-grabbing; }\n\ndiv button.btn.btn-warning.glyphicon.glyphicon-screenshot {\n  left: calc(50% - 25px);\n  margin-top: 5px;\n  width: 50px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 647:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, "input[type=range] {\n  -webkit-appearance: none;\n  margin: 10px 0;\n  width: 100%; }\n\ninput[type=range]:focus {\n  outline: none; }\n\ninput[type=range]::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 5px;\n  cursor: pointer;\n  animate: 0.2s;\n  box-shadow: 0px 0px 0px #000000;\n  background: #5cb85c;\n  border-radius: 4px;\n  border: 0px solid #000000; }\n\ninput[type=range]::-webkit-slider-thumb {\n  box-shadow: 0px 0px 0px #000000;\n  border: 1px solid #5cb85c;\n  height: 18px;\n  width: 18px;\n  border-radius: 4px;\n  background: #5cb85c;\n  cursor: pointer;\n  -webkit-appearance: none;\n  margin-top: -7px;\n  opacity: 0.7; }\n\ninput[type=range]:focus::-webkit-slider-runnable-track {\n  background: #5cb85c; }\n\ninput[type=range]::-moz-range-track {\n  width: 100%;\n  height: 5px;\n  cursor: pointer;\n  animate: 0.2s;\n  box-shadow: 0px 0px 0px #000000;\n  background: #5cb85c;\n  border-radius: 4px;\n  border: 0px solid #000000; }\n\ninput[type=range]::-moz-range-thumb {\n  box-shadow: 0px 0px 0px #000000;\n  border: 1px solid #5cb85c;\n  height: 18px;\n  width: 18px;\n  border-radius: 4px;\n  background: #5cb85c;\n  cursor: pointer;\n  opacity: 0.7; }\n\ninput[type=range]::-ms-track {\n  width: 100%;\n  height: 5px;\n  cursor: pointer;\n  animate: 0.2s;\n  background: transparent;\n  border-color: transparent;\n  color: transparent; }\n\ninput[type=range]::-ms-fill-lower {\n  background: #5cb85c;\n  border: 0px solid #000000;\n  border-radius: 4px;\n  box-shadow: 0px 0px 0px #000000; }\n\ninput[type=range]::-ms-fill-upper {\n  background: #5cb85c;\n  border: 0px solid #000000;\n  border-radius: 4px;\n  box-shadow: 0px 0px 0px #000000; }\n\ninput[type=range]::-ms-thumb {\n  box-shadow: 0px 0px 0px #000000;\n  border: 1px solid #5cb85c;\n  height: 18px;\n  width: 18px;\n  border-radius: 4px;\n  background: #5cb85c;\n  cursor: pointer;\n  opacity: 0.7; }\n\ninput[type=range]:focus::-ms-fill-lower {\n  background: #5cb85c; }\n\ninput[type=range]:focus::-ms-fill-upper {\n  background: #5cb85c; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 648:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, "button.center-btn {\n  color: #277fca;\n  margin: 0px 10px;\n  top: 0px; }\n\nbutton.top-button {\n  margin: 10px 0; }\n\nul {\n  max-height: 193px;\n  overflow: auto; }\n  ul li.list-group-item {\n    padding: 6px; }\n    ul li.list-group-item div.li-row {\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      height: 35px;\n      position: relative; }\n      ul li.list-group-item div.li-row img {\n        margin: 0 10px; }\n      ul li.list-group-item div.li-row input.form-control {\n        width: 75%;\n        height: 100%; }\n      ul li.list-group-item div.li-row img {\n        height: 100%; }\n      ul li.list-group-item div.li-row span.position {\n        width: calc(100% - 125px);\n        overflow: hidden;\n        text-align: center;\n        -webkit-box-flex: 10;\n            -ms-flex-positive: 10;\n                flex-grow: 10;\n        display: -webkit-box;\n        display: -ms-flexbox;\n        display: flex;\n        -webkit-box-orient: vertical;\n        -webkit-box-direction: normal;\n            -ms-flex-direction: column;\n                flex-direction: column;\n        -webkit-box-pack: center;\n            -ms-flex-pack: center;\n                justify-content: center;\n        margin: 0 10px; }\n      ul li.list-group-item div.li-row button {\n        -webkit-box-flex: 0;\n            -ms-flex-positive: 0;\n                flex-grow: 0;\n        opacity: 1;\n        padding: 5px 10px;\n        margin: 0 5px;\n        font-size: 12px; }\n        ul li.list-group-item div.li-row button.glyphicon-chevron-right {\n          -webkit-transform: rotate(0deg);\n                  transform: rotate(0deg);\n          transition: .2s; }\n        ul li.list-group-item div.li-row button:disabled {\n          opacity: .5; }\n\n.input-and-picker {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: distribute;\n      justify-content: space-around; }\n  .input-and-picker input {\n    width: 65%; }\n\nh6 {\n  width: 70%; }\n\nh4.modal-title {\n  color: #337ab7; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 649:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, "a {\n  float: right;\n  margin: -18px 0 0px 0px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 65:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CalcService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CalcService = (function () {
    function CalcService() {
    }
    CalcService.prototype.toDegrees = function (radian) {
        var deg = Cesium.Math.toDegrees(radian);
        return ((deg % 360) + 360) % 360;
    };
    CalcService.prototype.toRadians = function (degree) {
        var pos_degree = ((degree % 360) + 360) % 360;
        return Cesium.Math.toRadians(pos_degree);
    };
    CalcService.prototype.toFixes7Obj = function (obj) {
        __WEBPACK_IMPORTED_MODULE_1_lodash__["forEach"](obj, function (val, key) {
            if (!isNaN(val))
                obj[key] = +(+val).toFixed(7);
        });
        return obj;
    };
    CalcService.prototype.getParsedUrlWithSubdomain = function (url) {
        if (!url.includes("{s}"))
            return url;
        var cesium_imagery_provider = new Cesium.UrlTemplateImageryProvider({
            url: url
        });
        var subdomains_array = cesium_imagery_provider._subdomains;
        var parsed_subdomains = "{" + (__WEBPACK_IMPORTED_MODULE_1_lodash__["isEmpty"](subdomains_array) ? "" : subdomains_array[0] + "-" + subdomains_array[subdomains_array.length - 1]) + "}";
        return url.replace("{s}", parsed_subdomains);
    };
    return CalcService;
}());
CalcService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [])
], CalcService);

//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/calc-service.js.map

/***/ }),

/***/ 650:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, ".panel.panel-default {\n  top: -45%; }\n  .panel.panel-default .panel-heading {\n    background-color: #222;\n    border-color: #080808;\n    color: white; }\n    .panel.panel-default .panel-heading .close {\n      color: white;\n      opacity: .8;\n      font-weight: 100; }\n      .panel.panel-default .panel-heading .close:hover {\n        opacity: 1;\n        font-weight: 700; }\n  .panel.panel-default .panel-body {\n    background: #424242; }\n  .panel.panel-default .form-group {\n    margin-bottom: 3px !important; }\n\n.pos-container form {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n  .pos-container form .form-group.submit {\n    display: none; }\n  .pos-container form .input_type {\n    width: 200px;\n    padding: 0 15px; }\n  .pos-container form .markers-group {\n    width: 255px;\n    padding: 0 15px; }\n  .pos-container form .layers-group {\n    width: 113px;\n    margin: 0 15px;\n    padding: 0; }\n  .pos-container form .size-group {\n    width: 53px;\n    margin: 0 15px;\n    padding: 0; }\n  .pos-container form .terrain-group {\n    width: 53px;\n    margin: 0 15px;\n    padding: 0; }\n  .pos-container form .b-switch {\n    padding: 0 15px;\n    width: 157px;\n    margin-right: 15px; }\n  .pos-container form .position-group {\n    width: 76px;\n    margin: 0 15px;\n    padding: 0; }\n  .pos-container form .lighting-group {\n    width: 20px;\n    margin: 0 15px;\n    padding: 0; }\n  .pos-container form md-input-container {\n    color: #d6d6d6; }\n    .pos-container form md-input-container input:focus {\n      color: white; }\n\n@media screen and (max-width: 767px) {\n  .panel.panel-default {\n    margin-bottom: 0;\n    border: none;\n    z-index: 1091;\n    position: relative; }\n    .panel.panel-default .panel-body {\n      max-height: 270px;\n      overflow: auto; }\n      .panel.panel-default .panel-body form {\n        -webkit-box-pack: center;\n            -ms-flex-pack: center;\n                justify-content: center; }\n        .panel.panel-default .panel-body form .input_type {\n          width: inherit; }\n          .panel.panel-default .panel-body form .input_type md-input-container {\n            width: 100%; }\n        .panel.panel-default .panel-body form .layers-group, .panel.panel-default .panel-body form .markers-group, .panel.panel-default .panel-body form .size-group, .panel.panel-default .panel-body form .lighting-group, .panel.panel-default .panel-body form .terrain-group {\n          width: inherit; }\n        .panel.panel-default .panel-body form .markers-group {\n          width: inherit; }\n        .panel.panel-default .panel-body form .group-div {\n          margin-top: 2%; }\n        .panel.panel-default .panel-body form .form-group.submit {\n          margin: 0;\n          margin-top: 2%;\n          width: 100%;\n          display: -webkit-box;\n          display: -ms-flexbox;\n          display: flex;\n          -webkit-box-pack: center;\n              -ms-flex-pack: center;\n                  justify-content: center; }\n          .panel.panel-default .panel-body form .form-group.submit button.submit-mobile {\n            width: 80%;\n            background: #0f0961;\n            border-color: #343075; }\n  .blackscreen {\n    position: fixed;\n    width: 100%;\n    height: 100%;\n    background: rgba(0, 0, 0, 0.5);\n    top: 0;\n    left: 0;\n    z-index: 1000; }\n  .position-group {\n    display: none; } }\n\n.glyphicon {\n  top: 0px !important; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 651:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, ".control-buttons {\n  margin: 10px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n  .control-buttons button {\n    margin: 0 10px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 652:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, ".map-layer {\n  width: 100%;\n  height: 100%; }\n  .map-layer .mapsCont {\n    position: relative;\n    width: 100%;\n    height: 100%; }\n\n.row button.btn.btn-info {\n  margin: 20px auto;\n  display: block; }\n\nbutton.show-tools {\n  position: absolute;\n  display: none; }\n\n#nav-icon3 {\n  display: block;\n  left: 25px;\n  width: 30px;\n  height: 30px;\n  position: absolute;\n  -webkit-transform: rotate(0deg);\n          transform: rotate(0deg);\n  transition: .5s ease-in-out;\n  cursor: pointer; }\n  #nav-icon3 span {\n    display: block;\n    position: absolute;\n    height: 4px;\n    width: 100%;\n    background: #5bc0de;\n    border-radius: 9px;\n    opacity: 1;\n    left: 0;\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n    transition: .25s ease-in-out; }\n    #nav-icon3 span:nth-child(1) {\n      top: 0px; }\n    #nav-icon3 span:nth-child(2), #nav-icon3 span:nth-child(3) {\n      top: 10px; }\n    #nav-icon3 span:nth-child(4) {\n      top: 20px; }\n  #nav-icon3.open {\n    left: 110px;\n    width: 15px;\n    top: 15px;\n    -webkit-transform: rotate(90deg);\n            transform: rotate(90deg); }\n    #nav-icon3.open span {\n      background: #d9534f; }\n      #nav-icon3.open span:nth-child(1), #nav-icon3.open span:nth-child(4) {\n        top: 18px;\n        width: 0%;\n        left: 50%; }\n      #nav-icon3.open span:nth-child(2) {\n        -webkit-transform: rotate(45deg);\n                transform: rotate(45deg); }\n      #nav-icon3.open span:nth-child(3) {\n        -webkit-transform: rotate(-45deg);\n                transform: rotate(-45deg); }\n\napp-position-form {\n  display: block;\n  height: auto;\n  max-height: 500px; }\n\n@media screen and (max-width: 700px) {\n  app-position-form {\n    position: absolute;\n    z-index: 10000;\n    left: 0;\n    padding: 5vw;\n    height: 203px; } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 653:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(13)(false);
// imports


// module
exports.push([module.i, "img {\n  width: 90px; }\n\n.glyphicon.glyphicon-wrench {\n  font-size: 20px;\n  transition: .3s; }\n  .glyphicon.glyphicon-wrench.is-open {\n    color: #fff;\n    -webkit-transform: rotate(180deg);\n            transform: rotate(180deg); }\n  .glyphicon.glyphicon-wrench .a-text {\n    display: none; }\n\n@media (max-width: 767px) {\n  #navbar.collapse {\n    position: absolute;\n    transition: height .3s;\n    display: block !important;\n    overflow: hidden !important;\n    width: 100%;\n    z-index: 10000;\n    background: #222222; }\n  .glyphicon.glyphicon-wrench {\n    color: #fff;\n    font-size: 20px; }\n    .glyphicon.glyphicon-wrench .a-text {\n      display: inline-block;\n      position: relative;\n      bottom: 3px;\n      left: 8px; } }\n\n.nav-item .nav-link {\n  color: white; }\n\n.nav-item:hover {\n  background-color: #080808; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 663:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 205,
	"./af.js": 205,
	"./ar": 212,
	"./ar-dz": 206,
	"./ar-dz.js": 206,
	"./ar-kw": 207,
	"./ar-kw.js": 207,
	"./ar-ly": 208,
	"./ar-ly.js": 208,
	"./ar-ma": 209,
	"./ar-ma.js": 209,
	"./ar-sa": 210,
	"./ar-sa.js": 210,
	"./ar-tn": 211,
	"./ar-tn.js": 211,
	"./ar.js": 212,
	"./az": 213,
	"./az.js": 213,
	"./be": 214,
	"./be.js": 214,
	"./bg": 215,
	"./bg.js": 215,
	"./bn": 216,
	"./bn.js": 216,
	"./bo": 217,
	"./bo.js": 217,
	"./br": 218,
	"./br.js": 218,
	"./bs": 219,
	"./bs.js": 219,
	"./ca": 220,
	"./ca.js": 220,
	"./cs": 221,
	"./cs.js": 221,
	"./cv": 222,
	"./cv.js": 222,
	"./cy": 223,
	"./cy.js": 223,
	"./da": 224,
	"./da.js": 224,
	"./de": 227,
	"./de-at": 225,
	"./de-at.js": 225,
	"./de-ch": 226,
	"./de-ch.js": 226,
	"./de.js": 227,
	"./dv": 228,
	"./dv.js": 228,
	"./el": 229,
	"./el.js": 229,
	"./en-au": 230,
	"./en-au.js": 230,
	"./en-ca": 231,
	"./en-ca.js": 231,
	"./en-gb": 232,
	"./en-gb.js": 232,
	"./en-ie": 233,
	"./en-ie.js": 233,
	"./en-nz": 234,
	"./en-nz.js": 234,
	"./eo": 235,
	"./eo.js": 235,
	"./es": 237,
	"./es-do": 236,
	"./es-do.js": 236,
	"./es.js": 237,
	"./et": 238,
	"./et.js": 238,
	"./eu": 239,
	"./eu.js": 239,
	"./fa": 240,
	"./fa.js": 240,
	"./fi": 241,
	"./fi.js": 241,
	"./fo": 242,
	"./fo.js": 242,
	"./fr": 245,
	"./fr-ca": 243,
	"./fr-ca.js": 243,
	"./fr-ch": 244,
	"./fr-ch.js": 244,
	"./fr.js": 245,
	"./fy": 246,
	"./fy.js": 246,
	"./gd": 247,
	"./gd.js": 247,
	"./gl": 248,
	"./gl.js": 248,
	"./gom-latn": 249,
	"./gom-latn.js": 249,
	"./he": 250,
	"./he.js": 250,
	"./hi": 251,
	"./hi.js": 251,
	"./hr": 252,
	"./hr.js": 252,
	"./hu": 253,
	"./hu.js": 253,
	"./hy-am": 254,
	"./hy-am.js": 254,
	"./id": 255,
	"./id.js": 255,
	"./is": 256,
	"./is.js": 256,
	"./it": 257,
	"./it.js": 257,
	"./ja": 258,
	"./ja.js": 258,
	"./jv": 259,
	"./jv.js": 259,
	"./ka": 260,
	"./ka.js": 260,
	"./kk": 261,
	"./kk.js": 261,
	"./km": 262,
	"./km.js": 262,
	"./kn": 263,
	"./kn.js": 263,
	"./ko": 264,
	"./ko.js": 264,
	"./ky": 265,
	"./ky.js": 265,
	"./lb": 266,
	"./lb.js": 266,
	"./lo": 267,
	"./lo.js": 267,
	"./lt": 268,
	"./lt.js": 268,
	"./lv": 269,
	"./lv.js": 269,
	"./me": 270,
	"./me.js": 270,
	"./mi": 271,
	"./mi.js": 271,
	"./mk": 272,
	"./mk.js": 272,
	"./ml": 273,
	"./ml.js": 273,
	"./mr": 274,
	"./mr.js": 274,
	"./ms": 276,
	"./ms-my": 275,
	"./ms-my.js": 275,
	"./ms.js": 276,
	"./my": 277,
	"./my.js": 277,
	"./nb": 278,
	"./nb.js": 278,
	"./ne": 279,
	"./ne.js": 279,
	"./nl": 281,
	"./nl-be": 280,
	"./nl-be.js": 280,
	"./nl.js": 281,
	"./nn": 282,
	"./nn.js": 282,
	"./pa-in": 283,
	"./pa-in.js": 283,
	"./pl": 284,
	"./pl.js": 284,
	"./pt": 286,
	"./pt-br": 285,
	"./pt-br.js": 285,
	"./pt.js": 286,
	"./ro": 287,
	"./ro.js": 287,
	"./ru": 288,
	"./ru.js": 288,
	"./sd": 289,
	"./sd.js": 289,
	"./se": 290,
	"./se.js": 290,
	"./si": 291,
	"./si.js": 291,
	"./sk": 292,
	"./sk.js": 292,
	"./sl": 293,
	"./sl.js": 293,
	"./sq": 294,
	"./sq.js": 294,
	"./sr": 296,
	"./sr-cyrl": 295,
	"./sr-cyrl.js": 295,
	"./sr.js": 296,
	"./ss": 297,
	"./ss.js": 297,
	"./sv": 298,
	"./sv.js": 298,
	"./sw": 299,
	"./sw.js": 299,
	"./ta": 300,
	"./ta.js": 300,
	"./te": 301,
	"./te.js": 301,
	"./tet": 302,
	"./tet.js": 302,
	"./th": 303,
	"./th.js": 303,
	"./tl-ph": 304,
	"./tl-ph.js": 304,
	"./tlh": 305,
	"./tlh.js": 305,
	"./tr": 306,
	"./tr.js": 306,
	"./tzl": 307,
	"./tzl.js": 307,
	"./tzm": 309,
	"./tzm-latn": 308,
	"./tzm-latn.js": 308,
	"./tzm.js": 309,
	"./uk": 310,
	"./uk.js": 310,
	"./ur": 311,
	"./ur.js": 311,
	"./uz": 313,
	"./uz-latn": 312,
	"./uz-latn.js": 312,
	"./uz.js": 313,
	"./vi": 314,
	"./vi.js": 314,
	"./x-pseudo": 315,
	"./x-pseudo.js": 315,
	"./yo": 316,
	"./yo.js": 316,
	"./zh-cn": 317,
	"./zh-cn.js": 317,
	"./zh-hk": 318,
	"./zh-hk.js": 318,
	"./zh-tw": 319,
	"./zh-tw.js": 319
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 663;


/***/ }),

/***/ 689:
/***/ (function(module, exports) {

module.exports = "<app-navbar></app-navbar>\r\n\r\n<div class=\"page-container\">\r\n  <map-mip></map-mip>\r\n</div>\r\n\r\n"

/***/ }),

/***/ 690:
/***/ (function(module, exports) {

module.exports = "<div #container [style.cursor]=\"markers.getCursorStyle()\" ></div>\r\n"

/***/ }),

/***/ 691:
/***/ (function(module, exports) {

module.exports = "<div #container [style.cursor]=\"markers.getCursorStyle()\"></div>\r\n"

/***/ }),

/***/ 692:
/***/ (function(module, exports) {

module.exports = "<div #container [style.cursor]=\"markers.getCursorStyle()\"></div>\r\n"

/***/ }),

/***/ 693:
/***/ (function(module, exports) {

module.exports = "<div class=\"btn-group picked-group\">\r\n  <button class=\"btn btn-default picked-button\" [class.active]=\"Active\" (click)=\"togglePickedEmitter.emit(!Active)\" type=\"button\" [disabled]=\"disabledAction\" tooltip=\"add marker\" triggers=\"hover\" container=\"body\">\r\n    <img [src]=\"getMarkerUrlByColor(selectedColor)\"/>\r\n  </button>\r\n  <button class=\"btn btn-default glyphicon glyphicon-option-vertical\" (click)=\"smModal.show()\"  tooltip=\"choose icon\" triggers=\"hover\" container=\"body\" type=\"button\"></button>\r\n</div>\r\n\r\n<div bsModal #smModal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\" [config]=\"{backdrop: backdrop}\">\r\n  <div class=\"modal-dialog modal-sm\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <h4 class=\"modal-title pull-left\">Choose icon</h4>\r\n        <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"smModal.hide()\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n        <ul >\r\n          <li *ngFor=\"let icon of markerColors(); let _index = index\" >\r\n            <a\r\n              [class.is-selected]=\"_index == selectedIndex\"\r\n              (click)=\"changeMarkerColor(_index) ;smModal.hide()\">\r\n              <img [src]=\"getMarkerUrlByColor(icon.color)\"/>\r\n            </a>\r\n          </li>\r\n        </ul>\r\n\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ 694:
/***/ (function(module, exports) {

module.exports = "<div class=\"onoffswitch\">\r\n  <input type=\"checkbox\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"myonoffswitch\" [(ngModel)]=\"mapmipService.skipLocationChange\">\r\n  <label class=\"onoffswitch-label\" for=\"myonoffswitch\" tooltip=\"Fixed URL\">\r\n    <span class=\"onoffswitch-inner\"></span>\r\n    <span class=\"onoffswitch-switch\"></span>\r\n  </label>\r\n</div>\r\n"

/***/ }),

/***/ 695:
/***/ (function(module, exports) {

module.exports = "<button class=\"btn btn-danger\" (click)=\"geoJsonModal.show()\" type=\"button\">GeoJson</button>\r\n<div  bsModal #geoJsonModal=\"bs-modal\" class=\"modal fade layers-modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\" (onShow)=\"initializeGeojsonArray()\">\r\n  <div class=\"modal-dialog modal-md\">\r\n\r\n\r\n\r\n\r\n    <form class=\"modal-content\" (submit)=\"submitGeoJson()\">\r\n\r\n\r\n\r\n\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"geoJsonModal.hide()\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n        <h4 class=\"modal-title\">GeoJson</h4>\r\n      </div>\r\n\r\n\r\n\r\n\r\n\r\n\r\n      <div class=\"modal-body\">\r\n        <button class=\"btn btn-default\" type=\"button\" (click)=\"defaultModal.show()\">Add</button>\r\n        <button class=\"glyphicon glyphicon-trash btn btn-danger pull-right\" type=\"button\" [hidden]=\"geojson_array.length == 0\" (click)=\"removeAllLayers()\"></button>\r\n\r\n        <ul class=\"list-group\" *ngIf=\"geojson_array.length > 0\">\r\n\r\n          <li class=\"list-group-item\" *ngFor=\"let geojson_item of geojson_array;let index = index\"\r\n              [class.show-params]=\"geojson_item.expand\"\r\n              tabindex=\"0\">\r\n\r\n            <div class=\"li-row\">\r\n              <span class=\"url\">{{geojson_item}}</span>\r\n              <button class=\"btn btn-info glyphicon glyphicon-pencil\" type=\"button\" (click)=\"editModal(index)\"></button>\r\n              <button class=\"btn btn-danger glyphicon glyphicon-remove-sign\" type=\"button\" (click)=\"removeGeojson(index)\"></button>\r\n            </div>\r\n          </li>\r\n        </ul>\r\n      </div>\r\n\r\n      <div class=\"modal-footer\">\r\n        <button class=\"btn btn-default\" (click)=\"geoJsonModal.hide()\" type=\"button\">Cancel</button>\r\n        <button class=\"btn btn-default\" type=\"submit\">Ok</button>\r\n      </div>\r\n\r\n    </form>\r\n  </div>\r\n</div>\r\n\r\n\r\n<div [config]=\"{backdrop: false}\" bsModal #defaultModal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog modal-sm\">\r\n    <form class=\"modal-content\" (submit)=\"submitAddGeojson(add_geojson.geojson)\">\r\n\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"defaultModal.hide()\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n\r\n      <div class=\"modal-body default-modal-body\">\r\n        <div class=\"form-group\">\r\n\r\n          <label>GeoJson URL: </label>\r\n\r\n          <input class=\"form-control\" [(ngModel)]=\"add_geojson.geojson\" [ngModelOptions]=\"{standalone: true}\"/>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"modal-footer\">\r\n        <div class=\"btn-group\" dropdown dropdown-append-to-body>\r\n          <button id=\"btn-append-to-body\" type=\"button\" class=\"btn btn-primary\" dropdownToggle>\r\n            Examples <span class=\"caret\"></span>\r\n          </button>\r\n          <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"btn-append-to-body\">\r\n            <li *ngFor=\"let example of examples$ | async\">\r\n              <a class=\"dropdown-item\" (click)=\"addGeojsonExample(example.url)\">{{example.name}}</a>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n        <span class=\"glyphicon glyphicon-exclamation-sign pull-left\"   tooltipClass=\"url-tooltip\"></span>\r\n        <button class=\"btn btn-default\" (click)=\"defaultModal.hide()\" type=\"button\">Cancel</button>\r\n        <button class=\"btn btn-default\" type=\"submit\">{{add_geojson.onEdit() ? 'Save' : 'Add'}}</button>\r\n      </div>\r\n\r\n    </form>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ 696:
/***/ (function(module, exports) {

module.exports = "<button class=\"btn btn-primary layer-btn\" (click)=\"layersModal.show()\" type=\"button\">Layers</button>\r\n<app-switch-layers [(layersArray)]=\"layersArray\" (submitLayersEmitter)=\"submitLayers()\"></app-switch-layers>\r\n\r\n<div  bsModal #layersModal=\"bs-modal\" class=\"modal fade layers-modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" (onShow)=\"initLayersArray()\" (keypress)=\"onKeyPress($event)\" aria-hidden=\"true\">\r\n  <div class=\"modal-dialog modal-md\">\r\n    <form class=\"modal-content\" (ngSubmit)=\"submitLayers()\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"layersModal.hide()\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n        <h4 class=\"modal-title\">Layers</h4>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n\r\n        <div class=\"body-header\">\r\n\r\n          <button class=\"btn btn-default mapbox-btn\" type=\"button\" (click)=\"mapboxModal.show()\">\r\n            <img src=\"http://2rct3i2488gxf9jvb1lqhek9-wpengine.netdna-ssl.com/wp-content/uploads/2016/06/mapbox-logo-256.png\"/>\r\n          </button>\r\n\r\n          <button class=\"btn btn-default mapbox-btn\" type=\"button\" (click)=\"osmModal.show()\">\r\n            <img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/256px-Openstreetmap_logo.svg.png\"/>\r\n          </button>\r\n\r\n          <button class=\"btn btn-default\" type=\"button\" (click)=\"tmsModal.show()\">\r\n            TMS\r\n            <img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/GDALLogoColor.svg/150px-GDALLogoColor.svg.png\"/>\r\n          </button>\r\n\r\n\r\n\r\n          <button class=\"btn btn-default mapbox-btn\" type=\"button\" (click)=\"bingModal.show()\">\r\n            <img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Bing_logo_(2013).svg/2000px-Bing_logo_(2013).svg.png\"/>\r\n          </button>\r\n\r\n          <button class=\"btn btn-default\" type=\"button\" (click)=\"defaultModal.show()\">\r\n            Default\r\n          </button>\r\n        </div>\r\n\r\n        <div class=\"remove-all-btn-area\">\r\n          <button class=\"glyphicon glyphicon-trash btn btn-danger\" type=\"button\" [hidden]=\"layersArray.length == 0\" (click)=\"removeAllLayers()\"></button>\r\n        </div>\r\n\r\n        <ul class=\"list-group\" *ngIf=\"layersArray.length > 0\">\r\n          <li class=\"list-group-item\" *ngFor=\"let layer_item of layersArray | reverse; let i = index\"\r\n              [class.show-params]=\"layer_item.expand\"\r\n              [appDragItem]=\"[layersArray.length - 1 - i , layersArray]\"\r\n              (onEnter)=\"submitLayers()\"\r\n              tabindex=\"0\">\r\n\r\n            <div class=\"li-row\">\r\n              <img *ngIf=\"source_images[layer_item.layer_obj.source]\" [src]=\"source_images[layer_item.layer_obj.source]\"/>\r\n              <!--<button class=\"btn btn-default glyphicon glyphicon-chevron-right\" type=\"button\" (click)=\"expandParams(layer_item)\" [disabled]=\"Object.keys(layer_item.layer_obj).length < 2\"></button>-->\r\n              <span class=\"url\">{{layer_item.layer_obj.url}}</span>\r\n              <button class=\"btn btn-info glyphicon glyphicon-pencil\" type=\"button\" (click)=\"editModal(layer_item, layersArray.length - 1 - i)\"></button>\r\n              <button class=\"btn btn-danger glyphicon glyphicon-remove-sign\" type=\"button\" (click)=\"removeTms(layersArray.length - 1 - i)\"></button>\r\n            </div>\r\n\r\n\r\n\r\n            <!--<div class=\"params\">-->\r\n              <!--<table class=\"table table-bordered\">-->\r\n                <!--<tbody>-->\r\n                <!--<template ngFor let-key [ngForOf]=\"Object.keys(layer_item.layer_obj)\">-->\r\n                  <!--<tr *ngIf=\"key != 'url' && key != 'source'\">-->\r\n                    <!--<th>{{key}}</th>-->\r\n                    <!--<td>{{layer_item.layer_obj[key]}}</td>-->\r\n                  <!--</tr>-->\r\n                <!--</template>-->\r\n                <!--</tbody>-->\r\n              <!--</table>-->\r\n            <!--</div>-->\r\n          </li>\r\n        </ul>\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n\r\n        <div class=\"btn-group\" dropdown dropdown-append-to-body>\r\n          <button id=\"btn-append-to-body\" type=\"button\" class=\"btn btn-primary\" dropdownToggle>\r\n            Examples <span class=\"caret\"></span>\r\n          </button>\r\n          <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"btn-append-to-body\">\r\n            <li *ngFor=\"let example of examples$ | async\">\r\n              <a class=\"dropdown-item\" (click)=\"layersArray.push({layer_obj:example.layer_obj})\">{{example.name}}</a>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n\r\n        <button class=\"btn btn-default\" (click)=\"layersModal.hide()\" type=\"button\">Cancel</button>\r\n        <button class=\"btn btn-default\" [disabled]=\"!canApply()\" (click)=\"initLayersArray()\" type=\"button\">Restore</button>\r\n        <button class=\"btn btn-default\" [disabled]=\"!canApply()\" type=\"submit\">Apply</button>\r\n        <button class=\"btn btn-default\" (click)=\"submitLayers(true)\" type=\"button\">Ok</button>\r\n      </div>\r\n    </form>\r\n  </div>\r\n</div>\r\n\r\n\r\n<!--<div [config]=\"{backdrop: false}\" bsModal #addModal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\" (onHide)=\"addObject.edit_index = -1;addObject.layer_obj = {}\">-->\r\n  <!--<div class=\"modal-dialog modal-sm add-tms\">-->\r\n    <!--<form class=\"modal-content\" (ngSubmit)=\"submitAddLayer(addObject.layer_obj)\">-->\r\n      <!--<div class=\"modal-header\">-->\r\n        <!--<button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"addModal.hide()\">-->\r\n          <!--<span aria-hidden=\"true\">&times;</span>-->\r\n        <!--</button>-->\r\n        <!--<h4 class=\"modal-title\">{{addObject.on_edit() ? 'Edit' : 'Add'}} Layer</h4>-->\r\n      <!--</div>-->\r\n      <!--<div class=\"modal-body\">-->\r\n        <!--<div class=\"form-group url-group\">-->\r\n          <!--<label>url:</label>-->\r\n          <!--<input class=\"form-control\" [(ngModel)]=\"addObject.layer_obj.url\" [ngModelOptions]=\"{standalone: true}\">-->\r\n          <!--<button class=\"btn btn-default glyphicon glyphicon-plus-sign tms-btn\" (click)=\"addQueryModal.show()\" type=\"button\"></button>-->\r\n        <!--</div>-->\r\n        <!--<ul class=\"list-group\">-->\r\n          <!--<div *ngFor=\"let key of Object.keys(addObject.layer_obj)\">-->\r\n            <!--<li class=\"list-group-item query-item\" *ngIf=\"key != 'url'\">-->\r\n              <!--<span>{{key}}: {{addObject.layer_obj[key]}}</span>-->\r\n              <!--<button class=\"btn btn-info glyphicon glyphicon-pencil\" (click)=\"editQuery({key: key, val: addObject.layer_obj[key]})\" type=\"button\"></button>-->\r\n              <!--<button class=\"btn btn-danger glyphicon glyphicon-remove-sign\" (click)=\"deleteKey(addObject.layer_obj, key)\" type=\"button\"></button>-->\r\n            <!--</li>-->\r\n          <!--</div>-->\r\n        <!--</ul>-->\r\n      <!--</div>-->\r\n\r\n      <!--<div class=\"modal-footer\">-->\r\n        <!--<button class=\"btn btn-default\" (click)=\"addModal.hide()\" type=\"button\">Cancel</button>-->\r\n        <!--<button class=\"btn btn-default\" type=\"submit\">{{addObject.on_edit() ? 'Save' : 'Add'}}</button>-->\r\n      <!--</div>-->\r\n\r\n    <!--</form>-->\r\n\r\n  <!--</div>-->\r\n<!--</div>-->\r\n\r\n<div [config]=\"{backdrop: false}\" bsModal #mapboxModal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\" (onHide)=\"addObject.mapbox.init()\">\r\n  <div class=\"modal-dialog modal-sm\">\r\n    <form class=\"modal-content\" (submit)=\"submitAddLayer(addObject.mapbox.obj)\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"mapboxModal.hide()\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n        <div class=\"form-group\">\r\n          <label>Url:</label>\r\n          <input class=\"form-control\" [(ngModel)]=\"addObject.mapbox.obj.url\" [ngModelOptions]=\"{standalone: true}\"/>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <div class=\"checkbox\">\r\n            <label><input type=\"checkbox\" value=\"\" [(ngModel)]=\"addObject.mapbox.required.mapid\"[ngModelOptions]=\"{standalone: true}\"><b>MapId:</b></label>\r\n          </div>\r\n          <input class=\"form-control\"  [disabled]=\"!addObject.mapbox.required.mapid\" [(ngModel)]=\"addObject.mapbox.obj.mapid\" class=\"form-control\" [ngModelOptions]=\"{standalone: true}\"/>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <div class=\"checkbox\">\r\n            <label><input type=\"checkbox\" value=\"\" [(ngModel)]=\"addObject.mapbox.required.access_token\"[ngModelOptions]=\"{standalone: true}\"><b>AccessToken:</b></label>\r\n          </div>\r\n          <input class=\"form-control\" [disabled]=\"!addObject.mapbox.required.access_token\" [(ngModel)]=\"addObject.mapbox.obj.access_token\" class=\"form-control\" [ngModelOptions]=\"{standalone: true}\"/>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <div class=\"checkbox\">\r\n            <label><input type=\"checkbox\" value=\"\" [(ngModel)]=\"addObject.mapbox.required.format\"[ngModelOptions]=\"{standalone: true}\"><b>Format:</b></label>\r\n          </div>\r\n          <input class=\"form-control\" [disabled]=\"!addObject.mapbox.required.format\" [(ngModel)]=\"addObject.mapbox.obj.format\" class=\"form-control\" [ngModelOptions]=\"{standalone: true}\"/>\r\n        </div>\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button class=\"btn btn-default\" (click)=\"mapboxModal.hide()\" type=\"button\">Cancel</button>\r\n        <button class=\"btn btn-default\" type=\"submit\">{{addObject.mapbox.onEdit() ? 'Save' : 'Add'}}</button>\r\n      </div>\r\n\r\n    </form>\r\n  </div>\r\n</div>\r\n\r\n\r\n<div [config]=\"{backdrop: false}\" bsModal #osmModal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\" (onHide)=\"addObject.openstreetmap.init()\">\r\n  <div class=\"modal-dialog modal-sm\">\r\n    <form class=\"modal-content\" (submit)=\"submitAddLayer(addObject.openstreetmap.obj)\">\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"osmModal.hide()\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n\r\n        <div class=\"form-group\">\r\n          <label>Url:</label>\r\n          <input class=\"form-control\" [(ngModel)]=\"addObject.openstreetmap.obj.url\" [ngModelOptions]=\"{standalone: true}\"/>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <div class=\"checkbox\">\r\n            <label><input type=\"checkbox\" value=\"\" [(ngModel)]=\"addObject.openstreetmap.required.format\"[ngModelOptions]=\"{standalone: true}\"><b>Format:</b></label>\r\n          </div>\r\n          <input class=\"form-control\" [disabled]=\"!addObject.openstreetmap.required.format\" [(ngModel)]=\"addObject.openstreetmap.obj.format\" class=\"form-control\" [ngModelOptions]=\"{standalone: true}\"/>\r\n        </div>\r\n\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button class=\"btn btn-default\" (click)=\"osmModal.hide()\" type=\"button\">Cancel</button>\r\n        <button class=\"btn btn-default\" type=\"submit\">Add</button>\r\n      </div>\r\n\r\n    </form>\r\n  </div>\r\n</div>\r\n\r\n\r\n\r\n\r\n\r\n<div [config]=\"{backdrop: false}\" bsModal #tmsModal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\" (onHide)=\"addObject.tms.init()\">\r\n  <div class=\"modal-dialog modal-sm\">\r\n    <form class=\"modal-content\" (submit)=\"submitAddLayer(addObject.tms.obj)\">\r\n\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"tmsModal.hide()\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n\r\n      <div class=\"modal-body\">\r\n        <div class=\"form-group\">\r\n          <label>Url:</label>\r\n          <input class=\"form-control\" [(ngModel)]=\"addObject.tms.obj.url\" [ngModelOptions]=\"{standalone: true}\"/>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <div class=\"checkbox\">\r\n            <label><input type=\"checkbox\" value=\"\" [(ngModel)]=\"addObject.tms.required.format\"[ngModelOptions]=\"{standalone: true}\"><b>Format:</b></label>\r\n          </div>\r\n          <input class=\"form-control\" [disabled]=\"!addObject.tms.required.format\" [(ngModel)]=\"addObject.tms.obj.format\" class=\"form-control\" [ngModelOptions]=\"{standalone: true}\"/>\r\n        </div>\r\n\r\n      </div>\r\n\r\n      <div class=\"modal-footer\">\r\n        <button class=\"btn btn-default\" (click)=\"tmsModal.hide()\" type=\"button\">Cancel</button>\r\n        <button class=\"btn btn-default\" type=\"submit\">{{addObject.tms.onEdit() ? 'Save' : 'Add'}}</button>\r\n      </div>\r\n\r\n    </form>\r\n  </div>\r\n</div>\r\n\r\n\r\n\r\n\r\n<div [config]=\"{backdrop: false}\" bsModal #bingModal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\" (onHide)=\"addObject.bing.init()\">\r\n  <div class=\"modal-dialog modal-sm\">\r\n    <form class=\"modal-content\" (submit)=\"submitAddLayer(addObject.bing.obj)\">\r\n\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"bingModal.hide()\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n\r\n      <div class=\"modal-body\">\r\n\r\n        <div class=\"form-group\">\r\n          <label>Url:</label>\r\n          <input class=\"form-control\" [(ngModel)]=\"addObject.bing.obj.url\" [ngModelOptions]=\"{standalone: true}\"/>\r\n        </div>\r\n\r\n        <div class=\"form-group\">\r\n          <label>Key:</label>\r\n          <input class=\"form-control\" [(ngModel)]=\"addObject.bing.obj.key\" [ngModelOptions]=\"{standalone: true}\"/>\r\n        </div>\r\n\r\n        <div class=\"form-group\" dropdown dropdown-append-to-body2>\r\n          <label>Style:</label>\r\n          <input readonly class=\"form-control\" [(ngModel)]=\"addObject.bing.obj.style\" dropdownToggle [ngModelOptions]=\"{standalone: true}\"/>\r\n\r\n          <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"btn-append-to-body\">\r\n            <li *ngFor=\"let style_key of addObject.bing.styles\">\r\n              <a class=\"dropdown-item\" (click)=\"addObject.bing.obj.style = style_key\">{{style_key}}</a>\r\n            </li>\r\n          </ul>\r\n\r\n        </div>\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button class=\"btn btn-default\" (click)=\"bingModal.hide()\" type=\"button\">Cancel</button>\r\n        <button class=\"btn btn-default\" type=\"submit\">{{addObject.bing.onEdit() ? 'Save' : 'Add'}}</button>\r\n      </div>\r\n\r\n    </form>\r\n  </div>\r\n</div>\r\n\r\n\r\n\r\n<div [config]=\"{backdrop: false}\" bsModal #defaultModal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\" (onHide)=\"addObject.default.init()\">\r\n  <div class=\"modal-dialog modal-sm\">\r\n    <form class=\"modal-content\" (submit)=\"submitAddLayer(addObject.default.obj)\">\r\n\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"defaultModal.hide()\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n\r\n        <div class=\"form-group\">\r\n          <button class=\"btn btn-default glyphicon glyphicon-plus-sign tms-btn\" type=\"button\" (click)=\"addQueryModal.show()\"></button>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"modal-body default-modal-body\">\r\n        <template  ngFor let-key [ngForOf]=\"Object.keys(addObject.default.obj)\">\r\n          <div class=\"form-group\">\r\n            <button *ngIf=\"key != 'url'\" class=\"glyphicon glyphicon-remove\" (click)=\"deleteKey(addObject.default.obj, key)\"></button>\r\n            <label>{{key}}</label>\r\n\r\n            <input class=\"form-control\" [(ngModel)]=\"addObject.default.obj[key]\" [ngModelOptions]=\"{standalone: true}\"/>\r\n          </div>\r\n        </template>\r\n      </div>\r\n\r\n      <div class=\"modal-footer\">\r\n        <span class=\"glyphicon glyphicon-exclamation-sign pull-left\" [tooltip]=\"queryParamsHelperService.layerObjecttToUrl(addObject.default.obj)\" tooltipClass=\"url-tooltip\"></span>\r\n        <button class=\"btn btn-default\" (click)=\"defaultModal.hide()\" type=\"button\">Cancel</button>\r\n        <button class=\"btn btn-default\" type=\"submit\">{{addObject.default.onEdit() ? 'Save' : 'Add'}}</button>\r\n      </div>\r\n\r\n    </form>\r\n  </div>\r\n</div>\r\n\r\n\r\n<div [config]=\"{backdrop: false}\" bsModal #addQueryModal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\" (onHide)=\"input_key.value = ''\">\r\n  <div class=\"modal-dialog modal-sm\">\r\n    <form class=\"modal-content\" (submit)=\"input_key.value ? addObject.default.obj[input_key.value] = '' : false ; addQueryModal.hide();\">\r\n\r\n      <div class=\"modal-body add-query\">\r\n        <div class=\"form-group\">\r\n          <label>Key</label>\r\n          <div class=\"add-query-control\">\r\n            <input class=\"form-control\" #input_key/>\r\n            <button class=\"btn btn-default glyphicon glyphicon-ok\" type=\"submit\"></button>\r\n            <button class=\"btn btn-default glyphicon glyphicon-remove\" type=\"button\" (click)=\"addQueryModal.hide()\"></button>\r\n          </div>\r\n        </div>\r\n      </div>\r\n\r\n    </form>\r\n  </div>\r\n</div>\r\n\r\n"

/***/ }),

/***/ 697:
/***/ (function(module, exports) {

module.exports = "<div role=\"alert\" class=\"alert alert-warning layers-alert\" *ngIf=\"alert\" [@fadeInOut]>\r\n  <strong class=\"fa fa-keyboard-o\"></strong> Press space to switch between layers.\r\n</div>\r\n\r\n<button class=\"btn btn-default glyphicon glyphicon-retweet switch-layer-btn\" type=\"button\" [class.selected]=\"active\" #switch_btn (click)=\"toggleSwitchBtn(switch_btn)\"  tooltip=\"switch layer\" triggers=\"hover\"></button>\r\n\r\n"

/***/ }),

/***/ 698:
/***/ (function(module, exports) {

module.exports = "<div class=\"pull-left\" id=\"light\">\r\n  <button class=\"btn btn-default glyphicon glyphicon-adjust\" [class.active]=\"lighting_value == 1\" (click)=\"toggleLight()\" type=\"button\" tooltip=\"Lighting\" triggers=\"hover\"></button>\r\n</div>\r\n\r\n<!-- [style.color]=\" opposite from the selected \"-->\r\n"

/***/ }),

/***/ 699:
/***/ (function(module, exports) {

module.exports = "<!--(mouseleave)=\"mouseDown = false\" (mouseenter)=\"mouseDown = false\"-->\r\n\r\n<template #popTemplate>\r\n  <div (clickOutside)=\"pop.hide()\" exclude=\"button#position_pop\">\r\n    <div class=\"popView\" (window:resize)=\"onResize($event)\" [ngStyle]=\"popViewStyle\" #popView>\r\n      <div class=\"drag\" #drag (window:mouseup)=\"mouseUp($event)\" (window:mousemove)=\"onMouseMove($event)\" (mousedown)=\"onMouseDown($event)\" [ngStyle]=\"dragStyle\">\r\n      </div>\r\n    </div>\r\n    <button type=\"button\" class=\"btn btn-warning glyphicon glyphicon-screenshot\" (click)=\"centerPosition()\"></button>\r\n  </div>\r\n</template>\r\n\r\n<button type=\"button\" class=\"btn btn-warning\"\r\n        placement=\"bottom\"\r\n        id=\"position_pop\"\r\n        #pop=\"bs-popover\"\r\n        [popover]=\"popTemplate\" popoverTitle=\"Map Position\">\r\n  Position\r\n</button>\r\n"

/***/ }),

/***/ 700:
/***/ (function(module, exports) {

module.exports = "\r\n\r\n<template #popTemplate>\r\n  <div style=\"width: 200px\" (clickOutside)=\"pop.hide()\" exclude=\"#pop\">\r\n     width: {{sizeArr[0]}}%\r\n    <input type=\"range\" [(ngModel)]=\"sizeArr[0]\" (ngModelChange)=\"onSizeChange()\" name=\"points\" min=\"0\" max=\"100\">\r\n     height: {{sizeArr[1]}}%\r\n    <input type=\"range\" [(ngModel)]=\"sizeArr[1]\" (ngModelChange)=\"onSizeChange()\" name=\"points\" min=\"0\" max=\"100\">\r\n\r\n  </div>\r\n</template>\r\n\r\n<button type=\"button\" class=\"btn btn-success\"\r\n        placement=\"bottom\"\r\n        id=\"pop\"\r\n        #pop=\"bs-popover\"\r\n        [popover]=\"popTemplate\" popoverTitle=\"Map size\">\r\n  Size\r\n</button>\r\n"

/***/ }),

/***/ 701:
/***/ (function(module, exports) {

module.exports = "  <!--<button md-raised-button color=\"primary\" class=\"pull-left\" (click)=\"smModal.show()\" type=\"button\">Markers</button>-->\r\n\r\n<button class=\"btn btn-primary pull-left\" (click)=\"smModal.show()\" type=\"button\">Markers</button>\r\n\r\n<div class=\"pull-left\">\r\n  <button class=\"btn btn-default glyphicon glyphicon-record center-btn\" [style.color]=\"positionFormService.getSelectedColorHEX()\" (click)=\"markerCenter()\" type=\"button\" tooltip=\"add centered marker\" triggers=\"hover\"></button>\r\n  <app-color-picker (togglePickedEmitter)=\"togglePicked($event)\" [Active]=\"positionFormService.onPicked\" [(selectedIndex)]=\"positionFormService.selectedColorIndex\" ></app-color-picker>\r\n</div>\r\n\r\n<div [config]=\"{backdrop: false}\" bsModal #smModal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\" (onShow)=\"cloneEditedMarkers()\">\r\n  <div class=\"modal-dialog modal-md\">\r\n    <form class=\"modal-content\" (submit)=\"submitMarkers(true)\">\r\n\r\n      <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"smModal.hide()\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n        <h4 class=\"modal-title\">Markers</h4>\r\n      </div>\r\n\r\n      <div class=\"modal-body\">\r\n        <button class=\"btn btn-primary top-button\" type=\"button\" (click)=\"addModal.show()\">Add</button>\r\n        <button class=\"glyphicon glyphicon-trash btn btn-danger pull-right top-button\" type=\"button\" [hidden]=\"edited_markers_array.length == 0\" (click)=\"removeAllMarkers()\"></button>\r\n\r\n        <ul class=\"list-group\" *ngIf=\"edited_markers_array.length > 0\">\r\n          <li class=\"list-group-item\" *ngFor=\"let marker of edited_markers_array; let i = index\" >\r\n\r\n            <div class=\"li-row\">\r\n              <img src=\"/assets/Markers/marker-icon-{{positionFormService.getSelectedColor(marker.colorIndex)}}.png\">\r\n              <span class=\"position\">{{marker.position}}</span>\r\n              <button class=\"btn btn-info glyphicon glyphicon-pencil\" type=\"button\" (click)=\"editMarker(i)\"></button>\r\n              <button class=\"btn btn-danger glyphicon glyphicon-remove-sign\" type=\"button\" (click)=\"rmvMarker(i)\"></button>\r\n            </div>\r\n          </li>\r\n        </ul>\r\n      </div>\r\n\r\n      <div class=\"modal-footer\">\r\n        <button class=\"btn btn-default\" (click)=\"smModal.hide()\" type=\"button\">Cancel</button>\r\n        <button class=\"btn btn-default\" [disabled]=\"!canApply()\" (click)=\"submitMarkers()\" type=\"button\">Apply</button>\r\n        <button class=\"btn btn-default\" type=\"submit\">Ok</button>\r\n      </div>\r\n\r\n    </form>\r\n  </div>\r\n</div>\r\n\r\n\r\n<div [config]=\"{backdrop: false}\" bsModal #addModal=\"bs-modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\" aria-hidden=\"true\" (onHide)=\"edit_obj.init()\">\r\n  <div class=\"modal-dialog modal-sm\">\r\n    <form class=\"modal-content\" (submit)=\"submitAddMarkers(edit_obj.marker)\">\r\n      <div class=\"modal-header\">\r\n        <h4 class=\"modal-title\">{{edit_obj.onEdit() ? 'Edit' : 'Add'}} Marker</h4>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n        <div class=\"form-group\">\r\n          <div class=\"input-and-picker\">\r\n            <input class=\"form-control text-center\" [(ngModel)]=\"edit_obj.marker.position\" [ngModelOptions]=\"{standalone: true}\" [style.border-color]=\"edit_obj.marker.position && !markerStrRegex(edit_obj.marker.position) ? 'red' : '#66afe9'\">\r\n            <app-color-picker [(selectedIndex)]=\"edit_obj.marker.colorIndex\" ></app-color-picker>\r\n          </div>\r\n          <h6 class=\"modal-subtitle text-info text-center\">Number,Number,(Number)</h6>\r\n        </div>\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button class=\"btn btn-default\" (click)=\"addModal.hide()\" type=\"button\">Cancel</button>\r\n        <button class=\"btn btn-default\" [disabled]=\"!markerStrRegex(edit_obj.marker.position)\" type=\"submit\">{{edit_obj.onEdit() ? 'Save' : 'Add'}}</button>\r\n      </div>\r\n\r\n    </form>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ 702:
/***/ (function(module, exports) {

module.exports = "<p>\r\n  <a target=\"_blank\" href=\"http://mapmip.webiks.com{{router.url}}\" class=\"glyphicon glyphicon-share\" tooltip=\"open in new tab\" container = \"body\" ></a>\r\n</p>\r\n"

/***/ }),

/***/ 703:
/***/ (function(module, exports) {

module.exports = "<div class=\"blackscreen\" (click)=\"close()\"></div>\r\n<div class=\"panel panel-default\">\r\n  <div class=\"panel-heading\">\r\n    Tools&nbsp;<span class=\"glyphicon glyphicon-wrench\"></span>\r\n    <button aria-label=\"Close\" class=\"close\" type=\"button\" (click)=\"close()\">\r\n      <span aria-hidden=\"true\">×</span>\r\n    </button>\r\n  </div>\r\n\r\n  <div class=\"panel-body\">\r\n\r\n    <div class=\"pos-container\">\r\n      <form class=\"row\" (submit)=\"submitForm()\">\r\n        <template ngFor let-key [ngForOf]=\"keys(params)\">\r\n\r\n          <div class=\"group-div\" *ngIf=\"havePermission(params[key])\">\r\n\r\n\r\n\r\n\r\n            <div class=\"form-group input_type\" *ngIf=\"!params[key].input_type\">\r\n\r\n              <md-input-container color=\"primary\">\r\n                <input mdInput placeholder=\"{{key}}\" [(ngModel)]=\"params[key].val\" [ngModelOptions]=\"{standalone: true}\">\r\n              </md-input-container>\r\n\r\n\r\n              <!--<div class=\"input-group\">-->\r\n              <!--<span class=\"input-group-addon\">{{key}}</span>-->\r\n              <!--<input type=\"text\" class=\"form-control\" [(ngModel)]=\"params[key].val\" name=\"{{key}}\" placeholder=\"{{key}}\">-->\r\n              <!--</div>-->\r\n            </div>\r\n\r\n            <div class=\"form-group markers-group\" *ngIf=\"params[key].input_type == 'app-markers'\">\r\n              <app-markers [lat]=\"params.lat.val\" [lng]=\"params.lng.val\" (submitMarkersEmitter)=\"submitMarkers($event)\"></app-markers>\r\n            </div>\r\n\r\n            <div class=\"form-group layers-group\" *ngIf=\"params[key].input_type == 'app-layers'\">\r\n              <app-layers [layersString]=\"params.layers.val\" (submitLayersEmitter)=\"submitLayers($event)\"></app-layers>\r\n            </div>\r\n\r\n            <div class=\"form-group size-group\" *ngIf=\"params[key].input_type == 'app-map-size'\">\r\n              <app-map-size (submitSizeEmitter)=\"submitForm()\" [(size)]=\"params.size.val\"></app-map-size>\r\n            </div>\r\n\r\n            <div class=\"form-group position-group\" *ngIf=\"params[key].input_type == 'app-map-position'\">\r\n              <app-map-position [size]=\"params.size.val\" (submitPositionEmitter)=\"submitForm()\" [(position)]=\"params.position.val\"></app-map-position>\r\n            </div>\r\n\r\n            <div class=\"form-group terrain-group\" *ngIf=\"params[key].input_type == 'app-terrain'\">\r\n              <app-terrain (submitTerrainEmitter)=\"submitForm()\" [(terrain)]=\"params.terrain.val\"></app-terrain>\r\n            </div>\r\n\r\n            <div class=\"form-group layers-group\" *ngIf=\"params[key].input_type == 'app-geojson-layer'\">\r\n              <app-geojson-layer [geojson]=\"params.geojson.val\" (submitGeoJsonEmitter)=\"submitGeojsons($event)\"></app-geojson-layer>\r\n            </div>\r\n\r\n            <div class=\"form-group lighting-group\" *ngIf=\"params[key].input_type == 'app-map-lighting'\">\r\n              <app-map-lighting [lighting]=\"params.lighting.val\"></app-map-lighting>\r\n            </div>\r\n\r\n\r\n            <div class=\"form-group b-switch\" *ngIf=\"params[key].input_type == 'Bswitch'\">\r\n              <bSwitch [switch-label-text]=\"key\" [(ngModel)]=\"params[key].val\" name=\"{{key}}\" (ngModelChange)=\"submitForm()\"></bSwitch>\r\n            </div>\r\n\r\n          </div>\r\n\r\n        </template>\r\n\r\n        <div class=\"group-div\">\r\n          <app-flip-switch [state]=\"mapMipService.skipLocationChange\"></app-flip-switch>\r\n        </div>\r\n\r\n        <button type=\"submit\" style=\"display: none\"></button>\r\n        <div class=\"form-group submit\">\r\n          <button type=\"button\" class=\"btn btn-info submit-mobile\" (click)=\"submitForm();close()\">Submit</button>\r\n        </div>\r\n      </form>\r\n\r\n    </div>\r\n\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ 704:
/***/ (function(module, exports) {

module.exports = "<template #popTemplate>\r\n  <form (clickOutside)=\"pop.hide()\" exclude=\"button#terrain_pop\" (submit)=\"submitTerrain(pop)\">\r\n    <div class=\"popView\" class=\"popover-terrain\">\r\n      <input #input type=\"text\" class=\"form-control\" [(ngModel)]=\"terrainUrl\"  [ngModelOptions]=\"{standalone: true}\">\r\n    </div>\r\n    <div class=\"control-buttons pull-right\">\r\n      <div class=\"btn-group\" dropdown dropdown-append-to-body>\r\n        <button id=\"btn-append-to-body\" type=\"button\" class=\"btn btn-primary\" dropdownToggle >\r\n          Examples <span class=\"caret\"></span>\r\n        </button>\r\n        <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"btn-append-to-body\">\r\n          <li *ngFor=\"let example of examples$ | async\">\r\n            <a class=\"dropdown-item\" (click)=\"terrainUrl=example.url\">{{example.name}}</a>\r\n          </li>\r\n        </ul>\r\n      </div>\r\n      <button type=\"button\" class=\"btn btn-danger\" (click)=\"pop.hide()\">Cancel</button>\r\n      <button type=\"submit\" class=\"btn btn-info\">OK</button>\r\n    </div>\r\n  </form>\r\n</template>\r\n\r\n<button type=\"button\" class=\"btn btn-info\"\r\n        placement=\"bottom\"\r\n        id=\"terrain_pop\"\r\n        #pop=\"bs-popover\"\r\n        (onShown)=\"onShownPopover()\"\r\n        [popover]=\"popTemplate\" popoverTitle=\"Map Terrain\">\r\n  Terrain\r\n</button>\r\n\r\n\r\n\r\n<!--\r\n(click)=\"layersArray.push({layer_obj:example.layer_obj})\"-->\r\n"

/***/ }),

/***/ 705:
/***/ (function(module, exports) {

module.exports = "<app-position-form *ngIf=\"!hideComponent\"></app-position-form>\r\n\r\n<div class=\"map-layer\">\r\n  <div class=\"mapsCont\" #mapsCont>\r\n    <app-new-tab></app-new-tab>\r\n    <router-outlet></router-outlet>\r\n  </div>\r\n</div>\r\n\r\n\r\n"

/***/ }),

/***/ 706:
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-inverse\">\r\n  <div class=\"container-fluid\">\r\n\r\n    <div class=\"navbar-header\">\r\n      <button type=\"button\" class=\"navbar-toggle collapsed\" (click)=\"isCollapsed = !isCollapsed;mapMipService.togglePositionForm(true)\" >\r\n        <span class=\"sr-only\">Toggle navigation</span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n      </button>\r\n      <a class=\"navbar-brand\">MapMip</a>\r\n    </div>\r\n    <div id=\"navbar\"\r\n         class=\"navbar-collapse\"\r\n         aria-expanded=\"false\"\r\n         [collapse]=\"isCollapsed\"\r\n         (collapsed)=\"setHeight(el, 0)\"\r\n         (expanded)=\"setHeight(el, 0);setHeight(el, el.scrollHeight)\" #el>\r\n\r\n      <ul class=\"nav navbar-nav\">\r\n\r\n        <li class=\"nav-item\" [class.active]=\"mapMipService.isActive('cesium')\">\r\n          <a class=\"nav-link\" (click)=\"mapMipService.goTo(CESIUM_PATH);isCollapsed = true\">\r\n            <img src=\"https://cesiumjs.org/images/logos/cesium-white.png\"/>\r\n          </a>\r\n        </li>\r\n\r\n        <li class=\"nav-item\"  [class.active]=\"mapMipService.isActive('leaflet')\">\r\n          <a class=\"nav-link\"  (click)=\"mapMipService.goTo(LEAFLET_PATH);isCollapsed = true\">\r\n            <img src=\"http://leafletjs.com/docs/images/logo.png\"/>\r\n          </a>\r\n        </li>\r\n\r\n        <li class=\"nav-item\"  [class.active]=\"mapMipService.isActive('openlayers')\">\r\n          <a class=\"nav-link\" (click)=\"mapMipService.goTo(OPENLAYERS_PATH);isCollapsed = true\">\r\n            <img style=\"width: 24px;height: 24px\" src=\"https://openlayers.org/assets/theme/img/logo70.png\">&nbsp;OpenLayers\r\n          </a>\r\n        </li>\r\n\r\n      </ul>\r\n\r\n\r\n      <ul class=\"nav navbar-nav navbar-right\">\r\n        <li><a class=\"glyphicon glyphicon-wrench\" [class.is-open]=\"!mapMipService.positionFormHidden()\" (click)=\"togglePositionForm()\"><span class=\"a-text\">Tools</span></a></li>\r\n      </ul>\r\n\r\n    </div>\r\n  </div>\r\n</nav>\r\n"

/***/ }),

/***/ 82:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_position_form_position_form_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_map_mip_service__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapLayerComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return animations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return host; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MapLayerComponent = (function () {
    function MapLayerComponent(positionFormService, mapMipService) {
        this.positionFormService = positionFormService;
        this.mapMipService = mapMipService;
        this.height = "100%";
        this.width = "100%";
        this.display = "block";
        this.position = "relative";
    }
    Object.defineProperty(MapLayerComponent.prototype, "hideComponent", {
        get: function () {
            return this.positionFormService.hideComponent;
        },
        enumerable: true,
        configurable: true
    });
    MapLayerComponent.prototype.ngOnInit = function () {
        this.positionFormService.mapsCont = this.mapsCont;
    };
    return MapLayerComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"])("style.height"),
    __metadata("design:type", Object)
], MapLayerComponent.prototype, "height", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"])("style.width"),
    __metadata("design:type", Object)
], MapLayerComponent.prototype, "width", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"])("style.display"),
    __metadata("design:type", Object)
], MapLayerComponent.prototype, "display", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostBinding"])("style.position"),
    __metadata("design:type", Object)
], MapLayerComponent.prototype, "position", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])("mapsCont"),
    __metadata("design:type", Object)
], MapLayerComponent.prototype, "mapsCont", void 0);
MapLayerComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'map-mip',
        template: __webpack_require__(705),
        styles: [__webpack_require__(652)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__components_position_form_position_form_service__["a" /* PositionFormService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__components_position_form_position_form_service__["a" /* PositionFormService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__api_map_mip_service__["a" /* MapMipService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__api_map_mip_service__["a" /* MapMipService */]) === "function" && _b || Object])
], MapLayerComponent);

var animations = [
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('routeAnimation', [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('*', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 1 })),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('void => *', [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0 }),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])(500)
        ]),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('* => void', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])(500, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ opacity: 0 })))
    ])
];
var host = {
    '[@routeAnimation]': "true",
    '[style.display]': "'flex'",
    '[style.position]': "'absolute'",
    '[style.width]': "'100%'",
    '[style.height]': "'100%'",
    '[style.justify-content]': "'center'"
};
var _a, _b;
//# sourceMappingURL=C:/Users/harel/Documents/MapMip/src/map-mip.component.js.map

/***/ }),

/***/ 951:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(432);


/***/ })

},[951]);
//# sourceMappingURL=main.bundle.js.map