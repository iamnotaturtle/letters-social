import PropTypes from 'prop-types';
import Filter from 'bad-words';
import React, {useState} from 'react';

const CreatePost = ({onSubmit}) => {
    const initialState = {
        content: '',
        valid: false,
        showLocationPicker: false,
        location: {
            lat: 34.1535641,
            lng: -118.1428115,
        },
        locationSelected: false,
    };

    const [content, setContent] = useState(initialState.content);
    const [valid, setValid] = useState(initialState.valid);
    const [showLocationPicker, setShowLocationPicker] = useState(initialState.showLocationPicker);
    const [location, setLocation] = useState({lat: initialState.location.lat, lng: initialState.location.lng});
    const [locationSelected, setLocationSelected] = useState(initialState.locationSelected);

    const filter = new Filter();

    const handlePostChange = (event) => {
        const content = filter.clean(event.target.value);
        setContent(content);
        setValid(content.length <= 280);
    }

    const handleRemoveLocation = () => {
        setLocationSelected(false);
        setLocation(initialState.location);
    }; 

    const handleSubmit = () => {
        if (!valid) {
            return;
        }

        const newPost = {
            content,
        };

        if (locationSelected) {
            newPost.location = location;
        }
        onSubmit(newPost);

        setContent(initialState.content);
        setValid(initialState.valid);
        setShowLocationPicker(initialState.showLocationPicker);
        setLocation(initialState.location);
        setLocationSelected(initialState.locationSelected);
    };

    const onLocationUpdate = (location) => setLocation(location);
    const onLocationSelect = (location) => {
        setLocation(location);
        setShowLocationPicker(false);
        setLocationSelected(true);
    };
    const handleToggleLocation = (e) => {
        e.preventDefault();
        setShowLocationPicker(!showLocationPicker);
    };
    
    return (
        <div className="create-post">
            <textarea placeholder="What's on your mind?"
                value={content}
                onChange={handlePostChange}/>
            <button onClick={handleSubmit}>Post</button>
        </div>
    );
};

CreatePost.propTypes = {
    onSubmit: PropTypes.func,
};

export default CreatePost;
