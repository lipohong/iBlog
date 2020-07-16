import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FacebookProvider, LoginButton } from 'react-facebook';
import { compose } from 'redux';
import { useCookies } from 'react-cookie';
import { PaletteTypeEnum } from '../enums/PaletteTypeEnum';

// mui
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { SET_PALETTETYPE } from '../constants/actionTypes';
import defaultNextI18Next from '../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

// components
import Layout from '../components/layout';

function Login({ paletteType, dispatch, t }) {
  const [cookies, setCookie] = useCookies(['iBlog']);

  const handleResponse = (res) => {
    console.log(res);
    
  }

  const handleError = (res) => {
    console.log(res);
  }

  useEffect(() => {
    if (!!cookies.paletteType) {
      dispatch({ type: SET_PALETTETYPE, paletteType: cookies.paletteType});
    } else {
      setCookie('paletteType', PaletteTypeEnum.light, { path: '/' });
    }
  }, [])

  return (
    <Layout>
      <div className='login'>
        <div className={'paperContainer'}>
          <Paper className='paperStyle'>
            <FacebookProvider appId="614470885873864">
              <LoginButton
                scope="email"
                onCompleted={handleResponse}
                onError={handleError}
                className="facebookButton"
              >
                <span>{ t('loginViaFacebook') }</span>
              </LoginButton>
            </FacebookProvider>
            <Button variant="contained" color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }>test</Button>
          </Paper>
        </div>
      </div>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  const { global } = state;
  return {
    paletteType: global && global.paletteType || PaletteTypeEnum.light
  }
}

Login.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(Login)