import { createRoot } from 'react-dom/client';

import Main from './Main';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
    <Main />,
);
