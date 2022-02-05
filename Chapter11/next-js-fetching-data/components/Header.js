import Link from "next/link";

const linkStyle = {
  marginRight: 15
};

export default function Header() {
  return (
    <div>
      <Link href="/">
        <a style={linkStyle}>Home</a>
      </Link>
      <Link href="/first">
        <a style={linkStyle}>First</a>
      </Link>
      <Link href="/second">
        <a style={linkStyle}>Second</a>
      </Link>
    </div>
  );
}
