import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import vis from "vis";
import PCA from 'pca-js';
import { parseFeature, reduceDimensions } from '../lib/nodesParser';
import { Grid, Button } from "@mui/material"

// 次元の範囲を決め打ち。
const MAX_DIMENSION = 200;

const addon = window.require("bindings")("Visualize_Sounds_Core_addon.node");


const ShowNodeData = ({ nodeData }) => { //nodeの情報を書く
  return (
    <div>
      {/* <p>id:{nodeData?.id}</p> */}
      {/* <p>label:{nodeData?.label}</p> */}
      {/* <p>x:{nodeData?.x}</p>
      <p>y:{nodeData?.y}</p> */}
      <p>path : {nodeData?.title}</p>
    </div>
  )
};

const Result = () => {
  const openFolder = () => {
    const { shell } = window.require('electron');
    const os = window.require('os');
    //一旦はどのosでも動くようにhomedirを開く。
    shell.showItemInFolder(os.homedir());
    //osによってファイルパスの扱いが違うけど、受け取ったパスをそのまま使って大丈夫そう
    // shell.showItemInFolder("C:\\Users\\morit\\Pictures\\My Cloud Samples\\sample01.jpg");
  };

  const [data, setData] = useState({ nodes: new vis.DataSet([]) });

  const search = () => { //初回だけ呼び出される
    const response = addon.FindSimilarAudioFromNodeMock([{}], [
      [{}]
    ]);

    response.then((nodes) => {
      console.log(nodes)
      const nodesFeatures = nodes.map((datum) => {
        return parseFeature(datum.feature, MAX_DIMENSION)
      })

      const adjustedData = reduceDimensions(nodesFeatures, 2);

      return nodes.map((node, idx) => {
        return { id: idx, x: adjustedData[0][idx], y: adjustedData[1][idx], title: node.path }
      })
    }).then((nodes) => {
      const dataSet = nodes = new vis.DataSet(nodes)
      console.log(dataSet)
      setData({ nodes: dataSet })
    })
  };

  const search_again = () => { //dataを更新→useEffectの依存値にdataを加える
    const response = addon.FindSimilarAudioFromNodeMock([{}], [
      [{}]
    ]);

    response.then((nodes) => {
      console.log(nodes)
      const nodesFeatures = nodes.map((datum) => {
        return parseFeature(datum.feature, MAX_DIMENSION)
      })

      const adjustedData = reduceDimensions(nodesFeatures, 2);

      return nodes.map((node, idx) => {
        return { id: idx, x: adjustedData[0][idx], y: adjustedData[1][idx], title: node.path }
      })
    }).then((nodes) => {
      const dataSet = nodes = new vis.DataSet(nodes)
      console.log(dataSet)
      setData({ nodes: dataSet })
    })
  };

  const rootNode = { id: 1, label: 'A', x: 20, y: 180, title: "/asset/music1.wav" };
  const [clickedNode, setClickedNode] = useState(null);

  const options = {
    height: '320px',
    width: '480px',
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
      console.log('clicked nodes:', data.nodes.get(id)); //コンソールに出力
    });
  };

  //初回render後に一度だけ呼ぶ（これがないと初めにグラフが表示されない
  useEffect(() => search(), []);

  //流れ
  //再検索ボタンが押される→search()が呼ばれる
  //→dataが更新→draw()が呼ばれる
  //→ClickedNodeが更新→reactがいい感じにrenderしてくれる
  useEffect(() => draw(), [data]);

  return (
    <div class="result_page_container">
      <div id="link_to_search_page">
        <Link to="/serch" style={{ color: "#FF8C00" }}>× アセット選択フォームへ</Link>
      </div>
      <div style={{ display: "flex", height: "430px" }}>
        <div id="network"></div>
        <div id="data">
          <p>入力アセット</p>
          <ShowNodeData nodeData={rootNode} />
          <p>---------------</p>
          <p>選択アセット</p>
          <ShowNodeData nodeData={clickedNode} />
          <Button onClick={openFolder} style={{ background: "#5500BB" }}>参照</Button>
          <Button onClick={search_again} style={{ background: "#5500BB" }}>再検索</Button>
        </div>
      </div>
    </div>
  );
}

export default Result