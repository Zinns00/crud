// src/pages/PostEdit.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/supabase";

function PostEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPost = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('post')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                alert("Could not fetch post information or you do not have permission to edit it.");
                navigate("/");
                return;
            }

            // 수정 권한 확인 로직
            // user_id 컬럼이 없으므로 author 이름으로만 체크합니다.
            // data.author_id는 더 이상 존재하지 않습니다.
            const isAuthor = user && (data.author === user.user_metadata?.username);
            const anonymousToken = localStorage.getItem('anonymousUserToken');
            const isAnonymousPost = !user && data.author === "익명" && anonymousToken && data.edit_token === anonymousToken;

            if (!isAuthor && !isAnonymousPost) {
                alert("You are not authorized to edit this post.");
                navigate(`/post/${id}`);
                return;
            }

            setTitle(data.title);
            setContent(data.content);
            setLoading(false);
        };

        getPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { error } = await supabase
            .from('post')
            .update({
                title: title,
                content: content,
            })
            .eq('id', id);

        if (error) {
            console.log("Edit error:", error);
            alert("Failed to update post.");
        } else {
            alert("Post updated successfully!");
            navigate(`/post/${id}`);
        }
    };

    const inputStyle = "w-full p-3 bg-white border-4 border-text-dark rounded-none font-body focus:outline-none focus:ring-2 focus:ring-pin-blue";
    const textareaStyle = `${inputStyle} h-60 resize-none`;

    if (loading) {
        return <WoodBackground><div className="text-white font-heading text-2xl text-center p-8">Loading Editor...</div></WoodBackground>;
    }

    return (
        <WoodBackground>
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative w-full max-w-2xl bg-note-pink p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.8)] transform rotate-1">
                    <div className="absolute w-6 h-6 rounded-full shadow-md bg-pin-blue top-4 left-4"></div>
                    <h1 className="font-heading text-4xl text-center mb-6 text-text-dark">
                        Edit Post
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="font-heading text-lg text-text-dark block mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={inputStyle}
                            />
                        </div>

                        <div>
                            <label className="font-heading text-lg text-text-dark block mb-2">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className={textareaStyle}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <RetroButton type="submit" className="bg-note-blue">Save Changes</RetroButton>
                            <RetroButton type="button" onClick={() => navigate(-1)} className="bg-gray-400">
                                Cancel
                            </RetroButton>
                        </div>
                    </form>
                </div>
            </div>
        </WoodBackground>
    );
}

export default PostEdit;