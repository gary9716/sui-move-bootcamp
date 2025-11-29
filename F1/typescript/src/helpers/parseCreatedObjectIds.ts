import { SuiObjectChange, SuiObjectChangeCreated } from "@mysten/sui/client";
import { ENV } from "../env";

interface Args {
  objectChanges: SuiObjectChange[];
}

interface Response {
  heroesIds: string[];
}

/**
 * Parses the provided SuiObjectChange[].
 * Extracts the IDs of the created Heroes and Weapons NFTs, filtering by objectType.
 */
export const parseCreatedObjectsIds = ({ objectChanges }: Args): Response => {
  const heroesIds: string[] = [];

  for (const change of objectChanges) {
    if (change.type === "created") {
      const created = change as SuiObjectChangeCreated;
      const objectType = created.objectType;

      // Check if it's a Hero object (from our package)
      // The objectType format is: PACKAGE_ID::MODULE::STRUCT_NAME
      if (objectType && objectType === `${ENV.PACKAGE_ID}::hero::Hero`) {
        heroesIds.push(created.objectId);
      }
    }
  }

  return {
    heroesIds,
  };
};
