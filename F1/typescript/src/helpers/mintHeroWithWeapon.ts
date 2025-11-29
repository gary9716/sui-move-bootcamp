import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { ENV } from "../env";
import { getAddress } from "./getAddress";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";
import { newHero } from "./newHero";
import { newWeapon } from "./newWeapon";
import { equipWeapon } from "./equipWeapon";

/**
 * Builds, signs, and executes a transaction for:
 * * minting a Hero NFT
 * * minting a Weapon NFT
 * * attaching the Weapon to the Hero
 * * transferring the Hero to the signer's address
 */
export const mintHeroWithWeapon =
  async (): Promise<SuiTransactionBlockResponse> => {
    const tx = new Transaction();
    const hero = newHero(tx, "Batman", 100);
    const weapon = newWeapon(tx, "Batmobile", 100);
    equipWeapon(tx, hero, weapon);
    tx.transferObjects([hero], getAddress({ secretKey: ENV.USER_SECRET_KEY }));
    return await suiClient.signAndExecuteTransaction({
      transaction: tx,
      signer: getSigner({ secretKey: ENV.USER_SECRET_KEY }),
      options: {
        showEffects: true,
        showObjectChanges: true,
      }
    });
  };
