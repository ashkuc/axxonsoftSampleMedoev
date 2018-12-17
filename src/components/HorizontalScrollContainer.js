import React from 'react';
import propTypes from 'prop-types';


export default class HorizontalScrollContainer extends React.Component {
    constructor(props) {
        super(props);

        this.container = React.createRef();

        this.state = {
            scroll: 0,
            dragPosition: 0,
            isPulling: false
        };

        this.onWheel = this.onWheel.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDrag = this.onDrag.bind(this);
    }

    static getScrollStatus(element) {
        const {
            scrollLeft,
            scrollWidth,
            offsetWidth,
            clientWidth
        } = element;

        return {
            isReachedEnd: scrollLeft + offsetWidth - scrollWidth === 0,
            isReachedStart: scrollLeft <= clientWidth * 0.1,
            isNeedMoreElements: scrollWidth <= clientWidth
        };
    }

    componentDidMount() {
        const {
            container: {
                current: element
            },
            props: {
                onReachStart,
                onReachEnd
            }
        } = this;

        const {
            isReachedStart,
            isReachedEnd
        } = HorizontalScrollContainer.getScrollStatus(element);

        if (isReachedStart) {
            onReachStart();
        }

        if (isReachedEnd) {
            onReachEnd();
        }
    }

    onWheel({ deltaY: delta }) {
        this.scrollBlock(delta);
    }

    onDrag({ clientX }) {
        const { dragPosition: prevDragPosition } = this.state;
        this.scrollBlock(prevDragPosition - clientX);
        this.setState({ dragPosition: clientX });
    }

    onDragStart({ clientX }) {
        this.setState({
            dragPosition: clientX,
            isPulling: true
        });
    }

    onDragEnd({ clientX }) {
        this.setState({
            dragPosition: clientX,
            isPulling: false
        });
    }

    scrollBlock(delta) {
        const {
            container: {
                current: element
            },
            props: {
                onReachStart,
                onReachEnd
            }
        } = this;

        if (delta) {
            const scroll = element.scrollLeft + delta;
            element.scrollTo(scroll, 0);
            this.setState({ scroll, scrollWidth: element.scrollWidth });

            const {
                isReachedStart,
                isReachedEnd
            } = HorizontalScrollContainer.getScrollStatus(element);

            isReachedStart && onReachStart();
            isReachedEnd && onReachEnd();
        }
    }

    componentDidUpdate({ children: prevChildren }) {
        const {
            container: {
                current: element
            },
            props: {
                children,
                onReachStart,
                onReachEnd
            },
            state: {
                scrollWidth
            }
        } = this;

        const isChildrenCountChanged = children.length !== prevChildren.length;
        const isScrollingBackward = element.scrollLeft + element.offsetWidth < element.scrollWidth / 2;

        const {
            isReachedStart,
            isReachedEnd,
            isNeedMoreElements
        } = HorizontalScrollContainer.getScrollStatus(element);

        if (isNeedMoreElements && isChildrenCountChanged) {
            isReachedStart && onReachStart();
            isReachedEnd && onReachEnd();
        }

        // prevent "jumping" on prepend elements
        if (isChildrenCountChanged && isScrollingBackward) {
            element.scrollTo(element.scrollWidth - scrollWidth, 0);
        }
    }

    render() {
        const {
            props: {
                children
            },
            state: {
                isPulling
            },
            onWheel
        } = this;

        return (
            <div
                className="horizontal-scroll-container"
                ref={this.container}
                onWheel={onWheel}
                onMouseDown={this.onDragStart}
                onMouseUp={this.onDragEnd}
                onMouseLeave={this.onDragEnd}
                onMouseMove={isPulling ? this.onDrag : () => {}}
            >
                {children}
            </div>
        );
    }

}

HorizontalScrollContainer.propTypes = {
    onReachStart: propTypes.func.isRequired,
    onReachEnd: propTypes.func.isRequired
};
