import Graph from "react-graph-vis";
import React, { useState } from "react";
import ReactDOM from "react-dom";

const options = {
  layout: {
    improvedLayout: true
  },
  nodes: {
    shape: 'box',
    font: {
      size: 13
    }
  },
  edges: {
    color: "#000000",
  },
  physics: {
    enabled: false
  }}

const Modal = ({ nodeData, isOpen, onClose, onSave }) => {
  const [data, setData] = useState(nodeData);

  const handleChange = (e) => {
    setData({ ...data, label: e.target.value });
  };

  const handleSave = () => {
    onSave(data);
    onClose();
  };
  console.log("isOpen")
  console.log(nodeData)
  console.log("isOpen")
  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", top: "40%", left: "40%", backgroundColor: "grey", padding: "40px", zIndex: 100 }}>
      <h2>Edit Node</h2>
      <input type="text" value={nodeData.label} onChange={handleChange} />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
function randomColor() {
  const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${red}${green}${blue}`;
}

const App = () => {
  const createNode = (x, y) => {
    const color = randomColor();
    setState(({ graph: { nodes, edges }, counter, ...rest }) => {
      const id = counter + 1;
      const from = Math.floor(Math.random() * (counter - 1)) + 1;
      return {
        graph: {
          nodes: [
            ...nodes,
            { id, label: `Node ${id}`, color, x, y }
          ],
          edges: [
            ...edges,
            { from, to: id }
          ]
        },
        counter: id,
        ...rest
      }
    });
  }
  const [state, setState] = useState({
    counter: 5,
    graph: {
      "nodes": [
        { "id": 1, "label": "lambda_matthias-create-job", "color": "#e04141" },
        { "id": 2, "label": "lambda_matthias-consume-job", "color": "#e09c41",  },
        { "id": 3, "label": "s3_matthias-lambda-bucket", "color": "#e0df41",  },
        { "id": 4, "label": "application_invoker_matthias-invoker-test", "color": "#7be041",  }
      ],
      "edges": [
        { "from": 1, "to": 3 },
        { "from": 1, "to": 4 },
        { "from": 2, "to": 3 },
        { "from": 4, "to": 2 }
      ]
    },
    events: {
      select: ({ nodes, edges }) => {
        console.log("Selected nodes:");
        console.log(nodes);
        console.log("Selected edges:");
        console.log(edges);
        alert("Selected node: " + nodes);
      },
      doubleClick: ({ pointer: { canvas } }) => {
        createNode(canvas.x, canvas.y);
      }
    },
    modalOpen: false,
    editingNode: null
  })
  const { graph, events, modalOpen, editingNode } = state;

  const handleSelect = ({ nodes }) => {
    if (nodes.length > 0) {
      const nodeId = nodes[0];
      const nodeData = graph.nodes.find(node => node.id === nodeId);
      setState({ ...state, modalOpen: true, editingNode: nodeData });
    }
  };

  const handleCloseModal = () => {
    setState({ ...state, modalOpen: false, editingNode: null });
  };

  const handleSaveNodeData = (newData) => {
    const newNodes = graph.nodes.map(node => node.id === newData.id ? newData : node);
    setState({ ...state, graph: { ...graph, nodes: newNodes } });
  };

  // Update your events object
  const updatedEvents = { ...events, select: handleSelect };

  return (
    <div>
      <Graph graph={graph} options={options} events={updatedEvents} style={{ height: "640px" }} />
      <Modal
        nodeData={editingNode}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNodeData}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
