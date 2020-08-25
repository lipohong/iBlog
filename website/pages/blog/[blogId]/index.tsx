import axios from 'axios';
import * as _ from 'lodash';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { compose } from 'redux';
import { connect } from 'react-redux';

import defaultNextI18Next from '../../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
import parse from 'html-react-parser';

const moment = require( "moment" );

// mui
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import FacebookIcon from '@material-ui/icons/Facebook';
import CommentIcon from '@material-ui/icons/Comment';

// components
import Layout from '../../../components/layout';

import { SeverityEnum } from '../../../enums/SeverityEnum';
import { PaletteTypeEnum } from '../../../enums/PaletteTypeEnum';
import { setMessage, setProgressOn } from '../../../store/actions/globalActions';


function ViewBlogPage(props) {
  const { dispatch, t, auth, paletteType } = props;
  const [blog, setBlog] = useState({});
  const [author, setAuthor] = useState({});
  const [content, setContent] = useState('');
  const [collections, setCollections] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { blogId } = router.query;

  const checkLogin = () => {
    if (!(auth && auth.userId)) {
      router.push(`/auth/login?from=blog/${blogId}`);

      return false;
    }

    return true;
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
      await init();
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

  const handCollectButtonClick = async () => {
    if (!checkLogin()) return;
    try {
      dispatch(setProgressOn(true));
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_COMMENT_API}/collections`,
        {
          headers: {
            Authorization: 'Bearer ' + auth.jwt
          }
        }
      );
      setCollections(data.payload);
      handleDialogOpen();
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

  const profileSection = () => {
    return (
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Link href={`/user/profile/${_.get(author, '_id')}`}>
            <Avatar src={`${_.get(author, 'userInfo.avatar')}`} style={{ width: '50px', height: '50px', cursor: 'pointer' }}>
              { !_.get(author, 'userInfo.avatar') && _.get(author, 'username', [])[0] }
            </Avatar>
          </Link>
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Link href={`/user/profile/${_.get(author, '_id')}`}>
                <span style={{ cursor: 'pointer' }}>{_.get(author, 'username')}</span>
              </Link>
              {
                _.get(author, '_id') !== _.get(auth, 'userId') &&
                <Button
                  size="small"
                  variant="outlined"
                  style={{ margin: "auto 10px" }}
                  color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
                >
                  Follow
                </Button>
              }
            </Grid>
            <Grid item xs={12}>
              <div className="updatedDate">{moment(blog['updatedDate']).format('YYYY-MM-DD')}</div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
  
  const functionButtons = (textAlign) => {
    return (
      <Grid container justify={textAlign}>
        <Grid item>
          <Tooltip title={blog['liked'] ? "Unlike" : "Like"}>
            <IconButton
              onClick={handLikeButtonClick}
              color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
            >
              {
                blog['liked'] ?
                <FavoriteIcon /> :
                <FavoriteBorderIcon />
              }
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Collect">
            <IconButton
              onClick={handCollectButtonClick}
              color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
            >
              {
                blog['collected'] ?
                <StarIcon /> :
                <StarBorderIcon />
              }
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Forward to facebook">
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

  const init = async () => {
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
      const converter = new QuillDeltaToHtmlConverter(blogInfo['content'], {});
      setContent(converter.convert());

      // get author info
      response = await axios.get(`${process.env.NEXT_PUBLIC_USER_API}/users/${blogInfo['userId']}`);
      const userInfo = response.data.payload;
      setAuthor(userInfo);
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
    init();

  }, [auth]);

  return (
    <Layout>
      <Head>
        <title>{`${blog['title']} | iBlog`}</title>
      </Head>
      <div className="blog">
        <Container maxWidth="md" className="container">
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
              {
                blog['cover'] &&
                <div>
                  <img className="ql-image" src={`${blog['cover']}`} />
                </div>
              }
              </Grid>
              <Grid item xs={12}>
                <div className="title">{blog['title']}</div>
              </Grid>
              <Hidden xsDown>
                <Grid item xs={8}>
                  {profileSection()}
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
                  {profileSection()}
                </Grid>
              </Hidden>
              <Grid item xs={12}>
                <div>{parse(content)}</div>
              </Grid>
              <Grid item xs={12}>
                {functionButtons("flex-end")}
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <FavoriteIcon color="primary" />
                      </Grid>
                      <Grid item>
                        {blog['likes']} Likes
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                      <CommentIcon color="primary" />
                      </Grid>
                      <Grid item>
                        {blog['comments']} comments
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                
              </Grid>
            </Grid>
          </div>
        </Container>
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          className="dialogContainer"
        >
          <DialogTitle>Collect</DialogTitle>
          <DialogContent>
            <Container>
              <Grid container>

              </Grid>
            </Container>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  const { global, auth, user } = state;
  return {
    paletteType: global && global.paletteType || PaletteTypeEnum.light,
    message: global && global.message,
    auth: auth && auth.auth || null,
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
