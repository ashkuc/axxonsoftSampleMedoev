import React from 'react';
import propTypes from 'prop-types';


export default class VideoSourceSelect extends React.Component {

    static renderOption(source) {
        const {
            origin,
            state,
            name
        } = source;

        return (
            <option value={origin} key={origin}>
                {name} ({state})
            </option>
        );
    }

    render() {
        const {
            videoSources,
            selectedOrigin,
            changeOrigin
        } = this.props;

        return (
            <select className="video-origin-select" value={selectedOrigin} onChange={changeOrigin}>
                <option value="" disabled >Источник не выбран</option>
                {videoSources.map(VideoSourceSelect.renderOption)}
            </select>
        );
    }
}

const videoSourceShape = propTypes.shape({
    origin: propTypes.string,
    state: propTypes.string,
    name: propTypes.string
});

VideoSourceSelect.propTypes = {
    changeOrigin: propTypes.func.isRequired,
    videoSources: propTypes.arrayOf(videoSourceShape),
    selectedOrigin: propTypes.string
};

VideoSourceSelect.defaultProps = {
    options: [],
    selectedOrigin: ''
};
