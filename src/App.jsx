// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import PostWrite from "./pages/PostWrite";
import PostEdit from "./pages/PostEdit"; // 👈 추가 (아직 파일 없음 에러 날 수 있음)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/write" element={<PostWrite />} />

        {/* ★ 수정 페이지 라우트 추가 */}
        <Route path="/edit/:id" element={<PostEdit />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;