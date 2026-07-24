import { Box, IconButton, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Stack } from '@mui/material'
import React from 'react'
import SendIcon from '@mui/icons-material/Send';
import { MotionConfig, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Footer = () => {

    const theme = useTheme()
    const is700 = useMediaQuery(theme.breakpoints.down(700))

    const labelStyles = {
        fontWeight: 300,
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
            textDecoration: 'underline'
        }
    }

    return (
        <Stack sx={{ backgroundColor: theme.palette.primary.main, paddingTop: "3rem", paddingLeft: is700 ? "1rem" : "3rem", paddingRight: is700 ? "1rem" : "3rem", paddingBottom: "1.5rem", rowGap: "5rem", color: theme.palette.primary.light, justifyContent: "space-around" }}>

            {/* upper */}
            <Stack flexDirection={'row'} rowGap={'1rem'} justifyContent={is700 ? "" : 'space-around'} flexWrap={'wrap'}>

                <Stack rowGap={'1rem'} padding={'1rem'}>
                    <Typography variant='h6'>Support</Typography>
                    <Typography component="a" href="https://www.google.com/maps/place/SK+General+Stores+Station+Road+Sakri/@26.2097846,86.079415,17z/data=!4m6!3m5!1s0x39edcf8ac7311eb7:0x6a769e37c40868b1!8m2!3d26.2096491!4d86.0784015!16s%2Fg%2F11h04fglsj?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" sx={labelStyles}>Sakri Station Rd, Bramhpur, Bihar.</Typography>
                    <Typography component="a" href="mailto:skgeneralstores2016@gmail.com" sx={labelStyles}>skgeneralstores2016@gmail.com</Typography>
                    <Typography component="a" href="tel:9386042504" sx={labelStyles}>+91 9386042504</Typography>
                </Stack>

                <Stack rowGap={'1rem'} padding={'1rem'}>
                    <Typography variant='h6'>Account</Typography>
                    <Typography component={Link } to="/profile" sx={labelStyles}>My Account</Typography>
                    <Typography component={Link} to="/login" sx={labelStyles}>Login / Register</Typography>
                    <Typography component={Link} to="/cart" sx={labelStyles}>Cart</Typography>
                    <Typography component={Link} to="/wishlist" sx={labelStyles}>Wishlist</Typography>
                    <Typography component={Link} to="/shop" sx={labelStyles}>Shop</Typography>
                </Stack> 

                <Stack rowGap={'1rem'} padding={'1rem'}>
                    <Typography variant='h6'>Quick Links</Typography>
                    <Typography component={Link} to="/privacy-policy" sx={labelStyles}>Privacy Policy</Typography>
                    <Typography component={Link} to="/terms-of-use" sx={labelStyles}>Terms Of Use</Typography>
                    <Typography component={Link} to="/faq" sx={labelStyles}>FAQ</Typography>
                    <Typography component={Link} to="/contact" sx={labelStyles}>Contact</Typography>
                </Stack>

            </Stack>

            {/* lower */}
            <Stack alignSelf={"center"}>
                <Typography color={'GrayText'}>&copy; SKSuperStore {new Date().getFullYear()}. All rights reserved</Typography>
            </Stack>

        </Stack>
    )
}