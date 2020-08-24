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
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

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
  const router = useRouter();

  const init = async () => {
    const { blogId } = router.query;

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

  }, []);

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
              <Grid item xs={12} sm={6}>
                <Grid container spacing={3} alignItems="center">
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
                          _.get(author, '_id') == _.get(auth, 'userId') &&
                          <Button
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
              </Grid>
              <Grid item xs={12} sm={6}>
                forward
              </Grid>
              <Grid item xs={12}>
                <div>{parse(content)}</div>
              </Grid>
            </Grid>
          </div>
        </Container>
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
