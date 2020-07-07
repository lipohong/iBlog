import { useEffect, useState } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import Router from 'next/router';

// components
import Layout from '../components/layout';

function HomePage({envTest}) {

  const init = async () => {
    // console.log(envTest);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout>
      <Head>
        <title>iBlog HomePage</title>
      </Head>
      <div>Home</div>
    </Layout>
  )
}

export async function getStaticProps() {

  return {
    props: {
      envTest: process.env.ENV_TEST,
    },
  }
}

export default HomePage