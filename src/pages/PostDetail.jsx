// src/pages/PostDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { getOrSetAnonymousToken } from "./token"; // 토큰 유틸리티 import
import CommentItem from "@/components/CommentItem"; // CommentItem 컴포넌트 import

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // 댓글 관련 상태 추가
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    const [anonymousToken, setAnonymousToken] = useState(null);
    // 댓글 '수정' 관련 상태 추가
    const [editingId, setEditingId] = useState(null); // 현재 수정 중인 댓글의 id
    const [editingText, setEditingText] = useState(""); // 수정 중인 댓글의 내용

    useEffect(() => {
        // 현재 로그인한 사용자 정보 가져오기
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            // 익명 사용자의 경우, 로컬 스토리지에서 토큰을 가져옵니다.
            if (!user) {
                setAnonymousToken(localStorage.getItem('anonymousUserToken'));
            }

            // 게시글과 댓글 정보를 동시에 가져옵니다.
            const [postData, commentsData] = await Promise.all([
                getPost(),
                getComments()
            ]);

            if (postData) setPost(postData);
            if (commentsData) setComments(commentsData);

            setLoading(false); // 모든 데이터 로딩 완료 후 로딩 상태 변경
        };
        fetchData();
    }, [id]); // id가 바뀔 때마다 데이터를 다시 불러옵니다.

    // 게시글 가져오기
    async function getPost() { // 데이터를 반환하도록 수정
        const { data, error } = await supabase
            .from('post')
            .select('*')
            .eq('id', id)
            .single();

        return data;
    }

    // 게시글 삭제 기능
    async function handleDelete() {
        const confirmDelete = window.confirm("진짜로 삭제하시겠습니까?");
        if (!confirmDelete) return;

        const { error } = await supabase
            .from('post')
            .delete()
            .eq('id', id);

        if (error) {
            alert("삭제 중 오류가 발생했습니다: " + error.message);
        } else {
            alert("삭제되었습니다.");
            navigate("/");
        }
    }

    function goEditPage() {
        navigate(`/edit/${id}`);
    }

    // 댓글 가져오기 (현재 게시글에 해당하는 댓글만)
    async function getComments() {
        const { data, error } = await supabase
            .from('comment') // comment 테이블에서
            .select('*')
            .eq('post_id', id) // post_id가 현재 글 번호(id)랑 같은 것만 가져와!
            .order('created_at', { ascending: true }); // 과거순 정렬

        return data;
    }

    // 댓글 작성하기
    async function handleCommentSubmit() {
        if (!newComment) return;
        // 로그인 상태에 따라 작성자 이름을 설정합니다.
        const authorName = currentUser ? currentUser.user_metadata?.username : "익명";

        const commentData = {
            content: newComment,
            author: authorName,
            post_id: id
        };

        // 익명 댓글일 경우, 수정 토큰을 추가합니다.
        if (!currentUser) {
            commentData.edit_token = getOrSetAnonymousToken();
        }

        const { error } = await supabase
            .from('comment')
            .insert([commentData]);

        if (error) {
            alert("댓글 작성 실패!");
        } else {
            setNewComment(""); // 입력창 비우기
            getComments().then(data => setComments(data)); // 댓글 목록 새로고침
        }
    }

    // 댓글 삭제하기 (CommentItem으로 전달)
    async function deleteComment(commentId) {
        if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
            const { error } = await supabase
                .from('comment')
                .delete()
                .eq('id', commentId);

            if (error) {
                alert("댓글 삭제에 실패했습니다: " + error.message);
            } else {
                alert("댓글이 삭제되었습니다.");
                getComments().then(data => setComments(data)); // 댓글 목록 새로고침
            }
        }
    }

    // 댓글 수정 시작 (수정 모드로 전환)
    function startEditing(comment) {
        setEditingId(comment.id);
        setEditingText(comment.content);
    }

    // 댓글 수정 취소
    function cancelEditing() {
        setEditingId(null);
        setEditingText("");
    }

    // 수정된 댓글 저장하기 (CommentItem으로 전달)
    async function saveEditedComment(commentId) {
        if (!editingText) {
            alert("내용을 입력해주세요.");
            return;
        }

        const { error } = await supabase
            .from('comment')
            .update({ content: editingText })
            .eq('id', commentId);

        if (error) {
            alert("댓글 수정에 실패했습니다: " + error.message);
        } else {
            alert("댓글이 수정되었습니다.");
            cancelEditing(); // 수정 모드 종료
            getComments().then(data => setComments(data)); // 댓글 목록 새로고침
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

            {/*
              수정/삭제 버튼 표시 조건:
              1. 로그인한 사용자가 자기 게시글을 볼 때
              2. 로그인하지 않은 사용자가 '익명' 게시글을 볼 때 (토큰 일치 확인)
            */}
            {((currentUser && currentUser.user_metadata?.username === post.author) ||
                (!currentUser && post.author === "익명" && anonymousToken && post.edit_token === anonymousToken)) && (
                    <>
                        {/* 수정 버튼 */}
                        <button
                            onClick={goEditPage}
                            style={{ marginLeft: "10px", background: "orange", color: "white", border: "none", padding: "5px 10px" }}
                        >
                            수정
                        </button>
                        {/* 삭제 버튼 */}
                        <button
                            onClick={handleDelete}
                            style={{ marginLeft: "10px", background: "red", color: "white", border: "none", padding: "5px 10px" }}
                        >
                            삭제
                        </button>
                    </>
                )}

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
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            anonymousToken={anonymousToken}
                            isEditing={editingId === comment.id}
                            editingText={editingText}
                            onEditingTextChange={setEditingText}
                            onStartEdit={startEditing}
                            onCancelEdit={cancelEditing}
                            onSaveEdit={saveEditedComment}
                            onDelete={deleteComment}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PostDetail;