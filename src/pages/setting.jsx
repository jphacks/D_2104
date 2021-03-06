import React from "react";
import { Button, Grid, Box } from "@mui/material";
import "./stylesheet.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import SuccessAlert from "../components/SuccessAlert"


const electron = window.require('electron');

const addon = window.require("bindings")("Visualize_Sounds_Core_addon");

const Setting = () => {
  //フォルダが選択されたときの状態管理
  const [folderName, setFolderName] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const folderHandleChange = (e) => {
    const filePath = e.target.files[0];
    const path = window.require('path')
    const folderPath = path.dirname(filePath.path)
    setFolderName(folderPath);
  };

  //オプションが入力された時の状態管理
  const [formatName, setFormatName] = React.useState("");
  const formatHandleChange = (e) => {
    console.log(e.target.value);
    setFormatName(e.target.value);
  };

  const handleClick = () => {
    // electron.ipcRenderer.invoke('get-user-data-path')
    //   .then(path=> {
    //     console.log(path)
        console.log(folderName)
        electron.ipcRenderer.invoke('get-register-source', folderName, formatName)
          .then((resp) => {
            console.log(resp)
            // resp.then(data => {
            //   console.log(data)
            // })
          })
      // })
  };

  return (
    <div className="main">
      <h1>設定</h1>

      <form
        style={{ color: "#fff" }}
        action="#"
        method="post"
        encType="multipart/form-data"
      >
        <h3>登録するディレクトリ</h3>
        <Grid container alignItems="center">
          <Grid item>
            <Button
              component="label"
              variant="contained"
              style={{ color: "#FFFFFF", backgroundColor: "#5500BB" }}
            >
              フォルダを選択
              <input
                type="file"
                id="filepicker"
                webkitdirectory=""
                style={{
                  opacity: "0",
                  appearance: "none",
                  position: "absolute",
                }}
                onChange={(e) => {
                  folderHandleChange(e);
                }}
              />
            </Button>
          </Grid>
          <Grid ml={2}>
            <p>{folderName}</p>
          </Grid>
        </Grid>
      </form>
      <div style={{ color: "#fff" }}>
        <Box my={3} mr={5}>
          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <TreeItem nodeId="1" label="登録オプション">
              <p>除外ファイル名条件(正規表現)</p>
              <input
                type="text"
                value={formatName}
                onChange={(e) => formatHandleChange(e)}
                style={{
                  width: "90%",
                  height: "2rem",
                  backgroundColor: "#37383F",
                  color: "#ffffff",
                }}
              />
              <p>例：*mp3</p>
            </TreeItem>
          </TreeView>
        </Box>
      </div>
      
      <Box style={{width: "50%"}}>
        <SuccessAlert severity="success" isOpen={isOpen} setIsOpen={setIsOpen} message="登録しました"></SuccessAlert>
      </Box>
      <Button
        component="label"
        variant="contained"
        style={{ color: "#fff", backgroundColor: "#5500bb" }}
        onClick={() => {
          handleClick();
        }}
      >
        登録
      </Button>
    </div>
  );
};

export default Setting;
