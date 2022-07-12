import { useState } from 'react' 

const BlogForm = ({ createBlog }) => {
    const [newTitle, newTitleChange] = useState('')
    const [newAuthor, newAuthorChange] = useState('')
    const [newUrl, newUrlChange] = useState('')

    const handleTitleChange = (event) => {
        newTitleChange(event.target.value)
    }

    const handleAuthorChange = (event) => {
        newAuthorChange(event.target.value)
    }

    const handleUrlChange = (event) => {
        newUrlChange(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl,
        })

        newTitleChange('')
        newAuthorChange('')
        newUrlChange('')

    }

    return (
        <div>
            <h2>Create new blog</h2>
            <form onSubmit={addBlog}>
                <>
                 <input
                    title = {newTitle}
                    onChange = {handleTitleChange}
                    />
                </>
                <>
                <input
                    author = {newAuthor}
                    onChange = {handleAuthorChange}
                    />
                </>
                <>
                <input
                    url = {newUrl}
                    onChange = {handleUrlChange}
                    />
                </>
               
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm