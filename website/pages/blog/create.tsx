import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { compose } from 'redux';
import { connect } from 'react-redux';

import defaultNextI18Next from '../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

// mui
import Container from '@material-ui/core/Container';


// components
import Layout from '../../components/layout';


function CreateBlogPage(props) {
  const [value, setValue] = useState('');
  const { t, auth, document } = props;
  const router = useRouter();
  const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

  const init = async () => {
    if (!auth && !auth.userId) {
      router.push(`/auth/login?from=blog/create`)
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <Head>
        <title>iBlog { t('headers.createBlogPage') }</title>
        <link rel="stylesheet" href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"></link>
      </Head>
      <div className="blog">
        <Container maxWidth="md">
          <ReactQuill theme="snow" value={value} onChange={setValue}/>
        </Container>
      </div>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  const { global, auth, user } = state;
  return {
    message: global && global.message,
    auth: auth && auth.auth || null,
    user: user && user.user || null
  }
}

CreateBlogPage.getInitialProps = async () => ({
  namespacesRequired: ['common']
})

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(CreateBlogPage)
