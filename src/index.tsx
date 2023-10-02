import { createRoot } from 'react-dom/client';

import './styles/global.css';

import GuideProvider from './contexts/Guide';
import ThemeProvider from './contexts/Theme';
import Main from './Main';

createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <GuideProvider>
            <Main />
        </GuideProvider>
    </ThemeProvider>,
);
