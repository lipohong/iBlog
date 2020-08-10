import * as crypto from 'crypto-js';
import * as _ from 'lodash';
import axios from 'axios';
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
import Avatar from '@material-ui/core/Avatar';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import { setMessage, setProgressOn } from '../../store/actions/globalActions';
import { SeverityEnum } from '../../enums/SeverityEnum';

import defaultNextI18Next from '../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

// components
import Layout from '../../components/layout';

import { setAuth } from '../../store/actions/authActions';
import { setUser } from '../../store/actions/userActions';


function Profile({ paletteType, user, dispatch, t }) {
  const [cookies, setCookie, removeCookie] = useCookies(['iBlog']);
  const [showPassword, setShowPassword] = useState(false);
  const inputForm = useRef('form');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();


  const redirectToLoginPage = () => {
    router.push('/auth/login?from=user/profile')
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
        password: await encryptAES(password)
      }
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_USER_API}/users`, postData);
      const auth = {
        userId: data.payload.userId,
        jwt: data.payload.jwt
      }
      // get user info
      dispatch(await setUser(auth));

      // remember me checked
      if (rememberMe) {
        setCookie('rememberMe', postData, { path: '/' });
      } else {
        removeCookie('rememberMe', { path: '/' });
      }
      
      // store auth info
      dispatch(setAuth(auth));

      // save auth to cookies
      setCookie('auth', auth, { path: '/' });

      // login success tips
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.success,
        message: t(`messages.login.general.loginSuccess`)
      }));

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
    if (!cookies.auth) {
      // redirect to login page
      redirectToLoginPage();
      return;
    }
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <Layout>
      <Head>
        <title>iBlog { t('headers.profilePage') }</title>
      </Head>
      <div className='profile'>
        <Container className="paperContainer" maxWidth="md">
          <Paper className='paperStyle'>
            <Container>
              <ValidatorForm
                ref={inputForm}
                onSubmit={handleSubmit}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container justify="center">
                      <Avatar alt="t" src={`${user.userInfo.avatar}`} style={{ width: '150px', height: '150px', backgroundColor: '#eee' }} >
                        { !user.userInfo.avatar && user.username[0] }
                      </Avatar>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" noWrap>
                      {t('pages.login.email')}
                    </Typography>
                    <TextValidator value={user.email} variant="outlined" fullWidth disabled="true" />
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
                  <Grid item xs={12}>
                    <Button 
                      variant="contained"
                      type="submit"
                      color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
                    >
                      {t('pages.login.submit')}
                    </Button>
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
  const { global, auth, user } = state;
  return {
    paletteType: global && global.paletteType || PaletteTypeEnum.light,
    user: user && user.user || null
  }
}

Profile.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(Profile)