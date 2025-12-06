// src/pages/PostEdit.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useParams 추가
import { supabase } from "../supabase";

function PostEdit() {
    const { id } = useParams(); // URL에서 수정할 글 번호 가져오기
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 1. 기존 데이터 불러오기 (화면 켜지자마자 실행)
    useEffect(() => {
        getPost();
    }, []);

    async function getPost() {
        const { data, error } = await supabase
            .from('post')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            alert("글 정보를 불러오지 못했습니다.");
            navigate("/"); // 실패하면 목록으로 쫓아냄
        } else {
            // 가져온 데이터를 입력창 상태(State)에 넣어줌 -> 화면에 글자가 채워짐
            setTitle(data.title);
            setContent(data.content);
        }
    }

    // 2. 수정된 내용 저장하기 (Update)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { error } = await supabase
            .from('post') // 테이블 이름 'post'
            .update({ // ★ insert 대신 update 사용!
                title: title,
                content: content,
            })
            .eq('id', id); // ★ 중요: "이 번호(id)를 가진 글만" 수정해라!

        if (error) {
            console.log("수정 에러:", error);
            alert("글 수정에 실패했습니다.");
        } else {
            alert("수정되었습니다!");
            navigate(`/post/${id}`); // 수정 끝나면 다시 상세 페이지로 이동
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>글 수정하기</h1>
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

                <button type="submit">수정 완료</button>
                <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: "10px" }}>
                    취소
                </button>
            </form>
        </div>
    );
}

export default PostEdit;