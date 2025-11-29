import { useSuiClient, useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Flex, Heading, Text, TextField, Box } from "@radix-ui/themes";
import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { newHero } from "./repo/newHero";
import { newWeapon } from "./repo/newWeapon";
import { equipWeapon } from "./repo/equipWeapon";

export function CreateHeroForm() {
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const queryClient = useQueryClient();
  const { mutate: signAndExecute, isPending, error } = useSignAndExecuteTransaction();

  const [heroName, setHeroName] = useState("Batman");
  const [heroStamina, setHeroStamina] = useState(100);
  const [weaponName, setWeaponName] = useState("Batmobile");
  const [weaponAttack, setWeaponAttack] = useState(100);

  const handleMint = () => {
    if (!account) {
      return;
    }

    const tx = new Transaction();

    // Mint the Hero
    const hero = newHero(tx, heroName, heroStamina);

    // Mint the Weapon
    const weapon = newWeapon(tx, weaponName, weaponAttack);

    // Equip the Weapon to the Hero
    equipWeapon(tx, hero, weapon);

    // Transfer the Hero to the sender
    tx.transferObjects([hero], account.address);

    signAndExecute(
      {
        transaction: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      },
      {
        onSuccess: async (result) => {
          // Wait for transaction to be confirmed
          await suiClient.waitForTransactionBlock({
            digest: result.digest,
          });

          // Invalidate queries to refresh the lists
          queryClient.invalidateQueries({ queryKey: ["getObject"] });
          queryClient.invalidateQueries({ queryKey: ["getOwnedObjects"] });
        },
      }
    );
  };

  if (!account) {
    return (
      <Flex direction="column" my="2">
        <Text>Please connect your wallet to create a hero</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" my="2" gap="3">
      <Heading size="4">Create Hero</Heading>
      
      <Box>
        <Flex direction="column" gap="3">
          <Flex direction="column" gap="1">
            <Text size="2" weight="medium">Hero Name:</Text>
            <TextField.Root
              value={heroName}
              onChange={(e) => setHeroName(e.target.value)}
              placeholder="Enter hero name"
            />
          </Flex>

          <Flex direction="column" gap="1">
            <Text size="2" weight="medium">Hero Stamina:</Text>
            <TextField.Root
              type="number"
              value={heroStamina}
              onChange={(e) => setHeroStamina(Number(e.target.value))}
              placeholder="Enter stamina"
            />
          </Flex>

          <Flex direction="column" gap="1">
            <Text size="2" weight="medium">Weapon Name:</Text>
            <TextField.Root
              value={weaponName}
              onChange={(e) => setWeaponName(e.target.value)}
              placeholder="Enter weapon name"
            />
          </Flex>

          <Flex direction="column" gap="1">
            <Text size="2" weight="medium">Weapon Attack:</Text>
            <TextField.Root
              type="number"
              value={weaponAttack}
              onChange={(e) => setWeaponAttack(Number(e.target.value))}
              placeholder="Enter attack value"
            />
          </Flex>

          <Button
            onClick={handleMint}
            disabled={isPending}
            size="3"
          >
            {isPending ? "Minting..." : "Mint Hero with Weapon"}
          </Button>

          {error && (
            <Text color="red" size="2">
              Error: {error.message}
            </Text>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}

