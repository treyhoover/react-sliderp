import * as React from "react";
import { Grid } from "react-virtualized";
import { throttle, debounce, clamp } from "lodash";
import { Motion, spring } from "react-motion";

const SCROLL_THROTTLE = 50;
const SCROLL_END_TIMEOUT = 250;

type Touch = {
    x: number;
    y: number;
}

const gridStyle = {
    outline: "none",
};

class SliderInner extends React.Component<ISliderCoreProps, any> {
    static keyDownListener;

    el?: any;
    scrollDelta = 0;
    totalScrollDelta = 0;
    lastTouch?: Touch = null;

    constructor(props: ISliderCoreProps) {
        super();

        this.state = {
            scrollLeft: props.scrollLeft,
        };
    }

    get scrollLeft() {
        if (!this.el) return 0;

        return this.el._scrollingContainer.scrollLeft;
    }

    get columnWidth() {
        return this.props.width / this.props.slidesToShow;
    }

    get synced() {
        return this.state.scrollLeft === this.props.scrollLeft;
    }

    componentWillReceiveProps(nextProps: ISliderCoreProps) {
        const isExternal = nextProps !== this.props;

        if (isExternal) {
            this.waitForScrollStop.flush();
        }

        if (nextProps.scrollLeft !== this.state.scrollLeft) {
            this.setState({ scrollLeft: nextProps.scrollLeft });
        }
    }

    componentDidUpdate() {
        this.el._scrollingContainer.style.overflow = "hidden";

        if (this.synced) {
            this.recompute();
        }
    }

    bindRef = (grid: any) => {
        this.el = grid;
    };

    onMouseWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (!this.props.scrollable) return;

        const xDist = Math.abs(e.deltaX);
        const yDist = Math.abs(e.deltaY);

        if (xDist / 2 < yDist) return; // ignore vertical scrolls

        const containerWidth = this.el._scrollingContainer.clientWidth;
        const maxScrollLeft = this.props.columnCount * this.props.columnWidth - containerWidth;
        const nextScrollLeft = this.scrollLeft + e.deltaX;

        if (nextScrollLeft > 0 && nextScrollLeft <= maxScrollLeft) {
            e.preventDefault(); // prevent "scroll bounce" when we're within range
        }

        this.onSwipe(e.deltaX);
    };

    onSwipe = (deltaX) => {
        this.scrollDelta += deltaX;
        this.totalScrollDelta += deltaX;
        this.onScroll();

        this.waitForScrollStop();
    };

    onScroll = throttle(() => {
        const containerWidth = this.el._scrollingContainer.clientWidth;
        const maxScrollLeft = this.props.columnCount * this.props.columnWidth - containerWidth;
        const nextScrollLeft = clamp(this.state.scrollLeft + this.scrollDelta, 0, maxScrollLeft);

        // check if this the start of a new scroll/slider was in sync
        if (this.state.scrollLeft === this.props.scrollLeft) {
            this.props.onScrollStart();
        }

        this.setState({ scrollLeft: nextScrollLeft });

        this.scrollDelta = 0;
    }, SCROLL_THROTTLE);

    waitForScrollStop = debounce(() => {
        const nextIndex = Math.round(this.scrollLeft / this.props.columnWidth);

        this.lastTouch = null;
        this.totalScrollDelta = 0;

        this.props.onScroll(nextIndex);
    }, SCROLL_END_TIMEOUT);

    onKeyDown = (e) => {
        const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

        if (arrowKeys.includes(e.key)) {
            e.preventDefault();

            this.props.onArrow(e);
        }
    };

    getTouch = (e): Touch => "touches" in e
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: e.clientX, y: e.clientY };

    onTouchMove = (e) => {
        const { swipeable, swipeForce } = this.props;
        if (!swipeable) return;

        const touch = this.getTouch(e);

        if (this.lastTouch !== null) {
            const deltaX = touch.x - this.lastTouch.x;
            const deltaY = touch.y - this.lastTouch.y;
            const xDist = Math.abs(deltaX);
            const yDist = Math.abs(deltaY);

            if (xDist / 2 < yDist) {
                // ignore vertical swipes
            } else {
                e.preventDefault();

                this.onSwipe(-deltaX * swipeForce);
            }
        }

        this.lastTouch = touch;
    };

    handleRest = () => {
        this.props.onRest();
    };

    recompute = () => {
        if (!this.el) return;

        this.el.recomputeGridSize();
    };

    addKeydownListener = () => {
        /* workaround to ensure we only have one document listener at a time */
        /* necessary because edge cases can bypass the mouseLeave event */
        this.removeKeydownListener();

        SliderInner.keyDownListener = this.onKeyDown;

        document.addEventListener("keydown", SliderInner.keyDownListener);
    };

    removeKeydownListener = () => {
        document.removeEventListener("keydown", SliderInner.keyDownListener);
    };

    render() {
        const { scrollLeft: stopX } = this.state;

        return (
            <div
                onWheel={this.onMouseWheel}
                onTouchMove={this.onTouchMove}
                onMouseEnter={this.addKeydownListener}
                onMouseLeave={this.removeKeydownListener}
            >
                <Motion
                    defaultStyle={{ scrollLeft: this.scrollLeft }}
                    style={{
                        scrollLeft: spring(stopX, { stiffness: 170, damping: 26 }),
                    }}
                    onRest={this.handleRest}
                >
                    {({ scrollLeft }) => <Grid
                        ref={this.bindRef}
                        columnCount={this.props.columnCount}
                        rowCount={1}
                        width={this.props.width}
                        height={this.props.height}
                        cellRenderer={this.props.cellRenderer}
                        rowHeight={this.props.height}
                        columnWidth={this.columnWidth}
                        scrollToAlignment="start"
                        scrollLeft={scrollLeft}
                        scrollingResetTimeInterval={SCROLL_END_TIMEOUT}
                        style={gridStyle}
                    />}
                </Motion>
            </div>
        );
    }
}

interface ISliderCoreProps {
    columnCount: number;
    width: number;
    height: number;
    slidesToShow: number;
    scrollLeft: number;
    cellRenderer: (obj: any) => any;
    rowHeight: number;
    columnWidth: number;
    onScrollStart: () => void;
    onScroll: (obj: any) => void;
    onRest: () => void;
    onArrow: (e: any) => void;
    scrollable: boolean;
    swipeable: boolean;
    swipeForce: number;
}

export default SliderInner;
