import { useState, useEffect } from 'react'

function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadAuditLogs()
  }, [])

  useEffect(() => {
    filterLogs()
  }, [logs, filter, searchTerm])

  const loadAuditLogs = () => {
    const auditLogs = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('audit_')) {
        try {
          const log = JSON.parse(localStorage.getItem(key))
          auditLogs.push({
            id: key,
            ...log,
            timestamp: new Date(log.timestamp)
          })
        } catch (e) {
          console.error('Error parsing audit log:', key)
        }
      }
    }

    // Sort by timestamp (newest first)
    auditLogs.sort((a, b) => b.timestamp - a.timestamp)
    setLogs(auditLogs)
  }

  const filterLogs = () => {
    let filtered = logs

    // Filter by action type
    if (filter !== 'all') {
      filtered = filtered.filter(log => log.action === filter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.fileId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.linkId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.expirationType?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLogs(filtered)
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'link_generated': return '🔗'
      case 'access_granted': return '✅'
      case 'file_downloaded': return '📥'
      case 'link_deactivated': return '🚫'
      case 'link_expired': return '⏰'
      default: return '📋'
    }
  }

  const getActionDescription = (log) => {
    switch (log.action) {
      case 'link_generated':
        return `Generated secure link for file ${log.fileId}`
      case 'access_granted':
        return `Access granted to secure link ${log.linkId}`
      case 'file_downloaded':
        return `File "${log.fileName}" downloaded from link ${log.linkId}`
      case 'link_deactivated':
        return `Link ${log.linkId} deactivated (${log.reason || 'unknown reason'})`
      case 'link_expired':
        return `Link ${log.linkId} expired`
      default:
        return log.action
    }
  }

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleString()
  }

  const getUniqueFiles = () => {
    const files = new Set()
    logs.forEach(log => {
      if (log.fileId) files.add(log.fileId)
    })
    return Array.from(files)
  }

  const getUniqueLinks = () => {
    const links = new Set()
    logs.forEach(log => {
      if (log.linkId) links.add(log.linkId)
    })
    return Array.from(links)
  }

  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('audit_')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
      loadAuditLogs()
    }
  }

  const exportLogs = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalLogs: logs.length,
      logs: logs
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `secure-file-vault-logs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="audit-logs">
      <h2>📊 Audit Logs</h2>
      <p className="logs-description">
        Track all file sharing activities, link generation, and access attempts.
      </p>

      <div className="logs-controls">
        <div className="filter-controls">
          <div className="filter-group">
            <label>Filter by action:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Actions</option>
              <option value="link_generated">Link Generated</option>
              <option value="access_granted">Access Granted</option>
              <option value="file_downloaded">File Downloaded</option>
              <option value="link_deactivated">Link Deactivated</option>
              <option value="link_expired">Link Expired</option>
            </select>
          </div>

          <div className="search-group">
            <label>Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by file ID, link ID, or filename..."
            />
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={exportLogs} className="export-button">
            📤 Export Logs
          </button>
          <button onClick={clearLogs} className="clear-button">
            🗑️ Clear Logs
          </button>
        </div>
      </div>

      <div className="logs-stats">
        <div className="stat-card">
          <h3>Total Logs</h3>
          <p className="stat-number">{logs.length}</p>
        </div>
        <div className="stat-card">
          <h3>Files Shared</h3>
          <p className="stat-number">{getUniqueFiles().length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Links</h3>
          <p className="stat-number">{getUniqueLinks().length}</p>
        </div>
        <div className="stat-card">
          <h3>Downloads</h3>
          <p className="stat-number">
            {logs.filter(log => log.action === 'file_downloaded').length}
          </p>
        </div>
      </div>

      <div className="logs-list">
        {filteredLogs.length === 0 ? (
          <div className="no-logs">
            <p>No audit logs found matching your criteria.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="log-entry">
              <div className="log-header">
                <div className="log-icon">
                  {getActionIcon(log.action)}
                </div>
                <div className="log-info">
                  <h4>{getActionDescription(log)}</h4>
                  <p className="log-timestamp">
                    {formatTimestamp(log.timestamp)}
                  </p>
                </div>
              </div>

              <div className="log-details">
                {log.fileId && (
                  <div className="log-detail">
                    <strong>File ID:</strong> {log.fileId}
                  </div>
                )}
                {log.linkId && (
                  <div className="log-detail">
                    <strong>Link ID:</strong> {log.linkId}
                  </div>
                )}
                {log.fileName && (
                  <div className="log-detail">
                    <strong>Filename:</strong> {log.fileName}
                  </div>
                )}
                {log.details && (
                  <div className="log-detail">
                    <strong>Details:</strong>
                    <ul>
                      {log.details.expirationType && (
                        <li>Expiration: {log.details.expirationType}</li>
                      )}
                      {log.details.expirationTime && (
                        <li>Duration: {log.details.expirationTime}</li>
                      )}
                      {log.details.downloadLimit && (
                        <li>Download limit: {log.details.downloadLimit}</li>
                      )}
                      {log.details.requirePassword && (
                        <li>Password protected: Yes</li>
                      )}
                      {log.details.requireOTP && (
                        <li>OTP required: Yes</li>
                      )}
                    </ul>
                  </div>
                )}
                {log.ip && (
                  <div className="log-detail">
                    <strong>IP:</strong> {log.ip}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="logs-info">
        <h4>🔒 Privacy & Security</h4>
        <ul>
          <li>All logs are stored locally in your browser</li>
          <li>No personal data is transmitted to external servers</li>
          <li>Logs help track file sharing activities</li>
          <li>Export functionality available for backup</li>
        </ul>
      </div>
    </div>
  )
}

export default AuditLogs
