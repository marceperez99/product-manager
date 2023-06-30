import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import useAuthentication from "../hooks/useAuthentication";

const ScreenLayout = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  const { logout } = useAuthentication();
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Product Management
          </Typography>
          <Button color="inherit" onClick={logout}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
};

export default ScreenLayout;
