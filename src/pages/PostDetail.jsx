// src/pages/PostDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // 댓글 관련 상태 추가
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        getPost();
        getComments(); // 게시글 불러올 때 댓글도 같이 불러옴
    }, []);

    // 1. 게시글 가져오기
    async function getPost() {
        const { data, error } = await supabase
            .from('post')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.log("게시글 에러:", error);
        } else {
            setPost(data);
        }
        setLoading(false);
    }

    // ★ 1. 삭제 기능 함수 추가
    async function handleDelete() {
        const confirmDelete = window.confirm("진짜로 삭제하시겠습니까?");
        if (!confirmDelete) return;

        const { error } = await supabase
            .from('post') // 테이블 이름 'post' 확인
            .delete()
            .eq('id', id); // 현재 보고 있는 글 번호(id)를 삭제

        if (error) {
            alert("삭제 실패!");
        } else {
            alert("삭제되었습니다.");
            navigate("/"); // 삭제 후 목록으로 이동
        }
    }

    function goEditPage() {
        navigate(`/edit/${id}`);
    }

    if (loading) return <div>로딩 중...</div>;

    // 2. 댓글 가져오기 (이 글에 달린 것만!)
    async function getComments() {
        const { data, error } = await supabase
            .from('comment') // comment 테이블에서
            .select('*')
            .eq('post_id', id) // post_id가 현재 글 번호(id)랑 같은 것만 가져와!
            .order('created_at', { ascending: true }); // 과거순 정렬

        if (!error) {
            setComments(data);
        }
    }

    // 3. 댓글 작성하기
    async function handleCommentSubmit() {
        if (!newComment) return;

        const { error } = await supabase
            .from('comment')
            .insert({
                content: newComment,
                author: "익명",
                post_id: id // ★ 중요: 현재 보고 있는 글 번호를 같이 저장
            });

        if (error) {
            alert("댓글 작성 실패!");
        } else {
            setNewComment(""); // 입력창 비우기
            getComments(); // 댓글 목록 새로고침
        }
    }

    if (loading) return <div style={{ padding: "20px" }}>로딩 중...</div>;
    if (!post) return <div style={{ padding: "20px" }}>글을 찾을 수 없습니다.</div>;

    return (
        <div style={{ padding: "20px" }}>
            {/* --- 게시글 영역 --- */}
            <h1>{post.title}</h1>
            <p>작성자: {post.author} | {new Date(post.created_at).toLocaleDateString()}</p>
            <hr />
            <div style={{ padding: "20px 0", minHeight: "100px", whiteSpace: "pre-wrap" }}>
                {post.content}
            </div>
            <button onClick={() => navigate("/")}>목록으로</button>

            {/* ★ 3. 수정/삭제 버튼 추가 */}
            <button
                onClick={goEditPage}
                style={{ marginLeft: "10px", background: "orange", color: "white", border: "none", padding: "5px 10px" }}
            >
                수정
            </button>

            <button
                onClick={handleDelete}
                style={{ marginLeft: "10px", background: "red", color: "white", border: "none", padding: "5px 10px" }}
            >
                삭제
            </button>

            {/* --- 댓글 영역 (새로 추가됨) --- */}
            <div style={{ marginTop: "50px", borderTop: "2px solid #eee", paddingTop: "20px" }}>
                <h3>댓글 ({comments.length})</h3>

                {/* 댓글 입력창 */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="댓글을 입력하세요..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{ flex: 1, padding: "10px" }}
                    />
                    <button onClick={handleCommentSubmit}>등록</button>
                </div>

                {/* 댓글 목록 */}
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {comments.map((comment) => (
                        <li key={comment.id} style={{ background: "#f9f9f9", padding: "10px", marginBottom: "5px", borderRadius: "5px" }}>
                            <strong>{comment.author}</strong>: {comment.content}
                            <span style={{ fontSize: "12px", color: "#888", marginLeft: "10px" }}>
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PostDetail;