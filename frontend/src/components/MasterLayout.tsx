import { Outlet, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { hasCognitoSetup } from '../auth/amplify';
import { useUser } from '../contexts/useUser';

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

  return (
    <LayoutContainer>
      <AppBar>
        <IconLink to="/" end>
          <PostAddIcon />
        </IconLink>
        <IconLink to="/study">
          <FitnessCenterIcon />
        </IconLink>
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
