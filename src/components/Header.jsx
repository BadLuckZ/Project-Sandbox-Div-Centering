import { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Stack,
  Button,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Fade,
  Badge,
  useMediaQuery,
  Drawer,
  ListSubheader,
} from "@mui/material";
import { categoryData, handleScrollToTop } from "../js/utils";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { CategoryContext } from "../contexts/CategoryContext";

const Header = ({ currentPermalink = null }) => {
  const { activeCategory, setActiveCategory, sidebarOpen, setSidebarOpen } =
    useContext(CategoryContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)");

  const handleCategoryClick = (catType) => {
    setActiveCategory((prev) => (prev === catType ? null : catType));
    if (isMobile) setSidebarOpen(true);
  };

  const handleSubItemClick = (api) => {
    navigate(`/items/${api}`);
    setActiveCategory(null);
    setSidebarOpen(false);
  };

  const categoryTypes = [...new Set(categoryData.map((item) => item.type))];
  const totalItemsInCart = cart.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "var(--Project-Sandbox-Black)" }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ minHeight: "56px !important", gap: "10px" }}
          >
            {isMobile && (
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{
                  padding: "8px",
                  fontSize: "1.25rem",
                  color: "var(--Project-Sandbox-White)",
                }}
              >
                <i className="fa-solid fa-bars"></i>
              </IconButton>
            )}

            <Box
              onClick={() => {
                handleScrollToTop();
                navigate("/");
              }}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <img src="/src/img/logo.svg" alt="Logo" />
              <Typography
                component="p"
                sx={{
                  color: "var(--Project-Sandbox-White)",
                  fontSize: "18px",
                  fontWeight: 600,
                  ml: 1,
                }}
              >
                WDB
              </Typography>
            </Box>

            {!isMobile && (
              <Box
                sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
              >
                <Stack direction="row" spacing={2}>
                  {categoryTypes.map((catType) => (
                    <Box key={catType} sx={{ position: "relative" }}>
                      <Button
                        onClick={() => handleCategoryClick(catType)}
                        sx={{
                          color:
                            activeCategory === catType
                              ? "var(--Project-Sandbox-Primary-Red-700)"
                              : "var(--Project-Sandbox-White)",
                          "&:hover": {
                            color: "var(--Project-Sandbox-Primary-Red-700)",
                          },
                        }}
                      >
                        {catType}
                      </Button>
                      <Fade in={activeCategory === catType}>
                        <List
                          sx={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            backgroundColor: "white",
                            boxShadow: 2,
                            zIndex: 1,
                            width: "200px",
                          }}
                        >
                          {categoryData
                            .filter((cat) => cat.type === catType)
                            .map((cat) => (
                              <ListItem
                                key={cat.api}
                                button
                                onClick={() => handleSubItemClick(cat.api)}
                                sx={{
                                  backgroundColor:
                                    cat.api === currentPermalink
                                      ? "var(--Project-Sandbox-Primary-Red-700)"
                                      : "inherit",
                                  "&:hover": {
                                    backgroundColor:
                                      "var(--Project-Sandbox-Secondary-Black-300)",
                                  },
                                }}
                              >
                                <ListItemText primary={cat.text} />
                              </ListItem>
                            ))}
                        </List>
                      </Fade>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            <IconButton
              onClick={() => navigate("/cart")}
              sx={{ color: "inherit" }}
            >
              <Badge badgeContent={totalItemsInCart} color="error">
                <i className="fa-solid fa-cart-shopping"></i>
              </Badge>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <Box sx={{ width: 250, padding: 2 }}>
          <List>
            {categoryTypes.map((catType) => (
              <Box key={catType}>
                <ListSubheader
                  sx={{ fontSize: "1.1rem", fontWeight: 600, color: "black" }}
                >
                  {catType}
                </ListSubheader>
                {categoryData
                  .filter((cat) => cat.type === catType)
                  .map((cat) => (
                    <ListItem
                      key={cat.api}
                      button
                      onClick={() => handleSubItemClick(cat.api)}
                      sx={{
                        backgroundColor:
                          cat.api === currentPermalink
                            ? "var(--Project-Sandbox-Primary-Red-700)"
                            : "inherit",
                        "&:hover": {
                          backgroundColor:
                            "var(--Project-Sandbox-Secondary-Black-300)",
                        },
                      }}
                    >
                      <ListItemText primary={cat.text} />
                    </ListItem>
                  ))}
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
