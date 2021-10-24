import React from 'react'
import { Link } from "react-router-dom";

const Result = () => {

  return (
    <div>
      <p>結果ページです</p>
      <Link to="/serch">検索ページへ</Link><br/>
      <Link to="/">設定ページへ</Link><br/>
      {/* //パラメータを渡す事もできます。 */}
      {/* <Link to="/pageb?sort=name">リンクテキスト</Link> */}
    </div>
     
  )
}

export default Result