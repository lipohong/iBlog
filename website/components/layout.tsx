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
import TranslateIcon from '@material-ui/icons/Translate';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { SET_PALETTETYPE } from '../constants/actionTypes';
import { PaletteTypeEnum } from '../enums/PaletteTypeEnum';

import defaultNextI18Next from '../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;


function Layout(props) {
  const { children, paletteType, dispatch, t } = props;

  const [cookies, setCookie] = useCookies(['iBlog']);

  const switchPaletteType = () => {
    if (paletteType === PaletteTypeEnum.light) {
      setCookie('paletteType', PaletteTypeEnum.dark, { path: '/' });
      dispatch({ type: SET_PALETTETYPE, paletteType: PaletteTypeEnum.dark});
    } else {
      setCookie('paletteType', PaletteTypeEnum.light, { path: '/' });
      dispatch({ type: SET_PALETTETYPE, paletteType: PaletteTypeEnum.light});
    }
  }

  const switchLanguage = () => {
    i18n.changeLanguage(i18n.language ==='en' ? 'zh' : 'en');
  }

  let theme = createMuiTheme({
    palette: {
      type: paletteType,
      primary: {
        light: '#03a9f4',
        main: '#03a9f4',
        contrastText: '#fff',
      },
      secondary: {
        light: '#00e5ff',
        main: '#00e5ff',
        contrastText: '#fff',
      }
    }
  });

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
        <AppBar position='relative' color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }>
          <Toolbar>
            <Link href="/">
              <Typography variant="h6" noWrap style={{ cursor: 'pointer' }}>
                iBlog
              </Typography>
            </Link>
            <IconButton
              style={{ marginLeft: 'auto'}}
              onClick={switchPaletteType}
              color="inherit"
            >
              { paletteType === PaletteTypeEnum.light ? <Brightness4Icon /> : <Brightness5Icon /> }
            </IconButton>
            <IconButton
              onClick={switchLanguage}
              color="inherit"
            >
              <TranslateIcon />
            </IconButton>
            <Link href="/login">
              <IconButton color="inherit">
                <AccountCircleIcon />
              </IconButton>
            </Link>
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