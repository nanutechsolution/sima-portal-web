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
  ClipboardList, HelpCircle, Check
} from 'lucide-react';

/**
 * PORTAL SURVEI UNMARIS V2.5 - UX OPTIMIZED
 * Fokus: Validasi Mandatori & Pengguna Awam
 */

// --- KOMPONEN: LOGIN PAGE ---
const LoginPage = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const nim = e.target.nim.value.trim();
    const password = e.target.password.value.trim();

    // Validasi Sederhana Sisi Klien
    if (!nim || !password) {
      setError('Mohon lengkapi NIM dan Password Anda.');
      triggerShake();
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
        setError(data.message || 'Akun tidak ditemukan atau password salah.');
        triggerShake();
      }
    } catch (err) {
      setError('Server SIAKAD tidak merespon. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-50 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div className={`max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-white relative z-10 overflow-hidden transition-all ${shake ? 'animate-bounce' : ''}`}>
        <div className="bg-[#1B2A66] p-10 text-center relative">
          <div className="w-16 h-16 bg-[#FACC15] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-400/20 rotate-3">
            <Lock className="text-[#1B2A66]" size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight">Portal Survei</h1>
          <p className="text-blue-200 text-[10px] mt-1 font-bold tracking-[0.2em] uppercase">Universitas Stella Maris</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-bold flex items-center gap-3">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase ml-4 mb-2 tracking-widest">Identitas Akun</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1B2A66] transition-colors" size={18} />
                <input name="nim" required placeholder="NIM atau NIDN" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all text-sm font-semibold" />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase ml-4 mb-2 tracking-widest">Kata Sandi</label>
              <div className="relative">
                <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1B2A66] transition-colors" size={18} />
                <input name="password" required type="password" placeholder="Password SIAKAD" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all text-sm font-semibold" />
              </div>
            </div>
          </div>

          <button disabled={loading} className="w-full bg-[#1B2A66] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-900 shadow-xl shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50">
            {loading ? 'Memvalidasi...' : 'Masuk Portal'}
          </button>
          
          <div className="flex items-center gap-3 py-2">
            <div className="h-[1px] bg-slate-100 flex-1"></div>
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tight">Sistem Keamanan Terpadu</p>
            <div className="h-[1px] bg-slate-100 flex-1"></div>
          </div>
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex justify-center">
        <div className="max-w-4xl w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-[#1B2A66] p-2 rounded-xl text-[#FACC15]"><LayoutDashboard size={18} /></div>
             <span className="font-black text-[#1B2A66] uppercase tracking-tighter text-md">SISET Portal</span>
          </div>
          <button onClick={onLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-colors">
            Keluar
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-[#1B2A66] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden mb-10 shadow-2xl shadow-blue-900/10">
          <div className="relative z-10">
            <h2 className="text-3xl font-black leading-tight">Selamat Datang,<br/>{user.name.split(' ')[0]}!</h2>
            <div className="mt-4 flex items-center gap-4">
              <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">{user.role}</span>
              <span className="text-blue-300 text-[10px] font-bold uppercase tracking-widest">{user.identifier}</span>
            </div>
          </div>
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl"></div>
        </div>

        <div className="mb-6 flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Daftar Survei Aktif</h3>
            <div className="h-px bg-slate-100 flex-1 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            [1,2].map(i => <div key={i} className="h-48 bg-white rounded-[2rem] animate-pulse border border-slate-100"></div>)
          ) : surveys.length > 0 ? (
            surveys.map(survey => (
              <div key={survey.id} className={`group bg-white rounded-[2rem] p-6 border-2 transition-all duration-300 flex flex-col justify-between ${survey.has_submitted ? 'border-transparent bg-slate-50/50' : 'border-transparent hover:border-[#1B2A66] hover:shadow-xl'}`}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${survey.has_submitted ? 'bg-slate-200 text-slate-400' : 'bg-blue-50 text-[#1B2A66]'}`}>
                      <ClipboardList size={22}/>
                    </div>
                    {survey.has_submitted && (
                      <span className="bg-green-100 text-green-700 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                        <Check size={10} /> Selesai
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-slate-800 text-md leading-tight mb-2">{survey.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2">{survey.description}</p>
                </div>

                <div className="mt-6">
                  {survey.has_submitted ? (
                    <div className="text-[10px] font-black text-slate-400 uppercase text-center py-2 bg-slate-100 rounded-xl tracking-widest">Terdaftar di Sistem</div>
                  ) : (
                    <button 
                      onClick={() => navigate(`/survey/${survey.id}`)} 
                      className="w-full bg-[#1B2A66] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-blue-900 active:scale-95 shadow-lg shadow-blue-900/10"
                    >
                      Mulai Isi <ChevronRight size={14}/>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
               <HelpCircle className="mx-auto text-slate-200 mb-4" size={48} />
               <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Belum ada survei baru untuk saat ini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN: SURVEY PAGE ---
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
        } else {
          setError(data.message || 'Gagal mengambil data.');
        }
      } catch (err) {
        setError('Masalah koneksi internet.');
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id, token, navigate]);

  // Kalkulasi Persentase Pengisian
  const calculateProgress = () => {
    if (!surveyData?.schema) return 0;
    const answeredCount = Object.keys(answers).filter(key => answers[key] !== "" && answers[key] !== null).length;
    return Math.round((answeredCount / surveyData.schema.length) * 100);
  };

  const validateForm = () => {
    const missing = [];
    surveyData.schema.forEach((field, index) => {
      const fieldName = `answer_${index}`;
      if (field.data.is_required && (!answers[fieldName] || answers[fieldName] === "")) {
        missing.push(index);
      }
    });
    setMissingFields(missing);
    return missing.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
        setError('Mohon lengkapi semua pertanyaan bertanda bintang (*)');
        // Scroll ke pertanyaan pertama yang kosong
        const firstMissing = document.getElementById(`question-${missingFields[0]}`);
        if (firstMissing) firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    setSubmitting(true);
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
      else setError('Gagal mengirim data. Silakan coba kembali.');
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !surveyData) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#1B2A66] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menyiapkan Formulir...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Progress Bar Top */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-100 z-[60]">
        <div className="h-full bg-[#FACC15] transition-all duration-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: `${calculateProgress()}%` }}></div>
      </div>

      <header className="sticky top-1.5 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 md:p-6 flex justify-center shadow-sm">
        <div className="max-w-3xl w-full flex justify-between items-center">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-400" />
          </button>
          <div className="text-center overflow-hidden px-4">
             <h1 className="font-black text-slate-800 text-xs md:text-sm uppercase tracking-tight truncate">{surveyData?.title}</h1>
             <p className="text-[9px] font-bold text-[#FACC15] uppercase tracking-widest mt-0.5">{calculateProgress()}% Selesai Terisi</p>
          </div>
          <div className="w-8 md:w-10"></div>
        </div>
      </header>

      <main className="max-w-3xl w-full mx-auto px-4 md:px-6 mt-10 space-y-6">
        {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase border border-red-100 flex items-center gap-3 sticky top-24 z-40 shadow-lg animate-in slide-in-from-top-4">
               <AlertCircle size={16} /> {error}
            </div>
        )}

        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
            <p className="text-blue-900 text-xs font-medium leading-relaxed text-center">
                {surveyData?.description || "Mohon isi formulir ini dengan sejujur-jujurnya demi perbaikan kualitas layanan kampus."}
            </p>
        </div>
        
        {surveyData?.schema.map((field, idx) => {
          const isMissing = missingFields.includes(idx);
          return (
            <div 
                id={`question-${idx}`}
                key={idx} 
                className={`bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border-2 transition-all duration-300 ${isMissing ? 'border-red-400 scale-[1.01]' : 'border-white'}`}
            >
                <div className="flex items-start gap-4 mb-8">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 transition-colors ${answers[`answer_${idx}`] ? 'bg-green-500 text-white' : 'bg-[#1B2A66] text-[#FACC15]'}`}>
                        {idx + 1}
                    </span>
                    <h3 className="font-black text-slate-800 text-md md:text-lg leading-snug">
                        {field.data.question} 
                        {field.data.is_required && <span className="text-red-500 ml-1" title="Wajib Diisi">*</span>}
                    </h3>
                </div>

                {field.type === 'rating' && (
                <div className="grid grid-cols-5 gap-3 max-w-sm">
                    {[1,2,3,4,5].map(v => (
                    <button 
                        key={v} 
                        onClick={() => {
                            setAnswers({...answers, [`answer_${idx}`]: v});
                            setMissingFields(missingFields.filter(i => i !== idx));
                        }} 
                        className={`aspect-square rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${answers[`answer_${idx}`] === v ? 'bg-[#1B2A66] border-[#1B2A66] text-[#FACC15] scale-110 shadow-2xl' : 'bg-slate-50 border-transparent text-slate-300 hover:bg-slate-100'}`}
                    >
                        <Star size={20} fill={answers[`answer_${idx}`] === v ? "#FACC15" : "none"} />
                        <span className="text-[10px] font-black">{v}</span>
                    </button>
                    ))}
                </div>
                )}

                {(field.type === 'textarea' || field.type === 'text') && (
                <textarea 
                    value={answers[`answer_${idx}`] || ""}
                    onChange={(e) => {
                        setAnswers({...answers, [`answer_${idx}`]: e.target.value});
                        if(e.target.value) setMissingFields(missingFields.filter(i => i !== idx));
                    }} 
                    className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#1B2A66] focus:bg-white outline-none transition-all text-sm font-semibold min-h-[120px] placeholder:text-slate-300" 
                    placeholder="Ketik jawaban atau saran Anda di sini..."
                />
                )}

                {field.type === 'select' && (
                <select 
                    value={answers[`answer_${idx}`] || ""}
                    onChange={(e) => {
                        setAnswers({...answers, [`answer_${idx}`]: e.target.value});
                        setMissingFields(missingFields.filter(i => i !== idx));
                    }} 
                    className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#1B2A66] focus:bg-white outline-none text-sm font-bold appearance-none cursor-pointer"
                >
                    <option value="">Pilih salah satu...</option>
                    {field.data.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                )}
                
                {isMissing && (
                    <p className="mt-4 text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">Pertanyaan ini wajib dijawab!</p>
                )}
            </div>
          );
        })}

        <div className="pt-10 flex flex-col items-center gap-4">
          <button 
            onClick={handleSubmit} 
            disabled={submitting} 
            className={`group bg-[#1B2A66] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center gap-3 ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-900'}`}
          >
            {submitting ? 'Sedang Mengirim...' : <>Kirim Laporan Survei <Send size={18} /></>}
          </button>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Jawaban Anda bersifat rahasia & anonim di laporan publik</p>
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
      <div className="absolute w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10 space-y-8 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-[#FACC15] text-[#1B2A66] rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-12">
            <CheckCircle2 size={48} strokeWidth={3} />
        </div>
        
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2 uppercase">Laporan Terkirim!</h2>
          <p className="text-blue-100 text-sm font-medium leading-relaxed px-4 opacity-80">
            Terima kasih, <b>{user?.name.split(' ')[0]}</b>. Masukan Anda telah kami simpan untuk perbaikan kampus Stella Maris.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-white text-[#1B2A66] py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all active:scale-95"
          >
            Kembali ke Beranda
          </button>
          <button 
            onClick={onLogout} 
            className="w-full py-4 text-[10px] font-black text-blue-300 hover:text-white uppercase tracking-[0.3em] transition-colors"
          >
            Keluar Sesi
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