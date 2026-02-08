import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FileUpload from './FileUpload';
import { FileText, TrendingUp, Target, Award } from 'lucide-react';

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

  // ✅ use backend URL from .env.production
  const API_URL = process.env.REACT_APP_API_URL;

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

      // ✅ FIXED: call Render backend directly
      const response = await axios.post(
        `${API_URL}/api/upload-resume`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        navigate('/results', { state: { analysisData: response.data.data } });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.error ||
        'Failed to analyze resume. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-full">
              <FileText className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ATS Resume Checker
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get instant feedback on your resume's ATS compatibility.
            Upload your resume and discover how to optimize it for your dream job.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="card text-center">
            <Target className="w-10 h-10 mx-auto mb-3 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold mb-2">ATS Score</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get a comprehensive score based on ATS compatibility
            </p>
          </div>

          <div className="card text-center">
            <TrendingUp className="w-10 h-10 mx-auto mb-3 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold mb-2">Keyword Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Discover missing keywords and skills for your industry
            </p>
          </div>

          <div className="card text-center">
            <Award className="w-10 h-10 mx-auto mb-3 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold mb-2">AI Suggestions</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Receive actionable tips to improve your resume
            </p>
          </div>

        </div>

        {/* Upload Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="card">

            <h2 className="text-2xl font-bold mb-6 text-center">
              Upload Your Resume
            </h2>

            <div className="mb-6">
              <FileUpload onFileSelect={handleFileSelect} />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Select Industry *
              </label>

              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="input-field"
                disabled={loading}
              >
                <option value="">Choose your industry...</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedFile || !industry}
              className="btn-primary w-full"
            >
              {loading ? 'Analyzing Resume...' : 'Analyze Resume'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Supported formats: PDF, DOC, DOCX • Max size: 5MB
            </p>

          </form>
        </div>

      </div>
    </div>
  );
}

export default HomePage;
