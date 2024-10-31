import { useContext } from "react";
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
    setActiveCategory(catType);
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
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "var(--Project-Sandbox-Black)",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            width: "100%",
            padding: isMobile ? "10px 16px !important" : "10px 64px !important",
            gap: "16px",
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "16px",
              }}
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
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src="/img/logo.svg" alt="Logo" />
                <Typography
                  component="p"
                  sx={{
                    color: "var(--Project-Sandbox-White)",
                    fontSize: "18px",
                    fontWeight: 600,
                    fontStyle: "normal",
                    ml: 1,
                    lineHeight: "24px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  WDB
                </Typography>
              </Box>
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
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: "400",
                          lineHeight: "20px",
                          fontFamily: "Poppins, sans-serif",
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
                            width: "250px",
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
                                  color:
                                    "var(--Project-Sandbox-Secondary-Black-900)",
                                  backgroundColor:
                                    cat.api === currentPermalink
                                      ? "var(--Project-Sandbox-Primary-Red-700)"
                                      : "inherit",
                                  "&:hover": {
                                    backgroundColor:
                                      cat.api === currentPermalink
                                        ? "var(--Project-Sandbox-Primary-Red-700)"
                                        : "var(--Project-Sandbox-Secondary-Black-300)",
                                  },
                                  cursor:
                                    cat.api === currentPermalink
                                      ? "default"
                                      : "pointer",
                                }}
                              >
                                <ListItemText
                                  primary={cat.text}
                                  primaryTypographyProps={{
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "16px",
                                    fontStyle: "normal",
                                    fontWeight: "400",
                                    lineHeight: "20px",
                                  }}
                                />
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
              sx={{
                color: "inherit",
                ":hover": {
                  color: "var(--Project-Sandbox-Primary-Red-700)",
                },
              }}
            >
              <Badge badgeContent={totalItemsInCart} color="error">
                <i className="fa-solid fa-cart-shopping"></i>
              </Badge>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {isMobile && (
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        >
          <Box
            sx={{
              maxWidth: "300px",
              padding: "16px",
            }}
          >
            <List
              sx={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {categoryTypes.map((catType) => (
                <Box key={catType}>
                  <ListSubheader
                    sx={{
                      fontSize: "18px",
                      fontWeight: 600,
                      fontStyle: "normal",
                      lineHeight: "24px",
                      paddingBottom: "12px",
                      color: "var(--Project-Sandbox-Black)",
                    }}
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
                        <ListItemText
                          primary={cat.text}
                          primaryTypographyProps={{
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: "400",
                            lineHeight: "20px",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        />
                      </ListItem>
                    ))}
                </Box>
              ))}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Header;
