import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import vis from "vis";
import { parseFeature, reduceDimensions } from '../lib/nodesParser';
import { Button } from "@mui/material";
import { Grid } from "@mui/material";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider'

// 次元の範囲を決め打ち。
const MAX_DIMENSION = 200;

const addon = window.require("bindings")("Visualize_Sounds_Core_addon.node");

const ShowNodeData = ({ nodeData }) => {
  return (
    <div>{nodeData?.title}</div>
  )
};

const ShowInputPath = ({ inputPath }) => {
  return (
    <div>{inputPath}</div>
  )
};

const Result = props => {
  const [data, setData] = useState({ nodes: new vis.DataSet([]) });
  const [inputPath, setInputPath] = useState(props.location.state.acceptFilePath);

  const [clickedNode, setClickedNode] = useState(null);

  const player = window.require('node-wav-player');

  //一度だけ呼び出す
  const search = () => {
    const response = addon.FindSimilarAudioFromFileMock(inputPath);

    response.then((nodes) => {
      const nodesFeatures = nodes.map((datum) => {
        return parseFeature(datum.feature, MAX_DIMENSION)
      })

      const adjustedData = reduceDimensions(nodesFeatures, 2);
      return nodes.map((node, idx) => {
        return { id: idx, x: adjustedData[0][idx], y: adjustedData[1][idx], title: node.path }
      })
    }).then((nodes) => {
      const dataSet = nodes = new vis.DataSet(nodes)
      setData({ nodes: dataSet })
    })
  };

  //再検索ボタンを押すと呼ばれる
  const search_again = () => {
    const response = addon.FindSimilarAudioFromNodeMock([{}], [
      [{}]
    ]);

    response.then((nodes) => {
      const nodesFeatures = nodes.map((datum) => {
        return parseFeature(datum.feature, MAX_DIMENSION)
      })

      const adjustedData = reduceDimensions(nodesFeatures, 2);

      return nodes.map((node, idx) => {
        return { id: idx, x: adjustedData[0][idx], y: adjustedData[1][idx], title: node.path }
      })
    }).then((nodes) => {
      const dataSet = nodes = new vis.DataSet(nodes)
      setData({ nodes: dataSet })
      setInputPath(clickedNode.title);
    })
  };

  //音声の再生周り
  function playSound() {
    return new Promise((resolve, reject) => {
      player.play({ path: clickedNode.path }).then(() => {
        resolve();
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    });
  }

  const options = {
    // height: '320px',
    // width: '480px',
    physics: {
      enabled: true,
      maxVelocity: 50,
      minVelocity: 0.1
    }
  };

  const draw = () => {
    const container = document.getElementById('network');
    if (!container) { return } // 対策→TypeError: Cannot read properties of null (reading 'hasChildNodes')
    const network = new vis.Network(container, data, options);
    network.on('click', (properties) => {
      if (properties.nodes.length === 0) { return } // node選択してないとnodes.getできないよ
      const id = properties.nodes[0];
      const node = data.nodes.get(id);
      if (node.id) setClickedNode(node); //画面に描画するためにstateを変更
    });
  };

  const openFolder = () => {
    const { shell } = window.require('electron');
    const os = window.require('os');
    //一旦はどのosでも動くようにhomedirを開く。
    shell.showItemInFolder(os.homedir());
    //osによってファイルパスの扱いが違うけど、受け取ったパスをそのまま使って大丈夫そう
    // shell.showItemInFolder("C:\\Users\\morit\\Pictures\\My Cloud Samples\\sample01.jpg");
  };

  useEffect(() => search(), []);
  useEffect(() => draw(), [data]);
  return (
    <Grid container>
      <Grid item sm={12} mt={6}>
        <Link to="/serch" style={{ color: "#FF8C00" }}>× アセット選択フォームへ</Link></Grid>
      <Grid item sm={6} id="network" mt={2}></Grid>
      <Grid item sm={5} id="info" mt={2} ml={2}>
        <Grid container alignItems="center">
          <Grid item>入力アセット</Grid>
          <Grid item>
            <IconButton aria-label="delete" onClick={playSound} >
              <PlayCircleFilledIcon color="primary" />
            </IconButton>
          </Grid>

          <Grid item sm={12}>
            <ShowInputPath inputPath={inputPath} />
          </Grid>

          <Grid item sm={12} mt={3} mb={1}><Divider color="#FFFFFF" /></Grid>

          <Grid item>選択アセット</Grid>
          <Grid item>
            <IconButton aria-label="delete" onClick={playSound} >
              <PlayCircleFilledIcon color="primary" />
            </IconButton>
          </Grid>

          <Grid item sm={12}>
            <Grid container alignItems="center">
              <Grid item sm={6}>
                <ShowNodeData nodeData={clickedNode} />
              </Grid>
              <Grid item sm={6}>
                <Button onClick={openFolder} size='small' style={{ background: "#5500BB", color: "#FFFFFF" }}>参照</Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item sm={12} mt={3}>
            <Button onClick={search_again} style={{ background: "#5500BB", color: "#FFFFFF" }}>選択アセットで再検索</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid >
  );

}

export default Result