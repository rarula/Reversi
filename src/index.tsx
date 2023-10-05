import { createRoot } from 'react-dom/client';

import './styles/global.css';

import GuideProvider from './contexts/Guide';
import ThemeProvider from './contexts/Theme';
import WasmProvider from './contexts/Wasm';
import Main from './Main';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <GuideProvider>
            <WasmProvider>
                <Main />
            </WasmProvider>
        </GuideProvider>
    </ThemeProvider>,
);
