import { useState } from 'react';

import { Box, CircularProgress, MenuItem, Pagination, Select, Typography } from '@mui/material';

import useScrollPosition from '@/hooks/useScrollPosition';

import type { CardListProps } from './types.d';

export function CardList<T>({
  items,
  loading = false,
  emptyMessage = 'Nenhum item encontrado',
  pagination = true,
  renderItem,
  keyExtractor,
}: CardListProps<T>) {
  const { scrolled } = useScrollPosition(10);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value: number) => {
    setRowsPerPage(value);
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  const paginatedItems = pagination
    ? items.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    : items;

  return (
    <Box>
      <Box mb={(theme) => theme.customSpacings.md}>
        {paginatedItems.map((item) => (
          <Box key={keyExtractor(item)} mb={(theme) => theme.customSpacings.sm}>
            {renderItem(item)}
          </Box>
        ))}
      </Box>

      {pagination && items.length > 0 && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '72px',
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            p: (theme) => theme.customSpacings.sm,
            zIndex: (theme) => theme.zIndex.appBar - 1,
            display: 'flex',
            flexDirection: 'column',
            gap: (theme) => theme.customSpacings.xs,
            alignItems: 'center',
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'transform 0.3s ease',
            transform: scrolled ? 'translateY(72px)' : 'translateY(0)',
          }}
        >
          <Pagination
            count={Math.ceil(items.length / rowsPerPage)}
            page={page + 1}
            onChange={(event, value) => handleChangePage(event, value - 1)}
            size="small"
            siblingCount={0}
            boundaryCount={1}
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                minWidth: 32,
                height: 32,
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, items.length)} de ${items.length}`}
            </Typography>

            <Select
              size="small"
              value={rowsPerPage}
              onChange={(e) => {
                handleChangeRowsPerPage(e.target.value);
                setPage(0);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              variant="standard"
              disableUnderline
              sx={{
                '& .MuiSelect-select': {
                  fontSize: '0.875rem',
                },
                '& .MuiSelect-icon': {
                  right: 0,
                },
              }}
            >
              <MenuItem value={5}>5 itens</MenuItem>
              <MenuItem value={10}>10 itens</MenuItem>
              <MenuItem value={15}>15 itens</MenuItem>
            </Select>
          </Box>
        </Box>
      )}
    </Box>
  );
}
