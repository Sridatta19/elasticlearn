import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import Container from "../components/container";
import DashboardTile from "../components/dashboard-tile";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Elasticlearn</title>
      </Head>
      <Container>
        <div className="my-6 flex flex-col space-y-12 items-center">
          <h1 className="m-0 text-6xl md:text-7xl text-center">
            Learn{" "}
            <a
              className="text-blue-600 hover:underline"
              href="https://www.elastic.co/guide/index.html"
            >
              Elasticsearch!
            </a>
          </h1>
          <DashboardTile
            href="blog"
            title="Blog"
            description="Find information about Elasticsearch features and API"
          />
          <a
            className={`w-full max-w-xl md:w-snug p-6 text-left text-gray-400 border border-gray-300 rounded-xl transition-colors`}
          >
            <h3 className="mb-4 text-2xl sm:text-3xl">Demo &rarr;</h3>
            <span className="m-0 text-sm sm:text-lg leading-normal">
              Explore the deployed example Elasticsearch project
            </span>
            <span className="ml-2 leading-normal text-xs sm:text-sm">
              (In Progress...)
            </span>
          </a>
          {/* <DashboardTile
            href="demo"
            title="Demo"
            description=""
          /> */}
        </div>
      </Container>
    </Layout>
  );
}
