"use strict";
// This class is constructed to implement
// https://www.w3.org/TR/css-variables-1/#cycles
class CustomPropertyDependencyGraph {
  // Takes one argument:
  //   The function to lookup the property in the list of stylesheets
  constructor(propertyLookup) {
    this._nodes = [];
    this._propertyLookup = propertyLookup;
  }

  // Creates the graph starting at the given custom property
  createNodesFrom(propertyName) {
    this._nodes = [];
    this._attachNodes(undefined, propertyName);
  }

  // Returns true if the graph is cyclic around the custom property
  isCyclicAround(propertyName) {
    const node = this._getNode(propertyName);
    const isCyclic = node.find(propertyName);
    this._unvisitNodes();
    return isCyclic;
  }

  // Initializes a node with no outgoing edges
  _createNode(nodeName) {
    this._nodes.push({
      name: nodeName,
      outgoing: [],
      visited: false,

      find(node) {
        this.visited = true;
        for (const outgoingNode of this.outgoing) {
          if (outgoingNode.name === node) {
            return true;
          }
          if (!outgoingNode.visited) {
            const wasFound = outgoingNode.find(node);
            if (wasFound) {
              return wasFound;
            }
          }
        }
        return false;
      }
    });
  }

  // Attaches the two nodes with an edge from "fromNode" to "newNode".
  // If newNode doesn't exist, one is created. Upon creation, all
  // outgoing edges/nodes are also created.
  _attachNodes(fromNode, newNode) {
    if (!exports.isCustomProperty(newNode)) {
      return;
    }

    if (!this._contains(newNode)) {
      this._createNode(newNode);
      this._drawEdgeConnecting(fromNode, newNode);
      const varSubstituteVal = this._propertyLookup(newNode);
      const dependencies = varSubstituteVal.value.matchAll(/var\((--[-\w]+)/g);

      let outgoingEdges = [];
      if (dependencies) {
        outgoingEdges = [...dependencies].map(match => match[1]);
      }

      for (const nodeAtEndOfEdge of outgoingEdges) {
        this._attachNodes(newNode, nodeAtEndOfEdge);
      }
    } else {
      this._drawEdgeConnecting(fromNode, newNode);
    }
  }

  // Attaches the two nodes with an edge from "fromNode" to "newNode".
  // No new nodes are created.
  _drawEdgeConnecting(fromNodeName, toNodeName) {
    if (!fromNodeName || !toNodeName) {
      return;
    }

    const fromNodeRef = this._getNode(fromNodeName);
    const toNodeRef = this._getNode(toNodeName);
    if (!fromNodeRef) {
      return;
    }

    if (!fromNodeRef.outgoing.some(e => e === toNodeRef)) {
      fromNodeRef.outgoing.push(toNodeRef);
    }
  }

  // Helper functions
  _contains(nodeName) {
    return this._nodes.some(e => e.name === nodeName);
  }
  _getNode(nodeName) {
    return this._nodes.find(e => e.name === nodeName);
  }
  _unvisitNodes() {
    this._nodes.forEach(e => {
      e.visited = false;
    });
  }
}

exports.CustomPropertyDependencyGraph = CustomPropertyDependencyGraph;
exports.isCustomProperty = propertyName => {
  return typeof propertyName === "string" &&
    propertyName.indexOf("--") === 0;
};
