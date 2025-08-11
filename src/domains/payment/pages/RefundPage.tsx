import { Container } from "~components";
import { Page } from "~components/Page";
import { RefundPolicy } from "src/components/RefundPolicy";

const RefundPage = () => {
  return (
    <Page>
      <Container>
        <RefundPolicy />
      </Container>
    </Page>
  );
};

export const Component = RefundPage;
