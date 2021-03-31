import React from 'react'
import '../scss/Post.scss'

const Post = React.memo(({ post }) => {
	return (
		<div className="post">
			<img className="post__avatar" alt="" src={post.owner.profile_image}  />
			<div className="post__title">{post.title}</div>
			<a className="post__link" href={post.link} target="_blank" rel="noreferrer noreferrer">{null}</a>
		</div>
	)
})

export default Post

