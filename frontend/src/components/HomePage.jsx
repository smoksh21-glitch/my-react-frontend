import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FileUpload from './FileUpload';
import { FileText, TrendingUp, Target, Award } from 'lucide-react';

const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5050';

const industries = [
  'Finance',
  'IT/Software',
  'Marketing',
  'HR',
  'Operations',
  'Healthcare',
  'Education',
  'Sales',
  'Engineering',
  'Custom'
];

function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please upload a resume file');
      return;
    }

    if (!industry) {
      setError('Please select an industry');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('industry', industry);

      const response = await axios.post(
        `${API_URL}/api/upload-resume`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data?.success) {
        navigate('/results', {
          state: { analysisData: response.data.data }
        });
      } else {
        setError('Unexpected response from server');
      }

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to analyze resume'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ATS Resume Checker
      </h1>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <FileUpload onFileSelect={handleFileSelect} />

        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Choose Industry</option>
          {industries.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 w-full disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </form>
    </div>
  );
}

export default HomePage;