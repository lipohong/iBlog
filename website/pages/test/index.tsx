import { useEffect, useState } from 'react';
import { compose } from 'redux';

// components
import { TestComponent } from '../../components/TestComponent';
import Layout from '../../components/layout';

import defaultNextI18Next from '../../plugins/i18n';
const { i18n, Link, withTranslation } = defaultNextI18Next;

function Test() {

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

Test.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default compose<any>(
  withTranslation('common')
)(Test)