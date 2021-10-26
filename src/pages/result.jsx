import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import vis from "vis";
import { useState } from 'react';


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
  const nodes = new vis.DataSet([
    { id: 1, label: 'A', x: 20, y: 180, title: "/asset/music1.wav" },
    { id: 2, label: 'B', x: 40, y: 200, title: "/asset/music2.wav" },
    { id: 3, label: 'C', x: 60, y: 10, title: "/asset/music3.wav" },
    { id: 4, label: 'D', x: 80, y: 150, title: "/asset/music4.wav" },
    { id: 5, label: 'E', x: 100, y: 300, title: "/asset/music5.wav" },
    { id: 6, label: 'F', x: 120, y: 100, title: "/asset/music6.wav" },
    { id: 7, label: 'G', x: 150, y: 250, title: "/asset/music7.wav" },
    { id: 8, label: 'H', x: 180, y: 50, title: "/asset/music8.wav" },
  ]);
  const data = {
    nodes: nodes,
  };
  const options = {
    height: '320px',
    width: '480px',
    physics: {
      enabled: true,
      maxVelocity: 50,
      minVelocity: 0.1
    }
  };

  const [clickedNode, setClickedNode] = useState(null);

  const draw = () => {
    const container = document.getElementById('network');
    const network = new vis.Network(container, data, options);
    network.on('click', (properties) => {
      const id = properties.nodes[0];
      const node = nodes.get(id);
      if (node.id) setClickedNode(node); //画面に描画するためにstateを変更
      console.log('clicked nodes:', nodes.get(id)); //コンソールに出力
    });
  };

  const openFolder = () => {
    const { shell } = window.require('electron');
    shell.showItemInFolder("/Users");

  };

  useEffect(() => draw(), []);

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