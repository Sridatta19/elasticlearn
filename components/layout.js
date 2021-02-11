import Alert from "../components/alert";
import Footer from "../components/footer";
import Meta from "../components/meta";
import { useRouter } from "next/router";

export default function Layout({ preview, children }) {
  const router = useRouter();
  return (
    <>
      <Meta />
      <div className="antialiased min-h-screen">
        {/* <Alert preview={preview} /> */}
        <main>{children}</main>
      </div>
      {router.pathname !== "/" && <Footer />}
    </>
  );
}
