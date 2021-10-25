const {Link} = ReactRouterDOM;

export const Result = (props) => {
  return (
    <div>
      <p>結果ページです</p>
      <Link to="/search">検索ページへ</Link><br/>
      <Link to="/">設定ページへ</Link><br/>
      {/* //パラメータを渡す事もできます。 */}
      {/* <Link to="/pageb?sort=name">リンクテキスト</Link> */}
    </div>
     
  )
}