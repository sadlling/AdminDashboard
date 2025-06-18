import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router-dom";
import {
  Link as ChakraLink,
  type LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";

// Объединяем пропсы Chakra и React Router
type CombinedLinkProps = ChakraLinkProps & RouterLinkProps;

// Кастомный компонент с правильной типизацией
const CustomLink = ({ children, ...props }: CombinedLinkProps) => (
  <ChakraLink as={RouterLink} {...props}>
    {children}
  </ChakraLink>
);

export default CustomLink;
