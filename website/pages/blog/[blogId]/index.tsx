import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { compose } from 'redux';
import { connect } from 'react-redux';

import defaultNextI18Next from '../../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
import parse from 'html-react-parser';

// mui
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

// components
import Layout from '../../../components/layout';

import { SeverityEnum } from '../../../enums/SeverityEnum';
import { PaletteTypeEnum } from '../../../enums/PaletteTypeEnum';
import { setMessage, setProgressOn } from '../../../store/actions/globalActions';


function ViewBlogPage(props) {
  const { dispatch, t, auth, paletteType } = props;
  const [content, setContent] = useState('<div></div>');
  const router = useRouter();

  const init = async () => {
    const { blogId } = router.query;

    dispatch(setProgressOn(true));
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BLOG_API}/blogs/${blogId}`,
        {
          headers: {
            Authorization: 'Bearer ' + auth.jwt
          }
        }
      );
      const converter = new QuillDeltaToHtmlConverter(data.payload['content'], {});
      setContent(converter.convert());      
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

  useEffect(() => {
    init();

  }, []);

  return (
    <Layout>
      <Head>
        <title>iBlog { t('headers.createBlogPage') }</title>
      </Head>
      <div className="blog">
        <Container maxWidth="md" className="container">
          <Paper>
            <Container>
              {parse(content)}
            </Container>
          </Paper>
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
