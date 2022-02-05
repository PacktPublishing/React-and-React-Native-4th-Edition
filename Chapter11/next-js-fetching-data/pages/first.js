import Layout from "../components/MyLayout.js";
import { fetchFirstItems } from "../api";

export default function First({ items }) {
  return (
    <Layout>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </Layout>
  );
}

First.getInitialProps = async () => {
  const res = await fetchFirstItems();
  const items = await res.json();

  return { items };
};
