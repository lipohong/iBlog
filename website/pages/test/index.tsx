import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// components
import { TestComponent } from '../../components/TestComponent';
import Layout from '../../components/layout';

function Test() {

  const router = useRouter();

  useEffect(() => {
  }, [])

  return (
    <Layout>
      <div>
        <TestComponent props={{}} />
      </div>
    </Layout>
  )
}

export default Test