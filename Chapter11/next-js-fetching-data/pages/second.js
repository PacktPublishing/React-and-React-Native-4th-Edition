import Layout from "../components/MyLayout.js";
import { fetchSecondItems } from "../api";

export default function Second({ items }) {
  return (
    <Layout>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </Layout>
  );
}

Second.getInitialProps = async () => {
  const res = await fetchSecondItems();
  const items = await res.json();

  return { items };
};
