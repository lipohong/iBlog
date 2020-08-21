import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { compose } from 'redux';
import { connect } from 'react-redux';

import defaultNextI18Next from '../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

// mui
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

// components
import Layout from '../../components/layout';

import { PaletteTypeEnum } from '../../enums/PaletteTypeEnum';


function CreateBlogPage(props) {
  const { t, auth, paletteType } = props;
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const inputForm = useRef('form');

  const router = useRouter();
  const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

  const handleTitleChange = (event) => {
    const value = event.currentTarget.value;
    setTitle(value);
  }

  const handleSubmit = async () => {

  }

  const init = async () => {
    if (!auth && !auth.userId) {
      router.push(`/auth/login?from=blog/create`)
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <Head>
        <title>iBlog { t('headers.createBlogPage') }</title>
        <link rel="stylesheet" href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"></link>
      </Head>
      <div className="blog">
        <Container maxWidth="md">
          <ValidatorForm
            ref={inputForm}
            onSubmit={handleSubmit}
          >
            <Card>
              <CardHeader
                title={t(`pages.blog.postBlog`)}
                subheader={new Date().toISOString().slice(0, 10)}
              />
              <CardContent>
                <TextValidator
                  name="title"
                  value={title}
                  variant="outlined"
                  fullWidth
                  validators={['required']}
                  onChange={handleTitleChange}
                  errorMessages={[t('messages.blog.form.titleRequired')]}
                />
                <ReactQuill theme="snow" value={value} onChange={setValue}/>
              </CardContent>
              <CardActions disableSpacing>
                <Button 
                  variant="contained"
                  type="submit"
                  color={ paletteType === PaletteTypeEnum.light ? 'secondary' : 'default' }
                >
                  {t('pages.blog.saveAsDraft')}
                </Button>
                <Button 
                  variant="contained"
                  type="submit"
                  color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
                >
                  {t('pages.blog.publish')}
                </Button>
              </CardActions>
            </Card>
          </ValidatorForm>
        </Container>
      </div>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  const { global, auth, user } = state;
  return {
    paletteType: global && global.paletteType || PaletteTypeEnum.light,
    message: global && global.message,
    auth: auth && auth.auth || null,
    user: user && user.user || null
  }
}

CreateBlogPage.getInitialProps = async () => ({
  namespacesRequired: ['common']
})

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(CreateBlogPage)
