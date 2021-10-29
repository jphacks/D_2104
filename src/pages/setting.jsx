import React from 'react'
import { Link } from "react-router-dom";
import { Button } from '@mui/material';
import './stylesheet.css'
import { flexbox } from '@mui/system';
// import RegisterSource from'/tests/addonTests.js'

const addon = window.require("bindings")("Visualize_Sounds_Core_addon");

const Setting = () => {

  // function showFolderName(file) {

  //   const preview = document.getElementById('folderName');
  //   const reader = new FileReader();

  //   reader.onload = function (e) {
  //     const nameUrl = e.target.result;
  //     const name = document.createElement("name");
  //     preview.appendChild(name);
  //   }
  //   reader.readAsDataURL(file);
  // }

//<input>でフォルダが選択された時の処理
  // const folderInput = document.getElementById('folderInput');
  // const handleFolderselect = () => {
  //   const folders = folderInput.files;

  //   for (let i=0;i<folders.length;i++) {
  //     console.log(files[i]);
  //   }
  // }
  // folderInput.assEventListener('change', handleFolderselect)

  // document.getElementById("filepicker").addEventListener("change", function(event) {
  //   let output = document.getElementById("listing");
  //   let files = event.target.files;

  //   for (let i=0; i<files.length; i++) {
  //     let item = document.createElement("li");
  //     item.innerHTML = files[i].webkitRelativePath;
  //     output.appendChild(item);
  //   };
  // }, false);


//フォルダが選択されたときの状態管理
  const [folderName, setFolderName] = React.useState('');
  const folderHandleChange = e => {
    // setFolderName(e.target.value)
    console.log(e.target);
  }

//オプションが入力された時の状態管理
  const [formatName, setFormatName] = React.useState('');
  const formatHandleChange = e => setFormatName(e.target.value); 

  const handleClick = () => {
    console.log(addon);
    console.log(addon.RegisterSourceMock);
    const r = addon.RegisterSourceMock("", "", "");
    console.log(r);
    r.then((resp) => {
      const data = resp
      console.log(data)
      });
  };



  return (
    <div className="main">
      <h1>設定</h1>

      <form style={{ color: "#fff" }}/*className="chooseDirectory"*/ action='#' method='post' encType="multipart/form-data">
        <p>登録するディレクトリ</p>
        <div className={{ display:"flex" }}>
          <Button
            component="label"
            variant="contained"
            style={{ color: "#FFFFFF", backgroundColor: "#5500BB" }}
          >
            フォルダを選択
            <input
              type="file"
              id="filepicker"
              className="inputFileBtnHide"
              webkitdirectory="" directory="" multiple
              value={folderName}
              onChange={(e)=>{
                console.log("aaaaaaa");
                folderHandleChange(e)}}/>
          </Button>
          <ul　id="listing" style={{ color:"#fff" }}></ul>
        </div>
      </form>
      <div style={{ color: "#fff" }}/*className="option"*/>
        <p>登録オプション</p>
        <p>ファイル名条件(正規表現)</p>
        <input type="text" value={formatName} onChange={formatHandleChange}/>
        <p>例：*mp3</p>
      </div>

      <Button
        component="label"
        variant="contained"
        style={{ color: "#fff" , backgroundColor: "#5500bb" }}
        onClick={() => {handleClick()}}
      >登録</Button><br/>

      <Link to="/serch">検索ページへ</Link><br/>
      <Link to="/result">結果ページへ</Link><br/>
      {/* //パラメータを渡す事もできます。 */}
      {/* <Link to="/pageb?sort=name">リンクテキスト</Link> */}

    </div>

  )
}

export default Setting