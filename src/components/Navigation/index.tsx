import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ClassIcon from '@mui/icons-material/Class';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import type { INavItem } from './types';

export const AppNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [value, setValue] = useState(location.pathname);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setValue(location.pathname);
  }, [location]);

  const handleNavigation = (_: React.SyntheticEvent, newValue: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      navigate(newValue);
    }, 100);
  };

  const navItems: INavItem[] = [
    {
      label: 'Início',
      value: '/',
      icon: <HomeIcon />,
    },
    {
      label: 'Alunos',
      value: '/students',
      icon: <PeopleIcon />,
    },
    {
      label: 'Aulas',
      value: '/classes',
      icon: <ClassIcon />,
    },
  ];

  const renderNavItem = (item: INavItem) => (
    <BottomNavigationAction
      key={item.value}
      label={item.label}
      value={item.value}
      icon={item.icon}
      aria-label={item.label}
      sx={{
        minWidth: '72px',
        padding: '8px 0 10px',
        transition: 'all 0.2s ease',
        '&.Mui-selected': {
          color: theme.palette.primary.main,
          '& .MuiSvgIcon-root': {
            transform: 'scale(1.1)',
          },
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
        '& .MuiTouchRipple-root': {
          color: theme.palette.primary.main,
        },
      }}
    />
  );

  if (!isMobile) {
    return (
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          transition: 'transform 0.3s ease',
          transform: scrolled ? 'translateY(-100%)' : 'translateY(0)',
          '&:hover': {
            transform: 'translateY(0)',
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color="text.primary">
            Gym Scheduling App
          </Typography>

          <Box sx={{ display: 'flex' }}>
            <BottomNavigation
              value={value}
              onChange={handleNavigation}
              showLabels
              sx={{
                gap: (theme) => theme.customSpacings.md,
                bgcolor: 'transparent',
                '& .MuiBottomNavigationAction-root': {
                  minWidth: 'auto',
                  padding: '6px 16px',
                  color: 'text.secondary',
                  borderRadius: theme.shape.borderRadius,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.selected,
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                },
              }}
            >
              {navItems.map(renderNavItem)}
            </BottomNavigation>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <Slide appear={false} direction="up" in={!scrolled}>
      <BottomNavigation
        value={value}
        onChange={handleNavigation}
        showLabels
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar,
          borderTop: `1px solid ${theme.palette.divider}`,
          height: '72px',
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          '& .MuiBottomNavigationAction-root': {
            minWidth: '72px',
            padding: '8px 0 10px',
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              '& .MuiSvgIcon-root': {
                transform: 'scale(1.1)',
              },
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          },
        }}
      >
        {navItems.map(renderNavItem)}
      </BottomNavigation>
    </Slide>
  );
};

export default AppNavigation;
