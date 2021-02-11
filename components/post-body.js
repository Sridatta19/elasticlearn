export default function PostBody({ content }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div
        className="prose prose-lg prose-pink"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
