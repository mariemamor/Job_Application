import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent } from "@mui/material";

interface Application {
  _id: string;
  job: {
    title: string;
    company: string;
  };
  status: string;
  resume: string;
  coverLetter?: string;
  phone?: string;
}

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/applications/myjobs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplications();
  }, [token]);

  return (
    <Box>
      {applications.length === 0 ? (
        <Typography>No applications yet.</Typography>
      ) : (
        applications.map((app) => (
          <Card key={app._id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{app.job.title}</Typography>
              <Typography variant="subtitle1">{app.job.company}</Typography>
              <Typography>Status: {app.status}</Typography>
              <Typography>Resume: {app.resume}</Typography>
              {app.coverLetter && <Typography>Cover Letter: {app.coverLetter}</Typography>}
              {app.phone && <Typography>Phone: {app.phone}</Typography>}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MyApplications;
