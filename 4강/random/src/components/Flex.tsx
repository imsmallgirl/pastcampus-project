import styled from "@emotion/styled";
import { color, ColorProps, display, layout, LayoutProps, position } from "styled-system";
import Box, { BoxProps } from "./Box";

const Flex = styled(Box)<BoxProps> `
    display: flex;
    ${display}
    ${position}
`

export default Flex;