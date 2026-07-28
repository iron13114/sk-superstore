import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import logo from "../../../assets/images/logo.jpeg";
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Chip, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TuneIcon from '@mui/icons-material/Tune';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';
import { Box } from '@mui/material';


export const Navbar=({isProductList=false})=> {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchCategory, setSearchCategory] = React.useState('all');
  
  const userInfo=useSelector(selectUserInfo)
  const cartItems=useSelector(selectCartItems)
  const loggedInUser=useSelector(selectLoggedInUser)
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const theme=useTheme()
  const is480=useMediaQuery(theme.breakpoints.down(480))

  const wishlistItems=useSelector(selectWishlistItems)
  const isProductFilterOpen=useSelector(selectProductIsFilterOpen)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToggleFilters=()=>{
    dispatch(toggleFilters())
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const settings = [
    {name:"Home",to:"/"},
    {name:'Profile',to:loggedInUser?.isAdmin?"/admin/profile":"/profile"},
    {name:loggedInUser?.isAdmin?'Orders':'My orders',to:loggedInUser?.isAdmin?"/admin/orders":"/orders"},
    {name:'Logout',to:"/logout"},
  ];

  return (
    <AppBar position="sticky" sx={{backgroundColor:"white",boxShadow:"none",color:"text.primary"}}>
      <Toolbar sx={{ p: 1, height: "4rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

        {/* LEFT SIDE: Filter Icon + Logo */}
        <Stack flexDirection={'row'} alignItems={'center'} columnGap={1}>
          {
            isProductList && (
              <IconButton onClick={handleToggleFilters}>
                <TuneIcon sx={{ color: isProductFilterOpen ? "black" : "" }} />
              </IconButton>
            )
          }
          
          <Box component="a" href="/" sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Box component="img" src={logo} alt="SK Superstore" sx={{
                height: 55,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Stack>

        {/* CENTER: Search Bar */}
        <Stack 
          flexDirection="row" 
          alignItems="center" 
          sx={{ 
            flex: 1, 
            maxWidth: 600, 
            mx: { xs: 1, sm: 2, md: 4 },
            display: { xs: 'none', sm: 'flex' } 
          }}
        >
          <Select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            size="small"
            sx={{
              bgcolor: '#f3f3f3',
              borderRadius: '4px 0 0 4px',
              height: 40,
              '& .MuiOutlinedInput-notchedOutline': { borderRight: 'none', borderColor: '#cdcdcd' },
              '& .MuiSelect-select': { py: 0.5, px: 1.5, fontSize: '0.85rem' },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="products">Products</MenuItem>
            <MenuItem value="brands">Brands</MenuItem>
          </Select>
          
          <TextField
            size="small"
            placeholder="Search SKSuperStore"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
                bgcolor: 'white',
                height: 40,
                '& fieldset': { borderColor: '#cdcdcd' },
              },
            }}
          />
          
          <IconButton
            onClick={handleSearch}
            sx={{
              bgcolor: '#febd69',
              borderRadius: '0 4px 4px 0',
              height: 40,
              width: 45,
              '&:hover': { bgcolor: '#f3a847' },
            }}
          >
            <SearchIcon sx={{ color: '#131921' }} />
          </IconButton>
        </Stack>

        {/* RIGHT SIDE: Profile, Greetings, Cart, and Wishlist */}
        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'} columnGap={2}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={userInfo?.name} src="null" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {
              loggedInUser?.isAdmin && 
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography component={Link} color={'text.primary'} sx={{ textDecoration: "none" }} to="/admin/add-product" textAlign="center">Add new Product</Typography>
              </MenuItem>
            }
            {settings.map((setting) => (
              <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                <Typography component={Link} color={'text.primary'} sx={{ textDecoration: "none" }} to={setting.to} textAlign="center">{setting.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
          
          <Typography variant='h6' fontWeight={300}>
            {is480 ? `${userInfo?.name?.toString().split(" ")[0]}` : `Hey👋, ${userInfo?.name}`}
          </Typography>
          
          {loggedInUser?.isAdmin && <Button variant='contained'>Admin</Button>}
          
          <Stack sx={{ flexDirection: "row", columnGap: "1rem", alignItems: "center", justifyContent: "center" }}>
            {
              cartItems?.length > 0 && 
              <Badge badgeContent={cartItems.length} color='error'>
                <IconButton onClick={() => navigate("/cart")}>
                  <ShoppingCartOutlinedIcon />
                </IconButton>
              </Badge>
            }
            
            {
              !loggedInUser?.isAdmin &&
              <Stack>
                <Badge badgeContent={wishlistItems?.length} color='error'>
                  <IconButton component={Link} to={"/wishlist"}><FavoriteBorderIcon /></IconButton>
                </Badge>
              </Stack>
            }
          </Stack>
        </Stack>

      </Toolbar>
    </AppBar>
  );
}