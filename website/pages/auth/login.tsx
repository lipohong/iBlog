import axios from 'axios';
import * as crypto from 'crypto-js';
import * as _ from 'lodash';
import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FacebookIcon from '@material-ui/icons/Facebook';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import { setMessage, setPaletteType, setProgressOn } from '../../store/actions/globalActions';
import { SeverityEnum } from '../../enums/SeverityEnum';

import defaultNextI18Next from '../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

// components
import Layout from '../../components/layout';
import { setAuth } from 'store/actions/authActions';

function Login({ paletteType, dispatch, t }) {
  const [cookies, setCookie, removeCookie] = useCookies(['iBlog']);
  const [showPassword, setShowPassword] = useState(false);
  const inputForm = useRef('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { from } = router.query;


  const redirectToPreviousPage = () => {
    if (!!from && from !== '/' && from !== 'auth/login') {
      router.push(`/${from}`);
    } else {
      router.push(`/`);
    }
  }

  const handleResponse = async (res) => {
    const { profile, tokenDetail } = res;
    dispatch(setProgressOn(true));
    try {
      const postData = {
        email: profile.email,
        accessToken: tokenDetail.accessToken
      }
      const res = await axios.post(`${process.env.NEXT_PUBLIC_USER_API}/users/facebook`, postData);

      // store auth info
      dispatch(setAuth({
        userId: res.data.payload.userId,
        jwt: res.data.payload.jwt
      }));

      // save auth to cookies
      setCookie('auth', res.data.payload, { path: '/' });

      // login success tips
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.success,
        message: t(`messages.login.general.loginSuccess`)
      }));

      // redirect to previous page
      redirectToPreviousPage();
    } catch (err) {
      let errMessage: string;
      const message = _.get(err, 'response.data.message');
      errMessage = !!message ? t(`messages.login.errors.${message}`) : t(`messages.common.unknownError`);

      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: errMessage
      }));
    }
    dispatch(setProgressOn(false));
  }

  const handleError = (res) => {
    dispatch(setMessage({
      open: true,
      severity: SeverityEnum.error,
      message: t(`messages.common.unknownError`)
    }));
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

  const encryptAES = async (password: string): Promise<string> => {
    const encryptedPassword = await crypto.AES.encrypt(password, process.env.NEXT_PUBLIC_AES_SECRECT).toString();

    return encryptedPassword;
  }

  const decryptAES = async (encryptedPassword: string): Promise<string> => {
    const bytes = crypto.AES.decrypt(encryptedPassword, process.env.NEXT_PUBLIC_AES_SECRECT);
    const decryptPassword = bytes.toString(crypto.enc.Utf8);

    if (!decryptPassword) {
      throw new Error('ex_incorrect_password');
    }

    return decryptPassword;
  }

  const handleSubmit = async () => {
    dispatch(setProgressOn(true));
    try {
      const postData = {
        email,
        password: await encryptAES(password)
      }
      const res = await axios.post(`${process.env.NEXT_PUBLIC_USER_API}/users`, postData);

      // remember me checked
      if (rememberMe) {
        setCookie('rememberMe', postData, { path: '/' });
      } else {
        removeCookie('rememberMe', { path: '/' });
      }
      
      // store auth info
      dispatch(setAuth({
        userId: res.data.payload.userId,
        jwt: res.data.payload.jwt
      }));

      // save auth to cookies
      setCookie('auth', res.data.payload, { path: '/' });

      // login success tips
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.success,
        message: t(`messages.login.general.loginSuccess`)
      }));

      // redirect to previous page
      redirectToPreviousPage();
    } catch (err) {
      let errMessage: string;
      const message = _.get(err, 'response.data.message');
      errMessage = !!message ? t(`messages.login.errors.${message}`) : t(`messages.common.unknownError`);

      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: errMessage
      }));
    }
    dispatch(setProgressOn(false));
  }

  const handleRememberMeChange = (event) => {
    setRememberMe(event.currentTarget.checked);
  }

  const init = async () => {
    if (!!cookies.auth) {
      // store auth info
      dispatch(setAuth(cookies.auth));

      // redirect to previous page
      redirectToPreviousPage();
      return;
    }
    if (!!cookies.rememberMe) {
      const postData = cookies.rememberMe;
      setRememberMe(true);
      setEmail(postData.email);
      setPassword(await decryptAES(postData.password));
    }
  }

  useEffect(() => {
    init();
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
                      errorMessages={[t('messages.login.form.emailRequired'), t('messages.login.form.emailNotValid')]}
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
                      errorMessages={[t('messages.login.form.passwordRequired')]}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
                          checked={rememberMe}
                          onChange={handleRememberMeChange} name="remember" />
                        }
                      label={t('pages.login.rememberMe')}
                    />
                    <Link href="/auth/forgetPassword">
                      <span style={{ cursor: "pointer" }}>{t('pages.login.forgetPassword')}</span>
                    </Link>
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
                  <Link href="/auth/register">
                    <span style={{ cursor: "pointer" }}>{t('pages.login.createAccount')}</span>
                  </Link>
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