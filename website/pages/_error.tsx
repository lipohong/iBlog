// components
import Layout from '../components/layout';

// mui
import Container from '@material-ui/core/Container';

function Error({ statusCode }) {
  return (
    <Layout>
      <Container style={{ margin: '50px 0' }}  maxWidth="sm">
        <div>
          {statusCode
          ? statusCode === 404 ?  `Page not found` : `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
        </div>
      </Container>
    </Layout>
    
  )
}

Error.getInitialProps = async ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return {
    namespacesRequired: ['common'],
    statusCode 
  }
}

export default Error