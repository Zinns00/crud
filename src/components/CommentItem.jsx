// src/components/CommentItem.jsx
import React from 'react';

function CommentItem({
    comment,
    currentUser,
    anonymousToken,
    isEditing,
    editingText,
    onEditingTextChange,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onDelete
}) {
    // 수정/삭제 권한 확인 로직
    const isAuthor =
        // 1. 로그인 사용자가 자기 댓글을 수정/삭제할 때
        (currentUser && currentUser.user_metadata?.username === comment.author) ||
        // 2. 익명 사용자가 '익명' 댓글을 수정/삭제할 때 (토큰 일치 확인)
        (!currentUser && comment.author === "익명" && anonymousToken && comment.edit_token === anonymousToken);

    return (
        <li style={{ background: "#f9f9f9", padding: "10px", marginBottom: "5px", borderRadius: "5px" }}>
            {isEditing ? (
                // 수정 모드 UI
                <div>
                    <input
                        type="text"
                        value={editingText}
                        onChange={(e) => onEditingTextChange(e.target.value)}
                        style={{ width: "80%", padding: "5px" }}
                    />
                    <button onClick={() => onSaveEdit(comment.id)} style={{ marginLeft: "5px" }}>저장</button>
                    <button onClick={onCancelEdit} style={{ marginLeft: "5px" }}>취소</button>
                </div>
            ) : (
                // 읽기 모드 UI
                <div>
                    <strong>{comment.author}</strong>: {comment.content}
                    <span style={{ fontSize: "12px", color: "#888", marginLeft: "10px" }}>
                        {new Date(comment.created_at).toLocaleString()}
                    </span>

                    {/* 작성자 본인일 경우에만 수정/삭제 버튼 표시 */}
                    {isAuthor && (
                        <div style={{ float: "right" }}>
                            <button
                                onClick={() => onStartEdit(comment)}
                                style={{ marginRight: "5px", border: "none", background: "transparent", color: "blue", cursor: "pointer" }}
                            >
                                수정
                            </button>
                            <button
                                onClick={() => onDelete(comment.id)}
                                style={{ border: "none", background: "transparent", color: "red", cursor: "pointer" }}
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>
            )}
        </li>
    );
}

export default CommentItem;