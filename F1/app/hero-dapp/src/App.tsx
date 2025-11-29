import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Tabs } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import { HeroList } from "./HeroList";
import { CreateHeroForm } from "./CreateHeroForm";
import { OwnedObjects } from "./OwnedObjects";

function App() {
  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>Hero dApp</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <WalletStatus />

          <Tabs.Root defaultValue="heroes" mt="4">
            <Tabs.List>
              <Tabs.Trigger value="heroes">All Heroes</Tabs.Trigger>
              <Tabs.Trigger value="create">Create Hero</Tabs.Trigger>
              <Tabs.Trigger value="my-heroes">My Heroes</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
              <Tabs.Content value="heroes">
                <HeroList />
              </Tabs.Content>

              <Tabs.Content value="create">
                <CreateHeroForm />
              </Tabs.Content>

              <Tabs.Content value="my-heroes">
                <OwnedObjects />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Container>
      </Container>
    </>
  );
}

export default App;
