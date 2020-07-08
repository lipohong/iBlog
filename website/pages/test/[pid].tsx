import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { compose } from 'redux';

// components
import { TestComponent } from '../../components/TestComponent';
import Layout from '../../components/layout';

import defaultNextI18Next from '../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

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

TestId.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default compose<any>()(TestId)