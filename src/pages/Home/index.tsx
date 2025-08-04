import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Button, Container, Grid, Typography } from '@mui/material';

import { clearClasses } from '@/services/indexedDb/queries/class/clearClasses';

import { generateMockStudentsAndAddToDB } from '@/utils/mockData/studentsMock';
import { handleToastifyMessage } from '@/utils/toastify/toastifyMessage';

const HomePage = () => {
  const [populateLoading, setPopulateLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  const handlePopulateStudents = async () => {
    setPopulateLoading(true);

    await generateMockStudentsAndAddToDB();

    setTimeout(() => {
      handleToastifyMessage({
        message: 'Alunos populados com sucesso!',
        type: 'success',
      });
      setPopulateLoading(false);
    }, 1500);
  };

  const handleClearClasses = async () => {
    setClearLoading(true);

    await clearClasses();

    setTimeout(() => {
      handleToastifyMessage({
        message: 'Aulas limpas com sucesso!',
        type: 'success',
      });
      setClearLoading(false);
    }, 1500);
  };

  return (
    <Container maxWidth="md">
      <Box my={(theme) => theme.customSpacings.xxl} textAlign="center">
        <img src="/gym.svg" alt="Gym" width={128} height={128} />

        <Typography variant="h4" component="h1" gutterBottom>
          Bem-vindo à Rede de Academias!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Gerencie suas aulas e alunos com facilidade.
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          <Button
            sx={{ mt: (theme) => theme.customSpacings.md }}
            component={Link}
            to="/students"
            disabled={populateLoading || clearLoading}
          >
            Ver Lista de Alunos
          </Button>

          <Button
            sx={{ mt: (theme) => theme.customSpacings.md }}
            component={Link}
            to="/classes"
            disabled={populateLoading || clearLoading}
          >
            Ver Agenda de Aulas
          </Button>

          <Button
            sx={{ mt: (theme) => theme.customSpacings.md }}
            onClick={handlePopulateStudents}
            disabled={populateLoading || clearLoading}
            loading={populateLoading}
          >
            Limpar + Popular Alunos
          </Button>

          <Button
            sx={{ mt: (theme) => theme.customSpacings.md }}
            onClick={handleClearClasses}
            disabled={populateLoading || clearLoading}
            loading={clearLoading}
          >
            Limpar Aulas
          </Button>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
