import { useEffect } from 'react';
import Head from 'next/head';
import { compose } from 'redux';
import { connect } from 'react-redux';

import defaultNextI18Next from '../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

// mui
import Container from '@material-ui/core/Container';
import SortIcon from '@material-ui/icons/Sort';

// components
import Layout from '../components/layout';


function HomePage({ t, dispatch }) {

  const init = async () => {
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <Head>
        <title>iBlog { t('headers.homePage') }</title>
      </Head>
      <div className="home">
        <Container maxWidth="md">
          <div className="functionBar"><SortIcon />Sort by: update time</div>
        </Container>
      </div>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  const { global } = state;
  return {
    message: global && global.message
  }
}

HomePage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(HomePage)
