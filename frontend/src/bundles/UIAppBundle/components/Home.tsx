import { useSmart } from "@bluelibs/smart";
import { useUIComponents } from "@bluelibs/x-ui";
import {
  Button,
  Form,
  Input,
  Layout,
  notification,
  Row,
  Typography,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { EthereumSmart } from "../smarts";
import { CreateNFTParams } from "../smarts/types";
import { NFT } from "./NFT";
import { NoNFTs } from "./NoNFTs";

export const Home: React.FC = () => {
  const ethereum = useSmart(EthereumSmart);

  const [form] = useForm();

  const { state } = ethereum;

  const UIComponents = useUIComponents();

  if (!state.isReady) {
    return <UIComponents.Loading />;
  }

  const onSubmit = async (input: CreateNFTParams) => {
    try {
      await ethereum.createNFT(input);

      notification.success({
        message: `You have successfully created the NFT '${input.name}!'`,
      });

      form.resetFields();
    } catch (err) {
      notification.error({ message: err.message });
    }
  };

  return (
    <Layout>
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: "100vh", flexDirection: "column" }}
      >
        <Form form={form} onFinish={onSubmit}>
          <Form.Item label="Name" name="name">
            <Input required />
          </Form.Item>

          <Form.Item label="Latitude" name="lat">
            <Input required type="number" />
          </Form.Item>

          <Form.Item label="Longitude" name="long">
            <Input required type="number" />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button style={{ marginTop: "1rem" }} htmlType="submit">
              Create NFT
            </Button>
          </Form.Item>
        </Form>

        {state.NFTs.length && (
          <Typography style={{ marginTop: "1rem" }}>Your NFTs:</Typography>
        )}

        {state.NFTs.length === 0 ? (
          <NoNFTs />
        ) : (
          <Row>
            {state.NFTs.map((nft, index) => (
              <NFT {...nft} key={index} />
            ))}
          </Row>
        )}
      </Row>
    </Layout>
  );
};
