import React from 'react'
import { Link } from "react-router-dom";

const Setting = () => {
  const { addon } = require("bindings")("Visualize_Sounds_Core_addon");
  console.log(addon)
  console.log(addon.RegisterSource)
  const r = addon.RegisterSource("", "", "");
  r.then((resp) => {
    const data = resp
    console.log(data)
  });
  return (
    <div>
      <p>設定ページです</p>
      <Link to="/serch">検索ページへ</Link><br/>
      <Link to="/result">結果ページへ</Link><br/>
      {/* //パラメータを渡す事もできます。 */}
      {/* <Link to="/pageb?sort=name">リンクテキスト</Link> */}
      
    </div>

  )
}

export default Setting