import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import vis from "vis";
import ReactDOM from "react-dom";

const ShowNodeData = (nodeData) => { //nodeの情報を書く
  const container = document.getElementById("data");
  const element = (
    <div>
      <p>id:{nodeData?.id}</p>
      <p>label:{nodeData?.label}</p>
      <p>x:{nodeData?.x}</p>
      <p>y:{nodeData?.id}</p>
      <p>title:{nodeData?.title}</p>
    </div>
  );
  ReactDOM.render(element, container);
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
    width: '480px'
  };

  const draw = () => {
    const container = document.getElementById('network');
    const network = new vis.Network(container, data, options);
    network.on('click', (properties) => {
      const id = properties.nodes[0];
      const clickedNode = nodes.get(id);
      ShowNodeData(clickedNode);
      console.log('clicked nodes:', clickedNode);
    });
  };

  useEffect(() => draw(), []);
  return (
    <div>
      <div id="network"></div>
      <div id="data">
        <p>id:</p>
        <p>label:</p>
        <p>x:</p>
        <p>y:</p>
        <p>title:</p>
      </div>
      <Link to="/serch">検索ページへ</Link><br />
      <Link to="/">設定ページへ</Link><br />
    </div >
  );
}

export default Result