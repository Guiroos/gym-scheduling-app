import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ClassIcon from '@mui/icons-material/Class';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { MobileNavigation } from './MobileNavigation';

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [path, setPath] = useState(location.pathname);

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  const handleNavigation = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  if (isMobile) {
    return <MobileNavigation path={path} handleNavigation={handleNavigation} />;
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: (theme) => theme.palette.background.paper,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: (theme) => theme.customSpacings.sm, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Gym Scheduler
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <BottomNavigation
            value={path}
            onChange={handleNavigation}
            showLabels
            sx={{
              bgcolor: (theme) => theme.palette.background.paper,
              '& .MuiBottomNavigationAction-root': {
                minWidth: 'auto',
                padding: (theme) => theme.customSpacings.sm,
                color: (theme) => theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: (theme) => theme.palette.primary.main,
                },
              },
            }}
          >
            <BottomNavigationAction label="Início" value="/" icon={<HomeIcon />} />
            <BottomNavigationAction label="Alunos" value="/students" icon={<PeopleIcon />} />
            <BottomNavigationAction label="Aulas" value="/classes" icon={<ClassIcon />} />
          </BottomNavigation>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
