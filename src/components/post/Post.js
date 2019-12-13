import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import * as API from "../../shared/http";
import Content from "./Content";
import Image from "./Image";
import Link from "./Link";
import PostActionSection from "./PostActionSection";
import Comments from "../comment/Comments";
import UserHeader from "../post/UserHeader";
import Loader from "../Loader";

export const Post = (props) => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [user, setUser] = useState(props.user);

    const loadPost = async (id) => {
        const res = await API.fetchPost(id);
        const post = await res.json();
        setPost(post);
    };

    useEffect(() => {
        loadPost(props.id);
    }, []);


    if (!post) {
        return <Loader />;
    }

    return (
        <div className="post">
            <UserHeader date={post.date} user={post.user} />
            <Content post={post} />
            <Image post={post} />
            <Link link={post.link} />
            <PostActionSection showComments={showComments} />
            <Comments
                comments={comments}
                show={showComments}
                post={post}
                user={props.user}
            />
        </div>
    );

}

Post.propTypes = {
    user:  PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        profilePicture: PropTypes.APIstring,
    }),

    post: PropTypes.shape({
        comments: PropTypes.array,
        content: PropTypes.string,
        date: PropTypes.number,
        id: PropTypes.string.isRequired,
        image: PropTypes.string,
        likes: PropTypes.array,
        location: PropTypes.object,
        user: PropTypes.object,
        userId: PropTypes.string
    })
};

export default Post;
