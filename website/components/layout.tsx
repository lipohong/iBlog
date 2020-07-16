// import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useCookies } from 'react-cookie';

// mui
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import TranslateIcon from '@material-ui/icons/Translate';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { SET_PALETTETYPE, SET_THEME } from '../constants/actionTypes';
import { PaletteTypeEnum } from '../enums/PaletteTypeEnum';

import defaultNextI18Next from '../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;


function Layout(props) {
  const { children, paletteType, dispatch, t } = props;

  const [cookies, setCookie] = useCookies(['iBlog']);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isLanguageMenuOpen = Boolean(anchorEl);

  const switchPaletteType = () => {
    if (paletteType === PaletteTypeEnum.light) {
      setCookie('paletteType', PaletteTypeEnum.dark, { path: '/' });
      dispatch({ type: SET_PALETTETYPE, paletteType: PaletteTypeEnum.dark});
    } else {
      setCookie('paletteType', PaletteTypeEnum.light, { path: '/' });
      dispatch({ type: SET_PALETTETYPE, paletteType: PaletteTypeEnum.light});
    }
  }

  const switchToEn = () => {
    i18n.changeLanguage('en');
    handleLanguageMenuClose();
  }

  const switchToZh = () => {
    i18n.changeLanguage('zh');
    handleLanguageMenuClose();
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

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setAnchorEl(null);
  };

  const switchTheme = (number: Number) => {
    dispatch({ type: SET_THEME, theme: number});
    handleThemeMenuClose()
  }

  useEffect(() => {
    if (!!cookies.paletteType) {
      dispatch({ type: SET_PALETTETYPE, paletteType: cookies.paletteType});
    } else {
      setCookie('paletteType', PaletteTypeEnum.light, { path: '/' });
    }
    if (!!cookies.theme) {
      dispatch({ type: SET_THEME, theme: cookies.theme});
    } else {
      setCookie('theme', 0, { path: '/' });
    }
  }, [])
  
  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position='relative' color='default'>
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
              onClick={handleLanguageMenuOpen}
              color="inherit"
            >
              <InvertColorsIcon />
            </IconButton>
            <IconButton
              onClick={handleThemeMenuOpen}
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
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={isLanguageMenuOpen}
          onClose={handleLanguageMenuClose}
        >
          <MenuItem onClick={switchToZh}>繁</MenuItem>
          <MenuItem onClick={switchToEn}>EN</MenuItem>
        </Menu>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={isLanguageMenuOpen}
          onClose={handleThemeMenuClose}
        >
          {/* { [1, 2, 3].map(number => {
            <MenuItem onClick={switchTheme(number)}>Theme {number}</MenuItem>
          }) } */}
        </Menu>
        {children}
      </div>
      <style global jsx>{`
        body {
          color: ${ paletteType === PaletteTypeEnum.light ? '#000' : '#fff'};
          background-color:  ${ paletteType === PaletteTypeEnum.light ? '#eee' : '#000'};
        }
      `}</style>
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