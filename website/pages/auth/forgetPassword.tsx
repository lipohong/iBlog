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
const { Link, withTranslation } = defaultNextI18Next;

// components
import Layout from '../../components/layout';

function ForgetPassword ({ paletteType, dispatch, t }) {
  const [cookies, setCookie] = useCookies(['iBlog']);
  const inputForm = useRef('form');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [disableSendEmail, setDisableSendEmail] = useState(false);
  const [countDown, setCountDown] = useState(60);
  const countRef = useRef(countDown);
  countRef.current = countDown;

  const passwordRef = useRef(password);
  passwordRef.current = password;
  const router = useRouter();


  const handleEmailChange = (event) => {
    const value = event.currentTarget.value;
    setUserEmail(value);
  }

  const handleVerifyCodeChange = (event) => {
    const value = event.currentTarget.value;
    setVerifyCode(value);
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

  const sendVerifyCodeEmail = async () => {
    dispatch(setProgressOn(true));
    try {
      if (!userEmail) {
        dispatch(setMessage({
          open: true,
          severity: SeverityEnum.error,
          message: t(`messages.forgetPassword.form.emailRequired`)
        }));
        dispatch(setProgressOn(false));

        return
      }
      const postData = {
        email: userEmail
      }
      await axios.post(`${process.env.NEXT_PUBLIC_USER_API}/users/forgetPassword`, postData);
      
      // register success tips
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.success,
        message: t(`messages.forgetPassword.general.sendVerifyCodeSuccess`)
      }));

      // disable send email
      setDisableSendEmail(true);

      // set timer to ban email sending
      const timer = setInterval(() => {
        if (countRef.current > 0) {
          setCountDown(countRef.current - 1);
        } else {
          clearInterval(timer);
          setCountDown(60);
          setDisableSendEmail(false);
        }
      }, 1000);
    } catch (err) {
      let errMessage: string;
      const message = _.get(err, 'response.data.message');
      errMessage = !!message ? t(`messages.forgetPassword.errors.${message}`) : t(`messages.common.unknownError`);
      console.log(err);
      
      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: errMessage
      }));
    }
    dispatch(setProgressOn(false));
  } 

  const handleSubmit = async () => {
    dispatch(setProgressOn(true));
    try {
      const postData = {
        email: userEmail,
        verifyCode,
        password: await encryptAES(password)
      }
      await axios.post(`${process.env.NEXT_PUBLIC_USER_API}/users/resetPassword`, postData);
      
      // register success tips
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.success,
        message: t(`messages.forgetPassword.general.resetPasswordSuccess`)
      }));

      // redirect to login page
      router.push('/auth/login');
    } catch (err) {
      let errMessage: string;
      const message = _.get(err, 'response.data.message');
      errMessage = !!message ? t(`messages.forgetPassword.errors.${message}`) : t(`messages.common.unknownError`);
      console.log(err);
      
      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: errMessage
      }));
    }
    dispatch(setProgressOn(false));
  }

  const init = async () => {
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
        <title>iBlog { t('headers.forgetPasswordPage') }</title>
      </Head>
      <div className='forgetPassword'>
        <Container className="paperContainer" maxWidth="xs">
        <Paper className='paperStyle'>
              <Container>
                <ValidatorForm
                  ref={inputForm}
                  onSubmit={handleSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                      <Typography variant="h6" noWrap>
                        {t('pages.forgetPassword.iblogResetPassword')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" noWrap>
                      {t('pages.forgetPassword.email')}
                      </Typography>
                      <TextValidator
                        name="userEmail"
                        value={userEmail}
                        variant="outlined"
                        fullWidth
                        validators={['required', 'isEmail']}
                        onChange={handleEmailChange}
                        errorMessages={[t('messages.forgetPassword.form.emailRequired'), t('messages.forgetPassword.form.emailNotValid')]}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Grid container alignItems="center" style={{ height: '100%' }}>
                        {
                          disableSendEmail &&
                          <div>
                            {`${countDown} ${t('messages.forgetPassword.general.sendEmailCountdown')}`}
                          </div>
                        }
                        <Button 
                          variant="contained"
                          type="button"
                          onClick={sendVerifyCodeEmail}
                          disabled={disableSendEmail}
                          color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
                        >
                          {t('pages.forgetPassword.getVerifyCode')}
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" noWrap>
                      {t('pages.forgetPassword.verifyCode')}
                      </Typography>
                      <TextValidator
                        name="verifyCode"
                        value={verifyCode}
                        variant="outlined"
                        fullWidth
                        validators={['required']}
                        onChange={handleVerifyCodeChange}
                        errorMessages={[t('messages.forgetPassword.form.verifyCodeRequired')]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" noWrap>
                        {t('pages.forgetPassword.password')}
                      </Typography>
                      <TextValidator
                        name="password"
                        value={password}
                        variant="outlined"
                        type='password'
                        fullWidth
                        validators={['required']}
                        onChange={handlePasswordChange}
                        errorMessages={[t('messages.forgetPassword.form.passwordRequired')]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" noWrap>
                        {t('pages.forgetPassword.confirmPassword')}
                      </Typography>
                      <TextValidator
                        name="repeatPassword"
                        value={confirmPassword}
                        variant="outlined"
                        type='password'
                        fullWidth
                        validators={['isPasswordMatch', 'required']}
                        onChange={handleConfirmPasswordChange}
                        errorMessages={[t('messages.forgetPassword.form.passwordMissmatch'), t('messages.forgetPassword.form.confirmPasswordRequired')]}
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
                        <span style={{ cursor: "pointer" }}>{t('pages.forgetPassword.backToLogin')}</span>
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

ForgetPassword.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(ForgetPassword)