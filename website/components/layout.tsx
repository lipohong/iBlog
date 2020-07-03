import Link from 'next/link';
import Router from 'next/router';

function Layout({ children }) {
  
  return (
    <div>
      <div>
        <Link href="test/abcdefg"><a>Test</a></Link> | 
        <Link href="/about"><a>About</a></Link> | 
        <a onClick={ () => { Router.push('/about') } }>About</a>
      </div>
      {children}
    </div>
  )
}

export default Layout