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
  User, Building2, ClipboardCheck, Info, Clock,
  ArrowLeft, LayoutDashboard, sparkles
} from 'lucide-react';

/**
 * PORTAL SURVEI UNMARIS V2.0 - UI MODERN
 * Arsitektur: React Router + Tailwind CSS v4
 */

// --- UTILS: Format Warna & Style ---
const PRIMARY_COLOR = "#1B2A66";
const ACCENT_COLOR = "#FACC15";

// --- KOMPONEN: LOGIN PAGE ---
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
        setError(data.message || 'Kredensial salah.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server SIAKAD.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white relative z-10 overflow-hidden transition-all">
        <div className="bg-[#1B2A66] p-12 text-center relative">
          <div className="bg-white/10 w-20 h-20 rounded-3xl rotate-12 absolute -top-4 -right-4 blur-sm"></div>
          <Lock className="text-[#FACC15] mx-auto mb-4" size={48} strokeWidth={2.5} />
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Portal Survei</h1>
          <p className="text-blue-200 text-[11px] mt-1 font-bold tracking-[0.2em] uppercase">Stella Maris Sumba</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-10 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3 animate-bounce">
              <AlertCircle size={18}/> {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-5 top-5 text-slate-400" size={18} />
              <input name="nim" required placeholder="NIM / NIDN" className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-semibold" />
            </div>
            <div className="relative">
              <ShieldCheck className="absolute left-5 top-5 text-slate-400" size={18} />
              <input name="password" required type="password" placeholder="Password SIAKAD" className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-semibold" />
            </div>
          </div>
          <button disabled={loading} className="w-full bg-[#1B2A66] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-900 shadow-2xl shadow-blue-900/30 transition-all active:scale-95 disabled:opacity-50">
            {loading ? 'Mengautentikasi...' : 'Masuk Sekarang'}
          </button>
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tight">Terintegrasi Keamanan SIAKAD</p>
        </form>
      </div>
    </div>
  );
};

// --- KOMPONEN: DASHBOARD PAGE ---
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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Modern Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-center">
        <div className="max-w-5xl w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-[#1B2A66] p-2 rounded-xl text-[#FACC15]"><LayoutDashboard size={20} /></div>
             <span className="font-black text-[#1B2A66] uppercase tracking-tighter text-lg">SISET Portal</span>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-xs transition-colors">
            Keluar <LogOut size={16}/>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 mt-10">
        {/* Welcome Hero */}
        <div className="bg-[#1B2A66] rounded-[3rem] p-10 text-white relative overflow-hidden mb-12 shadow-2xl shadow-blue-900/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-[#FACC15] text-3xl font-black shadow-inner border border-white/20">
                {user.name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-black leading-tight">Halo, {user.name.split(' ')[0]}! 👋</h2>
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">{user.role} • {user.identifier}</p>
              </div>
            </div>
            <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase text-blue-300 tracking-widest">Status Kehadiran</p>
              <p className="text-sm font-bold flex items-center gap-2 mt-1">Sesi Aktif <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div></p>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-8 px-4">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Daftar Survei Kampus</h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full">{surveys.length} Tersedia</span>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-slate-100"></div>)
          ) : surveys.length > 0 ? (
            surveys.map(survey => (
              <div 
                key={survey.id} 
                className={`group relative bg-white rounded-[2.5rem] p-8 shadow-sm border-2 transition-all duration-300 overflow-hidden flex flex-col justify-between ${survey.has_submitted ? 'border-transparent opacity-60' : 'border-transparent hover:border-[#1B2A66] hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1'}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className={`p-3 rounded-2xl ${survey.has_submitted ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-[#1B2A66]'}`}>
                      <ClipboardCheck size={24}/>
                    </div>
                    {survey.has_submitted ? (
                      <div className="bg-green-100 text-green-700 p-1 rounded-full"><CheckCircle2 size={16}/></div>
                    ) : (
                      <div className="w-2 h-2 bg-[#FACC15] rounded-full"></div>
                    )}
                  </div>
                  <h4 className="font-black text-slate-800 text-lg mb-2 leading-tight">{survey.title}</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-3">{survey.description}</p>
                </div>

                <div className="mt-8">
                  {survey.has_submitted ? (
                    <div className="text-center py-3 text-[10px] font-black text-green-600 uppercase tracking-widest">Terkirim pada Database</div>
                  ) : (
                    <button 
                      onClick={() => navigate(`/survey/${survey.id}`)} 
                      className="w-full bg-slate-50 text-[#1B2A66] group-hover:bg-[#1B2A66] group-hover:text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      Buka Form <ChevronRight size={16}/>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
               <Info className="mx-auto text-slate-200 mb-4" size={48} />
               <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Belum ada survei baru untuk Anda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN: SURVEY FORM PAGE ---
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
          setError(data.message || 'Gagal mengambil data.');
        }
      } catch (err) {
        setError('Masalah koneksi.');
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
      if (response.ok) navigate('/success');
      else setError('Gagal mengirim jawaban.');
    } catch (err) {
      setError('Kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !surveyData) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#1B2A66] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menyiapkan Berkas...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center pb-20">
      {/* Sticky Survey Header */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 p-6 flex justify-center shadow-sm">
        <div className="max-w-3xl w-full flex justify-between items-center">
          <button onClick={() => navigate('/dashboard')} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
             <h1 className="font-black text-slate-800 text-sm uppercase tracking-tight line-clamp-1">{surveyData?.title}</h1>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Pengisian Survei Resmi</p>
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-3xl w-full px-6 mt-12 space-y-8">
        {error && <div className="p-5 bg-red-50 text-red-600 rounded-3xl font-bold text-xs border border-red-100">{error}</div>}
        
        {surveyData?.schema.map((field, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-white animate-in slide-in-from-bottom-4 fade-in duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex items-start gap-4 mb-8">
              <span className="bg-[#1B2A66] text-[#FACC15] w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0">{idx + 1}</span>
              <h3 className="font-black text-slate-800 text-lg leading-tight">{field.data.question} {field.data.is_required && <span className="text-red-500">*</span>}</h3>
            </div>

            {field.type === 'rating' && (
              <div className="grid grid-cols-5 gap-3">
                {[1,2,3,4,5].map(v => (
                  <button 
                    key={v} 
                    onClick={() => setAnswers({...answers, [`answer_${idx}`]: v})} 
                    className={`aspect-square rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${answers[`answer_${idx}`] === v ? 'bg-[#1B2A66] border-[#1B2A66] text-[#FACC15] scale-105 shadow-2xl shadow-blue-900/30' : 'bg-slate-50 border-transparent text-slate-300 hover:bg-slate-100'}`}
                  >
                    <Star size={24} fill={answers[`answer_${idx}`] === v ? "#FACC15" : "none"} />
                    <span className="text-xs font-black">{v}</span>
                  </button>
                ))}
              </div>
            )}

            {(field.type === 'textarea' || field.type === 'text') && (
              <textarea 
                onChange={(e) => setAnswers({...answers, [`answer_${idx}`]: e.target.value})} 
                className="w-full p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-[#1B2A66] focus:bg-white outline-none transition-all text-sm font-semibold min-h-[150px]" 
                placeholder="Tuliskan pendapat Anda di sini..."
              />
            )}

            {field.type === 'select' && (
              <select 
                onChange={(e) => setAnswers({...answers, [`answer_${idx}`]: e.target.value})} 
                className="w-full p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-[#1B2A66] focus:bg-white outline-none text-sm font-bold appearance-none cursor-pointer"
              >
                <option value="">Pilih Opsi...</option>
                {field.data.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
          </div>
        ))}

        <div className="pt-10 flex justify-center">
          <button 
            onClick={handleSubmit} 
            disabled={loading || Object.keys(answers).length === 0} 
            className="group bg-[#1B2A66] text-white px-16 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-900/40 hover:bg-blue-900 transition-all active:scale-95 disabled:opacity-30 flex items-center gap-3"
          >
            {loading ? 'Mengirim Data...' : <>Kirim Laporan <Send size={20} className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </div>
      </main>
    </div>
  );
};

// --- KOMPONEN: SUCCESS PAGE ---
const SuccessPage = ({ onLogout, user }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#1B2A66] flex items-center justify-center p-6 text-center text-white relative overflow-hidden">
      {/* Animated decor */}
      <div className="absolute w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="max-w-md w-full relative z-10 space-y-10 animate-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-[#FACC15] text-[#1B2A66] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-12">
            <CheckCircle2 size={64} strokeWidth={2.5} />
          </div>
        </div>
        
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-4">MANTAP! 🚀</h2>
          <p className="text-blue-100 text-lg font-medium leading-relaxed px-4">
            Halo <b>{user?.name.split(' ')[0]}</b>, kontribusi Anda telah kami terima dan masuk ke sistem audit.
          </p>
        </div>

        <div className="space-y-4 pt-6">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-white text-[#1B2A66] py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-blue-50 transition-all active:scale-95"
          >
            Kembali ke Beranda
          </button>
          <button 
            onClick={onLogout} 
            className="w-full py-4 text-xs font-black text-blue-300 hover:text-white uppercase tracking-[0.3em] transition-colors"
          >
            Selesaikan Sesi
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ENTRY ---
const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('survey_user');
    return saved ? JSON.parse(saved) : null;
  });
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