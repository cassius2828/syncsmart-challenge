import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { Container } from "@mui/material";

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
        position="static"
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2, color: "#e36537" }}
          >
            <MenuIcon sx={{ display: { xs: "block", lg: "none" } }} />
          </IconButton>
          <Container
            sx={{
              display: "flex",
              gap: "12px",
              justifyContent: "end",
            }}
          >
            <Link href={"/"}>
              <Button color="" variant="contained" sx={{ color: "#e36537" }}>
                Home
              </Button>
            </Link>
            <Link href={"/dashboard/alpha"}>
              <Button color="" variant="contained" sx={{ color: "#e36537" }}>
                Alpha Dashboard
              </Button>
            </Link>
            <Link href={"/dashboard/beta"}>
              <Button color="" variant="contained" sx={{ color: "#e36537" }}>
                Beta Dashboard
              </Button>
            </Link>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
