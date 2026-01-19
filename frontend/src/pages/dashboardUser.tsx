import React from "react";
import { Container, Typography, Box } from "@mui/material";
import ApplyJobForm from "../components/dashboarduser/ApplyJobForm";
import MyApplications from "../components/dashboarduser/myApplicaions";

const DashboardUser: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>

      <Box mt={4}>
        <ApplyJobForm />
      </Box>

      <Box mt={4}>
        <Typography variant="h5">My Applications</Typography>
        <MyApplications />
      </Box>
    </Container>
  );
};

export default DashboardUser;
