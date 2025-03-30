import { useEffect, useState } from 'react';
import './App.css';
import { supabase } from '../supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])
  
  const signOut = async () => {
    const {error} = await supabase.auth.signOut();
  };

  const signUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  if (!session) {
    return (
      <>
      {/* <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} /> */}
      <button onClick={signUp}>Sign in with Google</button>
      </>
    )
  }
  else {
    return (
    <div>
      <h2>Welcome, {session?.user?.email} </h2>
      <button onClick={signOut}>Sign out</button>
      <Dashboard />  {/* 👈 Show the dashboard here */}
    </div>
      )
  }
}

export default App
