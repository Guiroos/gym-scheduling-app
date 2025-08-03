import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { useMediaQuery } from '@mui/material';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Navigation from '@/components/Navigation';

import ClassDetails from '@/pages/Classes/ClassDetails';
import ClassesList from '@/pages/Classes/ClassesList';
import HomePage from '@/pages/Home';
import StudentsList from '@/pages/Students/StudentsList';

const MainContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const showNavigation = !location.pathname.includes('/classes/');

  return (
    <Box
      sx={{
        pb: isMobile && showNavigation ? '80px' : 0,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!isMobile && <Navigation />}

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/students" element={<StudentsList />} />
          <Route path="/classes" element={<ClassesList />} />
          <Route path="/classes/:classId" element={<ClassDetails />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Box>

      {isMobile && showNavigation && <Navigation />}
    </Box>
  );
};

export const ApplicationRoutes = () => {
  return (
    <Router>
      <MainContent />
    </Router>
  );
};
