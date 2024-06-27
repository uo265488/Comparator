import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";

import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginButton from "./authentication/LoginButton";
import LogoutButton from "./authentication/LogoutButton";
import Button from "@mui/material/Button";
import ProfileButton from "./authentication/ProfileButton";
import { useAuth0 } from "@auth0/auth0-react";

const pages = [
  { name: "Scanner", link: "scanner" },
  { name: "Catálogo", link: "productos" },
  { name: "La Lista de la compra", link: "lista" },
  { name: "Tus listas", link: "listasPersonales" },
  { name: "Estadisticas", link: "estadisticas" }

];

export function NavigationBar() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  console.log("Usuario en sesion: " + user);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  var unidades = 0;
  const cart = useSelector((state) => state.laListaReducer.lista);
  cart.forEach((item) => (unidades += item.unidades));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container style={{ backgroundColor: "rgb(97, 75, 154)" }} maxWidth="xl">
        <Toolbar
          style={{ backgroundColor: "rgb(97, 75, 154)" }}
          disableGutters
        >
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            COMPARATOR
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} component="a" href={page.link} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" variant="body1">
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "rgb(255, 255, 255)",
              textDecoration: "none",
            }}
          >
            COMPARATOR
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                href={page.link}
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <Link to="/lista">
            <IconButton
              style={{ marginRight: "1em" }}
              size="large"
              aria-label={"show " + cart.forEach + "new notifications"}

            >
              <Badge badgeContent={unidades} color="error">
                <ShoppingCartIcon />
              </Badge>{" "}
            </IconButton>
          </Link>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {isAuthenticated ? (
                  <Avatar alt="Profile pic" src={user.picture} />
                ) : (
                  <Avatar alt="Profile pic" />
                )}
              </IconButton>
            </Tooltip>

            {/**settings.map((setting) => (
                 <MenuItem key={setting} onClick={handleCloseUserMenu}>
              <Button
                href={setting.link}
                key={setting.name}
                onClick={handleCloseNavMenu}
              >
                {setting.name}
              </Button>
                </MenuItem>
              ))*/}

            {isAuthenticated ? (
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key={"profileButton"} onClick={handleCloseUserMenu}>
                  <ProfileButton></ProfileButton>
                </MenuItem>

                <MenuItem key={"logoutButton"} onClick={handleCloseUserMenu}>
                  <LogoutButton></LogoutButton>
                </MenuItem>
              </Menu>
            ) : (
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key={"loginButton"} onClick={handleCloseUserMenu}>
                  <LoginButton></LoginButton>
                </MenuItem>
              </Menu>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
