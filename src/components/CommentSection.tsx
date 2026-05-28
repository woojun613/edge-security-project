// src/components/CommentSection.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface CommentType {
  id: number;
  news_id: number;
  user_id: string;
  user_email: string;
  content: string;
  created_at: string;
  comment_likes: { user_id: string }[]; // Supabase 관계형 조인 결과용
}

export default function CommentSection({ newsId }: { newsId: string }) {
  const [user, setUser] = useState<any>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // 1. 유저 세션 및 댓글 목록 불러오기
  const fetchCommentsAndUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);

    // 댓글을 가져오면서 해당 댓글에 눌린 좋아요 유저 목록까지 조인(Join)해서 가져옵니다.
    const { data } = await supabase
      .from("news_comments")
      .select("*, comment_likes(user_id)")
      .eq("news_id", newsId)
      .order("created_at", { ascending: true });

    setComments(data || []);
  };

  useEffect(() => {
    fetchCommentsAndUser();
  }, [newsId]);

  // 2. 댓글 등록
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("로그인이 필요한 서비스입니다.");
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from("news_comments")
      .insert([{
        news_id: newsId,
        user_id: user.id,
        user_email: user.email,
        content: newComment
      }]);

    if (error) alert(error.message);
    else {
      setNewComment("");
      fetchCommentsAndUser();
    }
  };

  // 3. 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    const { error } = await supabase
      .from("news_comments")
      .delete()
      .eq("id", commentId);

    if (error) alert("삭제 권한이 없습니다.");
    else fetchCommentsAndUser();
  };

  // 4. 댓글 수정 저장
  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim()) return;

    const { error } = await supabase
      .from("news_comments")
      .update({ content: editContent })
      .eq("id", commentId);

    if (error) alert("수정 권한이 없습니다.");
    else {
      setEditingId(null);
      fetchCommentsAndUser();
    }
  };

  // 5. 좋아요 토글 (누르기 / 취소하기)
  const handleToggleLike = async (comment: CommentType) => {
    if (!user) return alert("로그인 후 좋아요를 누를 수 있습니다.");

    const hasLiked = comment.comment_likes?.some(like => like.user_id === user.id);

    if (hasLiked) {
      // 이미 좋아요를 누른 상태 -> 좋아요 취소 (DELETE)
      await supabase
        .from("comment_likes")
        .delete()
        .eq("comment_id", comment.id)
        .eq("user_id", user.id);
    } else {
      // 좋아요 안 누른 상태 -> 좋아요 추가 (INSERT)
      await supabase
        .from("comment_likes")
        .insert([{ comment_id: comment.id, user_id: user.id }]);
    }

    fetchCommentsAndUser(); // 상태 갱신
  };

  return (
    <div className="mt-16 pt-8 border-t border-zinc-800">
      <h3 className="text-xl font-bold mb-6 text-zinc-100">댓글 ({comments.length})</h3>

      {/* ✍️ 댓글 작성창 */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-2">{user.email} 계정으로 로그인됨</div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="보안 권고안에 대한 의견이나 질문을 남겨주세요..."
              rows={3}
              className="w-full bg-transparent text-white placeholder-zinc-600 focus:outline-none resize-none text-sm leading-relaxed"
            />
            <div className="flex justify-end mt-2">
              <button type="submit" className="px-4 py-2 bg-[#C273FF] text-black font-bold text-xs rounded hover:bg-[#a855f7] transition">
                댓글 등록
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center text-sm text-zinc-500 mb-8">
          공지 사항에 댓글을 작성하려면 로그인이 필요합니다.
        </div>
      )}

      {/* 💬 댓글 리스트 */}
      <div className="space-y-4">
        {comments.map((comment) => {
          const likesCount = comment.comment_likes?.length || 0;
          const isLiked = comment.comment_likes?.some(like => like.user_id === user?.id);

          return (
            <div key={comment.id} className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-xl flex flex-col justify-between gap-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-zinc-400">{comment.user_email}</span>
                  <span className="text-[11px] text-zinc-600">{new Date(comment.created_at).toLocaleDateString('ko-KR')}</span>
                </div>

                {editingId === comment.id ? (
                  <div className="space-y-2 mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#C273FF]"
                      rows={2}
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">취소</button>
                      <button onClick={() => handleUpdateComment(comment.id)} className="px-3 py-1 bg-[#C273FF] text-black font-bold text-xs rounded">저장</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                )}
              </div>

              {/* 하단 제어 바 (좋아요 및 본인 인증 액션 버튼) */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-900">
                {/* ❤️ 좋아요 버튼 */}
                <button
                  onClick={() => handleToggleLike(comment)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition ${
                    isLiked 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                      : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300"
                  }`}
                >
                  <span>{isLiked ? "❤️" : "🤍"}</span>
                  <span>{likesCount}</span>
                </button>

                {/* 🛠️ 본인 댓글일 때만 노출되는 에디터 버튼 (UI Guard) */}
                {user && user.id === comment.user_id && editingId !== comment.id && (
                  <div className="flex gap-3 text-xs text-zinc-500">
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="hover:text-white transition"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="hover:text-red-400 transition"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}