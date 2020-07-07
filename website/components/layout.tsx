import Link from 'next/link';
import Router from 'next/router';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';

import { SET_PALETTETYPE } from '../constants/actionTypes';


function Layout(props) {
  const { children, paletteType, dispatch } = props;

  const [cookies, setCookie] = useCookies(['iBlog']);

  useEffect(() => {
    if (!!cookies.paletteType) {
      dispatch({ type: SET_PALETTETYPE, paletteType: cookies.paletteType});
    } else {
      setCookie('paletteType', 'light', { path: '/' });
    }
    
  }, [])
  
  return (
    <div className={`layout ${paletteType}`}>
      <div>
        <Link href="/"><a>Home</a></Link> | 
        <Link href="/test/abcdefg" scroll={false}><a>Test</a></Link> | 
        <Link href="/about"><a>About</a></Link> | 
        <a onClick={ () => { Router.push('/test') } }>Test Home</a>
      </div>
      {children}
    </div>
  )
}

const mapStateToProps = (state) => {
  const { global } = state
  return {
    paletteType: global && global.paletteType || 'light'
  }
}

export default connect(mapStateToProps)(Layout)