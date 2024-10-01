import type { Node } from "@xyflow/react";

type EntityData = {
  label: string;
  resourceType: string;
  resourceId: string;
};

export type EntityNode = Node<EntityData, "entity">;
