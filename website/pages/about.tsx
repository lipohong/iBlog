import { useEffect } from 'react';
import { connect } from 'react-redux';
import { SET_PALETTETYPE } from '../constants/actionTypes';
import { useCookies } from 'react-cookie';

// components
import Layout from '../components/layout';

function About(props) {
  const { paletteType, dispatch } = props;
  const [cookies, setCookie] = useCookies(['iBlog']);

  useEffect(() => {

  }, [])

  return (
    <Layout>
      <div>about</div>
      <div>
        <button onClick={() => {
            setCookie('paletteType', paletteType === 'light' ? 'dark' : 'light', { path: '/' });
            dispatch({ type: SET_PALETTETYPE, paletteType: paletteType === 'light' ? 'dark' : 'light'});
          }}
        >
          Change Mode!
        </button>
      </div>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  const { global } = state
  return {
    paletteType: global && global.paletteType || 'light'
  }
}

export default connect(mapStateToProps)(About)