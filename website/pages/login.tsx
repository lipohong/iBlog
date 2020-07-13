import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FacebookProvider, LoginButton } from 'react-facebook';
import { compose } from 'redux';
import { useCookies } from 'react-cookie';
import PaletteTypeEnum from '../enum/PaletteTypeEnum';

// mui
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Brightness4Icon from '@material-ui/icons/Brightness4';

import { SET_PALETTETYPE } from '../constants/actionTypes';
import defaultNextI18Next from '../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

// components

function Login({ paletteType, dispatch, t }) {
  const [cookies, setCookie] = useCookies(['iBlog']);

  const swithPaletteType = () => {
    if (paletteType === PaletteTypeEnum.light) {
      setCookie('paletteType', PaletteTypeEnum.dark, { path: '/' });
      dispatch({ type: SET_PALETTETYPE, paletteType: PaletteTypeEnum.dark});
    } else {
      setCookie('paletteType', PaletteTypeEnum.light, { path: '/' });
      dispatch({ type: SET_PALETTETYPE, paletteType: PaletteTypeEnum.light});
    }
  }

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
    <div className={`login layout ${paletteType}`}>
      <AppBar position='fixed'>
        <Toolbar>
          <Typography variant="h6" noWrap>
            iBlog
          </Typography>
          <div>
            <IconButton
              onClick={swithPaletteType}
            >
              { paletteType === PaletteTypeEnum.light ? <Brightness4Icon /> : <Brightness5Icon /> }
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
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
        </Paper>
      </div>
    </div>
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