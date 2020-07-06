import { useEffect } from 'react'
import { connect } from 'react-redux';
import { SET_MODE } from '../constants/actionTypes';

// components
import Layout from '../components/layout';

function About(props) {
  const { mode, dispatch } = props;
  useEffect(() => {

  }, [])

  return (
    <Layout>
      <div className={mode}>about</div>
      <div><button onClick={() => { dispatch({ type: SET_MODE, mode: mode === 'day' ? 'night' : 'day'}) }}>Change Mode!</button></div>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  const { global } = state
  return {
    mode: global && global.mode || 'day'
  }
}

export default connect(mapStateToProps)(About)