"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Search, Download, Trash2, Mail, Calendar, User, MessageSquare, BarChart3, LogOut } from "lucide-react"
import { supabase } from "@/utils/supabase"
import type { ContactSubmission } from "@/types/database"
import { checkAdminAuth, logoutAdmin } from "./auth"

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, thisWeek: 0, today: 0 })
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAdminAuth()
        if (!authStatus) {
          window.location.href = "/admin/login"
          return
        }
        setIsAuthenticated(true)
        await loadData()
      } catch (error) {
        console.error("Auth check failed:", error)
        window.location.href = "/admin/login"
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const loadData = async () => {
    try {
      const { data: submissionsData, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const statsData = {
        total: submissionsData?.length || 0,
        thisMonth: submissionsData?.filter(s => 
          new Date(s.created_at) >= new Date(new Date().setDate(1))
        ).length || 0,
        thisWeek: submissionsData?.filter(s => 
          new Date(s.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0,
        today: submissionsData?.filter(s => 
          new Date(s.created_at).toDateString() === new Date().toDateString()
        ).length || 0,
      }

      setSubmissions(submissionsData || [])
      setFilteredSubmissions(submissionsData || [])
      setStats(statsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id)

      if (!error) {
        await loadData()
      }
    }
  }

  const handleExport = async () => {
    try {
      const { data } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (!data) return

      const csvData = [
        ['ID', 'Name', 'Email', 'Message', 'Created At'].join(','),
        ...data.map(item => [
          item.id,
          item.name,
          item.email,
          `"${item.message.replace(/"/g, '""')}"`,
          item.created_at
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvData], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `contact-submissions-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const filtered = submissions.filter(submission => {
        return (
          (submission?.name ?? '').toLowerCase().includes(query) ||
          (submission?.email ?? '').toLowerCase().includes(query) ||
          (submission?.message ?? '').toLowerCase().includes(query)
        )
      })
      setFilteredSubmissions(filtered)
    } else {
      setFilteredSubmissions(submissions)
    }
  }, [searchQuery, submissions])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          className="text-white text-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading admin panel...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Contact Submissions Admin</h1>
              <p className="text-gray-400">Manage and view all contact form submissions</p>
            </div>
            <Button
              onClick={() => logoutAdmin()}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: "Total", value: stats.total, icon: BarChart3, color: "from-blue-500 to-cyan-500" },
            { label: "This Month", value: stats.thisMonth, icon: Calendar, color: "from-green-500 to-emerald-500" },
            { label: "This Week", value: stats.thisWeek, icon: Calendar, color: "from-purple-500 to-pink-500" },
            { label: "Today", value: stats.today, icon: Calendar, color: "from-orange-500 to-red-500" },
          ].map((stat, index) => (
            <Card key={stat.label} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white"
            />
          </div>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </motion.div>

        {/* Submissions List */}
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {filteredSubmissions.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No submissions found</p>
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-white flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {submission.name || 'Anonymous'}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {submission.email || 'No email'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {submission.created_at ? 
                              new Date(submission.created_at).toLocaleDateString() : 
                              'No date'
                            }
                          </span>
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(submission.id)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-gray-300 whitespace-pre-wrap">
                          {submission.message || 'No message provided'}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {submission.id} • {
                          submission.created_at ? 
                          new Date(submission.created_at).toLocaleString() : 
                          'No date'
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
