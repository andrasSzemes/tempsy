import { Outlet, NavLink } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import ShuffleIcon from '@mui/icons-material/Shuffle';
// ...existing code...
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DownloadIcon from '@mui/icons-material/Download';
import { hasCognitoSetup } from '../auth/amplify';
import { useUser } from '../contexts/useUser';
import { useLocation } from 'react-router-dom';
import { useVerbs } from '../contexts/useVerbs';
import { downloadPracticeReportPdf } from '../services/practiceReportPdf';
import type { Combinaison } from '../services/combinaisonService';

const LayoutContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  margin: 0;
  padding: 0;
`;

const AppBar = styled.aside`
  width: 60px;
  height: 100vh;
  background-color: #00000042;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  gap: 10px;
`;

const iconBaseStyles = css`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: background-color 0.2s;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const IconLink = styled(NavLink)`
  ${iconBaseStyles}

  &.active {
    color: #d1b48c;
  }
`;

const IconAnchor = styled.a`
  ${iconBaseStyles}
`;

const IconGroup = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: ${({ $active }) => $active ? '1px solid #d1b48c44' : 'none'};
  border-radius: 6px;
  padding: 4px;
  margin-top: 8px;
  gap: 8px;
`;

const Main = styled.main`
  flex: 1;
  overflow: auto;
`;

const BottomAction = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const ActionLabel = styled.span`
  font-size: 11px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.75);
  user-select: none;
`;

const FlashMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
  background: rgba(20, 20, 20, 0.92);
  border: 1px solid rgba(209, 180, 140, 0.45);
  color: #f6e7cf;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  user-select: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
`;

type TaskExportItem = Pick<Combinaison, 'verb' | 'subject' | 'tense' | 'phraseToShow' | 'conjuguatedVerbWithSubject'>;

function MasterLayout() {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const { isLoggedIn, login, logout } = useUser();
  const {
    emptyTaskList,
    resetTaskList,
    taskList,
    importTasks,
    isTaskListResetable,
    isTailoredSetupEnabled,
    setTailoredSetupEnabled,
  } = useVerbs();
  const location = useLocation();
  const isSetupActive = location.pathname === '/';
  const isSetupRestartEnabled = taskList.length > 0;
  const isSetupExportEnabled = taskList.length > 0;
  const isPracticeEnabled = taskList.length > 0;
  const solvedTaskCount = taskList.filter((task) => task.isRight !== null).length;
  const isSummaryEnabled = taskList.length > 0 && solvedTaskCount === taskList.length;

  useEffect(() => {
    if (!flashMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFlashMessage(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [flashMessage]);

  const handleDownloadPdfReport = async () => {
    if (!isSummaryEnabled) {
      return;
    }
    await downloadPracticeReportPdf(taskList);
  };

  const downloadTaskExport = (items: TaskExportItem[], filePrefix: string) => {
    const date = new Date().toISOString().slice(0, 10);
    const fileName = `${filePrefix}-${date}.json`;
    const content = JSON.stringify(items, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportTaskList = () => {
    if (!isSetupExportEnabled) {
      return;
    }

    const exportItems: TaskExportItem[] = taskList.map((task) => ({
      verb: task.verb,
      subject: task.subject,
      tense: task.tense,
      phraseToShow: task.phraseToShow,
      conjuguatedVerbWithSubject: task.conjuguatedVerbWithSubject,
    }));

    downloadTaskExport(exportItems, 'TaskList');
  };

  const handleMissedExport = () => {
    if (!isSummaryEnabled) {
      return;
    }

    const missedItems: TaskExportItem[] = taskList
      .filter((task) => task.numOfTentatives > 0)
      .map((task) => ({
        verb: task.verb,
        subject: task.subject,
        tense: task.tense,
        phraseToShow: task.phraseToShow,
        conjuguatedVerbWithSubject: task.conjuguatedVerbWithSubject,
      }));

    if (missedItems.length === 0) {
      setFlashMessage('No missed items to export');
      return;
    }

    downloadTaskExport(missedItems, 'TaskList-Missed');
  };

  const normalizeImportedTask = (value: unknown): Combinaison | null => {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const candidate = value as Partial<TaskExportItem>;
    if (
      typeof candidate.verb !== 'string' ||
      typeof candidate.subject !== 'string' ||
      typeof candidate.tense !== 'string' ||
      typeof candidate.phraseToShow !== 'string' ||
      typeof candidate.conjuguatedVerbWithSubject !== 'string'
    ) {
      return null;
    }

    return {
      id: crypto.randomUUID(),
      verb: candidate.verb,
      subject: candidate.subject,
      tense: candidate.tense,
      phraseToShow: candidate.phraseToShow,
      conjuguatedVerbWithSubject: candidate.conjuguatedVerbWithSubject,
      numOfTentatives: 0,
      isRight: null,
    };
  };

  const taskKey = (task: Pick<Combinaison, 'verb' | 'subject' | 'tense'>) =>
    `${task.verb.trim().toLowerCase()}|${task.subject.trim().toLowerCase()}|${task.tense.trim().toLowerCase()}`;

  const handleImportTaskList = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      if (!Array.isArray(parsed)) {
        setFlashMessage('Import failed: JSON must be an array');
        return;
      }

      const imported = parsed
        .map((item) => normalizeImportedTask(item))
        .filter((item): item is Combinaison => item !== null);

      if (imported.length === 0) {
        setFlashMessage('Import finished: 0 valid task found');
        return;
      }

      const knownKeys = new Set(taskList.map(taskKey));
      let added = 0;
      let skipped = 0;
      for (const task of imported) {
        const key = taskKey(task);
        if (knownKeys.has(key)) {
          skipped += 1;
        } else {
          knownKeys.add(key);
          added += 1;
        }
      }

      if (imported.length > 0) {
        importTasks(imported);
      }

      setFlashMessage(`Import complete: ${added} new, ${skipped} duplicate skipped`);
    } catch (error) {
      console.error('Could not import task list JSON:', error);
      setFlashMessage('Import failed: invalid JSON file');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <LayoutContainer>
      {flashMessage && <FlashMessage>{flashMessage}</FlashMessage>}
      <AppBar>
        <IconGroup $active={isSetupActive}>
          {!isSetupActive && (
            <IconLink to="/" end>
              <PostAddIcon />
            </IconLink>
          )}
          {isSetupActive && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {isLoggedIn && (
                <>
                  <div style={{ marginTop: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <IconAnchor
                      href="#"
                      aria-label="Random setup"
                      onClick={e => {
                        e.preventDefault();
                        setTailoredSetupEnabled(false);
                      }}
                      title="Random"
                    >
                      <ShuffleIcon sx={{ color: !isTailoredSetupEnabled ? '#d1b48c' : '#888', cursor: 'pointer' }} />
                    </IconAnchor>
                    <ActionLabel style={{ marginTop: '3px', color: !isTailoredSetupEnabled ? 'rgba(255,255,255,0.75)' : '#888' }}>
                      Random
                    </ActionLabel>
                  </div>
                  <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <IconAnchor
                      href="#"
                      aria-label="Tailored setup"
                      onClick={e => {
                        e.preventDefault();
                        setTailoredSetupEnabled(true);
                      }}
                      title="Tailored"
                    >
                      <PsychologyAltIcon sx={{ color: isTailoredSetupEnabled ? '#d1b48c' : '#888', cursor: 'pointer' }} />
                    </IconAnchor>
                    <ActionLabel style={{ marginTop: '3px', color: isTailoredSetupEnabled ? 'rgba(255,255,255,0.75)' : '#888' }}>
                      Tailored
                    </ActionLabel>
                  </div>
                </>
              )}
              <IconAnchor
                href="#"
                aria-label="Újrakezdés setup"
                onClick={e => {
                  e.preventDefault();
                  if (!isSetupRestartEnabled) return;
                  emptyTaskList();
                }}
                title="Újrakezdés"
                style={{ pointerEvents: isSetupRestartEnabled ? 'auto' : 'none' }}
              >
                <RestartAltIcon sx={{ color: isSetupRestartEnabled ? '#ffffff' : '#888', cursor: isSetupRestartEnabled ? 'pointer' : 'not-allowed' }} />
              </IconAnchor>
              <ActionLabel style={{ marginTop: '3px', color: isSetupRestartEnabled ? 'rgba(255,255,255,0.75)' : '#888' }}>Restart</ActionLabel>

              <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconAnchor
                  href="#"
                  aria-label="Full Export"
                  onClick={e => {
                    e.preventDefault();
                    if (!isSetupExportEnabled) return;
                    handleExportTaskList();
                  }}
                  title="Full Export"
                  style={{ pointerEvents: isSetupExportEnabled ? 'auto' : 'none' }}
                >
                  <DownloadIcon sx={{ color: isSetupExportEnabled ? '#ffffff' : '#888', cursor: isSetupExportEnabled ? 'pointer' : 'not-allowed' }} />
                </IconAnchor>
                <ActionLabel style={{ marginTop: '3px', textAlign: 'center', color: isSetupExportEnabled ? 'rgba(255,255,255,0.75)' : '#888' }}>
                  Export
                </ActionLabel>
              </div>

              <div style={{ marginTop: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconAnchor
                  href="#"
                  aria-label="Import"
                  onClick={e => {
                    e.preventDefault();
                    importInputRef.current?.click();
                  }}
                  title="Import"
                >
                  <UploadFileIcon sx={{ color: '#ffffff', cursor: 'pointer' }} />
                </IconAnchor>
                <ActionLabel style={{ marginTop: '3px', color: 'rgba(255,255,255,0.75)' }}>Import</ActionLabel>
              </div>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json,.json"
                style={{ display: 'none' }}
                onChange={e => {
                  void handleImportTaskList(e);
                }}
              />
            </div>
          )}
        </IconGroup>
        <ActionLabel style={{marginTop: '0px'}}>Setup</ActionLabel>
        <IconGroup $active={isPracticeEnabled && location.pathname === '/study'}>
          {location.pathname !== '/study' && (
            isPracticeEnabled ? (
              <IconLink to="/study">
                <FitnessCenterIcon />
              </IconLink>
            ) : (
              <IconAnchor
                href="#"
                aria-label="Practice disabled"
                aria-disabled="true"
                onClick={e => e.preventDefault()}
                style={{ pointerEvents: 'none', opacity: 0.5 }}
                title="Adj hozzá legalább egy elemet a taskList-hez"
              >
                <FitnessCenterIcon sx={{ color: '#888', cursor: 'not-allowed' }} />
              </IconAnchor>
            )
          )}
          {location.pathname === '/study' && taskList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0px' }}>
              <IconAnchor
                href="#"
                aria-label="Újrakezdés"
                onClick={e => {
                  e.preventDefault();
                  if (!isTaskListResetable) return;
                  resetTaskList();
                }}
                title="Újrakezdés"
                style={{ pointerEvents: isTaskListResetable ? 'auto' : 'none' }}
              >
                <RestartAltIcon sx={{ color: isTaskListResetable ? '#ffffff' : '#888', cursor: isTaskListResetable ? 'pointer' : 'not-allowed' }} />
              </IconAnchor>
              <ActionLabel style={{ marginTop: '3px', color: isTaskListResetable ? 'rgba(255,255,255,0.75)' : '#888' }}>Restart</ActionLabel>

              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconAnchor
                  href="#"
                  aria-label="Summary"
                  onClick={e => {
                    e.preventDefault();
                    if (!isSummaryEnabled) return;
                    void handleDownloadPdfReport();
                  }}
                  title="Summary"
                  style={{ pointerEvents: isSummaryEnabled ? 'auto' : 'none' }}
                >
                  <PictureAsPdfIcon sx={{ color: isSummaryEnabled ? '#ffffff' : '#888', cursor: isSummaryEnabled ? 'pointer' : 'not-allowed' }} />
                </IconAnchor>
                <ActionLabel style={{ marginTop: '3px', color: isSummaryEnabled ? 'rgba(255,255,255,0.75)' : '#888' }}>Summary</ActionLabel>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconAnchor
                  href="#"
                  aria-label="Missed"
                  onClick={e => {
                    e.preventDefault();
                    if (!isSummaryEnabled) return;
                    handleMissedExport();
                  }}
                  title="Missed"
                  style={{ pointerEvents: isSummaryEnabled ? 'auto' : 'none' }}
                >
                  <DownloadIcon sx={{ color: isSummaryEnabled ? '#ffffff' : '#888', cursor: isSummaryEnabled ? 'pointer' : 'not-allowed' }} />
                </IconAnchor>
                <ActionLabel style={{ marginTop: '3px', color: isSummaryEnabled ? 'rgba(255,255,255,0.75)' : '#888' }}>Missed</ActionLabel>
              </div>
            </div>
          )}
        </IconGroup>
        <ActionLabel style={{ color: isPracticeEnabled ? 'rgba(255, 255, 255, 0.75)' : '#888' }}>Practice</ActionLabel>
        {hasCognitoSetup && (
          <BottomAction>
            {isLoggedIn && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <IconLink to="/statistics" aria-label="Statistics">
                  <QueryStatsIcon sx={{ color: '#fff' }} />
                </IconLink>
                <ActionLabel style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Statistics</ActionLabel>
              </div>
            )}
            <IconAnchor
              href="#"
              aria-label={isLoggedIn ? 'Logout' : 'Login'}
              onClick={(event) => {
                event.preventDefault();
                if (isLoggedIn) {
                  void logout();
                } else {
                  void login();
                }
              }}
            >
              {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
            </IconAnchor>
            <ActionLabel>{isLoggedIn ? 'Logout' : 'Login'}</ActionLabel>
          </BottomAction>
        )}
      </AppBar>
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
}

export default MasterLayout;
