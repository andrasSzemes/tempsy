import { Outlet, NavLink } from 'react-router-dom';
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
import { hasCognitoSetup } from '../auth/amplify';
import { useUser } from '../contexts/useUser';
import { useLocation } from 'react-router-dom';
import { useVerbs } from '../contexts/useVerbs';
import { downloadPracticeReportPdf } from '../services/practiceReportPdf';

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

function MasterLayout() {
  const { isLoggedIn, login, logout } = useUser();
  const {
    emptyTaskList,
    resetTaskList,
    taskList,
    isTaskListResetable,
    isTailoredSetupEnabled,
    setTailoredSetupEnabled,
  } = useVerbs();
  const location = useLocation();
  const isSetupActive = location.pathname === '/';
  const isSetupRestartEnabled = taskList.length > 0;
  const isPracticeEnabled = taskList.length > 0;
  const solvedTaskCount = taskList.filter((task) => task.isRight !== null).length;
  const isSummaryEnabled = taskList.length > 0 && solvedTaskCount === taskList.length;

  const handleDownloadPdfReport = async () => {
    if (!isSummaryEnabled) {
      return;
    }
    await downloadPracticeReportPdf(taskList);
  };

  return (
    <LayoutContainer>
      <AppBar>
        <IconGroup $active={isSetupActive}>
          <IconLink to="/" end>
            <PostAddIcon />
          </IconLink>
          {isSetupActive && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {isLoggedIn && (
                <>
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                <RestartAltIcon sx={{ color: isSetupRestartEnabled ? '#d1b48c' : '#888', cursor: isSetupRestartEnabled ? 'pointer' : 'not-allowed' }} />
              </IconAnchor>
              <ActionLabel style={{ marginTop: '3px', color: isSetupRestartEnabled ? 'rgba(255,255,255,0.75)' : '#888' }}>Restart</ActionLabel>
            </div>
          )}
        </IconGroup>
        <ActionLabel>Setup</ActionLabel>
        <IconGroup $active={isPracticeEnabled && location.pathname === '/study'}>
          {isPracticeEnabled ? (
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
          )}
          {location.pathname === '/study' && taskList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '6px' }}>
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
                <RestartAltIcon sx={{ color: isTaskListResetable ? '#d1b48c' : '#888', cursor: isTaskListResetable ? 'pointer' : 'not-allowed' }} />
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
                  <PictureAsPdfIcon sx={{ color: isSummaryEnabled ? '#d1b48c' : '#888', cursor: isSummaryEnabled ? 'pointer' : 'not-allowed' }} />
                </IconAnchor>
                <ActionLabel style={{ marginTop: '3px', color: isSummaryEnabled ? 'rgba(255,255,255,0.75)' : '#888' }}>Summary</ActionLabel>
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
