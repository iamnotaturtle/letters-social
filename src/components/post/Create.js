import PropTypes from 'prop-types';
import Filter from 'bad-words';
import React, {useState} from 'react';

const filter = new Filter();

const CreatePost = props => {
    const [content, setContent] = useState('');
    const [valid, setValid] = useState(false);

    const handlePostChange = (event) => {
        const content = filter.clean(event.target.value);
        setContent(content);
        setValid(content.length <= 280)
    }
    const handleSubmit = () => {
        if (!valid) {
            return;
        }

        const newPost = {
            content,
        };
        console.log(newPost);
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

CreatePost.propTypes = {};

export default CreatePost;
