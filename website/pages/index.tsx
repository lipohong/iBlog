import { useEffect } from 'react';
import Head from 'next/head';
import { compose } from 'redux';
import { connect } from 'react-redux';

import defaultNextI18Next from '../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

// mui
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Container from '@material-ui/core/Container';
import SortIcon from '@material-ui/icons/Sort';

// components
import Layout from '../components/layout';


function HomePage({ t, dispatch }) {

  const init = async () => {
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <Head>
        <title>iBlog { t('headers.homePage') }</title>
      </Head>
      <div className="home">
        <Container maxWidth="md">
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe">
                S
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title="Welcome to iBlog"
            subheader={new Date().toISOString().slice(0, 10)}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              Enjoy yourself!
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>
          <div className="functionBar"><SortIcon />Sort by: update time</div>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" noWrap>
                Left
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" noWrap>
                right
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </div>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  const { global } = state;
  return {
    message: global && global.message
  }
}

HomePage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(HomePage)
