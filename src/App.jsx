import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate,
  useParams
} from 'react-router-dom';
import { 
  ShieldCheck, Lock, Send, CheckCircle2, 
  AlertCircle, LogOut, ChevronRight, Star,
  User, Building2, ClipboardCheck, Info, Clock
} from 'lucide-react';

/**
 * PORTAL SURVEI UNMARIS - DASHBOARD OTOMATIS
 * Fitur: Mengambil daftar survei secara dinamis dari API.
 */

// --- KOMPONEN HALAMAN LOGIN (Tetap Sama) ---
const LoginPage = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login-siakad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          nim_nidn: e.target.nim.value,
          password: e.target.password.value
        })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('survey_token', data.token);
        localStorage.setItem('survey_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login Gagal.');
      }
    } catch (err) {
      setError('Sistem tidak merespon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-800">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-[#1B2A66] p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <Lock className="text-[#FACC15] mx-auto mb-4 relative z-10" size={40} />
          <h1 className="text-xl font-bold text-white uppercase tracking-tight relative z-10">Portal Survei Terpadu</h1>
          <p className="text-blue-200 text-[10px] mt-1 font-bold tracking-widest uppercase relative z-10">Universitas Stella Maris</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3"><AlertCircle size={18}/> {error}</div>}
          <div className="space-y-4">
            <input name="nim" required placeholder="NIM / NIDN" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B2A66] transition-all text-sm font-medium" />
            <input name="password" required type="password" placeholder="Password SIAKAD" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B2A66] transition-all text-sm font-medium" />
          </div>
          <button disabled={loading} className="w-full bg-[#1B2A66] text-white py-4 rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 active:scale-95 disabled:opacity-50">
            {loading ? 'Memvalidasi Sesi...' : 'Masuk Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- KOMPONEN HALAMAN DASHBOARD (DENGAN LIST OTOMATIS) ---
const DashboardPage = ({ user, token, onLogout }) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/surveys`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const data = await response.json();
        if (response.ok) setSurveys(data.surveys);
      } catch (err) {
        console.error("Gagal mengambil daftar survei.");
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="max-w-xl w-full space-y-6">
        {/* User Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#1B2A66] rounded-2xl flex items-center justify-center text-[#FACC15] font-bold text-xl shadow-lg">{user.name[0]}</div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight">{user.name}</h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{user.role} • {user.identifier}</p>
            </div>
          </div>
          <button onClick={onLogout} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><LogOut size={20}/></button>
        </div>

        {/* Survey List */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Survei yang Tersedia</h3>
          
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-xs font-bold animate-pulse">Memperbarui Daftar...</div>
          ) : surveys.length > 0 ? (
            surveys.map(survey => (
              <div key={survey.id} className={`bg-white rounded-[2rem] p-6 shadow-md border-2 transition-all ${survey.has_submitted ? 'border-transparent opacity-60' : 'border-transparent hover:border-[#1B2A66] group'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-50 text-[#1B2A66] rounded-xl"><ClipboardCheck size={20}/></div>
                  {survey.has_submitted ? (
                    <span className="bg-green-100 text-green-700 text-[9px] font-black px-3 py-1 rounded-full uppercase">Selesai Diisi</span>
                  ) : (
                    <span className="bg-[#FACC15] text-[#1B2A66] text-[9px] font-black px-3 py-1 rounded-full uppercase">Belum Diisi</span>
                  )}
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{survey.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{survey.description}</p>
                
                {!survey.has_submitted && (
                  <button onClick={() => navigate(`/survey/${survey.id}`)} className="w-full mt-6 bg-slate-50 text-[#1B2A66] py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-[#1B2A66] group-hover:text-white transition-all">
                    Buka Formulir <ChevronRight size={14}/>
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-slate-200">
              <Info className="mx-auto text-slate-300 mb-3" size={32}/>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">Tidak ada survei aktif saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN HALAMAN FORM SURVEI (Tetap Sama) ---
const SurveyPage = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/surveys/${id}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const data = await response.json();
        if (response.ok) {
          if (data.has_submitted) navigate('/success');
          else setSurveyData(data.survey);
        } else {
          setError(data.message || 'Gagal mengambil data survei.');
        }
      } catch (err) {
        setError('Koneksi terputus.');
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id, token, navigate]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/surveys/${id}/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ answers })
      });
      const data = await response.json();
      if (response.ok) navigate('/success');
      else setError(data.message || 'Gagal mengirim jawaban.');
    } catch (err) {
      setError('Kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !surveyData) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 text-xs uppercase tracking-widest animate-pulse">Menyiapkan Lembar Survei...</div>;

  return (
    <div className="min-h-screen bg-slate-50 md:p-10 flex justify-center">
      <div className="max-w-2xl w-full bg-white md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        <div className="bg-[#1B2A66] p-8 text-white relative">
          <button onClick={() => navigate('/dashboard')} className="mb-4 text-blue-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">← Kembali ke Dashboard</button>
          <h1 className="text-xl font-bold uppercase tracking-tight">{surveyData?.title}</h1>
          <p className="text-blue-200 text-xs mt-1 font-medium">{surveyData?.description}</p>
        </div>
        {error && <div className="mx-8 mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3"><AlertCircle size={18}/> {error}</div>}
        <div className="p-8 flex-1 space-y-10">
           {surveyData?.schema.map((field, idx) => (
             <div key={idx} className="space-y-4">
               <label className="block text-sm font-bold text-slate-700">{idx + 1}. {field.data.question} {field.data.is_required && <span className="text-red-500">*</span>}</label>
               {field.type === 'rating' && (
                 <div className="flex gap-2">
                   {[1,2,3,4,5].map(v => (
                     <button key={v} onClick={() => setAnswers({...answers, [`answer_${idx}`]: v})} className={`flex-1 py-5 rounded-2xl border-2 transition-all font-black text-lg ${answers[`answer_${idx}`] === v ? 'bg-blue-50 border-[#1B2A66] text-[#1B2A66] shadow-lg shadow-blue-100 scale-105' : 'bg-slate-50 border-transparent text-slate-300'}`}>{v}</button>
                   ))}
                 </div>
               )}
               {(field.type === 'textarea' || field.type === 'text') && (
                 <textarea onChange={(e) => setAnswers({...answers, [`answer_${idx}`]: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#1B2A66] focus:bg-white outline-none transition-all text-sm font-medium" rows={field.type === 'textarea' ? 4 : 1} placeholder="Ketik jawaban Anda..." />
               )}
               {field.type === 'select' && (
                 <select onChange={(e) => setAnswers({...answers, [`answer_${idx}`]: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#1B2A66] outline-none text-sm font-medium">
                    <option value="">Pilih...</option>
                    {field.data.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                 </select>
               )}
             </div>
           ))}
        </div>
        <div className="p-8 border-t flex justify-end bg-slate-50/30">
          <button onClick={handleSubmit} disabled={loading || Object.keys(answers).length === 0} className="bg-[#1B2A66] text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:bg-blue-900 transition-all disabled:opacity-30 flex items-center gap-2">
            {loading ? 'Mengirim Data...' : <>Kirim Jawaban <Send size={18}/></>}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN HALAMAN SUKSES (Tetap Sama) ---
const SuccessPage = ({ onLogout, user }) => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center text-slate-800">
            <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl space-y-8 border border-slate-100 animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 size={48} /></div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Kontribusi Berhasil!</h2>
                    <p className="text-slate-500 text-sm mt-3 leading-relaxed">Terima kasih, <b>{user?.name}</b>. Jawaban Anda telah diverifikasi dan disimpan.</p>
                </div>
                <div className="space-y-3">
                    <button onClick={() => navigate('/dashboard')} className="w-full bg-[#1B2A66] text-white py-4 rounded-2xl font-bold shadow-lg">Kembali ke Beranda</button>
                    <button onClick={onLogout} className="w-full py-4 text-xs font-black text-slate-400 hover:text-slate-800 uppercase tracking-widest transition-colors">Keluar Sesi</button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('survey_user')));
  const [token, setToken] = useState(localStorage.getItem('survey_token'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <LoginPage onLoginSuccess={(u, t) => {setUser(u); setToken(t);}} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <DashboardPage user={user} token={token} onLogout={() => {localStorage.clear(); setUser(null); setToken(null);}} /> : <Navigate to="/login" />} />
        <Route path="/survey/:id" element={token ? <SurveyPage token={token} /> : <Navigate to="/login" />} />
        <Route path="/success" element={token ? <SuccessPage user={user} onLogout={() => {localStorage.clear(); setUser(null); setToken(null);}} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;