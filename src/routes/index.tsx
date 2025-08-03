import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import ClassDetails from '@/pages/Classes/ClassDetails';
// import ClassesList from '@/pages/Classes/ClassesList';
import HomePage from '@/pages/Home';
import StudentsList from '@/pages/Students/StudentsList';

export const ApplicationRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/students" element={<StudentsList />} />

        {/* <Route path="/classes" element={<ClassesList />} /> */}
        {/* <Route path="/classes/:classId" element={<ClassDetails />} /> */}

        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
};
