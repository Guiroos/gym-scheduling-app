import ClassIcon from '@mui/icons-material/Class';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

import type { MobileNavigationProps } from './types';

export const MobileNavigation = ({ path, handleNavigation }: MobileNavigationProps) => {
  return (
    <BottomNavigation
      value={path}
      onChange={handleNavigation}
      showLabels
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        height: '64px',
      }}
    >
      <BottomNavigationAction label="Início" value="/" icon={<HomeIcon />} />
      <BottomNavigationAction label="Alunos" value="/students" icon={<PeopleIcon />} />
      <BottomNavigationAction label="Aulas" value="/classes" icon={<ClassIcon />} />
    </BottomNavigation>
  );
};
