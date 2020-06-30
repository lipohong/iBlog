import { useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';

function HomePage({envTest}) {

  const init = async () => {
    console.log(envTest);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Link href="test/abcdefg"><a>Test</a></Link> | 
      <Link href="/about"><a>About</a></Link> | 
      <a onClick={ () => { Router.push('/about') } }>About</a>
    </div>
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