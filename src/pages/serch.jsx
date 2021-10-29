import { React, useState } from 'react'
import { Link } from "react-router-dom";
import useReactRouter from 'use-react-router';

import { Button } from '@mui/material';
import { TextField } from '@mui/material';

import './stylesheet.css'

const Serch = ({History}) => {
  const [acceptFile, setAcceptFile] = useState();
  const { history, state } = useReactRouter();

  const handleClick = () => {
    history.push({pathname:'/result',state:{acceptFilePath: acceptFile}})
  }


  return (
    <div className="main">
      <h1>探す</h1>
      {/* <TextField 
        id="filled-basic" 
        label="Filled" 
        variant="filled" 
        label="入力アセットを選択"
        /> */}
      <p>入力アセットを選択</p>
      <Button
        id="serch_file-select"
        component="label"
        variant="contained"
        style={{ color: "#FFFFFF", backgroundColor: "#5500BB" }}
      >
        ファイルを選択
        <input
          type="file"
          accept="audio/*"
          className="inputFileBtnHide"
          onChange={(e)=>{setAcceptFile(e.target.files[0].path)}}//pathをつけるとファイルのパスが取得できる（electronの機能）
        />
      </Button>
        <Button 
          id="serch_serch-button"
          variant="contained"
          onClick={() => handleClick()}
          style={{ color: "#FFFFFF", backgroundColor: "#5500BB", width: 120 }}
        >探す</Button>
        {acceptFile && <p>{acceptFile}</p>}
      {/* <Link to="/">設定ページへ</Link><br/> */}
      {/* //パラメータを渡す事もできます。 */}
      {/* <Link to="/pageb?sort=name">リンクテキスト</Link> */}
    </div>
  )
}

export default Serch