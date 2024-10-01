import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  NodeMouseHandler,
  MarkerType,
} from "@xyflow/react";
import type { Edge } from "@xyflow/react";
import { nanoid } from "nanoid";
import "@xyflow/react/dist/style.css";

import Sidebar from "./components/Sidebar";
import Loading from "./components/Loading";
import ErrorEl from "./components/Error";
import {
  fetchCategories,
  fetchMeal,
  fetchMeals,
  Item,
  MealDetail,
} from "./api/meals";
import { EntityNode } from "./nodes/types";
import { initialNodes, nodeTypes } from "./nodes";

const DIST_X = 300;
const DIST_Y = 75;

export default function App() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const [currentMeal, setCurrentMeal] = useState<MealDetail | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState<Edge>([]);

  const setNodesAndEdges = useCallback(
    (items: Item[] = [], parentNode: EntityNode, resourceType: string) => {
      const startY = parentNode.position.y - ((items.length - 1) * DIST_Y) / 2;

      const newNodes: EntityNode[] = [];
      const newEdges: Edge[] = [];

      items.forEach((item, idx) => {
        const id = nanoid();
        const newNode: EntityNode = {
          id,
          type: "entity",
          data: {
            label: item.label,
            resourceType,
            resourceId: item.id,
          },
          position: {
            x: parentNode.position.x + DIST_X,
            y: startY + idx * DIST_Y,
          },
        };

        const newEdge = {
          id: `${parentNode.id}-${id}`,
          source: parentNode.id,
          target: id,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
          },
        };

        newNodes.push(newNode);
        newEdges.push(newEdge);
      });

      setNodes((prevNodes) => [...prevNodes, ...newNodes]);
      setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    },
    [setEdges, setNodes]
  );

  const handleNodeClickInternal = useCallback<NodeMouseHandler<EntityNode>>(
    async (_, node) => {
      const { resourceType, label, resourceId } = node.data;

      setNodes((prevNodes) => {
        let end = -1;
        for (let i = prevNodes.length - 1; i >= 0; i--) {
          if (prevNodes[i].data.resourceType === resourceType) {
            end = i;
            break;
          }
        }

        const newNodes = prevNodes.slice(0, end + 1);
        return newNodes;
      });

      let items: Item[] = [];
      let newResourceType: string = "";

      if (resourceType === "explore") {
        items = await fetchCategories();
        newResourceType = "category";
      } else if (resourceType === "category" || resourceType === "ingredient") {
        items = [{ id: label, label: "View Meals" }];
        newResourceType = `view/${resourceType}`;
      } else if (resourceType.startsWith("view")) {
        items = await fetchMeals({
          category: resourceType === "view/category" ? resourceId : "",
          ingredient: resourceType === "view/ingredient" ? resourceId : "",
        });

        newResourceType = "meal";
      } else if (resourceType === "meal") {
        const meal = await fetchMeal(resourceId);
        setCurrentMeal(meal);

        items = [
          {
            id: "",
            label: "View Ingredients",
          },
          {
            id: "",
            label: "View Tags",
          },
          {
            id: "",
            label: "View Details",
          },
        ];

        newResourceType = "meal-details";
      } else if (
        resourceType === "meal-details" &&
        label === "View Ingredients"
      ) {
        if (!currentMeal) {
          return;
        }

        items = currentMeal.ingredients.map((ingredient) => ({
          id: ingredient,
          label: ingredient,
        }));

        newResourceType = "ingredient";
      } else if (resourceType === "meal-details" && label === "View Tags") {
        if (!currentMeal) {
          return;
        }

        items = currentMeal.tags.map((tag) => ({
          id: tag,
          label: tag,
        }));

        newResourceType = "tag";
      } else if (resourceType === "meal-details" && label === "View Details") {
        setShowPanel((prevShowPanel) => !prevShowPanel);
      }

      setNodesAndEdges(items, node, newResourceType);
    },
    [setNodesAndEdges, currentMeal, setNodes]
  );

  const handleNodeClick = useCallback<NodeMouseHandler<EntityNode>>(
    async (event, node) => {
      if (loading) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await handleNodeClickInternal(event, node);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setError(`Failed to fetch data. ${errorMessage}`);
        setTimeout(() => {
          setError(null);
        }, 3000);
      } finally {
        setLoading(false);
      }
    },
    [handleNodeClickInternal, loading]
  );

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
    >
      <Background />
      {showPanel && currentMeal && (
        <Panel
          position="top-right"
          className="w-[400px] m-0 bg-white border-2 border-gray-200 text-gray-900 max-h-[100vh] overflow-y-auto"
        >
          <Sidebar meal={currentMeal} closePanel={() => setShowPanel(false)} />
        </Panel>
      )}
      {error && (
        <Panel position="top-center">
          <ErrorEl error={error} />
        </Panel>
      )}
      {loading && (
        <Panel position="top-center">
          <Loading />
        </Panel>
      )}
    </ReactFlow>
  );
}
