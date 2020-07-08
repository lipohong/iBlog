import { useEffect } from 'react';
import Head from 'next/head';
import { compose } from 'redux';
import { connect } from 'react-redux';

import defaultNextI18Next from '../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

// components
import Layout from '../components/layout';

function HomePage({envTest}) {

  const init = async () => {
    // console.log(envTest);
    i18n.changeLanguage('zh');
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <Head>
        <title>iBlog HomePage</title>
      </Head>
      <div>Home</div>
    </Layout>
  )
}


const mapStateToProps = (state) => {
  const { global } = state;
  return {
    paletteType: global && global.paletteType || 'light'
  }
}

HomePage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(HomePage)
