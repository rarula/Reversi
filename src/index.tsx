import { createRoot } from 'react-dom/client';

import GuideProvider from './contexts/Guide';
import Main from './Main';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
    <GuideProvider>
        <Main />
    </GuideProvider>,
);
