import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "../../components/container";
import PostBody from "../../components/post-body";
import Header from "../../components/header";
import PostHeader from "../../components/post-header";
import Layout from "../../components/layout";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import PostTitle from "../../components/post-title";
import Head from "next/head";
import Link from "next/link";
import markdownToHtml from "../../lib/markdownToHtml";

export default function Post({ post, preview, previousPost, nextPost }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | Elasticsearch Blog built with Next.js
                </title>
                <meta property="og:image" content={post.ogImage.url} />
                <link
                  rel="preload"
                  href="https://unpkg.com/prismjs@0.0.1/themes/prism-okaidia.css"
                  as="script"
                />
                <link
                  href={`https://unpkg.com/prismjs@0.0.1/themes/prism-okaidia.css`}
                  rel="stylesheet"
                />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
              />
              <PostBody content={post.content} />
              <div className="mt-3 max-w-3xl mx-auto flex justify-between prose prose-lg prose-pink">
                <div className="md:text-lg">
                  {previousPost && (
                    <Link
                      href={`/posts/${previousPost.slug}`}
                    >{`← ${previousPost.title}`}</Link>
                  )}
                </div>
                <div className="md:text-lg">
                  {nextPost && (
                    <Link
                      href={`/posts/${nextPost.slug}`}
                    >{`${nextPost.title} →`}</Link>
                  )}
                </div>
              </div>
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "content",
    "ogImage",
    "coverImage",
    "index",
  ]);
  const content = await markdownToHtml(post.content || "");
  const allPosts = getAllPosts(["title", "index", "slug"]);
  const previousPost = allPosts.find((p) => p.index === post.index - 1) || null;
  const nextPost = allPosts.find((p) => p.index === post.index + 1) || null;
  return {
    props: {
      post: {
        ...post,
        content,
      },
      previousPost,
      nextPost,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
