import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Stack,
  Button,
  Box,
  IconButton,
} from "@mui/material";

const menuItems = ["Men", "Women", "Kids", "Shoes", "Accessories"];

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ minHeight: "56px !important", gap: "10.417px" }}
        >
          <img src="../src/img/logo.svg"></img>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 0,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            WDB
          </Typography>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Stack direction="row" spacing={2}>
              {menuItems.map((item) => (
                <Button
                  key={item}
                  sx={{
                    color:
                      item === "Women"
                        ? "var(--Project-Sandbox-Primary-Red-700)"
                        : "white",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {item}
                </Button>
              ))}
            </Stack>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton color="inherit" size="small">
              <i className="fa-solid fa-magnifying-glass"></i>
            </IconButton>
            <IconButton color="inherit" size="small">
              <i class="fa-regular fa-heart"></i>
            </IconButton>
            <IconButton color="inherit" size="small">
              <i class="fa-regular fa-user"></i>
            </IconButton>
            <IconButton color="inherit" size="small">
              <i class="fa-solid fa-cart-shopping"></i>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
