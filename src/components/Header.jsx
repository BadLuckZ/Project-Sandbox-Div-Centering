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
} from "@mui/material";
import { categoryData } from "../js/utils";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { CategoryContext } from "../contexts/CategoryContext";

const Header = ({ currentPermalink = null }) => {
  const { activeCategory, setActiveCategory } = useContext(CategoryContext);
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
          <img src="../src/img/logo.svg" alt="Logo" />
          <Typography
            component="p"
            sx={{
              color: "var(--Project-Sandbox-White)",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            WDB
          </Typography>

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
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        backgroundColor: "white",
                        boxShadow: 2,
                        zIndex: 1,
                        width: "200px",
                        cursor: "pointer",
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
                              cursor: "pointer",
                            }}
                          >
                            <ListItemText
                              primary={cat.text}
                              sx={{
                                color:
                                  "var(--Project-Sandbox-Secondary-Black-900)",
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

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={() => navigate("/cart")}
              color="inherit"
              size="small"
            >
              <i className="fa-solid fa-cart-shopping"></i>
              <Badge
                badgeContent={totalItemsInCart}
                color="error"
                sx={{ position: "absolute", top: "-1px", right: "-1px" }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
