import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import MapBox from 'mapbox';

const LocationTypeAhead = ({onLocationUpdate, onLocationSelect}) => {
    const [text, setText] = useState('');
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const mapbox = new MapBox(process.env.MAPBOX_API_TOKEN);

    const resetSearch = () => {
        setText('');
        setLocations([]);
        setSelectedLocation(null);
    };

    const handleLocationUpdate = (location) => {
        setText(location.name);
        setLocations([]),
        setSelectedLocation(location);
        onLocationUpdate(location);
    };

    const handleSearchChange = async (e) => {
        const text = e.target.value;
        setText(text);

        if (!text) return;
        
        const loc = await mapbox.geocodeForward(text, {});

        if (!loc.entity.features || !loc.entity.features.length) return;

        const locations = loc.entity.features.map(features => {
            const [lng, lat] = feature.center;
            return {
                name: feature.place_name,
                lat,
                lng,
            };
        });
        setLocations(locations);
    };

    const handleSelectLocation = () => onLocationSelect(selectedLocation);

    const attemptGeoLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(({coords}) => {
                const {latitude, longitude} = coords;
                const loc = await mapbox.geocodeReverse({ latitude, longitude});

                if (!loc.entity.features || !loc.entity.features.length) return;

                const feature = loc.entity.features[0];
                const [lng, lat] = feature.center;
                const currentLocation = {
                    name: feature.place_name,
                    lat,
                    lng,
                };

                setLocations([currentLocation]);
                setSelectedLocation(currentLocation);
                setText(currentLocation.name);
                handleLocationUpdate(currentLocation);
            },
            null,
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            });
        }
    };

    useEffect(() => {
        return () => resetSearch();
    });

    return [
        <div key="location-typeahead" className="location-typeahead">
            <i className="fa fa-location-arrow" onClick={attemptGeoLocation}/>
            <input 
                onChange={handleSearchChange}
                type="text"
                placeholder="Enter a location..."
                value={text}
            />
            <button
                className="open"
                disabled={!selectedLocation}
                onClick={handleSelectLocation}
            >
                Select
            </button>  
        </div>,
        text.length && locations.length ? 
        <div key="location-typeahead-results" className="location-typeahead-results">
            {
                locations.map(location => 
                    <div
                        key={location.name}
                        className="result"
                        onClick={e => {
                            e.preventDefault();
                            handleLocationUpdate(location);
                        }}>
                        {location.name}
                    </div>
                )
            }

        </div> : 
        null
    ];
};

LocationTypeAhead.PropTypes = {
    onLocationUpdate: PropTypes.func.isRequired,
    onLocationSelect: PropTypes.func.isRequired,
};

export default LocationTypeAhead;