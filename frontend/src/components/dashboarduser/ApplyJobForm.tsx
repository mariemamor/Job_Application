import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography } from "@mui/material";
import JobCard, { Job } from "./jobCard";
import { baseUrl } from "../../api/baseUrl";
const ApplyJobForm: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const token = localStorage.getItem("token");

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${baseUrl}/jobs/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, [token]);

  const handleApply = async (jobId: string) => {
    try {
      await axios.post(
        `${baseUrl}/applications/apply`,
        { jobId, resume, coverLetter, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Applied successfully!");
      setResume("");
      setCoverLetter("");
      setPhone("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error applying");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Available Jobs
      </Typography>

      <Box mb={4}>
        <TextField
          label="Resume URL"
          fullWidth
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Cover Letter"
          fullWidth
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Box>

      {jobs.map((job) => (
        <JobCard key={job._id} job={job} onApply={handleApply} />
      ))}
    </Box>
  );
};

export default ApplyJobForm;
