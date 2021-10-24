import React from 'react'
import { Link } from "react-router-dom";

const Serch = () => {

  return (
      <div>
      <p>検索ページです</p>
      <Link to="/result">結果ページへ</Link><br/>
      <Link to="/">設定ページへ</Link><br/>
      {/* //パラメータを渡す事もできます。 */}
      {/* <Link to="/pageb?sort=name">リンクテキスト</Link> */}
    </div>
  )
}

export default Serch