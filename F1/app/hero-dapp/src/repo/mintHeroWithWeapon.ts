import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, HEROES_REGISTRY_ID } from "../constants";
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
export const mintHeroWithWeapon = async (
    client: SuiClient,
    signer: any,
    recipient: string,
    heroName: string = "Batman",
    heroStamina: number = 100,
    weaponName: string = "Batmobile",
    weaponAttack: number = 100
): Promise<SuiTransactionBlockResponse> => {
    const tx = new Transaction();

    // Mint the Hero
    const hero = newHero(tx, heroName, heroStamina);

    // Mint the Weapon
    const weapon = newWeapon(tx, weaponName, weaponAttack);

    // Equip the Weapon to the Hero
    equipWeapon(tx, hero, weapon);

    // Transfer the Hero to the recipient
    tx.transferObjects([hero], recipient);

    // Sign and execute the transaction
    const result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer,
        options: {
            showEffects: true,
            showObjectChanges: true,
        },
    });

    return result;
};

