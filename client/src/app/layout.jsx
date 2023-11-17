import { Inter } from "next/font/google";
// import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rexhent Docs",
  description:
    "NextJS, React and Quill rich text editor, using a Postgresql database",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
