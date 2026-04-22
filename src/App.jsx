import { useState, useEffect } from "react";

const MOCK_POSTS = [
  {
    id: 1, name: "김민준", dept: "마케팅팀", avatar: "김",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop",
    caption: "오늘 팀원들과 함께 환경 캠페인에 참여했습니다! 작은 실천이 큰 변화를 만든다고 믿어요 🌱",
    likes: 24, time: "2시간 전", certified: true,
  },
  {
    id: 2, name: "이서연", dept: "인사팀", avatar: "이",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=400&fit=crop",
    caption: "ESG 실천 챌린지 3일차! 오늘도 텀블러 들고 출근 완료 ☕ 함께해요!",
    likes: 18, time: "4시간 전", certified: true,
  },
  {
    id: 3, name: "박도현", dept: "개발팀", avatar: "박",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop",
    caption: "개발팀 전원 참여 인증샷입니다. 우리 팀 파이팅! 💪",
    likes: 31, time: "6시간 전", certified: true,
  },
  {
    id: 4, name: "최유진", dept: "재무팀", avatar: "최",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop",
    caption: "처음 참여해보는데 생각보다 재밌네요! 앞으로도 꾸준히 하겠습니다 😊",
    likes: 12, time: "8시간 전", certified: false,
  },
  {
    id: 5, name: "정하은", dept: "영업팀", avatar: "정",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop",
    caption: "영업팀도 빠질 수 없죠! 고객과 함께 성장하는 캠페인에 적극 동참합니다 🙌",
    likes: 27, time: "1일 전", certified: true,
  },
  {
    id: 6, name: "강민서", dept: "기획팀", avatar: "강",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=400&fit=crop",
    caption: "기획팀 인증! 이번 캠페인 기획에 참여했던 사람으로서 더욱 뿌듯합니다 ✨",
    likes: 19, time: "1일 전", certified: true,
  },
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

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLike = (id) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); setPosts(p => p.map(post => post.id === id ? { ...post, likes: post.likes - 1 } : post)); }
      else { next.add(id); setPosts(p => p.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post)); }
      return next;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadForm(f => ({ ...f, image: file, preview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!uploadForm.name || !uploadForm.dept || !uploadForm.caption) { showToast("모든 항목을 입력해주세요", "error"); return; }
    const newPost = {
      id: Date.now(), name: uploadForm.name, dept: uploadForm.dept, avatar: uploadForm.name[0],
      image: uploadForm.preview || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop",
      caption: uploadForm.caption, likes: 0, time: "방금 전", certified: false,
    };
    setPosts(p => [newPost, ...p]);
    setUploadForm({ name: "", dept: "", caption: "", image: null, preview: null });
    setSubmitSuccess(true);
    setTimeout(() => { setSubmitSuccess(false); setView("feed"); }, 2000);
  };

  const handleLogin = () => {
    if (loginForm.id === "admin" && loginForm.pw === "1234") {
      setIsAdmin(true); setLoggedIn(true); setCurrentUser({ name: "관리자", role: "admin" });
      setView("admin"); showToast("관리자로 로그인되었습니다");
    } else if (loginForm.id && loginForm.pw) {
      setLoggedIn(true); setCurrentUser({ name: loginForm.id, role: "user" });
      setView("upload"); showToast("로그인 성공!");
    } else { showToast("아이디와 비밀번호를 입력해주세요", "error"); }
  };

  const handleApprove = (id) => {
