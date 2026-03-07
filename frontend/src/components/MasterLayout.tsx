import { Outlet, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LoginIcon from '@mui/icons-material/Login';

function buildCognitoLoginUrl() {
  const domain = import.meta.env.VITE_COGNITO_DOMAIN as string | undefined;
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string | undefined;
  const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI as string | undefined;

  if (!domain || !clientId || !redirectUri) {
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
  });

  return `${domain}/oauth2/authorize?${params.toString()}`;
}

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

function MasterLayout() {
  const loginUrl = buildCognitoLoginUrl();

  return (
    <LayoutContainer>
      <AppBar>
        <IconLink to="/" end>
          <PostAddIcon />
        </IconLink>
        <IconLink to="/study">
          <FitnessCenterIcon />
        </IconLink>
        {loginUrl && (
          <IconAnchor href={loginUrl}>
            <LoginIcon />
          </IconAnchor>
        )}
      </AppBar>
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
}

export default MasterLayout;
