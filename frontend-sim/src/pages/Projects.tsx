import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    api.get('/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Mes projets</h1>
      <ul>
        {projects.map((p) => (
          <li key={p.id} className="border-b py-2">{p.name}</li>
        ))}
      </ul>
    </div>
  )
}