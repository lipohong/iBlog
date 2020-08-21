import axios from 'axios';
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
import Paper from '@material-ui/core/Paper';

// components
import Layout from '../../components/layout';

import { SeverityEnum } from '../../enums/SeverityEnum';
import { PaletteTypeEnum } from '../../enums/PaletteTypeEnum';

import { setMessage, setProgressOn } from '../../store/actions/globalActions';


function CreateBlogPage(props) {
  const { dispatch, t, auth, paletteType } = props;
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const inputForm = useRef('form');
  const quillEditor = useRef(null);
  const router = useRouter();

  const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

  const handleTitleChange = (event) => {
    const value = event.currentTarget.value;
    setTitle(value);
  }

  const handleContentChange = (value) => {
    setContent(value);
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
          const quill = quillEditor.current.getEditor();
          const range = quill.getSelection();
          if (range) {
            if (range.length == 0) {
              console.log('User cursor is at index', range.index);
            } else {
              quill.insertEmbed(range.index, 'image', avatar);
              console.log('User has highlighted: ');
            }
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

  }

  // const modules = {
  //   toolbar: {
  //     container: [
  //       [{ 'header': [1, 2, false] }],
  //       ['bold', 'italic', 'underline','strike', 'blockquote'],
  //       [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
  //       ['link', 'image'],
  //       ['clean']
  //     ],
  //     handlers: {
  //       image: uploadImage
  //     }
  //   },
  // }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  const init = async () => {    
    if (!(auth && auth.userId)) {
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
                    <ReactQuill
                      ref={quillEditor}
                      theme="snow"
                      className="editingArea"
                      value={content}
                      onChange={handleContentChange}
                      modules={modules}
                      formats={formats}
                    />
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
