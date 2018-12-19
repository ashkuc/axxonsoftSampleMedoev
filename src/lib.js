export const stateNamesMap = {
    connected: 'подключено',
    disconnected: 'отключено',
    signal_restored: 'сигнал восстановлен',
    signal_lost: 'сигнал потерян'
};

export const formatTimestampForRequest = (timestamp) => new Date(timestamp)
    .toISOString()
    .replace(/[^0-9,T]/g, '')
    .substring(0, 13);

export const getImageUrl = (sourceId, timestamp) => `${__API__}/asip-api/archive/media/${sourceId}/${formatTimestampForRequest(timestamp)}`;

export const formatToHourMinute = (milliseconds) => {
    const date = new Date(milliseconds);
    return `${date.getHours()}:${date.getMinutes()}`;
};

export const parseVideoOriginsResponse = (response) => Object.values(JSON.parse(response))
    .map(({ origin, state, friendlyNameShort: name }) => ({
        origin,
        state: stateNamesMap[state] || 'статус не определен',
        name
    }));

export const getVideoSources = () => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${__API__}/asip-api/video-origins/`);
    xhr.setRequestHeader('Authorization', 'Basic ' + Buffer.from(__USERNAME__ + ':' + __PASSWORD__).toString('base64'));

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            resolve(
                parseVideoOriginsResponse(xhr.response)
            );
        } else {
            reject();
        }
    };

    xhr.onerror = () => reject();
    xhr.send();
});
