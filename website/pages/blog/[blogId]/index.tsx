import axios from 'axios';
import * as _ from 'lodash';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { compose } from 'redux';
import { connect } from 'react-redux';

import defaultNextI18Next from '../../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
import parse from 'html-react-parser';

// mui
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import FacebookIcon from '@material-ui/icons/Facebook';
import CommentIcon from '@material-ui/icons/Comment';

// components
import Layout from '../../../components/layout';
import Profile from '../../../components/blog/profile';

import { SeverityEnum } from '../../../enums/SeverityEnum';
import { PaletteTypeEnum } from '../../../enums/PaletteTypeEnum';
import { setMessage, setProgressOn } from '../../../store/actions/globalActions';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

function ViewBlogPage(props) {
  const { dispatch, t, auth, user, paletteType } = props;
  const [blog, setBlog] = useState({});
  const [author, setAuthor] = useState({});
  const [content, setContent] = useState('');
  const [collections, setCollections] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const collectionForm = useRef('collectionForm');
  const commentForm = useRef('commentForm');
  const [collectionName, setCollectionName] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeAmount, setLikeAmount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentAmount, setCommentAmount] = useState(0);
  const [collected, setCollected] = useState(false);
  const router = useRouter();
  const { blogId } = router.query;

  
  const functionButtons = (textAlign) => {
    return (
      <Grid container justify={textAlign}>
        <Grid item>
          <Tooltip title={liked ? t('pages.blog.disLike') : t('pages.blog.like')}>
            <IconButton
              onClick={handLikeButtonClick}
              color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
            >
              {
                liked ?
                <FavoriteIcon /> :
                <FavoriteBorderIcon />
              }
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title={t('pages.blog.collect')}>
            <IconButton
              onClick={handCollectButtonClick}
              color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
            >
              {
                collected ?
                <StarIcon /> :
                <StarBorderIcon />
              }
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title={t('pages.blog.forwardToFacebook')}>
           <IconButton
              color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
            >
              <FacebookIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    )
  }

  const collectionSection = () => {
    return (
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        className="dialogContainer"
      >
        <DialogTitle>{t('pages.blog.collectBlog')}</DialogTitle>
        <DialogContent>
          <Container maxWidth="sm">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ValidatorForm
                  ref={collectionForm}
                  onSubmit={handleCollectionNameFormSubmit}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={6}>
                      <TextValidator
                        errorMessages={[t('messages.blog.form.collectionNameRequired')]}
                        fullWidth
                        name="newCollection"
                        onChange={handleCollectionNameChange}
                        placeholder={t('pages.blog.collectionName')}
                        validators={['required']}
                        value={collectionName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
                      >
                       {t('pages.blog.addCollection')}
                      </Button>
                    </Grid>
                  </Grid>
                </ValidatorForm>
              </Grid>
              <Grid container className="collectionListContainer">
                {
                  collections.map(collection => (
                    <Grid item xs={12} key={collection['_id']}>
                      <Grid container spacing={2}>
                        <Grid item xs={10}>
                          <div className="collectionName">{collection['name']}</div>
                          <div className="collectionInfo">{collection['blogIds'].length} blog(s)</div>
                        </Grid>
                        <Grid item xs={2}>
                          <Checkbox
                            checked={collection['blogIds'].indexOf(blogId) !== -1}
                            onChange={handleCheckBoxChange}
                            value={collection['_id']}
                          />
                        </Grid>
                      </Grid>
                      <Divider />
                    </Grid>
                  ))
                }
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDialogClose} color="inherit">
              {t(`pages.common.close`)}
            </Button>
          </DialogActions>
      </Dialog>
    )
  }

  const commentSection = () => {
    
    return (
      <Grid container spacing={2}>
        {
          comments.map(comment => (
            <Grid item xs={12} key={comment['_id']}>
              <Container maxWidth="sm">
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <Profile
                      userId={_.get(comment, 'userId')}
                      username={_.get(comment, 'user.username', [])}
                      avatar={_.get(comment, 'user.userInfo.avatar')}
                      updatedDate={comment['updatedDate']}
                      showFollow={false}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <pre style={{ fontSize: "16px", margin: 0, background: paletteType === PaletteTypeEnum.light ? '#ddd' : '#666' }}>
                      {comment['comment']}
                    </pre>
                  </Grid>
                </Grid>
                <Divider style={{ marginTop: '20px' }} />
              </Container>
            </Grid>
          ))
        }
      </Grid>
    )
  }

  const newCommentSection = () => {
    
    return (
      <Container maxWidth="sm">
        {
          user && user._id &&
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Profile
                userId={_.get(user, 'userId')}
                username={_.get(user, 'username', [])}
                avatar={_.get(user, 'userInfo.avatar')}
                showFollow={false}
              />
            </Grid>
            <Grid item xs={8}>
              <ValidatorForm
                ref={commentForm}
                onSubmit={handleNewCommentSubmit}
              >
                <TextValidator
                  value={newComment}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={5}
                  onChange={handlenewCommentChange}
                  validators={['required']}
                  errorMessages={[t('messages.blog.form.commentRequired')]}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button variant="outlined" type="submit" color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }>{t('pages.common.submit')}</Button>
                      </InputAdornment>
                    )
                  }}
                />
              </ValidatorForm>
            </Grid>
          </Grid>
        }
        {
          !(user && user._id) &&
          <div style={{ textAlign: "center" }}>
            <span style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={checkLogin}>{t('pages.blog.commentLogin')}</span> {t('pages.blog.leaveComment')}
          </div>
        }
      </Container>
    )
  }
 
  const checkLogin = () => {
    if (!(auth && auth.userId)) {
      router.push(`/auth/login?from=blog/${blogId}`);

      return false;
    }

    return true;
  }

  const checkCollected = (collectionList: string[]) => {
    for (let collection of collectionList) {
      if (collection['blogIds'].indexOf(blogId) !== -1) {
        setCollected(true);
        return;
      }
    }
    setCollected(false);
  }

  const handLikeButtonClick = async () => {
    if (!checkLogin()) return;
    try {
      dispatch(setProgressOn(true));
      await axios.post(
        `${process.env.NEXT_PUBLIC_COMMENT_API}/likes/blog/${blogId}`,
        null,
        {
          headers: {
            Authorization: 'Bearer ' + auth.jwt
          }
        }
      );
      setLiked(!liked);
      await getLikeAmount();
    } catch (err) {
      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: t(`messages.common.unknownError`)
      }));
    }
    dispatch(setProgressOn(false));
  }

  const handleDialogOpen = () => {
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleCollectionNameChange = (event) => {
    const value = event.currentTarget.value;
    setCollectionName(value);
  }
  
  const handCollectButtonClick = async () => {
    if (!checkLogin()) return;
    dispatch(setProgressOn(true));
    await getCollections();
    handleDialogOpen();
    dispatch(setProgressOn(false));
  }

  const handleCollectionNameFormSubmit = async () => {
    dispatch(setProgressOn(true));
    try {
      const postData = {
        name: collectionName
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_COMMENT_API}/collections`,
        postData,
        {
          headers: {
            Authorization: 'Bearer ' + auth.jwt
          }
        }
      );
      setCollectionName('')
      await getCollections();
    } catch (err) {
      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: t(`messages.common.unknownError`)
      }));
    }
    dispatch(setProgressOn(false));
  }

  const handleCheckBoxChange = async (e) => {
    dispatch(setProgressOn(true));
    try {
      const collectionId = e.target.value;
      const checked = e.target.checked;
      if (checked) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_COMMENT_API}/collections/${collectionId}/blog/${blogId}`,
          null,
          {
            headers: {
              Authorization: 'Bearer ' + auth.jwt
            }
          }
        );
      } else {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_COMMENT_API}/collections/${collectionId}/blog/${blogId}`,
          {
            headers: {
              Authorization: 'Bearer ' + auth.jwt
            }
          }
        );
      }
      await getCollections();
    } catch (err) {
      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: t(`messages.common.unknownError`)
      }));
    }
    dispatch(setProgressOn(false));
  }

  const handlenewCommentChange = (event) => {
    const value = event.currentTarget.value;
    setNewComment(value);
  }

  const handleNewCommentSubmit = async () => {
    dispatch(setProgressOn(true));
    try {
      const postData = {
        comment: newComment,
        blogId
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_COMMENT_API}/comments`,
        postData,
        {
          headers: {
            Authorization: 'Bearer ' + auth.jwt
          }
        }
      );
      // reset new comment value
      setNewComment('');
      // refresh comments
      await getComments();
      await getCommentAmount();
    } catch {
      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: t(`messages.common.unknownError`)
      }));
    }
    dispatch(setProgressOn(false));
  }

  const getComments = async () => {
    try {
      const commentResponse = await axios.get(`${process.env.NEXT_PUBLIC_COMMENT_API}/comments/blog/${blogId}`);
      let commentList = commentResponse.data.payload.commentList;
      let userIds = _.map(commentList, 'userId');
      // get userInfo for comments
      const postData = userIds;
      const userResponse = await axios.post(`${process.env.NEXT_PUBLIC_USER_API}/users/users`, postData);
      const userInfoList = userResponse.data.payload;
      const userInfoMap = _.keyBy(userInfoList, '_id');
      commentList = commentList.map(comment => ({
        ...comment,
        user: userInfoMap[comment['userId']] || {}
      }))      
      setComments(commentList);
    } catch (err) {
      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: t(`messages.common.unknownError`)
      }));
    }
  }

  const getCommentAmount = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_COMMENT_API}/comments/blog/${blogId}/amount`);
      setCommentAmount(data.payload);
    } catch (err) {
      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: t(`messages.common.unknownError`)
      }));
    }
  }

  const getLikeAmount = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_COMMENT_API}/likes/blog/${blogId}/amount`);
      setLikeAmount(data.payload);
    } catch (err) {
      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: t(`messages.common.unknownError`)
      }));
    }
  }

  const getCollections = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_COMMENT_API}/collections`,
        {
          headers: {
            Authorization: 'Bearer ' + auth.jwt
          }
        }
      );
      setCollections(data.payload);
      checkCollected(data.payload);
    } catch (err) {
      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: t(`messages.common.unknownError`)
      }));
    }
  }

  const getAuthorInfo = async () => {
    // get author info
    let response = await axios.get(`${process.env.NEXT_PUBLIC_USER_API}/users/${blog['userId']}`);
    const userInfo = response.data.payload;
    setAuthor(userInfo);
  }

  const getBlog = async () => {
    dispatch(setProgressOn(true));
    try {
      // get blog info
      let response = await axios.get(
        `${process.env.NEXT_PUBLIC_BLOG_API}/blogs/${blogId}`,
        {
          headers: {
            Authorization: 'Bearer ' + auth.jwt
          }
        }
      );
      const blogInfo = response.data.payload;
      setBlog(blogInfo);
      setLiked(blogInfo['liked']);
      const converter = new QuillDeltaToHtmlConverter(blogInfo['content'], {});
      setContent(converter.convert());
    } catch (err) {
      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: t(`messages.common.unknownError`)
      }));
      setTimeout(() => {
        router.push(`/`);
      }, 3000);
    }
    dispatch(setProgressOn(false));
  }

  useEffect(() => {
    getBlog();
    getComments();
    getCommentAmount();
    getLikeAmount();
    if (auth.jwt) {
      getCollections();
    }
  }, [auth]);

  useEffect(() => {
    if (blog['userId']) {
      getAuthorInfo();
    }
  }, [blog['userId']]);

  return (
    <Layout>
      <Head>
        <title>{`${blog['title']} | iBlog`}</title>
      </Head>
      <div className="blog">
        <Container maxWidth="md" className="container">
          <div>
            <Grid container spacing={4}>
              <Grid item xs={12}>
              {
                blog['cover'] &&
                <div><img className="ql-image" src={`${blog['cover']}`} /></div>
              }
              </Grid>
              <Grid item xs={12}>
                <div className="title">{blog['title']}</div>
              </Grid>
              <Hidden xsDown>
                <Grid item xs={8}>
                  <Profile
                    userId={_.get(author, '_id')}
                    username={_.get(author, 'username', [])}
                    avatar={_.get(author, 'userInfo.avatar')}
                    updatedDate={blog['updatedDate']}
                    showFollow={false}
                  />
                </Grid>
                <Grid item xs={4}>
                  {functionButtons("flex-end")}
                </Grid>
              </Hidden>
              <Hidden smUp>
                <Grid item xs={12}>
                  {functionButtons("flex-start")}
                </Grid>
                <Grid item xs={12}>
                  <Profile
                    userId={_.get(author, '_id')}
                    username={_.get(author, 'username', [])}
                    avatar={_.get(author, 'userInfo.avatar')}
                    updatedDate={blog['updatedDate']}
                    showFollow={false}
                  />
                </Grid>
              </Hidden>
              <Grid item xs={12}>
                <div>{parse(content)}</div>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <Profile
                      userId={_.get(author, '_id')}
                      username={_.get(author, 'username', [])}
                      avatar={_.get(author, 'userInfo.avatar')}
                      updatedDate={blog['updatedDate']}
                      showFollow={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {functionButtons("flex-end")}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <FavoriteIcon color="primary" />
                      </Grid>
                      <Grid item>
                        {likeAmount} {t('pages.blog.likes')}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                      <CommentIcon color="primary" />
                      </Grid>
                      <Grid item>
                        {commentAmount} {t('pages.blog.comments')}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {commentSection()}
              </Grid>
              <Grid item xs={12}>
                {newCommentSection()}
              </Grid>
            </Grid>
          </div>
        </Container>
        {collectionSection()}
      </div>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  const { global, auth, user } = state;
  return {
    paletteType: global && global.paletteType || PaletteTypeEnum.light,
    message: global && global.message,
    auth: auth && auth.auth,
    user: user && user.user || null
  }
}

ViewBlogPage.getInitialProps = async () => {
  return {
    namespacesRequired: ['common']
  }
}

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(ViewBlogPage)
