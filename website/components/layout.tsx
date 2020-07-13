// import Link from 'next/link';
import Router from 'next/router';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useCookies } from 'react-cookie';

// mui
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Brightness4Icon from '@material-ui/icons/Brightness4';

import { SET_PALETTETYPE } from '../constants/actionTypes';
import { PaletteTypeEnum } from '../enums/PaletteTypeEnum';

import defaultNextI18Next from '../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;


function Layout(props) {
  const { children, paletteType, dispatch, t } = props;

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

  let themeConfig = paletteType === PaletteTypeEnum.dark ? {
    palette: {
      type: PaletteTypeEnum.dark
    }
  } : {
    type: PaletteTypeEnum.light,
    primary: {
      main: '#03a9f4',
    },
    secondary: {
      main: '#00e5ff',
    },
    background: {
      default: '#ffffff',
    }
  }
  let theme = createMuiTheme(themeConfig);

  useEffect(() => {
    if (!!cookies.paletteType) {
      dispatch({ type: SET_PALETTETYPE, paletteType: cookies.paletteType});
    } else {
      setCookie('paletteType', PaletteTypeEnum.light, { path: '/' });
    }
  }, [])
  
  return (
    <ThemeProvider theme={theme}>
      <div className={`layout ${paletteType}`}>
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
            <div>
              <Link href="/"><a>{t('Home')}</a></Link> | 
              <Link href="/test/abcdefg" scroll={false}><a>{t('Test')}</a></Link> | 
              <Link href="/about"><a>{t('About')}</a></Link> | 
              <Link href="/login"><a>{t('Login')}</a></Link>
            </div>
          </Toolbar>
        </AppBar>
        {children}
      </div>
    </ThemeProvider>
  )
}

const mapStateToProps = (state) => {
  const { global } = state;
  return {
    paletteType: global && global.paletteType || PaletteTypeEnum.light
  }
}

Layout.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(Layout)