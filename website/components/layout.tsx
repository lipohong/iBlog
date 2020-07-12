// import Link from 'next/link';
import Router from 'next/router';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useCookies } from 'react-cookie';

import { SET_PALETTETYPE } from '../constants/actionTypes';

import defaultNextI18Next from '../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;


function Layout(props) {
  const { children, paletteType, dispatch, t } = props;

  const [cookies, setCookie] = useCookies(['iBlog']);

  useEffect(() => {
    if (!!cookies.paletteType) {
      dispatch({ type: SET_PALETTETYPE, paletteType: cookies.paletteType});
    } else {
      setCookie('paletteType', 'light', { path: '/' });
    }
  }, [])
  
  return (
    <div className={`layout ${paletteType}`}>
      <div>
        <Link href="/"><a>{t('Home')}</a></Link> | 
        <Link href="/test/abcdefg" scroll={false}><a>{t('Test')}</a></Link> | 
        <Link href="/about"><a>{t('About')}</a></Link> | 
        <Link href="/login"><a>{t('Login')}</a></Link>
      </div>
      {children}
    </div>
  )
}

const mapStateToProps = (state) => {
  const { global } = state;
  return {
    paletteType: global && global.paletteType || 'light'
  }
}

Layout.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(Layout)