import React from 'react';
import { Stack, Typography } from '@mui/material';

const CategoryCard = ({ category, setSelectedCategory, selectedCategory }) => (
  <Stack
    type="button"
    alignItems="center"
    justifyContent="center"
    className="category-card"
    sx={selectedCategory === category._id ? { borderTop: '4px solid #FF2625', background: '#fff', borderBottomLeftRadius: '20px', width: '270px', height: '282px', cursor: 'pointer', gap: '47px' } : { background: '#fff', borderBottomLeftRadius: '20px', width: '270px', height: '282px', cursor: 'pointer', gap: '47px' }}
    onClick={() => {
      setSelectedCategory(category._id);
      window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });
    }}
  >
    <img src={category.imageUrl} alt={category.name} style={{ width: '40px', height: '40px' }} />
    <Typography fontSize="24px" fontWeight="bold" fontFamily="Alegreya" color="#3A1212" textTransform="capitalize">
      {category.name}
    </Typography>
  </Stack>
);

export default CategoryCard;
