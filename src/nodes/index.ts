import Entity from "./Entity";
import { EntityNode } from "./types";

export const nodeTypes = {
  entity: Entity,
};

export const initialNodes: EntityNode[] = [
  {
    id: "explore",
    type: "entity",
    data: {
      label: "Explore",
      resourceType: "explore",
      resourceId: "explore",
    },
    position: { x: 50, y: 200 },
  },
];
