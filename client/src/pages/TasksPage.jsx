import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { setAuthToken } from '../lib/api.js'

export default function TasksPage() {
  const { token } = useAuth()
  const [tasks, setTasks] = useState([])
  const [q, setQ] = useState('')
  const [priority, setPriority] = useState('')
  const [completed, setCompleted] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { setAuthToken(token) }, [token])

  const fetchTasks = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (q) params.q = q
      if (priority) params.priority = priority
      if (completed) params.completed = completed
      const { data } = await api.get('/tasks', { params })
      setTasks(data.tasks)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchTasks() }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      title: form.get('title'),
      description: form.get('description'),
      priority: form.get('priority'),
      tags: form.get('tags')?.split(',').map(t=>t.trim()).filter(Boolean) || [],
    }
    try {
      const { data } = await api.post('/tasks', payload)
      setTasks((prev)=>[data.task, ...prev])
      e.currentTarget.reset()
    } catch (err) {
      alert(err.response?.data?.message || 'Create failed')
    }
  }

  const toggle = async (task) => {
    const { data } = await api.put(`/tasks/${task._id}`, { completed: !task.completed })
    setTasks((prev)=>prev.map(t=>t._id===task._id?data.task:t))
  }

  const remove = async (task) => {
    if (!confirm('Delete task?')) return
    await api.delete(`/tasks/${task._id}`)
    setTasks((prev)=>prev.filter(t=>t._id!==task._id))
  }

  const filtered = useMemo(()=>tasks, [tasks])

  return (
    <div className="space-y-6">
      <section className="bg-white p-4 rounded shadow">
        <form onSubmit={onCreate} className="grid md:grid-cols-5 gap-3">
          <input name="title" placeholder="Task title" className="border rounded px-3 py-2 md:col-span-2" required />
          <input name="description" placeholder="Description" className="border rounded px-3 py-2 md:col-span-2" />
          <select name="priority" className="border rounded px-3 py-2">
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
          <input name="tags" placeholder="tags (comma-separated)" className="border rounded px-3 py-2 md:col-span-3" />
          <button className="bg-gray-900 text-white rounded px-3 py-2">Add Task</button>
        </form>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <div className="grid md:grid-cols-4 gap-3">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search" className="border rounded px-3 py-2" />
          <select value={priority} onChange={(e)=>setPriority(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={completed} onChange={(e)=>setCompleted(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All statuses</option>
            <option value="true">Completed</option>
            <option value="false">Pending</option>
          </select>
          <button onClick={fetchTasks} className="bg-gray-100 border rounded px-3 py-2">Apply</button>
        </div>
      </section>

      {loading ? <p>Loading...</p> : error ? <p className="text-red-600">{error}</p> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(task => (
            <article key={task._id} className="border bg-white rounded p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{task.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${task.priority==='high'?'bg-red-100 text-red-700':task.priority==='low'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{task.priority}</span>
              </div>
              {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
              <div className="mt-2 flex flex-wrap gap-1">
                {task.tags?.map(t=> <span key={t} className="text-xs bg-gray-100 px-2 py-0.5 rounded">#{t}</span>)}
              </div>
              <div className="mt-3 text-xs text-gray-500">Created {new Date(task.createdAt).toLocaleString()}</div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={()=>toggle(task)} className={`px-2 py-1 rounded text-xs ${task.completed? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}>{task.completed? 'Completed' : 'Mark Done'}</button>
                <button onClick={()=>remove(task)} className="px-2 py-1 rounded text-xs bg-red-600 text-white">Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}


