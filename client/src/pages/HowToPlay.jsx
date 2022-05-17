import { Box, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

function HowToPlay() {
  return (
    <Box margin="16" padding="6" boxShadow="lg" bg="white">
      <SkeletonCircle size="10" />
      <SkeletonText mt="4" noOfLines={4} spacing="4" />
      <Skeleton mt="4" height="20px" />
      <Skeleton mt="4" height="20px" />
      <Skeleton mt="4" height="20px" />
      <Skeleton mt="4" height="20px" />
      <Skeleton mt="4" height="20px" />
      <Skeleton mt="4" height="20px" />
      <SkeletonCircle mt="4" size="10" />
      <SkeletonText mt="4" noOfLines={4} spacing="4" />
    </Box>
  );
}

export default HowToPlay;
