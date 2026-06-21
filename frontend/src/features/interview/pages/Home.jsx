import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { useInterview } from '../hooks/useInterview'
import "../style/home.scss"

const Home = () => {
  const { generateReport, getAllReports, reports } = useInterview()
  const { user, handleLogout } = useAuth()
  const navigate = useNavigate()
  const [selectedFileName, setSelectedFileName] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [error, setError] = useState("")
  const [fetchingReports, setFetchingReports] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        await getAllReports()
      } catch (err) {
        console.error("Failed to load reports:", err)
      } finally {
        setFetchingReports(false)
      }
    }
    fetchReports()
  }, [])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setResumeFile(file)
      setSelectedFileName(file.name)
      setError("")
    } else {
      setResumeFile(null)
      setSelectedFileName("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!resumeFile) {
      setError("Please upload your resume (PDF format) first.")
      return
    }
    if (!jobDescription.trim()) {
      setError("Please paste the job description details.")
      return
    }

    setError("")
    setGenerating(true)

    try {
      const response = await generateReport({
        jobDescription,
        selfDescription,
        resume: resumeFile
      })
      if (response && response.interviewReport) {
        navigate(`/interview/${response.interviewReport._id}`)
      } else {
        setError("Report was created but ID was missing from server response.")
      }
    } catch (err) {
      console.error("Submission failed:", err)
      setError(err?.response?.data?.message || "Failed to generate report. Please check your backend connection.")
    } finally {
      setGenerating(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high'
    if (score >= 50) return 'score-medium'
    return 'score-low'
  }

  return (
    <main className="home">
      {/* Top Navbar Header */}
      <header className="dashboard-header">
        <a href="/" className="brand-logo">
          <span>Jobnosis.</span>
        </a>
        <div className="user-nav">
          {user && (
            <span className="username-display">
              Welcome, {user.username || user.email}
            </span>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="dashboard-container">
        <form onSubmit={handleSubmit} className="generator-form">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h1>Generate <i>Interview</i> Report</h1>
            <p>Provide a job description and your profile credentials to get a customized AI interview roadmap.</p>
          </section>

          {error && (
            <div className="error-banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Inputs Grid */}
          <div className="interview-grid">
            {/* Left card: Job Description */}
            <div className="panel-card">
              <h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                Job <i>Description</i>
              </h2>
              <div className="input-field-group">
                <label htmlFor="jobDescription">Position Details</label>
                <textarea
                  name="jobDescription"
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description or requirements here..."
                  required
                ></textarea>
              </div>
            </div>

            {/* Right card: Profile / Resume */}
            <div className="panel-card">
              <h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Your <i>Profile</i>
              </h2>

              {/* Resume Upload Section */}
              <div className="input-field-group">
                <p>
                  Resume <span className="highlight">(PDF format recommended for best matching results)</span>
                </p>
                <label className="file-drop-zone" htmlFor="resume">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="upload-title">Choose your resume file</span>
                  <span className="upload-subtitle">Click to browse your local files</span>
                  {selectedFileName && (
                    <span className="filename-display">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {selectedFileName}
                    </span>
                  )}
                </label>
                <input
                  hidden
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>

              {/* Self Description Section */}
              <div className="input-field-group">
                <label htmlFor="selfDescription">Your Self Description</label>
                <textarea
                  name="selfDescription"
                  id="selfDescription"
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Briefly describe your core skills, experiences, and background..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Generate Report Button */}
          <div className="submit-container">
            <button type="submit" className="button primary-button generate-button">
              Generate Interview Report
            </button>
          </div>
        </form>

        {/* Recent Reports Section */}
        <section className="recent-reports-section">
          <div className="section-header">
            <h2>Recent <i>Reports</i></h2>
            <p>Your previously generated interview readiness reports and matching profiles.</p>
          </div>

          {fetchingReports ? (
            <div className="reports-skeleton-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="report-card skeleton">
                  <div className="card-content">
                    <div className="skeleton-line title"></div>
                    <div className="skeleton-line date"></div>
                  </div>
                  <div className="card-badge-area">
                    <div className="skeleton-line score"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : reports && reports.length > 0 ? (
            <div className="reports-grid">
              {reports.map((reportItem) => (
                <div
                  key={reportItem._id}
                  className="report-card"
                  onClick={() => navigate(`/interview/${reportItem._id}`)}
                >
                  <div className="card-content">
                    <h3 className="report-title">{reportItem.title}</h3>
                    <span className="report-date">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {formatDate(reportItem.createdAt)}
                    </span>
                  </div>
                  <div className="card-badge-area">
                    <div className={`score-badge ${getScoreClass(reportItem.matchScore)}`}>
                      <span className="score-val">{reportItem.matchScore || 0}%</span>
                      <span className="score-lbl">Match</span>
                    </div>
                    <span className="arrow-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-reports-card">
              <div className="empty-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h4>No Reports Found</h4>
              <p>You haven't generated any interview reports yet. Paste a job description and upload your resume above to get started.</p>
            </div>
          )}
        </section>
      </div>

      {/* Premium Loader Overlay */}
      {generating && (
        <div className="generating-overlay">
          <div className="loader-card">
            <div className="spinner-glow-container">
              <div className="glowing-spinner"></div>
            </div>
            <h3>Diagnosing <i>Profile</i></h3>
            <div className="loading-steps">
              <div className="step-item active">Parsing resume profile...</div>
              <div className="step-item">Analyzing target job description...</div>
              <div className="step-item">Identifying potential skill gaps...</div>
              <div className="step-item">Formulating preparation roadmap...</div>
            </div>
            <div className="loader-progress">
              <div className="loader-progress-bar"></div>
            </div>
            <p className="loader-hint">Please wait. Jobnosis AI is scanning and aligning your qualifications to the role.</p>
          </div>
        </div>
      )}
    </main>
  )
}

export default Home