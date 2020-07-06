import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// components
import { TestComponent } from '../../components/TestComponent';
import Layout from '../../components/layout';

function TestId() {
  const [ id, setId ] = useState(null);

  const router = useRouter();
  const { pid } = router.query

  useEffect(() => {
    setId('xyz');
  }, [])

  return (
    <Layout>
      <h3>{ pid }</h3>
      <h4 style={{ color: 'red' }}>{ id }</h4>
      <div>
        <TestComponent props={{}} />
      </div>
    </Layout>
  )
}

export default TestId