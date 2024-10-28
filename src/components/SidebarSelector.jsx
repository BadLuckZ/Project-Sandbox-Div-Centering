import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemButton,
} from "@mui/material";
import { categoryData } from "../js/utils";
import { useNavigate } from "react-router-dom";

export default function SidebarSelector({ type, current }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      categoryData.some((item) => item.type === type && item.api === current)
    ) {
      setOpen(true);
    }
  }, [type, current]);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleItemClick = (api) => {
    navigate(`/items/${api}`);
  };

  return (
    <List sx={{ width: "100%" }} component="nav">
      <ListItemButton
        onClick={handleClick}
        aria-expanded={open}
        aria-controls={`collapse-${type}`}
      >
        <ListItemText
          primary={type}
          primaryTypographyProps={{
            sx: {
              color: "var(--Project-Sandbox-Secondary-Black-900)",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: "600",
              lineHeight: "24px",
            },
          }}
        />
        <i className={`fa-solid fa-chevron-${open ? "up" : "down"}`}></i>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding id={`collapse-${type}`}>
          {categoryData
            .filter((item) => item.type === type)
            .map((item) => (
              <ListItem
                key={item.api}
                disablePadding
                sx={{
                  backgroundColor:
                    item.api === current
                      ? "var(--Project-Sandbox-Primary-Red-700)"
                      : "inherit",
                }}
              >
                <ListItemButton onClick={() => handleItemClick(item.api)}>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      sx: {
                        color: "var(--Text-DarkText)",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "20px",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Collapse>
    </List>
  );
}
