import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// components
import { TestComponent } from '../../components/TestComponent';


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
      <div>
        <TestComponent />
      </div>
    </div>
  )
}

export default TestId