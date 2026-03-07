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
  Info, Sparkles, Fingerprint, ShieldEllipsis
} from 'lucide-react';

/**
 * PORTAL SURVEI UNMARIS V3.0 - USER-FRIENDLY & MODERN
 * Fokus: Kejelasan Informasi untuk Pengguna Awam (UX Premium)
 */

// --- KOMPONEN: LOGIN PAGE (Pintu Masuk Terpadu) ---
const LoginPage = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const nim = e.target.nim.value.trim();
    const password = e.target.password.value.trim();

    if (!nim || !password) {
      setError('Harap masukkan NIM dan Password SIAKAD Anda.');
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
        setError(data.message || 'Data tidak cocok dengan database SIAKAD.');
        triggerShake();
      }
    } catch (err) {
      setError('Gagal menghubungi server. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ornamen Latar Belakang Modern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1B2A66] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FACC15] rounded-full blur-[120px]"></div>
      </div>

      <div className={`max-w-md w-full bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-white relative z-10 overflow-hidden transition-all duration-300 ${shake ? 'translate-x-2' : ''}`}>
        <div className="bg-[#1B2A66] p-12 text-center relative">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-[#FACC15] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-yellow-500/20 rotate-6">
              <Fingerprint className="text-[#1B2A66]" size={40} strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Login Portal</h1>
            <p className="text-blue-200 text-[10px] mt-1 font-bold tracking-[0.3em] uppercase">Stella Maris Sumba</p>
          </div>
          {/* Grain Effect */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        
        <form onSubmit={handleLogin} className="p-10 space-y-6">
          <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
             <Info size={16} className="text-[#1B2A66] shrink-0 mt-0.5" />
             <p className="text-[10px] text-blue-900 font-medium leading-relaxed">Gunakan akun <b>SIAKAD</b> yang biasa Anda gunakan untuk mengisi KRS atau melihat Nilai.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-[11px] font-bold flex items-center gap-3 animate-in fade-in">
              <AlertCircle size={18} className="shrink-0" /> {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Induk (NIM)</label>
              <input name="nim" required placeholder="Contoh: 202100123" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#1B2A66]/5 focus:border-[#1B2A66] transition-all text-sm font-semibold" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Akun</label>
              <input name="password" required type="password" placeholder="••••••••" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-[#1B2A66]/5 focus:border-[#1B2A66] transition-all text-sm font-semibold" />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-[#1B2A66] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-900 shadow-2xl shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50">
            {loading ? 'Sedang Mencocokkan...' : 'Masuk Portal Sekarang'}
          </button>
          
          <div className="flex justify-center items-center gap-2 pt-2">
            <ShieldEllipsis size={14} className="text-slate-300" />
            <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Enkripsi Keamanan End-to-End</span>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- KOMPONEN: DASHBOARD PAGE (Pusat Tugas Mahasiswa) ---
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
      {/* Navbar Minimalis Modern */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex justify-center">
        <div className="max-w-5xl w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-[#1B2A66] p-2.5 rounded-2xl text-[#FACC15] shadow-lg shadow-blue-900/10"><LayoutDashboard size={20} /></div>
             <div className="flex flex-col">
               <span className="font-black text-[#1B2A66] uppercase tracking-tighter text-lg leading-none">SISET</span>
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Portal Mahasiswa</span>
             </div>
          </div>
          <button onClick={onLogout} className="group flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
            Keluar <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Onboarding / Instruction Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-[#1B2A66] rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <span className="px-4 py-1.5 bg-[#FACC15] text-[#1B2A66] rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Selamat Datang</span>
              </div>
              <h2 className="text-4xl font-black leading-tight mb-4">Halo, {user.name.split(' ')[0]}!<br/>Siap Beri Masukan?</h2>
              <p className="text-blue-200 text-sm font-medium leading-relaxed max-w-md opacity-80">
                Pilih salah satu survei di bawah ini untuk membantu kami meningkatkan kualitas sarana prasarana kampus Stella Maris.
              </p>
            </div>
            <Sparkles className="absolute bottom-[-20px] right-[-20px] text-[#FACC15]/20" size={240} />
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl flex flex-col justify-center gap-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Status Anda</h3>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-[#1B2A66] font-black text-2xl border border-slate-200">{user.name[0]}</div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-slate-800 leading-none">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] font-bold text-slate-400 mt-2">{user.identifier}</span>
              </div>
            </div>
            <div className="h-[2px] bg-slate-50"></div>
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span>Peran</span>
               <span className="text-[#1B2A66]">{user.role}</span>
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest whitespace-nowrap">Tugas Survei Anda</h3>
            <div className="h-[2px] bg-slate-100 flex-1 rounded-full"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-4 py-2 rounded-full">{surveys.length} Tersedia</span>
        </div>

        {/* Dynamic Survey Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {loading ? (
            [1,2].map(i => <div key={i} className="h-64 bg-white rounded-[3rem] animate-pulse border border-slate-100 shadow-sm"></div>)
          ) : surveys.length > 0 ? (
            surveys.map(survey => (
              <div key={survey.id} className={`group bg-white rounded-[3rem] p-10 border-2 transition-all duration-500 flex flex-col justify-between overflow-hidden relative ${survey.has_submitted ? 'border-transparent bg-slate-50/50' : 'border-white hover:border-[#1B2A66] hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 shadow-xl shadow-slate-200/40'}`}>
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${survey.has_submitted ? 'bg-slate-200 text-slate-400' : 'bg-blue-50 text-[#1B2A66] group-hover:bg-[#1B2A66] group-hover:text-white'}`}>
                      <ClipboardList size={28}/>
                    </div>
                    {survey.has_submitted && (
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 size={14} /> Selesai Terisi
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-slate-800 text-xl leading-tight mb-3 group-hover:text-[#1B2A66] transition-colors">{survey.title}</h4>
                  <p className="text-[13px] text-slate-400 font-medium leading-relaxed line-clamp-2">{survey.description || 'Bantu kami memberikan penilaian terbaik untuk layanan ini.'}</p>
                </div>

                <div className="mt-10">
                  {survey.has_submitted ? (
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100/50 py-4 px-6 rounded-2xl">
                      <Sparkles size={14} /> Jawaban Telah Diverifikasi Sistem
                    </div>
                  ) : (
                    <button 
                      onClick={() => navigate(`/survey/${survey.id}`)} 
                      className="w-full bg-[#1B2A66] text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 hover:bg-blue-900 active:scale-95 shadow-xl shadow-blue-900/20"
                    >
                      Mulai Isi Sekarang <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100 shadow-inner">
               <HelpCircle className="mx-auto text-slate-200 mb-6" size={64} />
               <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-sm">Tidak ada survei baru saat ini</p>
               <p className="text-slate-300 text-xs mt-2 font-medium">Kami akan memberitahu Anda jika ada kuesioner baru.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN: SURVEY PAGE (Pengisian Terbimbing) ---
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
          setError(data.message || 'Gagal menyiapkan survei.');
        }
      } catch (err) {
        setError('Koneksi terputus. Harap cek wifi/data Anda.');
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
        setError('Waduh! Ada pertanyaan wajib yang belum terjawab nih.');
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
      else setError('Terjadi gangguan saat menyimpan jawaban.');
    } catch (err) {
      setError('Sistem sibuk. Coba klik kirim lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !surveyData) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-8 border-slate-100 rounded-full"></div>
        <div className="w-16 h-16 border-8 border-[#1B2A66] border-t-transparent rounded-full animate-spin absolute top-0"></div>
      </div>
      <p className="text-[10px] font-black text-[#1B2A66] uppercase tracking-[0.4em] animate-pulse">Menyiapkan Lembar Jawaban...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Dynamic Interactive Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-slate-100 z-[60]">
        <div className="h-full bg-gradient-to-r from-[#1B2A66] to-blue-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${calculateProgress()}%` }}></div>
      </div>

      <header className="sticky top-2 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 p-6 flex justify-center shadow-sm">
        <div className="max-w-3xl w-full flex justify-between items-center">
          <button onClick={() => navigate('/dashboard')} className="group flex items-center gap-2 p-3 hover:bg-slate-100 rounded-2xl transition-all">
            <ArrowLeft size={20} className="text-slate-400 group-hover:text-[#1B2A66]" />
            <span className="text-[10px] font-black text-slate-400 group-hover:text-[#1B2A66] uppercase hidden sm:block">Keluar</span>
          </button>
          <div className="text-center overflow-hidden px-4">
             <h1 className="font-black text-slate-800 text-sm uppercase tracking-tight truncate max-w-[200px] sm:max-w-md">{surveyData?.title}</h1>
             <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">{calculateProgress()}% Perjalanan Selesai</p>
          </div>
          <div className="p-3 bg-blue-50 text-[#1B2A66] rounded-2xl">
             <Info size={18} />
          </div>
        </div>
      </header>

      <main className="max-w-3xl w-full mx-auto px-5 md:px-0 mt-12 space-y-10">
        <div className="bg-gradient-to-br from-[#1B2A66] to-[#2D45A1] p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-white">
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center shrink-0 border border-white/20">
                 <ClipboardList size={40} className="text-[#FACC15]" />
              </div>
              <div>
                 <h2 className="text-2xl font-black mb-2">Panduan Pengisian</h2>
                 <p className="text-blue-100 text-xs font-medium leading-relaxed opacity-80">
                   {surveyData?.description || "Isilah setiap poin di bawah ini sesuai dengan apa yang Anda rasakan selama menggunakan fasilitas kampus. Masukan Anda sangat berharga bagi kami."}
                 </p>
              </div>
           </div>
           <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        </div>

        {error && (
            <div className="p-6 bg-red-50 text-red-600 rounded-[2rem] font-black text-[11px] uppercase border-2 border-red-100 flex items-center gap-4 sticky top-24 z-40 shadow-2xl animate-bounce">
               <AlertCircle size={20} /> {error}
            </div>
        )}
        
        {surveyData?.schema.map((field, idx) => {
          const isMissing = missingFields.includes(idx);
          const isAnswered = !!answers[`answer_${idx}`];
          return (
            <div 
                id={`question-${idx}`}
                key={idx} 
                className={`bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 border-4 transition-all duration-500 relative ${isMissing ? 'border-red-400' : isAnswered ? 'border-green-50' : 'border-white hover:border-blue-50'}`}
            >
                <div className="flex items-start gap-6 mb-10">
                    <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition-all duration-500 ${isAnswered ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-[#1B2A66] text-[#FACC15] shadow-lg shadow-blue-900/10'}`}>
                        {isAnswered ? <Check size={20} strokeWidth={3} /> : idx + 1}
                    </span>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-black text-slate-800 text-xl md:text-2xl leading-snug">
                            {field.data.question} 
                        </h3>
                        {field.data.is_required && (
                           <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mt-2">Survei Wajib Diisi *</span>
                        )}
                    </div>
                </div>

                {field.type === 'rating' && (
                <div className="grid grid-cols-5 gap-3 sm:gap-6 max-w-lg">
                    {[1,2,3,4,5].map(v => (
                    <button 
                        key={v} 
                        onClick={() => {
                            setAnswers({...answers, [`answer_${idx}`]: v});
                            setMissingFields(missingFields.filter(i => i !== idx));
                        }} 
                        className={`aspect-square rounded-[2rem] border-4 transition-all flex flex-col items-center justify-center gap-2 group/btn ${answers[`answer_${idx}`] === v ? 'bg-[#1B2A66] border-[#1B2A66] text-[#FACC15] scale-110 shadow-2xl' : 'bg-slate-50 border-transparent text-slate-300 hover:bg-slate-100 hover:text-slate-400'}`}
                    >
                        <Star size={28} fill={answers[`answer_${idx}`] === v ? "#FACC15" : "none"} className="transition-transform group-hover/btn:scale-110" />
                        <span className="text-xs font-black">{v}</span>
                    </button>
                    ))}
                </div>
                )}

                {(field.type === 'textarea' || field.type === 'text') && (
                <div className="relative group/input">
                  <textarea 
                      value={answers[`answer_${idx}`] || ""}
                      onChange={(e) => {
                          setAnswers({...answers, [`answer_${idx}`]: e.target.value});
                          if(e.target.value) setMissingFields(missingFields.filter(i => i !== idx));
                      }} 
                      className="w-full p-8 bg-slate-50 rounded-[2.5rem] border-4 border-transparent focus:border-[#1B2A66] focus:bg-white outline-none transition-all text-lg font-semibold min-h-[180px] placeholder:text-slate-300 shadow-inner" 
                      placeholder="Bagikan pengalaman atau saran Anda di sini..."
                  />
                  <div className="absolute right-6 bottom-6 opacity-20 pointer-events-none group-focus-within/input:opacity-100 transition-opacity">
                      <Sparkles size={32} className="text-[#1B2A66]" />
                  </div>
                </div>
                )}

                {field.type === 'select' && (
                <div className="relative">
                  <select 
                      value={answers[`answer_${idx}`] || ""}
                      onChange={(e) => {
                          setAnswers({...answers, [`answer_${idx}`]: e.target.value});
                          setMissingFields(missingFields.filter(i => i !== idx));
                      }} 
                      className="w-full p-8 bg-slate-50 rounded-[2rem] border-4 border-transparent focus:border-[#1B2A66] focus:bg-white outline-none text-lg font-black appearance-none cursor-pointer shadow-inner pr-16"
                  >
                      <option value="">-- Ketuk Untuk Memilih --</option>
                      {field.data.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ChevronRight size={24} className="absolute right-8 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" />
                </div>
                )}
                
                {isMissing && (
                    <div className="mt-8 flex items-center gap-3 text-red-500 animate-pulse bg-red-50 p-4 rounded-2xl">
                       <AlertCircle size={18} />
                       <p className="text-xs font-black uppercase tracking-widest">Maaf, pertanyaan ini wajib diisi dulu ya!</p>
                    </div>
                )}
            </div>
          );
        })}

        <div className="pt-10 flex flex-col items-center gap-6">
          <button 
            onClick={handleSubmit} 
            disabled={submitting} 
            className={`group bg-[#1B2A66] text-white px-20 py-7 rounded-[2.5rem] font-black text-[14px] uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(27,42,102,0.4)] transition-all active:scale-95 flex items-center gap-4 ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-900 hover:shadow-[0_25px_50px_-12px_rgba(27,42,102,0.6)]'}`}
          >
            {submitting ? 'Mengirim Data...' : <>Kirim Masukan Saya <Send size={24} className="group-hover:translate-x-2 transition-transform" /></>}
          </button>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-100 shadow-sm">
             <ShieldCheck size={16} className="text-green-500" />
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Kerahasiaan data Anda dilindungi sistem kampus</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- KOMPONEN: SUCCESS PAGE (Penghargaan Kontribusi) ---
const SuccessPage = ({ onLogout, user }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#1B2A66] flex items-center justify-center p-6 text-center text-white relative overflow-hidden">
      <div className="absolute w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white rounded-full blur-[180px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[180px]"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10 space-y-10 animate-in zoom-in duration-700">
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-[#FACC15] text-[#1B2A66] rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_20px_50px_rgba(250,204,21,0.4)] rotate-12 transition-transform hover:rotate-0 duration-500">
              <CheckCircle2 size={64} strokeWidth={3} />
          </div>
        </div>
        
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-4 uppercase">Terima Kasih!</h2>
          <p className="text-blue-100 text-lg font-medium leading-relaxed px-6 opacity-90">
            Halo <b>{user?.name.split(' ')[0]}</b>, masukan Anda sudah kami simpan untuk perbaikan kampus Stella Maris yang lebih baik.
          </p>
        </div>

        <div className="space-y-4 pt-6">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-white text-[#1B2A66] py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-50 transition-all active:scale-95"
          >
            Kembali ke Beranda
          </button>
          <button 
            onClick={onLogout} 
            className="w-full py-4 text-[10px] font-black text-blue-300 hover:text-white uppercase tracking-[0.4em] transition-colors"
          >
            Selesaikan Sesi Ini
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