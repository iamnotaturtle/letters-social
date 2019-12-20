import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';

const DisplayMap = (location = {lat = 34.1535641, lng = -118.1428115, name = null}, displayOnly = false) => {
    let map;
    let marker;

    const mapNode = useRef();
    const [mapLoaded, setMapLoaded] = useState(false);
    const [location, setLocation] = useState({
        lat,
        lng,
        name,
    });

    const ensureMapExists = () => {
        if (mapLoaded) {
            return;
        }

        map = window.L.mapbox.map(mapNode, 'mapbox.streets', {
            zoomControl: false,
            scrollWheelZoom: false,
        });
        map.setView(window.L.latLng(location.lat, location.lng), 12);
        addMarker(location.lat, location.lng);
        setMapLoaded(true);
    };

    const updateMapPosition = ({lat, lng}) => {
        map.setView(window.L.latLng(lat, lng));
        addMarker(lat, lng)
        setLocation({
            lat,
            lng,
        });
    };

    const addMarker = (lat, lng) => {
        if (marker) {
            return marker.setLatLng9window.L.latLng(lat, lng);
        }

        marker = window.L.marker.icon({'marker-color': '#4469af'});
        marker.addTo(map);
    };

    const generateStatisMapImage = (lat, lng) => {
        return `https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/${lat},${lng},12,0,0/600x175?access_token=${process.env.MAPBOX_API_TOKEN}`;
    };

    useEffect(() => {
        if (map && displayOnly) {
            map.invalidateSize(false);
        }
    }, []);

    useEffect(() => {
        updateMapPosition(location);
    }, [location]);

    return [
        <div key="displayMap" className="displayMap">
            <div className="map"
                ref={mapNode}
            >

            {!mapLoaded &&
                <img
                    className="map"
                    src={generateStatisMapImage(location.lat, location.lng)}
                    alt={location.name}
                />
            }
            </div>
        </div>,
        props.displayOnly && 
        <div key="location-description" className="location-description">
            <i className="location-icon fa fa-location-arrow"/>
            <span className="location-name">{location.name}</span>
        </div>
    ];
};

DisplayMap.PropTypes = {
    location: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
        name: PropTypes.string,
    }),
    displayOnly: PropTypes.bool,
}

export default DisplayMap;
