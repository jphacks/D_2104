import React from 'react'
import { Link } from "react-router-dom";

const Setting = () => {

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