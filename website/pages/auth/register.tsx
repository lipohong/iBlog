import axios from 'axios';
import * as crypto from 'crypto-js';
import * as _ from 'lodash';
import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { compose } from 'redux';
import { useCookies } from 'react-cookie';
import { PaletteTypeEnum } from '../../enums/PaletteTypeEnum';

// mui
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import { setMessage, setPaletteType, setProgressOn } from '../../store/actions/globalActions';
import { SeverityEnum } from '../../enums/SeverityEnum';

import defaultNextI18Next from '../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

// components
import Layout from '../../components/layout';

function Register({ paletteType, dispatch, t }) {
  const [cookies, setCookie] = useCookies(['iBlog']);
  const inputForm = useRef('form');
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifying, setVerifying] = useState(true);

  const passwordRef = useRef(password);
  passwordRef.current = password;
  const router = useRouter();
  const { email, verifyCode } = router.query;

  const handleUsernameChange = (event) => {
    const value = event.currentTarget.value;
    setUsername(value);
  }

  const handleEmailChange = (event) => {
    const value = event.currentTarget.value;
    setUserEmail(value);
  }

  const handlePasswordChange = (event) => {
    const value = event.currentTarget.value;    
    setPassword(value);
  }

  const handleConfirmPasswordChange = (event) => {
    const value = event.currentTarget.value;
    setConfirmPassword(value);
  }

  const encryptAES = async (password: string): Promise<string> => {
    const encryptedPassword = await crypto.AES.encrypt(password, process.env.NEXT_PUBLIC_AES_SECRECT).toString();

    return encryptedPassword;
  }

  const handleSubmit = async () => {
    dispatch(setProgressOn(true));
    try {
      const postData = {
        username,
        email: userEmail,
        password: await encryptAES(password)
      }
      await axios.post(`${process.env.NEXT_PUBLIC_USER_API}/users/register`, postData);
      
      // register success tips
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.success,
        message: t(`messages.register.general.registerSuccess`)
      }));

      // redirect to login page
      router.push('/auth/login');
    } catch (err) {
      let errMessage: string;
      const message = _.get(err, 'response.data.message');
      errMessage = !!message ? t(`messages.register.errors.${message}`) : t(`messages.common.unknownError`);
      
      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: errMessage
      }));
    }
    dispatch(setProgressOn(false));
  }

  const registerVerify = async () => {
    dispatch(setProgressOn(true));
      try {
        const postData = {
          email,
          verifyCode
        }
        await axios.post(`${process.env.NEXT_PUBLIC_USER_API}/users/registerVerify`, postData);

        dispatch(setMessage({
          open: true,
          severity: SeverityEnum.success,
          message: t(`messages.register.general.activateSuccess`)
        }));
        
        // redirect to login page
        router.push('/auth/login');
      } catch (err) {
        const message = _.get(err, 'response.data.message');
        const errMessage = !!message ? t(`messages.register.errors.${message}`) : t(`messages.common.unknownError`);

        // show error message
        dispatch(setMessage({
          open: true,
          severity: SeverityEnum.error,
          message: errMessage
        }));
          
        setVerifying(false);
      }
    dispatch(setProgressOn(false));
  }

  const init = async () => {
    if (!!email && !!verifyCode) {
      registerVerify();
    }
    ValidatorForm.addValidationRule('isPasswordMatch', (value: string) => {
      if (value !== passwordRef.current) {
          return false;
      }
      return true;
    });
  }

  useEffect(() => {
    init();
    return () => ValidatorForm.removeValidationRule('isPasswordMatch');
  }, []);

  return (
    <Layout>
      <Head>
        <title>iBlog { t('headers.registerPage') }</title>
      </Head>
      <div className='register'>
        <Container className="paperContainer" maxWidth="xs">
          {
            !!email && !!verifyCode &&
            <div className="pageMeassage">
              { verifying ? t(`messages.register.general.activatingAccount`) : t(`messages.register.errors.activateFail`) }
            </div>
          }
          {
            !(email && verifyCode) &&
            <Paper className='paperStyle'>
              <Container>
                <ValidatorForm
                  ref={inputForm}
                  onSubmit={handleSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                      <Typography variant="h6" noWrap>
                        {t('pages.register.iblogRegister')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" noWrap>
                      {t('pages.register.username')}
                      </Typography>
                      <TextValidator
                        name="username"
                        value={username}
                        variant="outlined"
                        fullWidth
                        validators={['required']}
                        onChange={handleUsernameChange}
                        errorMessages={[t('messages.register.form.usernameRequired')]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" noWrap>
                      {t('pages.register.email')}
                      </Typography>
                      <TextValidator
                        name="email"
                        value={userEmail}
                        variant="outlined"
                        fullWidth
                        validators={['required', 'isEmail']}
                        onChange={handleEmailChange}
                        errorMessages={[t('messages.register.form.emailRequired'), t('messages.register.form.emailNotValid')]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" noWrap>
                        {t('pages.register.password')}
                      </Typography>
                      <TextValidator
                        name="password"
                        value={password}
                        variant="outlined"
                        type='password'
                        fullWidth
                        autoComplete='false'
                        validators={['required']}
                        onChange={handlePasswordChange}
                        errorMessages={[t('messages.register.form.passwordRequired')]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" noWrap>
                        {t('pages.register.confirmPassword')}
                      </Typography>
                      <TextValidator
                        name="repeatPassword"
                        value={confirmPassword}
                        variant="outlined"
                        type='password'
                        fullWidth
                        autoComplete='false'
                        validators={['isPasswordMatch', 'required']}
                        onChange={handleConfirmPasswordChange}
                        errorMessages={[t('messages.register.form.passwordMissmatch'), t('messages.register.form.confirmPasswordRequired')]}
                      />
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
                    <Grid item xs={12} style={{ textAlign: "center", marginTop: '40px' }}>
                      <Link href="/auth/login">
                        <span style={{ cursor: "pointer" }}>{t('pages.register.alreadyHaveAccount')}</span>
                      </Link>
                    </Grid>
                  </Grid>
                </ValidatorForm>
              </Container>
            </Paper>
          }
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

Register.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(Register)