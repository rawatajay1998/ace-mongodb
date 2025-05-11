export default interface IAgentCardProps {
  agent: {
    _id: string;
    name: string;
    profileImage?: string;
    country: string;
    propertiesCount?: number;
  };
}
