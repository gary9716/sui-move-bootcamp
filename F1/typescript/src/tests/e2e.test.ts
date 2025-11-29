import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { mintHeroWithWeapon } from "../helpers/mintHeroWithWeapon";
import { parseCreatedObjectsIds } from "../helpers/parseCreatedObjectIds";
import { suiClient } from "../suiClient";
import { getWeaponIdOfHero } from "../helpers/getWeaponIdOfHero";
import { getHeroesRegistry } from "../helpers/getHeroesRegistry";

describe("Mint a Hero NFT, a Weapon NFT and equip it", () => {
  let txResponse: SuiTransactionBlockResponse;
  let heroId: string | undefined;
  let heroesIds: string[] = [];

  beforeAll(async () => {
    txResponse = await mintHeroWithWeapon();
    await suiClient.waitForTransaction({ digest: txResponse.digest, timeout: 10_000 });
    console.log("Executed transaction with txDigest:", txResponse.digest);
  });

  test("Transaction Status", () => {
    expect(txResponse.effects).toBeDefined();
    expect(txResponse.effects!.status.status).toBe("success");
  });

  test("Created Hero", async () => {
    expect(txResponse.objectChanges).toBeDefined();
    const { heroesIds: parsedHeroesIds } = parseCreatedObjectsIds({
      objectChanges: txResponse.objectChanges!,
    });
    expect(parsedHeroesIds.length).toBeGreaterThan(0);
    heroId = parsedHeroesIds[0];
    expect(heroId).toBeDefined();
  });

  test("Hero is equiped with a Weapon", async () => {
    expect(heroId).toBeDefined();
    if (!heroId) {
      throw new Error("heroId is not defined from previous test");
    }
    const weaponId = await getWeaponIdOfHero(heroId);
    expect(weaponId).toBeDefined();
    expect(weaponId).not.toBeUndefined();
  });

  test("Heroes registry", async () => {
    expect(heroId).toBeDefined();
    if (!heroId) {
      throw new Error("heroId is not defined from previous test");
    }
    const { ids, counter } = await getHeroesRegistry();
    heroesIds = ids;
    expect(ids.length).toBeGreaterThan(0);
    expect(ids).toContain(heroId);
    expect(counter).toBeGreaterThan(0);
  });
});
