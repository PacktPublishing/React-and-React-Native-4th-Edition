import React from "react";
import { withRouter } from "react-router";

export default withRouter(function Echo({
  match: { params },
  location: { search }
}) {
  return <h1>{params.msg || new URLSearchParams(search).get("msg")}</h1>;
});
