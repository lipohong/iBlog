import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { compose } from 'redux';
import { connect } from 'react-redux';

import defaultNextI18Next from '../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import { useQuill } from 'react-quilljs';
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

// mui
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

// components
import Layout from '../../components/layout';

import { SeverityEnum } from '../../enums/SeverityEnum';
import { BlogStatusEnum } from '../../enums/BlogStatusEnum';
import { PaletteTypeEnum } from '../../enums/PaletteTypeEnum';

import { setMessage, setProgressOn } from '../../store/actions/globalActions';


function CreateBlogPage(props) {
  const { dispatch, t, auth, paletteType } = props;
  const [title, setTitle] = useState('');
  const inputForm = useRef('form');
  const router = useRouter();

  const theme = 'snow';
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
  
      [{ list: 'ordered'}, { list: 'bullet' }],
      [{ indent: '-1'}, { indent: '+1' }],
  
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image'],
      [{ color: [] }, { background: [] }],
  
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  }
  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'indent',
    'size', 'header',
    'link', 'image',
    'color', 'background',
    'clean',
  ]
  const { quill, quillRef } = useQuill({ theme, modules, formats });

  const handleTitleChange = (event) => {
    const value = event.currentTarget.value;
    setTitle(value);
  }

  const uploadImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const newImage = input.files[0];
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
          const avatar = `${process.env.NEXT_PUBLIC_FILE_API}/files/${data.payload.fileId}`;
          const range = quill.getSelection();
          if (range) {
            quill.insertEmbed(range.index, 'image', avatar);
          } else {
            console.log('User cursor is not in editor');
          }
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
  }

  const handleSubmit = async () => {
    const content = quill.getContents().ops;
    const postData = {
      title,
      content,
      status: BlogStatusEnum.published
    }
    dispatch(setProgressOn(true));
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BLOG_API}/blogs`,
        postData,
        {
          headers: {
            Authorization: 'Bearer ' + auth.jwt
          }
        }
      );
      dispatch(setMessage({
        open: true,
        severity: SeverityEnum.success,
        message: t(`messages.blog.general.publishBlogSuccess`)
      }));
      setTimeout(() => {
        dispatch(setMessage({
          open: false,
          severity: SeverityEnum.success,
          message: ''
        }));

        router.push(`/blog/${data.payload._id}`);
      }, 3000);
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

  const init = async () => {    
    if (!(auth && auth.userId)) {
      router.push(`/auth/login?from=blog/create`)
    }
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (quill) {
      quill.getModule('toolbar').addHandler('image', uploadImage);
    }
  }, [quill]);

  return (
    <Layout>
      <Head>
        <title>iBlog { t('headers.createBlogPage') }</title>
      </Head>
      <div className="blog">
        <Container maxWidth="md" className="container">
          <ValidatorForm
            ref={inputForm}
            onSubmit={handleSubmit}
          >
            <Paper>
              <Container>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextValidator
                      name="title"
                      value={title}
                      fullWidth
                      placeholder={t(`messages.blog.form.titlePlaceHolder`)}
                      validators={['required']}
                      onChange={handleTitleChange}
                      errorMessages={[t('messages.blog.form.titleRequired')]}
                    />
                  </Grid>
                  <Grid item xs={12} className="editContainer">
                    <div>
                      <div ref={quillRef} />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </Grid>
              </Container>
            </Paper>
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
