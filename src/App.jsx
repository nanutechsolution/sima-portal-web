import React, { useState, useEffect, useRef } from 'react';
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
  User, LayoutDashboard, ArrowLeft, 
  ClipboardList, HelpCircle, Check,
  Info, Sparkles, Fingerprint, Heart,
  Zap, MessageCircle
} from 'lucide-react';

/**
 * PORTAL SURVEI UNMARIS V4.0 - MOBILE OPTIMIZED & FRIENDLY
 * Filosofi: Minimalis, Akrab, dan Efisien.
 */

// --- KOMPONEN: LOGIN (Sapaan Hangat) ---
const LoginPage = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const nim = e.target.nim.value.trim();
    const password = e.target.password.value.trim();

    if (!nim || !password) {
      setError('NIM dan Password jangan kosong ya!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login-siakad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ nim_nidn: nim, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('survey_token', data.token);
        localStorage.setItem('survey_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Ups! Akun atau password sepertinya salah.');
      }
    } catch (err) {
      setError('Koneksi lagi sibuk, coba sebentar lagi ya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <div className="inline-flex p-4 bg-blue-50 rounded-[2rem] text-[#1B2A66] mb-6 shadow-sm">
           <Fingerprint size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Halo, Selamat Datang!</h2>
        <p className="mt-2 text-sm font-medium text-slate-400">Masuk dengan akun SIAKAD UNMARIS Anda.</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input name="nim" required placeholder="Masukkan NIM / NIDN" className="block w-full px-6 py-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1B2A66] transition-all text-sm font-bold placeholder:text-slate-300" />
            </div>
            <div>
              <input name="password" type="password" required placeholder="Masukkan Password" className="block w-full px-6 py-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1B2A66] transition-all text-sm font-bold placeholder:text-slate-300" />
            </div>
          </div>

          <button disabled={loading} className="flex w-full justify-center rounded-2xl bg-[#1B2A66] px-6 py-5 text-sm font-black leading-6 text-white shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-95 disabled:opacity-50">
            {loading ? 'Memeriksa Data...' : 'Masuk Sekarang'}
          </button>
        </form>

        <p className="mt-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
           Proteksi Keamanan Stella Maris
        </p>
      </div>
    </div>
  );
};

// --- KOMPONEN: DASHBOARD (Ringkas & Informatif) ---
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
        console.error("Fetch error");
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Mobile Friendly */}
      <header className="bg-white border-b border-slate-100 px-6 py-6 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-white/90">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1B2A66] rounded-lg flex items-center justify-center text-[#FACC15] font-black italic">S</div>
            <span className="font-black text-slate-800 tracking-tighter uppercase text-sm">Portal Survei</span>
         </div>
         <button onClick={onLogout} className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:text-red-500 transition-colors">
            <LogOut size={18} />
         </button>
      </header>

      <main className="px-6 py-8 space-y-8 max-w-lg mx-auto">
        {/* Identitas Ringkas */}
        <section className="flex items-center gap-4">
           <div className="w-16 h-16 bg-gradient-to-br from-[#1B2A66] to-blue-700 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl shadow-lg">
              {user.name[0]}
           </div>
           <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-800 leading-tight">Halo, {user.name.split(' ')[0]}!</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{user.role} • {user.identifier}</p>
           </div>
        </section>

        {/* Info Box */}
        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center gap-4">
           <div className="p-3 bg-white rounded-2xl text-[#1B2A66] shadow-sm"><Zap size={20} fill="currentColor" /></div>
           <p className="text-[11px] font-bold text-blue-900 leading-relaxed">Ada <b>{surveys.filter(s => !s.has_submitted).length} survei baru</b> yang menanti masukan Anda hari ini.</p>
        </div>

        {/* List Survei */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Daftar Survei</h3>
          
          {loading ? (
            <div className="space-y-4">
               {[1,2].map(i => <div key={i} className="h-32 bg-white rounded-[2rem] animate-pulse shadow-sm"></div>)}
            </div>
          ) : surveys.length > 0 ? (
            surveys.map(survey => (
              <div 
                key={survey.id} 
                onClick={() => !survey.has_submitted && navigate(`/survey/${survey.id}`)}
                className={`bg-white rounded-[2.5rem] p-6 shadow-sm border-2 transition-all active:scale-[0.98] cursor-pointer ${survey.has_submitted ? 'opacity-60 border-transparent bg-slate-50/50' : 'border-white shadow-slate-200/50'}`}
              >
                <div className="flex justify-between items-start">
                   <div className="flex flex-col gap-1">
                      <h4 className="font-black text-slate-800 text-md leading-tight">{survey.title}</h4>
                      <p className="text-[11px] text-slate-400 font-medium line-clamp-1">{survey.description || 'Mari berikan penilaian jujur Anda.'}</p>
                   </div>
                   {survey.has_submitted ? (
                      <div className="bg-green-50 text-green-500 p-2 rounded-full shadow-inner"><Check size={14} strokeWidth={3} /></div>
                   ) : (
                      <div className="bg-blue-50 text-[#1B2A66] p-2 rounded-full"><ChevronRight size={14} strokeWidth={3} /></div>
                   )}
                </div>
                {!survey.has_submitted && (
                   <div className="mt-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#FACC15] rounded-full animate-ping"></span>
                      <span className="text-[9px] font-black text-[#1B2A66] uppercase tracking-widest">Siap Diisi</span>
                   </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
               <MessageCircle size={40} className="mx-auto text-slate-200 mb-4" />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Belum ada survei aktif.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- KOMPONEN: FORM SURVEI (Fokus & Nyaman) ---
const SurveyPage = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [missingFields, setMissingFields] = useState([]);

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
        }
      } catch (err) {
        setError('Koneksi terputus.');
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id, token, navigate]);

  const calculateProgress = () => {
    if (!surveyData?.schema) return 0;
    const answeredCount = Object.keys(answers).filter(key => answers[key] !== "" && answers[key] !== null).length;
    return Math.round((answeredCount / surveyData.schema.length) * 100);
  };

  const handleSubmit = async () => {
    const missing = [];
    surveyData.schema.forEach((field, index) => {
      if (field.data.is_required && !answers[`answer_${index}`]) missing.push(index);
    });
    
    if (missing.length > 0) {
        setMissingFields(missing);
        setError('Ada pertanyaan wajib yang terlewat nih!');
        const el = document.getElementById(`q-${missing[0]}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    setSubmitting(true);
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
      if (response.ok) navigate('/success');
    } catch (err) {
      setError('Gagal kirim, coba lagi ya.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex flex-col items-center justify-center animate-pulse"><div className="w-12 h-12 border-4 border-slate-100 border-t-[#1B2A66] rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 flex flex-col items-center">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-100 z-[60]">
        <div className="h-full bg-blue-600 transition-all duration-500 shadow-lg" style={{ width: `${calculateProgress()}%` }}></div>
      </div>

      <header className="w-full bg-white border-b border-slate-100 px-6 py-5 sticky top-1 z-50 flex justify-between items-center shadow-sm">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><ArrowLeft size={20} /></button>
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest">{calculateProgress()}% Selesai</span>
        <div className="w-8"></div>
      </header>

      <main className="px-5 py-8 space-y-6 w-full max-w-lg">
        <div className="px-2">
            <h1 className="text-2xl font-black text-slate-800 leading-tight">{surveyData?.title}</h1>
            <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">{surveyData?.description || 'Mohon berikan masukan terbaik Anda untuk kemajuan kampus kita.'}</p>
        </div>

        {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 sticky top-20 z-40 shadow-xl">
               <AlertCircle size={16} /> {error}
            </div>
        )}

        {surveyData?.schema.map((field, idx) => {
          const isMissing = missingFields.includes(idx);
          const isAnswered = !!answers[`answer_${idx}`];
          return (
            <div id={`q-${idx}`} key={idx} className={`bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-500 ${isMissing ? 'border-rose-400' : isAnswered ? 'border-green-100 bg-green-50/20' : 'border-white shadow-xl shadow-slate-200/40'}`}>
                <div className="flex gap-4 items-start mb-6">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 ${isAnswered ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-[#1B2A66] text-[#FACC15]'}`}>
                        {idx + 1}
                    </span>
                    <h3 className="font-bold text-slate-800 text-lg leading-snug">{field.data.question}</h3>
                </div>

                {field.type === 'rating' && (
                   <div className="flex justify-between gap-2 max-w-sm">
                      {[1,2,3,4,5].map(v => (
                         <button key={v} onClick={() => setAnswers({...answers, [`answer_${idx}`]: v})} className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${answers[`answer_${idx}`] === v ? 'bg-[#1B2A66] text-[#FACC15] shadow-xl scale-110' : 'bg-slate-50 text-slate-300'}`}>
                            <Star size={20} fill={answers[`answer_${idx}`] === v ? "currentColor" : "none"} />
                            <span className="text-[9px] font-black mt-1">{v}</span>
                         </button>
                      ))}
                   </div>
                )}

                {(field.type === 'textarea' || field.type === 'text') && (
                   <textarea value={answers[`answer_${idx}`] || ""} onChange={(e) => setAnswers({...answers, [`answer_${idx}`]: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-blue-50 border-transparent outline-none text-sm font-bold placeholder:text-slate-200 min-h-[120px]" placeholder="Ketik jawabanmu di sini..." />
                )}

                {field.type === 'select' && (
                   <select value={answers[`answer_${idx}`] || ""} onChange={(e) => setAnswers({...answers, [`answer_${idx}`]: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] focus:bg-white border-transparent outline-none text-sm font-bold appearance-none cursor-pointer">
                      <option value="">-- Tap untuk pilih --</option>
                      {field.data.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                )}

                {isMissing && <p className="mt-4 text-[9px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Pertanyaan ini penting, tolong diisi ya!</p>}
            </div>
          );
        })}

        <div className="py-10 text-center">
           <button onClick={handleSubmit} disabled={submitting} className="w-full bg-[#1B2A66] text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/30 transition-all active:scale-95 disabled:opacity-50">
              {submitting ? 'Sedang Menyimpan...' : 'Kirim Sekarang'}
           </button>
           <p className="mt-6 text-[10px] font-bold text-slate-300">Data Anda dilindungi oleh Sistem Kampus.</p>
        </div>
      </main>
    </div>
  );
};

// --- KOMPONEN: SUCCESS (Pesta Kecil) ---
const SuccessPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 text-center flex-col">
       <div className="relative mb-10">
          <div className="w-32 h-32 bg-green-50 rounded-[3rem] rotate-12 absolute inset-0 -z-10 animate-pulse"></div>
          <div className="w-32 h-32 bg-white rounded-[3rem] border-4 border-green-500 flex items-center justify-center shadow-2xl shadow-green-100">
             <CheckCircle2 size={64} className="text-green-500" strokeWidth={2.5} />
          </div>
          <Sparkles className="absolute -top-4 -right-4 text-yellow-400 animate-bounce" size={32} />
       </div>
       <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4">Mantap, Selesai!</h2>
       <p className="text-slate-400 text-sm font-medium leading-relaxed mb-12">Terima kasih, <b>{user?.name.split(' ')[0]}</b>. Masukan Anda sangat berarti bagi perbaikan kualitas layanan UNMARIS.</p>
       
       <div className="w-full max-w-xs space-y-4">
          <button onClick={() => navigate('/dashboard')} className="w-full py-5 rounded-2xl bg-[#1B2A66] text-white font-black text-xs uppercase tracking-widest shadow-xl">Balik ke Beranda</button>
          <button onClick={onLogout} className="w-full py-5 text-slate-300 font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors">Keluar Sesi</button>
       </div>
    </div>
  );
};

// --- MAIN ENTRY ---
const App = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('survey_user')));
  const [token, setToken] = useState(() => localStorage.getItem('survey_token'));

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