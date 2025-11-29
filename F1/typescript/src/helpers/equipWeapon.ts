import { ENV } from "../env";
import { Transaction } from "@mysten/sui/transactions";

export const equipWeapon = (tx: Transaction, hero: any, weapon: any) => {
    tx.moveCall({
        target: `${ENV.PACKAGE_ID}::hero::equip_weapon`,
        arguments: [hero, weapon],
    });
};