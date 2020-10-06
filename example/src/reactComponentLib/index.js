/* eslint-disable */
import React, { useRef, useMemo, useLayoutEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import smoothscroll from 'smoothscroll-polyfill';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

smoothscroll.polyfill();
function duplicateSlides(slides) {
    return __spreadArrays(slides, slides, slides);
}
function Slider(_a) {
    var slides = _a.slides, render = _a.children, sliderRef = _a.sliderRef, _b = _a.scrollEndDebounce, scrollEndDebounce = _b === void 0 ? 150 : _b, onChange = _a.onChange, _c = _a.infinite, infinite = _c === void 0 ? false : _c, props = __rest(_a, ["slides", "children", "sliderRef", "scrollEndDebounce", "onChange", "infinite"]);
    var lastIndex = useRef(0);
    var renderedSlides = useMemo(function () { return (infinite ? duplicateSlides(slides) : slides); }, [slides, infinite]);
    // Adjust scroll position to center
    var recenterInfinite = function (target) {
        var pageWidth = target.scrollWidth / 3;
        var _a = [pageWidth, pageWidth * 2], minLeft = _a[0], maxLeft = _a[1];
        if (target.scrollLeft < minLeft) {
            target.scrollLeft += pageWidth;
        }
        else if (target.scrollLeft > maxLeft) {
            target.scrollLeft -= pageWidth;
        }
    };
    // Set initial position
    useLayoutEffect(function () {
        var sliderEl = sliderRef === null || sliderRef === void 0 ? void 0 : sliderRef.current;
        if (sliderEl != null) {
            sliderEl.scrollLeft = infinite ? sliderEl.scrollWidth / 3 : 0;
        }
    }, [infinite]);
    var onScrollEnd = useCallback(debounce(function (target) {
        var _a, _b, _c;
        if (infinite) {
            recenterInfinite(target);
        }
        var slides = Array.from((_a = target.children) !== null && _a !== void 0 ? _a : []);
        var currentSlide = slides.find(function (s) { return s.offsetLeft >= target.scrollLeft; });
        var currentIndex = parseInt((_c = (_b = currentSlide === null || currentSlide === void 0 ? void 0 : currentSlide.dataset) === null || _b === void 0 ? void 0 : _b.index) !== null && _c !== void 0 ? _c : '0', 10);
        if (typeof onChange === 'function') {
            lastIndex.current = currentIndex;
            onChange(currentIndex);
        }
    }, scrollEndDebounce), [infinite]);
    return (React.createElement("div", __assign({ ref: sliderRef }, props, { style: {
            scrollSnapType: 'x mandatory',
            scrollPadding: 0,
            scrollMargin: 0,
            scrollSnapMargin: 0,
            overflowX: 'scroll',
            whiteSpace: 'nowrap',
        }, onScroll: function (e) { return onScrollEnd(e.currentTarget); } }), renderedSlides.map(function (slide, i) { return (React.createElement("div", { key: i, "data-index": i % slides.length, "data-duplicate": infinite ? i < slides.length || i > slides.length * 2 - 1 : false, style: { scrollSnapAlign: 'start', display: 'inline-block', verticalAlign: 'top' } }, render(slide, i))); })));
}

var defaultScrollToOptions = { behavior: 'smooth' };
var createPager = function (ref) {
    var ua = navigator.userAgent.toLowerCase();
    var isSafari = ua.indexOf('safari');
    var page = function (dir, options) {
        if (options === void 0) { options = defaultScrollToOptions; }
        var el = ref.current;
        if (!el)
            return;
        var scrollLeft = el.scrollLeft, offsetWidth = el.offsetWidth;
        var offset = isSafari ? 8 * dir : 0;
        var left = scrollLeft + offsetWidth * dir + offset;
        el.scrollTo(__assign(__assign({}, options), { left: left }));
    };
    return {
        back: function (options) { return page(-1, options); },
        forward: function (options) { return page(1, options); },
        goToSlide: function (n, options) {
            if (options === void 0) { options = defaultScrollToOptions; }
            var sliderEl = ref.current;
            if (sliderEl != null) {
                var slides = Array.from(sliderEl.children);
                var startSlide = slides.find(function (s) { var _a, _b; return ((_a = s.dataset) === null || _a === void 0 ? void 0 : _a.duplicate) === 'false' && ((_b = s.dataset) === null || _b === void 0 ? void 0 : _b.index) === n.toString(); });
                if (startSlide != null) {
                    var left = startSlide === null || startSlide === void 0 ? void 0 : startSlide.offsetLeft;
                    sliderEl.scrollTo(__assign(__assign({}, options), { left: left }));
                }
            }
        },
    };
};

export { Slider, createPager };
