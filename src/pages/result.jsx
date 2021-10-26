import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import vis from "vis";
import PCA from 'pca-js';
import { parseFeature, reduceDimensions } from '../lib/nodesParser';

// 次元の範囲を決め打ち。
const MAX_DIMENSION = 200;

const addon = window.require("bindings")("Visualize_Sounds_Core_addon.node");

const ShowNodeData = ({ nodeData }) => { //nodeの情報を書く
  return (
    <div style={{ color: "#FFFFFF" }}>
      <p>id:{nodeData?.id}</p>
      <p>label:{nodeData?.label}</p>
      <p>x:{nodeData?.x}</p>
      <p>y:{nodeData?.y}</p>
      <p>title:{nodeData?.title}</p>
    </div>
  )
};

const Result = () => {
  const [data, setData] = useState({ nodes: new vis.DataSet([]) });

  // データの検索処理
  useEffect(() => {
    const response = addon.FindSimilarAudioFromNode([{}], [
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
  }, [])

  // console.log(adData);
  
  // const nodes = new vis.DataSet([
  //   { id: 1, label: 'A', x: 20, y: 180, title: "/asset/music1.wav" },
  //   { id: 2, label: 'B', x: 40, y: 200, title: "/asset/music2.wav" },
  //   { id: 3, label: 'C', x: 60, y: 10, title: "/asset/music3.wav" },
  //   { id: 4, label: 'D', x: 80, y: 150, title: "/asset/music4.wav" },
  //   { id: 5, label: 'E', x: 100, y: 300, title: "/asset/music5.wav" },
  //   { id: 6, label: 'F', x: 120, y: 100, title: "/asset/music6.wav" },
  //   { id: 7, label: 'G', x: 150, y: 250, title: "/asset/music7.wav" },
  //   { id: 8, label: 'H', x: 180, y: 50, title: "/asset/music8.wav" },
  // ]);
  // const data = {
  //   nodes: nodes,
  // };
  const options = {
    height: '500px',
    width: '800px',
    physics: {
      enabled: true,
      maxVelocity: 50,
      minVelocity: 0.1
    }
  };

  const [clickedNode, setClickedNode] = useState(null);

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

  const openFolder = () => {
    const { shell } = window.require('electron');
    shell.showItemInFolder("/Users");

  };

  // ###########################
  // ここレンダリング問題残ってる
  // ###########################
  // useEffect(() => draw(), []);
  draw()

  return (
    <div style={{ background: "#191E2B" }}>
      <div style={{ display: "flex" }}>
        <div id="network" style={{ background: "#36383F" }}></div>
        <div>
          <ShowNodeData nodeData={clickedNode} />
          <a href="\\C:\Users" target="_blank">フォルダーを開く</a>
          <input type="file" />
          <button onClick={openFolder}>Click</button>
        </div>
      </div >
      <Link to="/serch">検索ページへ</Link><br />
      <Link to="/">設定ページへ</Link><br />
    </div>
  );
}

export default Result