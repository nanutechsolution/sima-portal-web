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
  User, LayoutDashboard, ArrowLeft, 
  ClipboardList, HelpCircle, Check,
  Info, Sparkles, Fingerprint, Heart,
  Zap, MessageCircle, Building, History,
  Award
} from 'lucide-react';

/**
 * PORTAL SURVEI UNMARIS V5.0 - CIVITAS ACADEMICA EDITION
 * UX Refactored: Tabbed Dashboard & Progress Tracker
 */

// --- KOMPONEN: LOGIN ---
const LoginPage = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const nim = e.target.nim.value.trim();
    const password = e.target.password.value.trim();

    if (!nim || !password) {
      setError('ID dan Password jangan kosong ya!');
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
           <Building size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Selamat Datang!</h2>
        <p className="mt-2 text-sm font-medium text-slate-400 px-4">Portal Survei Terpadu untuk <b>Seluruh Civitas</b> UNMARIS.</p>
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
              <input name="nim" required placeholder="NIM / NIDN / ID Staf" className="block w-full px-6 py-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-[#1B2A66] transition-all text-sm font-bold placeholder:text-slate-300" />
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

// --- KOMPONEN: DASHBOARD (UX Diperbarui) ---
const DashboardPage = ({ user, token, onLogout }) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' atau 'completed'
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

  // Klasifikasi data
  const pendingSurveys = surveys.filter(s => !s.has_submitted);
  const completedSurveys = surveys.filter(s => s.has_submitted);
  const totalSurveys = surveys.length;
  const completionRate = totalSurveys === 0 ? 0 : Math.round((completedSurveys.length / totalSurveys) * 100);

  const getGreeting = () => {
    const role = user.role.toLowerCase();
    if (role.includes('dosen')) return 'Bapak/Ibu';
    return 'Halo';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Sticky */}
      <header className="bg-white/90 border-b border-slate-100 px-6 py-5 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
         <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#1B2A66] to-blue-700 rounded-xl flex items-center justify-center text-[#FACC15] font-black italic shadow-lg">S</div>
            <div className="flex flex-col">
              <span className="font-black text-slate-800 tracking-tight text-sm leading-none">Portal Civitas</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">UNMARIS</span>
            </div>
         </div>
         <button onClick={onLogout} className="p-2.5 bg-slate-50 text-slate-400 rounded-full hover:text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
         </button>
      </header>

      <main className="px-6 py-8 space-y-8 max-w-lg mx-auto pb-24">
        {/* Identitas & Progress Ringkas */}
        <section className="flex items-center justify-between">
           <div className="flex items-center gap-4">
               <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-[1.2rem] flex items-center justify-center text-[#1B2A66] font-black text-xl shadow-inner border border-white">
                    {user.name[0]}
                  </div>
                  {completionRate === 100 && totalSurveys > 0 && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-[#F8FAFC]">
                      <Award size={12} strokeWidth={3} />
                    </div>
                  )}
               </div>
               <div className="flex flex-col">
                  <h2 className="text-lg font-black text-slate-800 leading-tight">{getGreeting()} {user.name.split(' ')[0]}</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{user.role}</p>
               </div>
           </div>
           
           <div className="text-right flex flex-col items-end">
              <span className="text-2xl font-black text-[#1B2A66]">{completionRate}%</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Selesai</span>
           </div>
        </section>

        {/* Tab Navigasi ala iOS */}
        <div className="flex p-1 bg-slate-200/50 rounded-[1.5rem]">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-white text-[#1B2A66] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Zap size={14} className={activeTab === 'pending' ? 'fill-current' : ''} />
            Tugas Baru
            {pendingSurveys.length > 0 && (
              <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-md ml-1 leading-none">{pendingSurveys.length}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'bg-white text-[#1B2A66] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <History size={14} />
            Riwayat
          </button>
        </div>

        {/* Render Konten Berdasarkan Tab */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {loading ? (
            // Skeleton Loading
            <div className="space-y-4">
               {[1,2].map(i => <div key={i} className="h-28 bg-white/50 rounded-[2rem] animate-pulse shadow-sm"></div>)}
            </div>
          ) : activeTab === 'pending' ? (
            /* --- TAB TUGAS BARU --- */
            pendingSurveys.length > 0 ? (
              pendingSurveys.map(survey => (
                <div 
                  key={survey.id} 
                  onClick={() => navigate(`/survey/${survey.id}`)}
                  className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all active:scale-[0.98] cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FACC15]"></div>
                  <div className="flex justify-between items-start ml-2">
                     <div className="flex flex-col gap-1.5">
                        <h4 className="font-black text-slate-800 text-base leading-tight group-hover:text-blue-600 transition-colors">{survey.title}</h4>
                        <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">{survey.description || 'Kontribusi Anda sangat berharga bagi peningkatan mutu layanan.'}</p>
                     </div>
                     <div className="bg-blue-50 text-[#1B2A66] p-2.5 rounded-xl shrink-0 ml-4 group-hover:bg-[#1B2A66] group-hover:text-white transition-colors">
                        <ChevronRight size={16} strokeWidth={3} />
                     </div>
                  </div>
                  <div className="mt-5 ml-2 flex items-center gap-2">
                     <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                     <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Wajib Diisi</span>
                  </div>
                </div>
              ))
            ) : (
              // Empty State Tugas
              <div className="text-center py-16 bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
                 <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} strokeWidth={2} />
                 </div>
                 <h3 className="text-sm font-black text-slate-800 mb-1">Semua Tugas Selesai!</h3>
                 <p className="text-xs font-medium text-slate-400 max-w-[200px] mx-auto leading-relaxed">Anda sudah menyelesaikan semua survei yang tersedia saat ini.</p>
              </div>
            )
          ) : (
            /* --- TAB RIWAYAT SELESAI --- */
            completedSurveys.length > 0 ? (
              completedSurveys.map(survey => (
                <div 
                  key={survey.id} 
                  className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 relative"
                >
                  <div className="flex gap-4 items-center">
                     <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                        <Check size={20} strokeWidth={3} />
                     </div>
                     <div className="flex flex-col gap-0.5">
                        <h4 className="font-bold text-slate-700 text-sm leading-tight line-clamp-1">{survey.title}</h4>
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Telah Berkontribusi</span>
                     </div>
                  </div>
                </div>
              ))
            ) : (
               // Empty State Riwayat
              <div className="text-center py-16">
                 <ClipboardList size={48} className="mx-auto text-slate-200 mb-4" strokeWidth={1.5} />
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Belum ada riwayat survei.</p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

// --- KOMPONEN: FORM SURVEI (Tetap Sama) ---
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
        setError('Ada bagian wajib yang belum terisi nih!');
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
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-100 z-[60]">
        <div className="h-full bg-blue-600 transition-all duration-500 shadow-lg" style={{ width: `${calculateProgress()}%` }}></div>
      </div>

      <header className="w-full bg-white/90 border-b border-slate-100 px-6 py-4 sticky top-1.5 z-50 flex justify-between items-center backdrop-blur-md">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ArrowLeft size={18} /></button>
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest">{calculateProgress()}% Selesai</span>
        <div className="w-9"></div>
      </header>

      <main className="px-5 py-8 space-y-6 w-full max-w-lg">
        <div className="px-2">
            <h1 className="text-2xl font-black text-slate-800 leading-tight">{surveyData?.title}</h1>
            <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">{surveyData?.description || 'Mohon berikan penilaian objektif Bapak/Ibu/Saudara untuk kemajuan kampus.'}</p>
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
            <div id={`q-${idx}`} key={idx} className={`bg-white rounded-[2rem] p-7 border-2 transition-all duration-500 shadow-[0_4px_20px_rgb(0,0,0,0.03)] ${isMissing ? 'border-rose-400' : isAnswered ? 'border-green-100 bg-green-50/10' : 'border-white'}`}>
                <div className="flex gap-4 items-start mb-6">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 ${isAnswered ? 'bg-green-500 text-white shadow-md' : 'bg-[#1B2A66] text-[#FACC15]'}`}>
                        {isAnswered ? <Check size={14} strokeWidth={3} /> : idx + 1}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base leading-snug pt-1">{field.data.question}</h3>
                </div>

                {field.type === 'rating' && (
                   <div className="flex justify-between gap-2 max-w-sm mx-auto">
                      {[1,2,3,4,5].map(v => (
                         <button key={v} onClick={() => setAnswers({...answers, [`answer_${idx}`]: v})} className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${answers[`answer_${idx}`] === v ? 'bg-[#1B2A66] text-[#FACC15] shadow-xl scale-110' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}>
                            <Star size={20} fill={answers[`answer_${idx}`] === v ? "currentColor" : "none"} />
                            <span className="text-[9px] font-black mt-1">{v}</span>
                         </button>
                      ))}
                   </div>
                )}

                {(field.type === 'textarea' || field.type === 'text') && (
                   <textarea value={answers[`answer_${idx}`] || ""} onChange={(e) => setAnswers({...answers, [`answer_${idx}`]: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-blue-50 border-transparent outline-none text-sm font-bold placeholder:text-slate-300 min-h-[120px] transition-all" placeholder="Ketik pendapat Anda di sini..." />
                )}

                {field.type === 'select' && (
                   <select value={answers[`answer_${idx}`] || ""} onChange={(e) => setAnswers({...answers, [`answer_${idx}`]: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-blue-50 border-transparent outline-none text-sm font-bold appearance-none cursor-pointer transition-all">
                      <option value="">-- Ketuk untuk memilih --</option>
                      {field.data.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                )}

                {isMissing && <p className="mt-4 text-[9px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Wajib diisi sebelum lanjut!</p>}
            </div>
          );
        })}

        <div className="py-8">
           <button onClick={handleSubmit} disabled={submitting} className="w-full bg-[#1B2A66] text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.1em] shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? 'Menyimpan Data...' : <><Send size={18} /> Kirim Penilaian</>}
           </button>
           <div className="flex items-center justify-center gap-2 mt-5">
              <ShieldCheck size={14} className="text-slate-300" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kerahasiaan Data Terjamin</p>
           </div>
        </div>
      </main>
    </div>
  );
};

// --- KOMPONEN: SUCCESS ---
const SuccessPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 text-center flex-col">
       <div className="relative mb-10">
          <div className="w-32 h-32 bg-green-50 rounded-[3rem] rotate-12 absolute inset-0 -z-10 animate-pulse"></div>
          <div className="w-32 h-32 bg-white rounded-[3rem] border-4 border-green-500 flex items-center justify-center shadow-2xl shadow-green-100">
             <CheckCircle2 size={64} className="text-green-500" strokeWidth={2.5} />
          </div>
          <Sparkles className="absolute -top-4 -right-4 text-[#FACC15] animate-bounce" size={32} />
       </div>
       <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4">Selesai!</h2>
       <p className="text-slate-500 text-sm font-medium leading-relaxed mb-12 px-2">Terima kasih banyak atas waktunya, <b>{user?.name.split(' ')[0]}</b>. Masukan Anda langsung masuk ke database pusat.</p>
       
       <div className="w-full max-w-xs space-y-3">
          <button onClick={() => navigate('/dashboard')} className="w-full py-4 rounded-2xl bg-[#1B2A66] text-white font-black text-xs uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all">Kembali ke Beranda</button>
          <button onClick={onLogout} className="w-full py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors">Keluar Aplikasi</button>
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