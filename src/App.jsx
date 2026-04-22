import { useState } from "react";

const MOCK_POSTS = [
  { id: 1, name: "김민준", dept: "마케팅팀", avatar: "김", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop", caption: "오늘 팀원들과 함께 환경 캠페인에 참여했습니다! 작은 실천이 큰 변화를 만든다고 믿어요 🌱", likes: 24, time: "2시간 전", certified: true },
  { id: 2, name: "이서연", dept: "인사팀", avatar: "이", image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=400&fit=crop", caption: "ESG 실천 챌린지 3일차! 오늘도 텀블러 들고 출근 완료 ☕ 함께해요!", likes: 18, time: "4시간 전", certified: true },
  { id: 3, name: "박도현", dept: "개발팀", avatar: "박", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop", caption: "개발팀 전원 참여 인증샷입니다. 우리 팀 파이팅! 💪", likes: 31, time: "6시간 전", certified: true },
  { id: 4, name: "최유진", dept: "재무팀", avatar: "최", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop", caption: "처음 참여해보는데 생각보다 재밌네요! 앞으로도 꾸준히 하겠습니다 😊", likes: 12, time: "8시간 전", certified: false },
  { id: 5, name: "정하은", dept: "영업팀", avatar: "정", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop", caption: "영업팀도 빠질 수 없죠! 고객과 함께 성장하는 캠페인에 적극 동참합니다 🙌", likes: 27, time: "1일 전", certified: true },
  { id: 6, name: "강민서", dept: "기획팀", avatar: "강", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=400&fit=crop", caption: "기획팀 인증! 이번 캠페인 기획에 참여했던 사람으로서 더욱 뿌듯합니다 ✨", likes: 19, time: "1일 전", certified: true },
];

const STATS = { total: 247, certified: 198, depts: 12, goal: 300 };

export default function CampaignPlatform() {
  const [view, setView] = useState("feed");
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [uploadForm, setUploadForm] = useState({ name: "", dept: "", caption: "", image: null, preview: null });
  const [loginForm, setLoginForm] = useState({ id: "", pw: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [filterDept, setFilterDept] = useState("전체");
  const [toast, setToast] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [adminFilter, setAdminFilter] = useState("전체");
  const depts = ["전체", "마케팅팀", "인사팀", "개발팀", "재무팀", "영업팀", "기획팀"];
  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const handleLike = (id) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); setPosts(p => p.map(post => post.id === id ? { ...post, likes: post.likes - 1 } : post)); }
      else { next.add(id); setPosts(p => p.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post)); }
      return next;
    });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadForm(f => ({ ...f, image: file, preview: ev.target.result }));
    reader.readAsDataURL(file);
  };
  const handleSubmit = () => {
    if (!uploadForm.name || !uploadForm.dept || !uploadForm.caption) { showToast("모든 항목을 입력해주세요", "error"); return; }
    const newPost = { id: Date.now(), name: uploadForm.name, dept: uploadForm.dept, avatar: uploadForm.name[0], image: uploadForm.preview || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop", caption: uploadForm.caption, likes: 0, time: "방금 전", certified: false };
    setPosts(p => [newPost, ...p]);
    setUploadForm({ name: "", dept: "", caption: "", image: null, preview: null });
    setSubmitSuccess(true);
    setTimeout(() => { setSubmitSuccess(false); setView("feed"); }, 2000);
  };
  const handleLogin = () => {
    if (loginForm.id === "admin" && loginForm.pw === "1234") { setIsAdmin(true); setLoggedIn(true); setCurrentUser({ name: "관리자", role: "admin" }); setView("admin"); showToast("관리자로 로그인되었습니다"); }
    else if (loginForm.id && loginForm.pw) { setLoggedIn(true); setCurrentUser({ name: loginForm.id, role: "user" }); setView("upload"); showToast("로그인 성공!"); }
    else { showToast("아이디와 비밀번호를 입력해주세요", "error"); }
  };
  const handleApprove = (id) => { setPosts(p => p.map(post => post.id === id ? { ...post, certified: true } : post)); showToast("인증 승인되었습니다"); };
  const handleDelete = (id) => { setPosts(p => p.filter(post => post.id !== id)); showToast("게시물이 삭제되었습니다"); };
  const filteredPosts = filterDept === "전체" ? posts : posts.filter(p => p.dept === filterDept);
  const adminPosts = adminFilter === "전체" ? posts : adminFilter === "승인대기" ? posts.filter(p => !p.certified) : posts.filter(p => p.certified);
  const progress = Math.round((STATS.certified / STATS.goal) * 100);
  return (
    <div style={{ fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif", background: "#F5F4F0", minHeight: "100vh", position: "relative" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
        .card { background: white; border-radius: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); transition: box-shadow 0.2s; }
        .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .btn-primary { background: #1A1A2E; color: white; border: none; border-radius: 10px; padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #16213E; transform: translateY(-1px); }
        .btn-outline { background: transparent; border: 1.5px solid #1A1A2E; color: #1A1A2E; border-radius: 10px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-outline:hover { background: #1A1A2E; color: white; }
        .input { width: 100%; padding: 12px 16px; border: 1.5px solid #E8E8E8; border-radius: 10px; font-size: 14px; outline: none; transition: border 0.2s; font-family: inherit; }
        .input:focus { border-color: #1A1A2E; }
        .tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .tag-certified { background: #E8F5E9; color: #2E7D32; }
        .tag-pending { background: #FFF3E0; color: #E65100; }
        .nav-btn { background: none; border: none; cursor: pointer; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: #666; transition: all 0.15s; }
        .nav-btn.active { color: #1A1A2E; background: #EEEDF0; font-weight: 700; }
        .nav-btn:hover { color: #1A1A2E; background: #F0EFF2; }
        .heart-btn { background: none; border: none; cursor: pointer; font-size: 18px; transition: transform 0.15s; }
        .heart-btn:hover { transform: scale(1.2); }
        .filter-btn { background: none; border: 1.5px solid #ddd; border-radius: 20px; padding: 5px 14px; font-size: 12px; cursor: pointer; transition: all 0.15s; font-family: inherit; color: #555; }
        .filter-btn.active { border-color: #1A1A2E; background: #1A1A2E; color: white; }
        .progress-bar { height: 8px; background: #E0E0E0; border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #1A1A2E, #4A90D9); border-radius: 4px; transition: width 1s ease; }
        .upload-area { border: 2px dashed #D0CFD0; border-radius: 12px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .upload-area:hover { border-color: #1A1A2E; background: #F8F8FA; }
        .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: white; background: linear-gradient(135deg, #1A1A2E, #4A90D9); flex-shrink: 0; }
        .toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 12px; font-size: 13px; font-weight: 600; z-index: 9999; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .success-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9998; }
        .post-img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; background: #eee; }
      `}</style>

      {toast && (<div className="toast" style={{ background: toast.type === "error" ? "#FF5252" : "#2E7D32", color: "white" }}>{toast.type === "error" ? "⚠️ " : "✅ "}{toast.msg}</div>)}

      {submitSuccess && (
        <div className="success-overlay">
          <div className="card" style={{ padding: "48px", textAlign: "center", maxWidth: 320 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>인증 완료!</div>
            <div style={{ fontSize: 14, color: "#888" }}>게시물이 등록되었습니다<br/>관리자 승인 후 피드에 표시됩니다</div>
          </div>
        </div>
      )}

      <header style={{ background: "white", borderBottom: "1px solid #EBEBEB", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#1A1A2E", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16 }}>🏢</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.3px" }}>CampaignHub</div>
              <div style={{ fontSize: 10, color: "#999", marginTop: -2 }}>사내 인증 캠페인 플랫폼</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className={`nav-btn ${view === "feed" ? "active" : ""}`} onClick={() => setView("feed")}>🏠 피드</button>
            {loggedIn ? <button className={`nav-btn ${view === "upload" ? "active" : ""}`} onClick={() => setView("upload")}>📸 인증하기</button> : <button className="nav-btn" onClick={() => setView("login")}>🔑 로그인</button>}
            {isAdmin && <button className={`nav-btn ${view === "admin" ? "active" : ""}`} onClick={() => setView("admin")}>⚙️ 관리</button>}
            {loggedIn && <button className="nav-btn" onClick={() => { setLoggedIn(false); setIsAdmin(false); setCurrentUser(null); setView("feed"); showToast("로그아웃되었습니다"); }}>👤 {currentUser?.name}</button>}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 680, margin: "0 auto", padding: "24px 20px 80px" }}>
        {view === "feed" && (
          <div>
            <div className="card" style={{ padding: "24px", marginBottom: 24, background: "linear-gradient(135deg, #1A1A2E 0%, #2D4A7A 100%)", color: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4, letterSpacing: 1 }}>2025 COMPANY CAMPAIGN</div>
                  <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>함께하는 ESG 실천 챌린지</div>
                  <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}>2025.01.01 ~ 2025.03.31</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 32, fontWeight: 900 }}>{STATS.certified}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>인증 완료</div>
                </div>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, opacity: 0.7 }}>
                <span>참여 목표: {STATS.goal}명</span><span>{progress}% 달성</span>
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800 }}>{STATS.total}</div><div style={{ fontSize: 10, opacity: 0.7 }}>전체 참여</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800 }}>{STATS.depts}</div><div style={{ fontSize: 10, opacity: 0.7 }}>참여 부서</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800 }}>{STATS.goal - STATS.certified}</div><div style={{ fontSize: 10, opacity: 0.7 }}>목표까지</div></div>
                <div style={{ marginLeft: "auto" }}>
                  {!loggedIn ? <button className="btn-primary" style={{ background: "white", color: "#1A1A2E", padding: "10px 20px" }} onClick={() => setView("login")}>참여하기 →</button>
                  : <button className="btn-primary" style={{ background: "white", color: "#1A1A2E", padding: "10px 20px" }} onClick={() => setView("upload")}>인증하기 →</button>}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
              {depts.map(d => (<button key={d} className={`filter-btn ${filterDept === d ? "active" : ""}`} onClick={() => setFilterDept(d)}>{d}</button>))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {filteredPosts.map(post => (
                <div key={post.id} className="card" style={{ overflow: "hidden" }}>
                  <img src={post.image} alt="" className="post-img" onError={e => e.target.style.background = "#ddd"} />
                  <div style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div className="avatar">{post.avatar}</div>
                      <div><div style={{ fontSize: 13, fontWeight: 700 }}>{post.name}</div><div style={{ fontSize: 11, color: "#999" }}>{post.dept}</div></div>
                      {post.certified && <span className="tag tag-certified" style={{ marginLeft: "auto" }}>✓ 인증</span>}
                    </div>
                    <p style={{ fontSize: 12, color: "#444", lineHeight: 1.6, marginBottom: 10 }}>{post.caption}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button className="heart-btn" onClick={() => handleLike(post.id)}>{likedPosts.has(post.id) ? "❤️" : "🤍"}</button>
                        <span style={{ fontSize: 12, color: "#888" }}>{post.likes}</span>
                      </div>
                      <span style={{ fontSize: 11, color: "#bbb" }}>{post.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "login" && (
          <div style={{ maxWidth: 400, margin: "40px auto" }}>
            <div className="card" style={{ padding: 40 }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1A2E" }}>로그인</div>
                <div style={{ fontSize: 13, color: "#999", marginTop: 6 }}>사번 또는 이메일로 로그인하세요</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input className="input" placeholder="사번 또는 이메일" value={loginForm.id} onChange={e => setLoginForm(f => ({ ...f, id: e.target.value }))} />
                <input className="input" type="password" placeholder="비밀번호" value={loginForm.pw} onChange={e => setLoginForm(f => ({ ...f, pw: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                <button className="btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={handleLogin}>로그인</button>
              </div>
              <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#bbb" }}>테스트: 일반 로그인 아무 값 입력 / 관리자: admin / 1234</div>
            </div>
          </div>
        )}

        {view === "upload" && loggedIn && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1A2E" }}>인증 게시물 등록</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>참여 인증 사진과 내용을 올려주세요</div>
            </div>
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>인증 사진 *</label>
                  {uploadForm.preview
                    ? <div style={{ position: "relative" }}>
                        <img src={uploadForm.preview} alt="" style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 12 }} />
                        <button onClick={() => setUploadForm(f => ({ ...f, image: null, preview: null }))} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>✕</button>
                      </div>
                    : <label className="upload-area">
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
                        <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#555" }}>클릭하여 사진 업로드</div>
                        <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>JPG, PNG (최대 10MB)</div>
                      </label>
                  }
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>이름 *</label>
                  <input className="input" placeholder="이름을 입력하세요" value={uploadForm.name} onChange={e => setUploadForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>부서 *</label>
                  <select className="input" style={{ cursor: "pointer" }} value={uploadForm.dept} onChange={e => setUploadForm(f => ({ ...f, dept: e.target.value }))}>
                    <option value="">부서 선택</option>
                    {depts.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>인증 내용 *</label>
                  <textarea className="input" rows={4} placeholder="캠페인 참여 소감이나 인증 내용을 적어주세요" value={uploadForm.caption} onChange={e => setUploadForm(f => ({ ...f, caption: e.target.value }))} style={{ resize: "vertical" }} />
                </div>
                <div style={{ background: "#F8F8FA", borderRadius: 10, padding: 14, fontSize: 12, color: "#888", lineHeight: 1.7 }}>
                  📋 <strong>안내</strong>: 게시물은 관리자 검토 후 피드에 표시됩니다.
                </div>
                <button className="btn-primary" style={{ width: "100%", padding: "14px" }} onClick={handleSubmit}>인증 게시물 제출하기</button>
              </div>
            </div>
          </div>
        )}

        {view === "admin" && isAdmin && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1A2E" }}>관리자 대시보드</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>게시물 승인 및 캠페인 현황 관리</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "전체 참여", value: posts.length, icon: "👥", color: "#E3F2FD" },
                { label: "승인 완료", value: posts.filter(p => p.certified).length, icon: "✅", color: "#E8F5E9" },
                { label: "승인 대기", value: posts.filter(p => !p.certified).length, icon: "⏳", color: "#FFF3E0" },
                { label: "달성률", value: `${progress}%`, icon: "🎯", color: "#F3E5F5" },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: "16px", background: s.color }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1A2E" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["전체", "승인대기", "승인완료"].map(f => (<button key={f} className={`filter-btn ${adminFilter === f ? "active" : ""}`} onClick={() => setAdminFilter(f)}>{f}</button>))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {adminPosts.map(post => (
                <div key={post.id} className="card" style={{ padding: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <img src={post.image} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{post.name}</span>
                      <span style={{ fontSize: 12, color: "#999" }}>{post.dept}</span>
                      <span className={`tag ${post.certified ? "tag-certified" : "tag-pending"}`} style={{ marginLeft: "auto" }}>{post.certified ? "✓ 승인됨" : "⏳ 대기"}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#666", lineHeight: 1.5, marginBottom: 10 }}>{post.caption}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      {!post.certified && <button className="btn-primary" style={{ padding: "7px 16px", fontSize: 12 }} onClick={() => handleApprove(post.id)}>✓ 승인</button>}
                      <button onClick={() => handleDelete(post.id)} style={{ background: "#FF5252", color: "white", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🗑 삭제</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{ marginTop: 24, padding: 24, border: "2px dashed #E0E0E0" }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>🔑 관리자 권한 이전</div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>캠페인 완료 후 기업 담당자에게 권한을 이전할 수 있습니다</div>
              <div style={{ display: "flex", gap: 10 }}>
                <input className="input" placeholder="이전할 담당자 이메일 또는 사번" style={{ flex: 1 }} />
                <button className="btn-outline">권한 이전</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #EBEBEB", padding: "10px 0", display: "flex", justifyContent: "center", gap: 8, zIndex: 100 }}>
        <button className={`nav-btn ${view === "feed" ? "active" : ""}`} onClick={() => setView("feed")}>🏠 피드</button>
        {loggedIn ? <button className={`nav-btn ${view === "upload" ? "active" : ""}`} onClick={() => setView("upload")}>📸 인증</button> : <button className="nav-btn" onClick={() => setView("login")}>🔑 로그인</button>}
        {isAdmin && <button className={`nav-btn ${view === "admin" ? "active" : ""}`} onClick={() => setView("admin")}>⚙️ 관리</button>}
      </div>
    </div>
  );
}
