import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
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
          ></IconButton>
          <Container
            sx={{
              display: "flex",
              gap: "12px",
              justifyContent: "end",
            }}
          >
            <Link href={"/"}>
              <Button
                color="inherit"
                variant="contained"
                sx={{
                  color: "#e36537",
                  backgroundColor: "#fff",
                  fontSize: { xs: "0.75rem", sm: "1rem" },
                  px: { xs: "4px", sm: ".75rem" },
                  width: { xs: "9rem", md: "14rem" },
                }}
              >
                Home
              </Button>
            </Link>
            <Link href={"/dashboard/alpha"}>
              <Button
                color="inherit"
                variant="contained"
                sx={{
                  color: "#e36537",
                  backgroundColor: "#fff",
                  fontSize: { xs: "0.75rem", sm: "1rem" },
                  px: { xs: "4px", sm: ".75rem" },
                  width: { xs: "9rem", md: "14rem" },
                }}
              >
                Alpha Dashboard
              </Button>
            </Link>
            <Link href={"/dashboard/beta"}>
              <Button
                color="inherit"
                variant="contained"
                sx={{
                  color: "#e36537",
                  backgroundColor: "#fff",
                  fontSize: { xs: "0.75rem", sm: "1rem" },
                  px: { xs: "4px", sm: ".75rem" },
                  width: { xs: "9rem", md: "14rem" },
                }}
              >
                Beta Dashboard
              </Button>
            </Link>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
