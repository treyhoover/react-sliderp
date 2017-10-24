import * as React from 'react'
import { clamp } from "./utils";
import SliderInner from "./SliderInner";
import { AutoSizer } from "react-virtualized"

export class Slider extends React.Component<SliderProps> {
    static defaultProps: any;

    el: any = null;
    scrollDelta = 0;
    totalScrollDelta = 0;

    get slideWidth() {
        const { width, slidesToShow } = this.props;

        return width / slidesToShow;
    }

    get maxScrollLeft() {
        const { slides, slidesToShow } = this.props;

        return (slides.length * this.slideWidth) - (slidesToShow * this.slideWidth);
    }

    get scrollLeft() {
        const scrollLeft = this.props.index * this.slideWidth;

        return clamp(scrollLeft, 0, this.maxScrollLeft);
    }

    renderSlide = ({ columnIndex: index = 0, key = "", rowIndex = 0, style = {} }) => {
        const { slides, children: renderSlide } = this.props;
        const slide = slides[index];

        return (
            <div
                className={"slide"}
                key={key}
                style={style}
            >
                {renderSlide({ slide, index })}
            </div>
        );
    };

    render() {
        const { slides, width, height, slidesToShow, onScroll, onArrow, scrollable, swipeable, className } = this.props;

        return (
            <div className={className}>
                <AutoSizer disableHeight onResize={this.props.onResize}>
                    {() => (
                        <SliderInner
                            columnCount={slides.length}
                            width={width}
                            height={height}
                            cellRenderer={this.renderSlide}
                            rowHeight={height}
                            columnWidth={width / slidesToShow}
                            scrollLeft={this.scrollLeft}
                            slidesToShow={slidesToShow}
                            onScroll={onScroll}
                            scrollable={scrollable}
                            swipeable={swipeable}
                            onArrow={onArrow}
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }
}

Slider.defaultProps = {
    scrollLeft: 0,
    columnCount: 0,
    width: 0,
    height: 0,
    rowHeight: 0,
    slidesToShow: 1,
    style: {},
    scrollable: false,
    swipeable: false,
    children: (obj: any) => undefined,
    onScroll: (index: number) => undefined,
    onArrow: (e: any) => undefined,
    onResize: (dimensions: any) => undefined,
};

interface SliderProps {
    slides: any[];
    index: number;
    width: number;
    height: number;
    slidesToShow: number;
    scrollLeft: number;
    columnCount: number;
    cellRenderer: (obj: any) => any;
    rowHeight: number;
    onScroll: (obj: any) => void;
    scrollable: boolean;
    swipeable: boolean;
    children: (obj: any) => any;
    className?: string;
    onArrow: (e: any) => void;
    onResize: (dimensions: any) => void;
}
