import { Outlet, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { hasCognitoSetup } from '../auth/amplify';
import { useUser } from '../contexts/useUser';
import { useLocation } from 'react-router-dom';
import { useVerbs } from '../contexts/useVerbs';

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
  const { resetTaskList, taskList, isTaskListResetable } = useVerbs();
  const location = useLocation();

  return (
    <LayoutContainer>
      <AppBar>
        <IconLink to="/" end>
          <PostAddIcon />
        </IconLink>
          <ActionLabel>Setup</ActionLabel>
        <IconGroup $active={location.pathname === '/study'}>
          <IconLink to="/study">
            <FitnessCenterIcon />
          </IconLink>
          {location.pathname === '/study' && taskList.length > 0 && (
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
          )}
        </IconGroup>
        {location.pathname === '/study' && (
          <ActionLabel>Practice</ActionLabel>
        )}
        {location.pathname !== '/study' && (
          <ActionLabel>Practice</ActionLabel>
        )}
        {hasCognitoSetup && (
          <BottomAction>
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
