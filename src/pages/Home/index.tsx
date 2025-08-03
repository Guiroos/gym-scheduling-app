import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Button, Container, Grid, Typography } from '@mui/material';

import { generateMockStudentsAndAddToDB } from '@/utils/mockData/studentsMock';
import { handleToastifyMessage } from '@/utils/toastify/toastifyMessage';

const HomePage = () => {
  const [loading, setLoading] = useState(false);

  const handlePopulateStudents = async () => {
    setLoading(true);

    await generateMockStudentsAndAddToDB();

    setTimeout(() => {
      handleToastifyMessage({
        message: 'Alunos populados com sucesso!',
        type: 'success',
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Container maxWidth="md">
      <Box my={(theme) => theme.customSpacings.xxl} textAlign="center">
        <img src="/gym.svg" alt="Gym" width={128} />

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
            disabled={loading}
          >
            Ver Lista de Alunos
          </Button>

          <Button
            sx={{ mt: (theme) => theme.customSpacings.md }}
            component={Link}
            to="/classes"
            disabled={loading}
          >
            Ver Agenda de Aulas
          </Button>

          <Button
            sx={{ mt: (theme) => theme.customSpacings.md }}
            onClick={handlePopulateStudents}
            disabled={loading}
            loading={loading}
          >
            Limpar + Popular Alunos
          </Button>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
