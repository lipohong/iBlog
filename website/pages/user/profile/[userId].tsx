import * as crypto from 'crypto-js';
import * as _ from 'lodash';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { compose } from 'redux';
import { PaletteTypeEnum } from '../../../enums/PaletteTypeEnum';

// mui
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';

import defaultNextI18Next from '../../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

// components
import Layout from '../../../components/layout';


function UserProfile({ paletteType, user, t }) {
  const router = useRouter();

  const init = async () => {    
    if (!user) {
      router.push(`/`);
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
      {
        !!user &&
        <div className='profile'>
          <Container className="paperContainer" maxWidth="md">
            <Paper className='paperStyle'>
              <Container>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container justify="center">
                      <Avatar
                          alt="t"
                          src={`${user.userInfo.avatar}`}
                          style={{
                            width: '150px',
                            height: '150px',
                            fontSize: '40px'
                          }}
                        >
                          { !user.userInfo.avatar && user.username[0] }
                        </Avatar>
                    </Grid>
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
              </Container>
            </Paper>
          </Container>
        </div>
      }
    </Layout>
  )
}

const mapStateToProps = (state) => {
  const { global } = state;
  return {
    paletteType: global && global.paletteType || PaletteTypeEnum.light
  }
}

UserProfile.getInitialProps = async ({ query }) => {
  const { userId } = query;
  let user = null;
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_USER_API}/users/${userId}`);
    user = data.payload
  } catch (err) {
    // throw err
  }
  return {
    namespacesRequired: ['common'],
    user
  }
}

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(UserProfile)