import Container from "./container";

export default function Footer() {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <Container>
        <div className="lg:px-12 py-8 flex flex-col lg:flex-row lg:justify-center items-center">
          <div>
            Made with ❤️ by
            <a
              href="https://github.com/Sridatta19/elasticlearn"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 font-medium underline"
            >
              Sridatta
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
