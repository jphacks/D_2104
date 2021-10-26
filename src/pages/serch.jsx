import { React, useState } from 'react'
import { Link } from "react-router-dom";
import useReactRouter from 'use-react-router';

const Serch = ({History}) => {
  const [acceptFile, setAcceptFile] = useState();
  const { history, state } = useReactRouter();

  const handleClick = () => {
    history.push({pathname:'/result',state:{acceptFile: acceptFile}})
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

export default Serch