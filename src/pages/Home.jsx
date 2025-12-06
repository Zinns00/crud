// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

function Home() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1); // 현재 페이지 번호 (기본값 1)
    const POSTS_PER_PAGE = 5; // 한 페이지에 5개씩 보여주기 (테스트용)

    useEffect(() => {
        getPosts();
    }, [page]); // ★ page가 바뀔 때마다 실행됨!

    async function getPosts() {
        // 0부터 시작하므로 계산이 필요함
        // 1페이지: 0 ~ 4
        // 2페이지: 5 ~ 9
        const start = (page - 1) * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE - 1;

        const { data, error } = await supabase
            .from('post')
            .select('*')
            .order('created_at', { ascending: false }) // 최신순 정렬
            .range(start, end); // ★ 여기서 범위를 자릅니다!

        if (error) {
            console.log("에러:", error);
        } else {
            setPosts(data);
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>게시판 목록</h1>
            <Link to="/write">
                <button style={{ marginBottom: "20px" }}>새 글 쓰기</button>
            </Link>

            <ul>
                {posts.map((post) => (
                    <li key={post.id} style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
                        <Link to={`/post/${post.id}`}>
                            <h3 style={{ cursor: "pointer", color: "blue" }}>{post.title}</h3>
                        </Link>
                        <p>{post.author} | {new Date(post.created_at).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>

            {/* --- 페이징 버튼 영역 --- */}
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1} // 1페이지면 '이전' 버튼 비활성화
                >
                    &lt; 이전
                </button>

                <span style={{ lineHeight: "30px", fontWeight: "bold" }}> {page} 페이지 </span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={posts.length < POSTS_PER_PAGE} // 데이터가 꽉 안 찼으면 '다음'이 없다는 뜻
                >
                    다음 &gt;
                </button>
            </div>
        </div>
    );
}

export default Home;