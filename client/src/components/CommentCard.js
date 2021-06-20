import React, { useState, useEffect } from 'react';
import { IconButton, Button } from '@material-ui/core';
import formatTimeDifference from '../utils/DateUtils';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ChatIcon from '@material-ui/icons/Chat';
import '../styles/Comment.css';
import Reply from './Reply';
import axios from 'axios';
import auth from '../auth/auth';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

export default function CommentCard(props) {
  const isAuthenticated = auth.isAuthenticated();
  const [syntheticLike, setSyntheticLike] = useState(false);
  const [writeReply, setWriteReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replies, setReplies] = useState([]);
  const comment = props.comment;

  useEffect(() => {
    if (props.recurseTree) {
      Promise.all(
        comment.replies.map((replyId) => {
          return axios.get('/api/comment/' + replyId);
        })
      ).then((result) => {
        setReplies(
          result.map((comment) => {
            return (
              <li className="RootComment" key={comment.data._id}>
                <CommentCard
                  comment={comment.data}
                  recurseTree={props.recurseTree}
                />
              </li>
            );
          })
        );
      });
    }
  }, [props, comment]);

  function handleUpvote() {
    if (!syntheticLike) {
      axios.post(
        '/api/comment/upvote',
        {
          userId: isAuthenticated.user._id,
          commentId: comment._id,
        },
        { headers: { Authorization: 'Bearer ' + isAuthenticated.token } }
      );
    } else {
      axios.post(
        '/api/comment/unvote',
        {
          userId: isAuthenticated.user._id,
          commentId: comment._id,
        },
        { headers: { Authorization: 'Bearer ' + isAuthenticated.token } }
      );
    }
    setSyntheticLike(!syntheticLike);
  }

  function handleDelete(event) {
    event.preventDefault();
    axios
      .delete('/api/comment/delete', {
        headers: { Authorization: 'Bearer ' + isAuthenticated.token },
        data: {
          userId: isAuthenticated.user._id,
          commentId: comment._id,
        },
      })
      .then((document.location.href = document.URL))
      .catch((err) => console.log(err));
  }

  function handleEdit(event) {
    event.preventDefault();
    axios
      .post(
        '/api/comment/edit/' + comment._id,
        {
          userId: isAuthenticated.user._id,
          revisedComment: event.target.edit.value,
        },
        { headers: { Authorization: 'Bearer ' + isAuthenticated.token } }
      )
      .then(() => {
        comment.body = event.target.edit.value;
        setIsEditing(false);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="CommentBody">
      {!isEditing ? (
        <div>
          <p>
            {props.maxCharCount < comment.body.length
              ? comment.body.slice(0, props.maxCharCount)
              : comment.body}{' '}
          </p>
          <p>
            ~{comment.authorName} <br />
            {formatTimeDifference(new Date(comment.uploadDate))}
          </p>
        </div>
      ) : (
        <form onSubmit={handleEdit}>
          {' '}
          <label for="edit"> Edit Comment </label>
          <textarea
            className="form-control"
            id="edit"
            rows="3"
            style={{ marginBottom: '1em' }}
          >
            {comment.body}
          </textarea>
          <Button type="submit" color="primary" variant="contained">
            Submit
          </Button>
        </form>
      )}

      <div className="CommentStats">
        <div>
          <IconButton onClick={handleUpvote}>
            <ThumbUpIcon style={{ marginRight: '0.5em' }} />
            {comment.upvotes.length + syntheticLike}
          </IconButton>
        </div>
        <div style={{ flex: '10' }}>
          <IconButton onClick={() => setWriteReply(!writeReply)}>
            <ChatIcon style={{ marginRight: '0.5em' }} />
            {comment.replies.length}
          </IconButton>
        </div>
        {comment.authorName === isAuthenticated.user.username && (
          <span>
            <div>
              <IconButton onClick={handleDelete}>
                <DeleteIcon color="secondary" />
              </IconButton>
            </div>
            <div>
              <IconButton onClick={() => setIsEditing(!isEditing)}>
                <EditIcon color="primary" />
              </IconButton>
            </div>
          </span>
        )}
      </div>

      <Reply comment={comment} writeReply={writeReply} />

      {replies.length !== 0 && <ul>{replies}</ul>}
    </div>
  );
}
