import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { RootStateOrAny, useSelector, useDispatch } from 'react-redux';
import Button from '../components/button';
import { setMode } from '../store/actions';


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
  const dispatch = useDispatch();
  const { mode, theme } = useSelector((state: RootStateOrAny) => state);

  return (
    <div>
      <Head>
        <title>{t('headers.homePage')} - iBlog</title>
      </Head>

      <main>
        <div>
            <Link href="/" locale="en">
              <a>Change to english {t('headers.homePage')}</a>
            </Link>
          </div>
          <div>
            <Link href="/" locale="zh">
              <a>Change to chinese</a>
            </Link>
          </div>
          <div>
            {mode.mode}
            <Button onClick={() => dispatch(setMode('dark'))}>Change Mode</Button>
          </div>
      </main>
    </div>
  )
}
