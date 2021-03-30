import React from 'react'
import '../scss/Post.scss'

const Post = React.memo(({ title, link, avatar }) => {
	return (
		<div className="post">
			<img className="post__avatar" alt="" src={avatar}  />
			<div className="post__title">{title}</div>
			<a className="post__link" href={link} target="_blank" rel="noreferrer noreferrer">{null}</a>
		</div>
	)
})

export default Post
