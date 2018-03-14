import { defaults, noop } from "lodash";
import { wrap, clamp } from "./utils";

export type ScrollStateGetter = () => ({
    index: number;
    numSlides: number;
    slidesToShow: number;
    wraps: boolean;
});

const defaultScrollState = {
    index: 0,
    numSlides: 1,
    slidesToShow: 1,
    wraps: true,
};

export type UpdateHandler = (index: number) => void;

class Resolver {
    private getScrollState;
    public update;

    constructor(getScrollState: ScrollStateGetter, onUpdate) {
        this.update = onUpdate;
        this.getScrollState = getScrollState;
    }

    /* Getters */
    public get firstRight() {
        const { slidesToShow } = this.getScrollState();

        return slidesToShow - 1;
    }

    public get lastLeft() {
        const { numSlides, slidesToShow } = this.getScrollState();

        return numSlides - slidesToShow;
    }

    public get lastRight() {
        const { numSlides } = this.getScrollState();

        return numSlides - 1;
    }

    /* Helpers */
    public isPartialEdge(index) {
        if (index < this.firstRight && index > 0) return true;

        return index > this.lastLeft && index < this.lastRight;
    }

    public isFirstPage(index) {
        return index <= this.firstRight;
    }

    public isLastPage(index) {
        return index >= this.lastLeft;
    }

    public lastSlideIsVisibleAt(index) {
        return index >= this.lastLeft && index <= this.lastRight;
    }

    public firstSlideIsVisibleAt(index) {
        return index >= 0 && index <= this.firstRight;
    }

    public wrapIndex(index) {
        const { numSlides, wraps } = this.getScrollState();

        return wraps ? wrap(index, numSlides) : this.clampIndex(index);
    }

    public clampIndex(index) {
        return clamp(index, 0, this.lastRight);
    }

    public resolve(index) {
        return this.clampIndex(this.wrapIndex(index));
    }

    /* Sliders */
    public slideLeft(n = 1): number {
        const { index } = this.getScrollState();
        const nextIndex = this.resolve(index - n);

        this.update(nextIndex);

        return nextIndex;
    }

    public slideRight(n = 1): number {
        const { index } = this.getScrollState();
        const nextIndex = this.resolve(index + n);

        this.update(nextIndex);

        return nextIndex;
    }

    public pageLeft(n = 1): number {
        const { index, slidesToShow, wraps } = this.getScrollState();
        let nextIndex = index - (n * slidesToShow);

        if (this.isFirstPage(index)) {
            nextIndex = wraps ? this.lastLeft : 0;
        }

        this.update(nextIndex);

        return nextIndex;
    }

    public pageRight(n = 1): number {
        const { index, slidesToShow, wraps } = this.getScrollState();
        let nextIndex = index + (n * slidesToShow);

        if (this.isLastPage(index)) {
            nextIndex = wraps ? 0 : this.lastLeft;
        }

        this.update(nextIndex);

        return nextIndex;
    }
}

export const createScroller = (_getState = noop, onUpdate: UpdateHandler = noop): Resolver => {
    const getState = () => defaults({}, _getState(), defaultScrollState);

    return new Resolver(getState, onUpdate);
};
