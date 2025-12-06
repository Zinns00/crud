// src/pages/PostWrite.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; // 연결 도구 불러오기

function PostWrite() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => { // async 붙이기!
        e.preventDefault();

        if (!title || !content) {
            alert("제목과 내용을 모두 입력해주세요!");
            return;
        }

        // ★ Supabase에 데이터 넣기
        const { error } = await supabase
            .from('post')
            .insert([
                { title: title, content: content, author: "익명" } // author는 일단 "익명"으로 고정
            ]);

        if (error) {
            console.log("글쓰기 에러:", error);
            alert("글 저장에 실패했습니다.");
        } else {
            alert("글이 작성되었습니다!");
            navigate("/");
        }
    };

    // ... (return 부분은 그대로 두셔도 됩니다) ...
    return (
        // ... 기존 코드와 동일 ...
        <div style={{ padding: "20px" }}>
            <h1>글쓰기</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>제목: </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", padding: "5px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>내용: </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: "100%", height: "200px", padding: "5px" }}
                    />
                </div>

                <button type="submit">작성 완료</button>
                <button type="button" onClick={() => navigate("/")} style={{ marginLeft: "10px" }}>
                    취소
                </button>
            </form>
        </div>
    );
}

export default PostWrite;