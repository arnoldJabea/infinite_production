import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    try {
      await api.post('/register', {
        name,
        email,
        password,
        role: 'artist', // ✅ ici tu ajoutes le champ requis
      });

      navigate('/login');
    } catch (err: any) {
      setError("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Inscription</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <input
          type="text"
          placeholder="Nom"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirmation"
          className="w-full mb-3 p-2 border rounded"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          S'inscrire
        </button>
      </form>
    </div>
  );
}