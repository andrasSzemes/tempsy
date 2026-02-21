import { Outlet, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LoginIcon from '@mui/icons-material/Login';

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

const IconLink = styled(NavLink)`
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

  &.active {
    color: #d1b48c;
  }
`;

const Main = styled.main`
  flex: 1;
  overflow: auto;
`;

function MasterLayout() {
  return (
    <LayoutContainer>
      <AppBar>
        <IconLink to="/" end>
          <PostAddIcon />
        </IconLink>
        <IconLink to="/study">
          <FitnessCenterIcon />
        </IconLink>
        <IconLink to="/login">
          <LoginIcon />
        </IconLink>
      </AppBar>
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
}

export default MasterLayout;
