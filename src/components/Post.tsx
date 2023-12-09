import styles from './Post.module.css'
import {Comment} from "./Comment.tsx";
import {Avatar} from "./Avatar.tsx";
import {format, formatDistanceToNow} from "date-fns";
import {ptBR} from "date-fns/locale";
import {ChangeEvent, FormEvent, InvalidEvent, useState} from "react";

interface Author {
    name: string;
    role: string;
    avatarUrl: string;
}

interface Content {
    type: 'paragraph' | 'link';
    content: string;
}

export interface PostType {
    id: number;
    author: Author;
    publishedAt: Date;
    content: Content[];
}

interface PostProps {
    post: PostType
}

export function Post({ post }: PostProps) {
    const [comments, setComments] = useState(['Legal!'])
    const [newCommentText, setNewCommentText] = useState('')

    const publishedAtFormatted = format(post.publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
        locale: ptBR
    })

    const publishedDateRelativeToNow = formatDistanceToNow(post.publishedAt, {
        locale: ptBR,
        addSuffix: true
    })

    function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('')
        setNewCommentText(event.target.value)
    }

    function handleCreateNewComment(event: FormEvent) {
        event.preventDefault()
        setComments([...comments, newCommentText])
        setNewCommentText('')
    }

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('Comment is required')
    }

    function deleteComment(commentToDelete: string) {
        const commentsWithoutDeletedOne = comments.filter(comment => {
            return comment !== commentToDelete
        })

        setComments(commentsWithoutDeletedOne)
    }

    const isNewCommentEmpty = newCommentText.length === 0

    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src={post.author.avatarUrl}/>
                    <div className={styles.authorInfo}>
                        <strong>{post.author.name}</strong>
                        <span>{post.author.role}</span>
                    </div>
                </div>

                <time title={ publishedAtFormatted } dateTime={post.publishedAt.toISOString()}>
                    {publishedDateRelativeToNow}
                </time>
            </header>

            <div className={styles.content}>
                {post.content.map(item => {
                    if (item.type === 'paragraph') {
                        return <p key={item.content}>{item.content}</p>
                    } else if (item.type === 'link') {
                        return <p key={item.content}><a href="#">{item.content}</a></p>
                    }
                })}
            </div>

            <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
                <strong>Comment this post</strong>

                <textarea
                    onChange={handleNewCommentChange}
                    onInvalid={handleNewCommentInvalid}
                    value={newCommentText}
                    name="comment"
                    required
                />

                <footer>
                    <button type="submit" disabled={isNewCommentEmpty}>Publish</button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {comments.map(comment => {
                    return (
                        <Comment
                            key={comment}
                            content={comment}
                            onDeleteComment={deleteComment}
                        />
                    )
                })}
            </div>
        </article>
    )
}