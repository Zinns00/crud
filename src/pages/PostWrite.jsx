// src/pages/PostWrite.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase";
import { getOrSetAnonymousToken } from "./token";

function PostWrite() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            // 로그인 상태와 관계없이 사용자 정보를 state에 저장합니다. (로그아웃 상태면 null)
            setUser(user);
        };
        checkUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            alert("Please fill in both the title and content!");
            return;
        }

        // user 상태에 따라 작성자 이름을 '익명' 또는 사용자의 닉네임으로 설정합니다.
        const authorName = user ? (user.user_metadata?.username || user.email.split("@")[0]) : "익명";

        const postData = {
            title: title,
            content: content,
            author: authorName,
        };

        // 익명 사용자일 경우, 수정 토큰을 추가합니다.
        if (!user) {
            postData.edit_token = getOrSetAnonymousToken();
        }

        const { error } = await supabase
            .from('post')
            .insert([postData]);

        if (error) {
            console.log("Write error:", error);
            alert("Failed to save the post.");
        } else {
            alert("Post created successfully!");
            navigate("/");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>글쓰기</h1>
            <form onSubmit={handleSubmit}>
                {/* 제목 입력 */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>제목</label>
                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #ddd", borderRadius: "5px" }}
                    />
                </div>

                {/* 내용 입력 */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>내용</label>
                    <textarea
                        placeholder="내용을 자유롭게 적어주세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: "100%", height: "300px", padding: "10px", fontSize: "16px", border: "1px solid #ddd", borderRadius: "5px", resize: "none" }}
                    />
                </div>

                {/* 버튼 영역 */}
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        type="submit"
                        style={{ padding: "10px 20px", background: "blue", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}
                    >
                        작성 완료
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        style={{ padding: "10px 20px", background: "#ccc", color: "black", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostWrite;