import * as crypto from 'crypto-js';
import * as _ from 'lodash';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { compose } from 'redux';
import { useCookies } from 'react-cookie';
import { PaletteTypeEnum } from '../../../enums/PaletteTypeEnum';

// mui
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Avatar from '@material-ui/core/Avatar';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import { setMessage, setProgressOn } from '../../../store/actions/globalActions';
import { SeverityEnum } from '../../../enums/SeverityEnum';

import defaultNextI18Next from '../../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

// components
import Layout from '../../../components/layout';

import { setAuth } from '../../../store/actions/authActions';
import { resetUser } from '../../../store/actions/userActions';


function Profile({ paletteType, user, auth, dispatch, t }) {
  const [cookies, setCookie, removeCookie] = useCookies(['iBlog']);
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const inputForm = useRef('form');
  const passwordForm = useRef('passwordForm');
  const [password, setPassword] = useState('');
  const [disableSendEmail, setDisableSendEmail] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('');
  const router = useRouter();
  const [countDown, setCountDown] = useState(60);
  const countRef = useRef(countDown);
  countRef.current = countDown;

  const logOut = async () => {
    // remove auth cookies
    removeCookie('auth', { path: '/' });
    // reset auth info
    dispatch(await setAuth({
      userId: "",
      jwt: ""
    }));
    // reset user info
    dispatch(await resetUser());
    router.push('/auth/login');
  }

  const redirectToLoginPage = () => {
    router.push('/auth/login?from=user/profile');
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handlePasswordChange = (event) => {
    const value = event.currentTarget.value;
    setPassword(value);
  }

  const handleUsernameChange = (event) => {
    const value = event.currentTarget.value;
    setUsername(value);
  }

  const handleDescriptionChange = (event) => {
    const value = event.currentTarget.value;
    setDescription(value);
  }

  const handleVerifyCodeChange = (event) => {
    const value = event.currentTarget.value;
    setVerifyCode(value);
  }

  const handleFileChange = async (event) => {
    const newImage = event.target.files[0];
    if (newImage) {
      dispatch(setProgressOn(true));
      try {
        const postData =  new FormData();
        postData.append("image", newImage);
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_FILE_API}/files`,
          postData, {
            headers: {
              Authorization: 'Bearer ' + auth.jwt,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        const avatar = data.payload.fileId;
        setAvatar(avatar);
      } catch (err) {
        // show error message
        dispatch(setMessage({
          open: true,
          severity: SeverityEnum.error,
          message: t(`messages.common.unknownError`)
        }));
      }
      dispatch(setProgressOn(false));
    }
  }

  const handleDialogOpen = () => {
    setDialogOpen(true);
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
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
        userInfo: {
          avatar,
          description
        }
      }
      await axios.put(
        `${process.env.NEXT_PUBLIC_USER_API}/users`,
        postData, {
          headers: {
            Authorization: 'Bearer ' + auth.jwt
          }
        }
      );

      // update profile success tips
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.success,
        message: t(`messages.profile.general.updateProfileSuccess`)
      }));

    } catch (err) {
      let errMessage: string;
      const message = _.get(err, 'response.data.message');
      errMessage = !!message ? t(`messages.profile.errors.${message}`) : t(`messages.common.unknownError`);

      // show error message
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.error,
        message: errMessage
      }));
    }
    dispatch(setProgressOn(false));
  }
  
  const sendVerifyCodeEmail = async () => {
    dispatch(setProgressOn(true));
    try {
      const postData = {
        email: user.email
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_USER_API}/users/newPassword`, 
        postData, {
          headers: {
            Authorization: 'Bearer ' + auth.jwt
          }
        }
      );
      
      // send email success tips
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.success,
        message: t(`messages.profile.general.sendVerifyCodeSuccess`)
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
      errMessage = !!message ? t(`messages.profile.errors.${message}`) : t(`messages.common.unknownError`);
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

  const handlePasswordFormSubmit = async () => {
    dispatch(setProgressOn(true));
    try {
      const postData = {
        password: await encryptAES(password),
        email: user.email,
        verifyCode
      }
      await axios.post(
        `${process.env.NEXT_PUBLIC_USER_API}/users/resetPassword`,
        postData, {
          headers: {
            Authorization: 'Bearer ' + auth.jwt
          }
        }
      );

      // change password success tips
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.success,
        message: t(`messages.profile.general.resetPasswordSuccess`)
      }));

      handleDialogClose();
      logOut();
    } catch (err) {
      let errMessage: string;
      const message = _.get(err, 'response.data.message');
      errMessage = !!message ? t(`messages.profile.errors.${message}`) : t(`messages.common.unknownError`);

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
    if (!cookies.auth) {
      // redirect to login page
      redirectToLoginPage();
      return;
    }
    setUsername(user.username);
    setDescription(user.userInfo.description);
    setAvatar(user.userInfo.avatar);    
  }

  useEffect(() => {
    init();
  }, [user])

  return (
    <Layout>
      <Head>
        <title>iBlog { t('headers.profilePage') }</title>
      </Head>
      <div className='profile'>
        <Container className="paperContainer" maxWidth="xs">
          <Paper className='paperStyle'>
            <Container>
              <ValidatorForm
                ref={inputForm}
                onSubmit={handleSubmit}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container justify="center">
                      <Avatar
                        src={`${avatar}`} style={{ width: '150px', height: '150px', backgroundColor: '#eee' }}
                      >
                        {
                          !avatar &&
                          <div>
                            <input
                              accept="image/*"
                              style={{ display: 'none' }}
                              id="upload-image-button"
                              onChange={handleFileChange}
                              type="file"
                            />
                            <label htmlFor="upload-image-button">
                              <Button
                                variant="contained"
                                color={ paletteType === PaletteTypeEnum.light ? 'secondary' : 'default' }
                              >
                                { t(`pages.profile.uploadImage`) }
                              </Button>
                            </label> 
                          </div>
                        }
                        {
                          avatar &&
                          <div>
                            <input
                              accept="image/*"
                              id="update-image-button"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                              type="file"
                            />
                            <label htmlFor="update-image-button">
                              <Button
                                variant="outlined"
                                color={ paletteType === PaletteTypeEnum.light ? 'secondary' : 'default' }
                              >
                                { t(`pages.profile.updateImage`) }
                              </Button>
                            </label> 
                          </div>
                        }
                      </Avatar>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" noWrap>
                      {t('pages.login.email')}
                    </Typography>
                    <TextValidator value={user.email} variant="outlined" fullWidth disabled={true} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" noWrap>
                      {t('pages.profile.username')}
                    </Typography>
                    <TextValidator
                      value={username}
                      variant="outlined"
                      fullWidth
                      onChange={handleUsernameChange}
                      validators={['required']}
                      errorMessages={[t('messages.profile.form.usernameRequired')]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" noWrap>
                      {t('pages.profile.description')}
                    </Typography>
                    <TextValidator value={description} variant="outlined" fullWidth multiline rows={5} onChange={handleDescriptionChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained"
                      type="submit"
                      fullWidth
                      color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
                    >
                      {t('pages.profile.updateProfile')}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained"
                      type="button"
                      fullWidth
                      onClick={logOut}
                      color={ paletteType === PaletteTypeEnum.light ? 'secondary' : 'default' }
                    >
                      {t('pages.profile.logOut')}
                    </Button>
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <div style={{ cursor: "pointer" }} onClick={handleDialogOpen}>
                      {t('pages.profile.changePassword')}
                    </div>
                  </Grid>
                </Grid>
              </ValidatorForm>
            </Container>
          </Paper>
        </Container>
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          className="dialogContainer"
        >
          <ValidatorForm
            ref={passwordForm}
            onSubmit={handlePasswordFormSubmit}
          >
            <DialogTitle >{t(`pages.profile.setupNewPassword`)}</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" noWrap>
                    {t('pages.profile.password')}
                  </Typography>
                  <TextValidator
                    name="password"
                    value={password}
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    validators={['required']}
                    onChange={handlePasswordChange}
                    errorMessages={[t('messages.profile.form.passwordRequired')]}
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
                  <Typography variant="subtitle2" noWrap>
                  {t('pages.profile.verifyCode')}
                  </Typography>
                  <TextValidator
                    name="verifyCode"
                    value={verifyCode}
                    variant="outlined"
                    fullWidth
                    validators={['required']}
                    onChange={handleVerifyCodeChange}
                    errorMessages={[t('messages.profile.form.verifyCodeRequired')]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container alignItems="center" style={{ height: '100%' }}>
                    <Button 
                      variant="contained"
                      type="button"
                      onClick={sendVerifyCodeEmail}
                      disabled={disableSendEmail}
                      color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
                    >
                      {t('pages.profile.getVerifyCode')}
                    </Button>
                    {
                      disableSendEmail &&
                      <div>
                        {`${countDown} ${t('messages.profile.general.sendEmailCountdown')}`}
                      </div>
                    }
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="inherit">
                {t(`pages.common.cancel`)}
              </Button>
              <Button type="submit" color="inherit">
                {t(`pages.common.submit`)}
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      </div>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  const { global, auth, user } = state;
  return {
    paletteType: global && global.paletteType || PaletteTypeEnum.light,
    auth: auth && auth.auth || null,
    user: user && user.user || null
  }
}

Profile.getInitialProps = async () => {
  return {
    namespacesRequired: ['common']
  }
}

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(Profile)