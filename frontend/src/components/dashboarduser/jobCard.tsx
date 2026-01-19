import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

export interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: number;
}

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{job.title}</Typography>
        <Typography variant="subtitle1">{job.company}</Typography>
        <Typography variant="body2">{job.description}</Typography>
        <Typography variant="caption">
          Location: {job.location} | Salary: {job.salary ?? "N/A"}
        </Typography>

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onApply(job._id)}
          >
            Apply
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;
