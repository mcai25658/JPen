import { useEffect, useState } from 'react';

import { startService } from './bundler';
import { CodeCell } from './components/CodeCell';

export const App = () => {
  const [initial, setInitial] = useState(false);

  useEffect(() => {
    if (initial) return;

    const start = async () => {
      const result = await startService();
      if (!result) return;
      setInitial(true);
    };

    start();
  }, [initial]);
  return <CodeCell initial={initial} />;
};
