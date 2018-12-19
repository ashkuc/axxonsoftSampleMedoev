import React from "react";
import { formatToHourMinute, getImageUrl, getVideoSources } from '../lib';
import VideoFrame from './Frame';
import HorizontalScrollContainer from './HorizontalScrollContainer';
import VideoSourceSelect from './VideoSourceSelect';
import './styles.scss';


const minute = 60 * 1000;

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timestamps: [Date.now()],
            videoSources: [],
            selectedOrigin: ''
        };

        this.addNext = this.addNext.bind(this);
        this.addPrev = this.addPrev.bind(this);
        this.changeOrigin = this.changeOrigin.bind(this);
    }

    changeOrigin({ target: { value: selectedOrigin = '' } = {} }) {
        this.setState({
            selectedOrigin,
            timestamps: [Date.now()]
        })
    }

    addPrev() {
        const { timestamps: [first, ...rest] } = this.state;

        this.setState({
            timestamps: [first - minute, first, ...rest]
        })
    }

    addNext() {
        const { timestamps } = this.state;
        const last = timestamps.slice(-1)[0];
        const next = last + minute;

        if (next <= Date.now()) {
            this.setState({
                timestamps: [...timestamps, next]
            })
        }
    }

    componentDidMount() {
        getVideoSources().then((videoSources) => {
            const selectedOrigin = videoSources[0] ? videoSources[0].origin : '';

            this.setState({
                videoSources,
                selectedOrigin
            })
        });
    }

    render() {
        const {
            state: {
                timestamps,
                videoSources,
                selectedOrigin
            },
            changeOrigin,
            addNext,
            addPrev
        } = this;

        const renderFrame = (timestamp) => (
            <VideoFrame
                key={timestamp}
                url={getImageUrl(selectedOrigin, timestamp)}
                time={formatToHourMinute(timestamp)}
            />
        );

        return(
            <div>
                <VideoSourceSelect
                    videoSources={videoSources}
                    selectedOrigin={selectedOrigin}
                    changeOrigin={changeOrigin}
                />

                {selectedOrigin &&
                    <HorizontalScrollContainer
                        onReachEnd={addNext}
                        onReachStart={addPrev}
                    >
                        {timestamps.map(renderFrame)}
                    </HorizontalScrollContainer>
                }
            </div>
        );
    }
}
