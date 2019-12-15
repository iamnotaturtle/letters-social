import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import parseLinkHeader from 'parse-link-header';
import orderBy from 'lodash/orderBy';

import ErrorMessage from './components/error/Error';
import Nav from './components/nav/navbar';
import Loader from './components/Loader';

import * as API from './shared/http';
import CreatePost from './components/post/Create';
import Ad from './components/ad/Ad';
import Post from './components/post/Post';
import Welcome from './components/welcome/Welcome';

/**
 * The app component serves as a root for the project and renders either children,
 * the error state, or a loading state
 * @method App
 * @module letters/components
 */
const App = (props) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [endpoint, setEndpoint] = useState(`${process.env
        .ENDPOINT}/posts?_page=1&_sort=date&_order=DESC&_embed=comments&_expand=user&_embed=likes`);

    const createNewPost = (post) => {
        setPosts(orderBy(posts.concat(post), 'date', 'desc'));
    };

    const getPosts = async () => {
        try {
            setLoading(true);
            const res = await API.fetchPosts(endpoint);
            const results = await res.json();

            const links = parseLinkHeader(res.headers.get('Link'));
            setPosts(orderBy(posts.concat(results), 'date', 'desc'));
            setEndpoint(links.next.url);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div className="app">
            <Nav user={props.user} />
            {loading ? (
                <div className="loading">
                    <Loader />
                </div>
            ) : (
                <div className="home">
                    <Welcome key="welcome" />
                    <div>
                        <CreatePost onSubmit={createNewPost}/>
                        {
                            posts.length > 0 
                            &&
                            <div className="posts">
                                { posts.map(({ id }) => <Post id={id} key={id} user={props.user} />)}
                            </div>
                        }
                        {
                            error ? <ErrorMessage error={error} /> :
                            <button className="block" onClick={getPosts}>
                                Load more posts
                            </button>
                        }
                    </div>
                    <div>
                        <Ad
                            url="https://ifelse.io/book"
                            imageUrl="/static/assets/ads/ria.png"
                        />
                        <Ad
                            url="https://ifelse.io/book"
                            imageUrl="/static/assets/ads/orly.jpg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

App.propTypes = {
    children: PropTypes.node,
};


export default App;
