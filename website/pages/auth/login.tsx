import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { FacebookProvider, LoginButton } from 'react-facebook';
import { compose } from 'redux';
import { useCookies } from 'react-cookie';
import { PaletteTypeEnum } from '../../enums/PaletteTypeEnum';

// mui
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FacebookIcon from '@material-ui/icons/Facebook';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import { SET_PALETTETYPE } from '../../constants/actionTypes';
import defaultNextI18Next from '../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

// components
import Layout from '../../components/layout';

function Login({ paletteType, dispatch, t }) {
  const [cookies, setCookie] = useCookies(['iBlog']);
  const [showPassword, setShowPassword ] = useState(false);
  const inputForm = useRef('form');
  const [email, setEmail ] = useState('');
  const [password, setPassword ] = useState('');

  const handleResponse = (res) => {
    console.log(res);
  }

  const handleError = (res) => {
    console.log(res);
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleEmailChange = (event) => {
    const value = event.currentTarget.value;
    setEmail(value);
  }

  const handlePasswordChange = (event) => {
    const value = event.currentTarget.value;
    setPassword(value);
  }

  const handleSubmit = (event) => {
    console.log(event);
    
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
      <Head>
        <title>iBlog { t('headers.loginPage') }</title>
      </Head>
      <div className='login'>
        <Container className="paperContainer" maxWidth="xs">
          <Paper className='paperStyle'>
            <Container>
              <ValidatorForm
                ref={inputForm}
                onSubmit={handleSubmit}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <Typography variant="h6" noWrap>
                      {t('pages.login.iblogLogin')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" noWrap>
                    {t('pages.login.email')}
                    </Typography>
                    <TextValidator
                      name="email"
                      value={email}
                      variant="outlined"
                      fullWidth
                      validators={['required', 'isEmail']}
                      onChange={handleEmailChange}
                      errorMessages={['Email is required', 'Email is not valid']}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" noWrap>
                      {t('pages.login.password')}
                    </Typography>
                    <TextValidator
                      name="password"
                      value={password}
                      variant="outlined"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      validators={['required']}
                      onChange={handlePasswordChange}
                      errorMessages={['Password is required']}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              // onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    <span style={{ cursor: "pointer" }}>{t('pages.login.forgetPassword')}</span>
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained"
                      type="submit"
                      fullWidth
                      color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
                    >
                      {t('pages.login.submit')}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <FacebookProvider appId="614470885873864">
                      <LoginButton
                        scope="email"
                        onCompleted={handleResponse}
                        onError={handleError}
                        className="facebookButton"
                      >
                        <div className="facebookButtonTextContainer">
                          <FacebookIcon /><span>{t('pages.login.loginViaFacebook')}</span>
                        </div>
                      </LoginButton>
                    </FacebookProvider>
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <span style={{ cursor: "pointer" }}>{t('pages.login.createAccount')}</span>
                  </Grid>
                </Grid>
              </ValidatorForm>
            </Container>
          </Paper>
        </Container>
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