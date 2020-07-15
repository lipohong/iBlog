import App from 'next/app'
import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import { compose } from 'redux';
import { CookiesProvider } from 'react-cookie';

import { PaletteTypeEnum } from '../enums/PaletteTypeEnum';
import reducer from '../store/reducers';
import '../assets/scss/global.scss';
import defaultNextI18Next from '../plugins/i18n';

const middleware = [ thunk ];

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

const appWithTranslation = defaultNextI18Next.appWithTranslation;

function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    
  }, []);

  return (
    <React.Fragment>
      <CookiesProvider>
        <Provider store={store}>
          <CssBaseline />
          <Component {...pageProps} />
        </Provider>
      </CookiesProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  return { ...appProps }
}

// export default compose<any>(
//   appWithTranslation
// )(MyApp)

export default appWithTranslation(MyApp);