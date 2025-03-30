import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [sessionLabel, setSessionLabel] = useState('');
  const [visaType, setVisaType] = useState('F-1');
  const [purpose, setPurpose] = useState('Renewal');

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('visa_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
      } else {
        setSessions(data);
      }
    };

    fetchSessions();
  }, []);

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const user = await supabase.auth.getUser();
    const user_id = user.data.user.id;

    const { data, error } = await supabase
      .from('visa_sessions')
      .insert([
        {
          user_id,
          session_label: sessionLabel,
          visa_type: visaType,
          purpose,
        },
      ]);

    if (error) {
      console.error('Error creating session:', error);
    } else {
      setSessions((prev) => [data[0], ...prev]); // Add to top of list
      setSessionLabel('');
      setVisaType('F-1');
      setPurpose('Renewal');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Your Visa Sessions</h2>

      {sessions.length === 0 ? (
        <p>No visa sessions yet.</p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((session) => (
            <li key={session.id} className="border p-4 rounded shadow">
              <strong>{session.session_label}</strong><br />
              Visa Type: {session.visa_type}<br />
              Purpose: {session.purpose}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleCreateSession} className="space-y-4 border-t pt-6">
        <h3 className="text-xl font-semibold">Create New Visa Session</h3>

        <div>
          <label className="block font-medium mb-1">Session Label</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            placeholder="e.g., Summer 2024"
            value={sessionLabel}
            onChange={(e) => setSessionLabel(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Visa Type</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={visaType}
            onChange={(e) => setVisaType(e.target.value)}
          >
            <option value="F-1">F-1</option>
            <option value="J-1">J-1</option>
            <option value="M-1">M-1</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Purpose</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >
            <option value="First-time application">First-time application</option>
            <option value="Renewal">Renewal</option>
            <option value="Lost passport">Lost passport</option>
            <option value="Change of school">Change of school</option>
            <option value="Change of status">Change of status</option>
            <option value="Administrative processing">Administrative processing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Session
        </button>
      </form>
    </div>
  );
}

export default Dashboard;