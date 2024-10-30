import React, { useContext } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { categoryData, handleScrollToTop } from "../js/utils";
import { CategoryContext } from "../contexts/CategoryContext";

const Footer = () => {
  const { setActiveCategory, setSidebarOpen } = useContext(CategoryContext);

  const handleCategoryClick = (categoryType) => {
    setActiveCategory(categoryType);
    setSidebarOpen(true);
    handleScrollToTop();
  };

  const categoryTypes = [...new Set(categoryData.map((item) => item.type))];

  return (
    <Box
      sx={{
        backgroundColor: "var(--Project-Sandbox-Secondary-Black-900)",
        display: "flex",
        width: "100%",
        padding: "24px 124px",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Typography
            sx={{
              color: "var(--Project-Sandbox-White)",
              fontSize: "32px",
              fontWeight: "700",
              paddingBottom: "24px",
            }}
          >
            Featured Product
          </Typography>
          {categoryTypes.map((categoryType, idx) => (
            <Typography
              key={`${categoryType}-${idx}`}
              sx={{
                color: "var(--Project-Sandbox-White)",
                fontSize: "18px",
                fontWeight: "600",
                lineHeight: "24px",
                paddingBottom: "16px",
                cursor: "pointer",
                ":hover": {
                  color: "var(--Project-Sandbox-Primary-Red-700)",
                },
              }}
              onClick={() => handleCategoryClick(categoryType)}
            >
              {categoryType}
            </Typography>
          ))}
        </Grid>

        {/* Register With Us */}
        <Grid item xs={12} md={4}>
          <Typography
            sx={{
              color: "var(--Project-Sandbox-White)",
              fontSize: "32px",
              fontWeight: "700",
              lineHeight: "48px",
              paddingBottom: "24px",
            }}
            gutterBottom
          >
            Register with us
          </Typography>
          <Typography
            sx={{
              color: "var(--Project-Sandbox-White)",
              fontSize: "16px",
              fontWeight: "100",
              lineHeight: "20px",
              paddingBottom: "24px",
            }}
            gutterBottom
          >
            Sign up now and get 20% off your first purchase!
          </Typography>
          <Button
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "var(--Project-Sandbox-White)",
              color: "var(--Project-Sandbox-Secondary-Black-900)",
              height: "54px",
              padding: "7px 10px",
              ":hover": {
                backgroundColor: "var(--Project-Sandbox-Primary-Red-700)",
              },
            }}
          >
            <Typography
              sx={{
                color: "var(--Project-Sandbox-Secondary-Black-900)",
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "20px",
                paddingRight: "8px",
              }}
            >
              Sign up now
            </Typography>
            <Typography sx={{ width: "21.362px", height: "21.362px" }}>
              <i className="fa-solid fa-circle-chevron-right"></i>
            </Typography>
          </Button>
        </Grid>

        {/* Customer Services */}
        <Grid item xs={12} md={4}>
          <Typography
            sx={{
              color: "var(--Project-Sandbox-White)",
              fontSize: "32px",
              fontWeight: "700",
              lineHeight: "48px",
              paddingBottom: "24px",
            }}
            gutterBottom
          >
            Customer services
          </Typography>
          <Typography
            sx={{
              color: "var(--Project-Sandbox-White)",
              fontSize: "16px",
              fontWeight: "100",
              lineHeight: "20px",
              paddingBottom: "16px",
            }}
            gutterBottom
          >
            MBK Tower 20th Floor, 444, Phaya Thai Rd, Wang Mai, Pathum Wan,
            Bangkok 10330
          </Typography>
          <Typography
            sx={{
              color: "var(--Project-Sandbox-White)",
              fontSize: "16px",
              fontWeight: "100",
              lineHeight: "20px",
              paddingBottom: "24px",
            }}
            gutterBottom
          >
            Email: jane.doe@realmail.com
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <Input
              type="email"
              placeholder="Enter your email"
              sx={{
                backgroundColor: "var(--Project-Sandbox-White)",
                borderRadius: "4px",
                height: "54px",
                input: {
                  color: "var(--Project-Sandbox-Secondary-Black-500)",
                  fontSize: "16px",
                },
              }}
            />
            <Button
              sx={{
                height: "54px",
                padding: "7px 10px",
                width: "fit-content",
                backgroundColor: "var(--Project-Sandbox-Primary-Red-700)",
                color: "var(--Project-Sandbox-Secondary-Black-900)",
                fontSize: "16px",
                fontWeight: "400",
                ":hover": {
                  backgroundColor: "var(--Project-Sandbox-Primary-Red-900)",
                },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Footer Bottom */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          mt: 4,
        }}
      >
        <Typography
          sx={{
            color: "var(--Project-Sandbox-Secondary-Black-500)",
            fontSize: "12px",
            fontWeight: "400",
            lineHeight: "16px",
          }}
        >
          Copyright © 2024 All rights reserved for all contents.
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Typography
            sx={{
              color: "var(--Project-Sandbox-Secondary-Black-500)",
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "16px",
            }}
          >
            Powered By
          </Typography>
          <img
            src="/img/skooldio.jpg"
            style={{ width: "49.853px", height: "17.109px" }}
          />
          <Typography
            sx={{
              color: "var(--Project-Sandbox-Secondary-Black-500)",
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "16px",
            }}
          >
            |
          </Typography>
          <img
            src="/img/webdev.jpg"
            style={{ width: "30.951px", height: "16.923px" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
