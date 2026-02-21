import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { H1, H2 } from "@/app/components/h";
import { Image } from "@/app/components/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: H1,
    h2: H2,
    img: (props: ComponentProps<"img">) => (
      <Image
        alt={props.alt || ""}
        height={Number(props.height) || 400}
        src={typeof props.src === "string" ? props.src : ""}
        width={Number(props.width) || 600}
      />
    ),
    ...components,
  };
}
