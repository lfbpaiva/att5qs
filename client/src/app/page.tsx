"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import Button from "@/components/Button";
import { postsService } from "@/service/posts/posts";
import { Post } from "@/service/types";
import { useAuth } from "@/contexts/AuthContext";

interface DummyPost {
  id: number;
  title: string;
  body: string;
  reactions: {
    likes: number;
    dislikes: number;
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [dummyPosts, setDummyPosts] = useState<DummyPost[]>([]);
  const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth();

  useEffect(() => {
    fetch("https://dummyjson.com/posts?limit=5")
      .then((res) => res.json())
      .then((data) => setDummyPosts(data.posts))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoadingAuth) {
      loadPosts();
    }
  }, [page, isLoadingAuth, isAuthenticated]);

  async function loadPosts() {
    try {
      setIsLoadingPosts(true);
      setError(null);

      const POSTS_PER_PAGE = 10;

      const response = await postsService.getPosts({
        skip: page * POSTS_PER_PAGE,
        limit: POSTS_PER_PAGE,
        userId: user?.id,
      });

      if (page === 0) {
        setPosts(response.posts);
      } else {
        setPosts((prev) => [...prev, ...response.posts]);
      }

      setHasMore(response.posts.length === POSTS_PER_PAGE);
    } catch {
      setError("Erro ao carregar posts. Tente novamente mais tarde.");
    } finally {
      setIsLoadingPosts(false);
    }
  }

  async function handleLike(postId: number) {
    if (!user) {
      alert("Você precisa estar autenticado para curtir posts!");
      return;
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, liked: !post.liked } : post
      )
    );

    try {
      await postsService.toggleLikePost({ postId, userId: user.id });
    } catch {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, liked: !post.liked } : post
        )
      );
      alert("Erro ao curtir post. Tente novamente.");
    }
  }

  function handleLoadMore() {
    setPage((prev) => prev + 1);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Header />

      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            color: "var(--foreground)",
          }}
        >
          Feed de Posts
        </h1>

        {error && (
          <div
            style={{
              background: "var(--error)",
              color: "white",
              padding: "1rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {isLoadingAuth || (isLoadingPosts && page === 0) ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--foreground)",
            }}
          >
            Carregando posts...
          </div>
        ) : (
          <>
            <div>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isAuthenticated={isAuthenticated}
                  onLike={handleLike}
                />
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Button
                  onClick={handleLoadMore}
                  isLoading={isLoadingPosts}
                  style={{ padding: "0.75rem 2rem" }}
                >
                  Carregar mais
                </Button>
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "2rem",
                  color: "var(--foreground)",
                  opacity: 0.7,
                }}
              >
                Você chegou ao fim dos posts!
              </p>
            )}
          </>
        )}

        {!isLoadingAuth && !isLoadingPosts && posts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--foreground)",
              opacity: 0.7,
            }}
          >
            <p style={{ fontSize: "1.125rem" }}>Nenhum post encontrado.</p>
          </div>
        )}

        {dummyPosts.length > 0 && (
          <div style={{ marginTop: "3rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "var(--foreground)",
              }}
            >
              Posts em Destaque
            </h2>
            {dummyPosts.map((dPost) => (
              <div
                key={dPost.id}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    color: "var(--foreground)",
                  }}
                >
                  {dPost.title}
                </h3>
                <p
                  style={{
                    color: "var(--foreground)",
                    opacity: 0.85,
                    lineHeight: "1.6",
                    marginBottom: "1rem",
                  }}
                >
                  {dPost.body}
                </p>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
                    👍 {dPost.reactions.likes} curtidas
                  </span>
                  <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
                    👎 {dPost.reactions.dislikes} descurtidas
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
