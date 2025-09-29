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
        } catch (_e) {
          console.error('Error parsing audit log:', key)
        }
      }
    }

    // Sort by timestamp (newest first)
    auditLogs.sort((a, b) => b.timestamp - a.timestamp)
    setLogs(auditLogs)
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-2 text-white text-center">📊 Audit Logs</h2>
      <p className="text-gray-400 mb-6 text-center">
        Track all file sharing activities, link generation, and access attempts.
      </p>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col">
            <label className="text-gray-300 font-semibold mb-1">Filter by action:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="all">All Actions</option>
              <option value="link_generated">Link Generated</option>
              <option value="access_granted">Access Granted</option>
              <option value="file_downloaded">File Downloaded</option>
              <option value="link_deactivated">Link Deactivated</option>
              <option value="link_expired">Link Expired</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-300 font-semibold mb-1">Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by file ID, link ID, or filename..."
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportLogs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            📤 Export Logs
          </button>
          <button
            onClick={clearLogs}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            🗑️ Clear Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 rounded-lg p-4 text-center">
          <h3 className="text-gray-400 text-sm mb-1 uppercase">Total Logs</h3>
          <p className="text-2xl font-bold text-white">{logs.length}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 text-center">
          <h3 className="text-gray-400 text-sm mb-1 uppercase">Files Shared</h3>
          <p className="text-2xl font-bold text-white">{getUniqueFiles().length}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 text-center">
          <h3 className="text-gray-400 text-sm mb-1 uppercase">Active Links</h3>
          <p className="text-2xl font-bold text-white">{getUniqueLinks().length}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 text-center">
          <h3 className="text-gray-400 text-sm mb-1 uppercase">Downloads</h3>
          <p className="text-2xl font-bold text-white">
            {logs.filter(log => log.action === 'file_downloaded').length}
          </p>
        </div>
      </div>

      <div>
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 italic py-12">
            <p>No audit logs found matching your criteria.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4 shadow">
              <div className="flex items-start gap-4 mb-2">
                <div className="text-2xl">{getActionIcon(log.action)}</div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{getActionDescription(log)}</h4>
                  <p className="text-gray-400 text-sm">{formatTimestamp(log.timestamp)}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {log.fileId && (
                  <div className="bg-gray-900 rounded px-3 py-2 text-sm text-gray-300">
                    <span className="font-semibold text-white">File ID:</span> {log.fileId}
                  </div>
                )}
                {log.linkId && (
                  <div className="bg-gray-900 rounded px-3 py-2 text-sm text-gray-300">
                    <span className="font-semibold text-white">Link ID:</span> {log.linkId}
                  </div>
                )}
                {log.fileName && (
                  <div className="bg-gray-900 rounded px-3 py-2 text-sm text-gray-300">
                    <span className="font-semibold text-white">Filename:</span> {log.fileName}
                  </div>
                )}
                {log.details && (
                  <div className="bg-gray-900 rounded px-3 py-2 text-sm text-gray-300">
                    <span className="font-semibold text-white">Details:</span>
                    <ul className="list-disc list-inside">
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
                  <div className="bg-gray-900 rounded px-3 py-2 text-sm text-gray-300">
                    <span className="font-semibold text-white">IP:</span> {log.ip}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mt-8">
        <h4 className="text-lg font-bold text-white mb-2">🔒 Privacy & Security</h4>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
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
