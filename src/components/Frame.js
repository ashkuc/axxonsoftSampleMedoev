import React from 'react';
import propTypes from 'prop-types';


export default class Frame extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isImageMissed: false
        };
    }

    render() {
        const {
            props: {
                // timestamp,
                url,
                time
            },
            state: {
                isImageMissed
            }
        } = this;

        const onLoadError = () => this.setState({ isImageMissed: true });
        const onLoadSuccess = () => this.setState({ isImageMissed: false });

        const className = isImageMissed ? 'frame missed' : 'frame';

        return (
            <div className={className}>
                <span className="time">{time}</span>
                <div className="image-wrap">
                    <img
                        hidden={isImageMissed}
                        className="image"
                        src={url}
                        alt="Изображение отсутствует"
                        onError={onLoadError}
                        onLoad={onLoadSuccess}
                    />
                    <div className="message">
                        <span hidden={!isImageMissed}>Изображение отсутствует</span>
                    </div>

                    <div className="status"/>
                </div>
            </div>
        );
    }
}

Frame.propTypes = {
    // timestamp: propTypes.number.isRequired,
    url: propTypes.string.isRequired,
    time: propTypes.string.isRequired
};
