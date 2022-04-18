import { Layout, Typography } from "antd";
import { NFT as NFTType } from "../smarts/types";

export type NFTProps = NFTType;

export const NFT: React.FC<NFTProps> = ({ latitude, longitude, name }) => {
  return (
    <Layout style={{ marginLeft: "2rem" }}>
      <Typography>name: {name}</Typography>

      <Typography>Latitude: {latitude}</Typography>
      <Typography>Longitude: {longitude}</Typography>
    </Layout>
  );
};
