import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { CURRENT_NETWORK, PACKAGE_ID } from "./constants";

interface HeroCardProps {
  heroId: string;
  name?: string;
  stamina?: number;
  weapon?: {
    name?: string;
    attack?: number;
  } | null;
}

export function HeroCard({ heroId, name, stamina, weapon }: HeroCardProps) {
  return (
    <Card style={{ padding: "16px", marginBottom: "12px" }}>
      <Flex direction="column" gap="2">
        <Flex justify="between" align="center">
          <Heading size="3">{name || "Unknown Hero"}</Heading>
          <Text
            size="1"
            style={{
              fontFamily: "monospace",
              cursor: "pointer",
              textDecoration: "underline",
              color: "var(--blue-11)",
            }}
            onClick={() => {
              window.open(
                `https://suiexplorer.com/object/${heroId}?network=${CURRENT_NETWORK}`,
                "_blank"
              );
            }}
          >
            View on Explorer
          </Text>
        </Flex>
        
        <Flex direction="column" gap="1">
          <Text size="2" weight="medium">
            ID: <span style={{ fontFamily: "monospace", fontSize: "11px" }}>{heroId}</span>
          </Text>
          {stamina !== undefined && (
            <Text size="2">
              Stamina: <strong>{stamina}</strong>
            </Text>
          )}
          {weapon ? (
            <Box mt="2" p="2" style={{ background: "var(--gray-3)", borderRadius: "4px" }}>
              <Text size="2" weight="medium">Weapon:</Text>
              <Text size="2">Name: {weapon.name || "Unknown"}</Text>
              {weapon.attack !== undefined && (
                <Text size="2">Attack: <strong>{weapon.attack}</strong></Text>
              )}
            </Box>
          ) : (
            <Text size="2" style={{ color: "var(--gray-9)" }}>
              No weapon equipped
            </Text>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}

