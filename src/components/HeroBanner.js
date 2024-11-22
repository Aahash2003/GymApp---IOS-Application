import React from 'react'
import { Box, Stack, Typography, Button } from '@mui/material';
import HeroBannerImage from '../Assets/Logo/banner.png'
const HeroBanner = () => {
    return (
        <Box sx={{ mt: { lg: '212px', xs: '70px' }, 
        ml: { sm: '50px' } }} 
        postition="relative" p="20px" >
            <Typography color="#FF2625" fontWeight="600" fontSize="26px">
                Fitness Club
                </Typography>
                <Typography fontWeight={700} 
                sx={{ fontSize: { lg: '44px', xs: '40px'}}}
                mb = "15px" mt="20px">
                    Sleep  <br />
                    Grind  
                     <br />
                    Repeat
                    </Typography>
                    <Typography  fontSize = "22px" lineHeight= "35px" mb = {2}>
                        Check out the Most Effective Workouts
                    </Typography>
                    <Button variant = "contained" color= "error" href = "#exercises " sx={{backgroundColor: 'ff2625', padding: '10px'}} >Explore Exercises</Button>
                    <Typography fontWeight={600} color="#ff2625" sx={{opacity: 0.1, display: { lg: 'block', xs: 'none'} }}
                    fontSize="200px"
                    >
                        Exercises


                    </Typography>
                    <img src= {HeroBannerImage} alt= "banner" className='hero-banner-img' style={{ left: '100000px', margin:'20px'}}px = "-20px"/>
        </Box>
    )
}

export default HeroBanner