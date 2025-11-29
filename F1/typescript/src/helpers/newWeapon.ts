import { Transaction } from "@mysten/sui/transactions";
import { ENV } from "../env";

export const newWeapon = (tx: Transaction, name: string, attack: number) => {
    return tx.moveCall({
        target: `${ENV.PACKAGE_ID}::hero::new_weapon`,
        arguments: [
            tx.pure.string(name),
            tx.pure.u64(attack),
        ],
    });
};