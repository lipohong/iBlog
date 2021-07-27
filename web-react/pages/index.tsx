import Head from 'next/head';
import Link from 'next/link';
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

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <div>
      <Head>
        <title>Home Page - iBlog</title>
        <meta name="description" content="iBlog is a blogging website for stories sharing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
            <Link href="/" locale="en">
              <a>Change to english {t('headers.homePage')}</a>
            </Link>
          </div>
          <div>
            <Link href="/" locale="zh">
              <a>Change to chinese {}</a>
            </Link>
          </div>
      </main>
    </div>
  )
}
