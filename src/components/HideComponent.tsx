export default function HideComponent(props: {
  paths: string[];
  children: JSX.Element;
}) {
  return (
    <>{!props.paths.includes(location.pathname) && <>{props.children}</>}</>
  );
}
