import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Setup from './components/Setup';
import Study from './components/Study';
import Privacy from './components/Privacy';
import MasterLayout from './components/MasterLayout';
import Statistics from './components/Statistics';
import { VerbsProvider } from './contexts/useVerbs';
import { UserClientProvider } from './contexts/clientProviders/useUserClient';
import { UserProvider } from './contexts/useUser';
import { CombinationClientProvider } from './contexts/clientProviders/useCombinationClient';
import { VerbClientProvider } from './contexts/clientProviders/useVerbClient';
import { LanguageProvider } from './contexts/useLanguage';
import { PracticeClientProvider } from './contexts/clientProviders/usePracticeClient';

function App() {
  return (
    <>
      <UserClientProvider>
        <CombinationClientProvider>
          <VerbClientProvider>
            <PracticeClientProvider>
              <UserProvider>
                <LanguageProvider>
                  <VerbsProvider>
                    <BrowserRouter>
                      <Routes>
                        <Route element={<MasterLayout />}>
                          <Route path="/" element={<Setup />} />
                          <Route path="/study" element={<Study />} />
                          <Route path="/statistics" element={<Statistics />} />
                          <Route path="/privacy" element={<Privacy />} />
                        </Route>
                      </Routes>
                    </BrowserRouter>
                  </VerbsProvider>
                </LanguageProvider>
              </UserProvider>
            </PracticeClientProvider>
          </VerbClientProvider>
        </CombinationClientProvider>
      </UserClientProvider>
    </>
  );
}

export default App
