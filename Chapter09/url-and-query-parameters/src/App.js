import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function App({ children }) {
  return <section>{children}</section>;
}

App.propTypes = {
  children: PropTypes.node.isRequired
};

const param = "From Param";
const query = new URLSearchParams({ msg: "From Query" });

App.defaultProps = {
  children: (
    <section>
      <p>
        <Link to={`echo/${param}`}>Echo param</Link>
      </p>
      <p>
        <Link to={`echo?${query.toString()}`} query={query}>
          Echo query
        </Link>
      </p>
    </section>
  )
};
