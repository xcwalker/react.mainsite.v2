import { Helmet } from "react-helmet";

export default function PageSeoWrapper(props: {
  children: React.ReactNode;
  title: string;
  description?: string;
  image?: string;
}) {
  console.log("Rendering PageSeoWrapper with title:", props.title);
  console.log("Rendering PageSeoWrapper with description:", props.description);
  console.log("Rendering PageSeoWrapper with image:", props.image);

  return (
    <>
      <Helmet>
        <title>{props.title}</title>
        {props.description && (
          <meta name="description" content={props.description.toString()} />
        )}
        {props.description && (
          <meta
            name="twitter:description"
            content={props.description.toString()}
          />
        )}
        {props.description && (
          <meta
            property="og:description"
            content={props.description.toString()}
          />
        )}
        {props.image && <meta name="twitter:image" content={props.image} />}
        {props.image && <meta property="og:image" content={props.image} />}
      </Helmet>
      {props.children}
    </>
  );
}
