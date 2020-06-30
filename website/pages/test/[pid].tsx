import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


function TestId() {
  const [ id, setId ] = useState(null);

  const router = useRouter();
  const { pid } = router.query

  useEffect(() => {
    setId('xyz');
  }, [])

  return (
    <div>
      <h3>{ pid }</h3>
      <h4 style={{ color: 'red' }}>{ id }</h4>
    </div>
  )
}

export default TestId