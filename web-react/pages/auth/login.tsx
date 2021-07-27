import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    }
  }
}

export default function Login() {
  const { t } = useTranslation('common');

  return (
    <div>
      <Head>
        <title>{t('headers.loginPage')} - iBlog</title>
      </Head>

      <main>
        <div>
           
          </div>
      </main>
    </div>
  )
}