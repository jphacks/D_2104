// main.js

// Routingがネイティブだとメモリ上で管理する。
// https://reactrouter.com/web/api/MemoryRouter
const {MemoryRouter, Route, Switch, Link, BrowserHistory} = ReactRouterDOM;
const {useState} = React;
console.log(window)

const Setting = () => {

  return (
    <div>
      <p>設定ページです</p>
      <Link to="/search">検索ページへ</Link><br/>
      <Link to="/result">結果ページへ</Link><br/>
      {/* //パラメータを渡す事もできます。 */}
      {/* <Link to="/pageb?sort=name">リンクテキスト</Link> */}
    </div>

  )
}

const Result = (props) => {
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

const Search = ({History}) => {
  const [acceptFile, setAcceptFile] = useState();
  // const { history, state } = useReactRouter();

  const handleClick = () => {
    // history.push({pathname:'/result',state:{acceptFile: acceptFile}})
  }

  return (
    <div>
      <h1>探す</h1>
      <p>入力アセット</p>
      <input 
        type="file"
        accept="audio/*"
        onChange={(e)=>{
          setAcceptFile(e.target.value)
        }}
        />
        <button
          onClick={() => handleClick()}
        >探す</button>
      <Link to="/">設定ページへ</Link><br/>
      {/* //パラメータを渡す事もできます。 */}
      {/* <Link to="/pageb?sort=name">リンクテキスト</Link> */}
    </div>
  )
}

ReactDOM.render((
  <div>
    <MemoryRouter>

    <Switch>
      <Route exact path="/" component={Setting} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/result" component={Result} />

    </Switch>

    </MemoryRouter>
    </div>
  ), document.getElementById('content')
);