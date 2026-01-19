import React from "react";
import {
  Box,
  Typography,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";


const drawerWidth = 240;

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
        <List>
          {["Home", "Profile", "Settings", "Logout"].map((text) => (
            <ListItem key={text}>
              <ListItemButton>
                {text} 
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f5" }}
      >
        <Toolbar /> {/* spacing for AppBar */}
        <Typography variant="h4" gutterBottom>
          Welcome to your Dashboard!
        </Typography>

        <Grid container spacing={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">My Applications</Typography>
                <Typography variant="body2">
                  You have 5 job applications pending.
                </Typography>
                <Button sx={{ mt: 2 }} variant="contained">
                  View Applications
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6">Messages</Typography>
                <Typography variant="body2">
                  You have 2 new messages from recruiters.
                </Typography>
                <Button sx={{ mt: 2 }} variant="contained">
                  View Messages
                </Button>
              </CardContent>
            </Card>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
