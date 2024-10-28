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
} from "@mui/material";
import { useState, useContext } from "react";
import { categoryData } from "../js/utils";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

const Header = ({ currentPermalink = null }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  const handleCategoryClick = (catType) => {
    setActiveCategory((prev) => (prev === catType ? null : catType));
  };

  const handleSubItemClick = (api) => {
    navigate(`/items/${api}`);
    setActiveCategory(null);
  };

  const categoryTypes = [...new Set(categoryData.map((item) => item.type))];

  const totalItemsInCart = cart.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "var(--Project-Sandbox-Black)" }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: "56px !important",
            gap: "10.417px",
            position: "relative",
          }}
        >
          {/* Logo */}
          <img src="../src/img/logo.svg" alt="Logo" />
          <Typography
            component="p"
            sx={{
              color: "var(--Project-Sandbox-White)",
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "24px",
            }}
          >
            WDB
          </Typography>

          {/* Another Selector */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Stack direction="row" spacing={2}>
              {categoryTypes.map((catType) => (
                <div key={catType} style={{ position: "relative" }}>
                  <Button
                    sx={{
                      color:
                        catType === activeCategory
                          ? "var(--Project-Sandbox-Primary-Red-700)"
                          : "var(--Project-Sandbox-White)",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      cursor: "pointer",
                      ":hover": {
                        color: "var(--Project-Sandbox-Primary-Red-700)",
                      },
                    }}
                    onClick={() => handleCategoryClick(catType)}
                  >
                    {catType}
                  </Button>
                  <Fade in={activeCategory === catType} timeout={300}>
                    <List
                      component="div"
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
                            button={true}
                            key={cat.api}
                            disabled={cat.api === currentPermalink}
                            onClick={() => {
                              if (cat.api !== currentPermalink) {
                                handleSubItemClick(cat.api);
                              }
                            }}
                            sx={{
                              backgroundColor:
                                cat.api === currentPermalink
                                  ? "var(--Project-Sandbox-Primary-Red-700)"
                                  : "",
                              pointerEvents:
                                cat.api === currentPermalink ? "none" : "auto",
                            }}
                          >
                            <ListItemText
                              primary={cat.text}
                              primaryTypographyProps={{
                                sx: {
                                  color:
                                    "var(--Project-Sandbox-Secondary-Black-900)",
                                  fontSize: "14px",
                                  fontWeight: 400,
                                  lineHeight: "20px",
                                  cursor:
                                    cat.api === currentPermalink
                                      ? "not-allowed"
                                      : "pointer",
                                },
                              }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Fade>
                </div>
              ))}
            </Stack>
          </Box>

          {/* Icons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              color="inherit"
              size="small"
              sx={{
                position: "relative",
                "&:hover": {
                  color: "var(--Project-Sandbox-Primary-Red-700)",
                },
              }}
              onClick={(event) => {
                navigate("/cart");
              }}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              <Badge
                badgeContent={totalItemsInCart}
                color="error"
                sx={{
                  position: "absolute",
                  top: "-1px",
                  right: "-1px",
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
