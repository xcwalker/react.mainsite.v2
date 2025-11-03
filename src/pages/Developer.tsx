import { Navigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Section from "../components/Section";
import { SidebarContainer } from "../components/Sidebar/SidebarContainer";
import SideBySide from "../components/SideBySide";
import { CopyBlock, dracula } from "react-code-blocks";
import codecCSS from "../styles/components/codeSnippet.module.css";
import PageSeoWrapper from "../components/PageSeoWrapper";
import { separator, title } from "../App";

export function DeveloperView() {
  const { pageID } = useParams();

  return (
    <PageSeoWrapper
      title={`Developer ${separator} ${title}`}
      description={`Developer documentation for ${title}`}
    >
      <Section id="components">
        <SideBySide leftWidth="250px">
          <Sidebar pageID={pageID} />
          <main>
            {!pageID && <span>Select a page from the sidebar.</span>}
            {pageID &&
              pages.map((page) => {
                if (page.href === pageID) {
                  return (
                    <Section key={page.name} id={page.name}>
                      {page.component}
                    </Section>
                  );
                }
              })}
          </main>
        </SideBySide>
      </Section>
    </PageSeoWrapper>
  );
}

function ComponentsView() {
  const { sectionID } = useParams();

  if (!sectionID) {
    return <Navigate to={"./" + components[0].href} />;
  }

  return (
    <PageSeoWrapper
      title={`Components ${separator} Developer ${separator} ${title}`}
      description={`Developer documentation of components for ${title}`}
    >
      <Section id="components">
        {components.map((component) => {
          if (component.href === sectionID) {
            return (
              <PageSeoWrapper
                title={`${component.name} ${separator} Components ${separator} Developer ${separator} ${title}`}
                description={`Developer documentation of ${component.name} for ${title}`}
              >
                <Section key={component.name} id={component.name}>
                  <h2>{component.component}</h2>
                  <p>{component.description}</p>
                  <h3>Example Usage</h3>
                  <ExampleUsage>{component.component}</ExampleUsage>
                  <h3>Code</h3>
                  <CodePreview code={component.exampleCode} />
                </Section>
              </PageSeoWrapper>
            );
          }
        })}
      </Section>
    </PageSeoWrapper>
  );
}

function FunctionsView() {
  const { sectionID } = useParams();

  if (!sectionID) {
    return <Navigate to={"./" + functions[0].href} />;
  }

  return (
    <PageSeoWrapper
      title={`Functions ${separator} Developer ${separator} ${title}`}
      description={`Developer documentation of functions for ${title}`}
    >
      <Section id="functions">
        {functions.map((func) => {
          if (func.href === sectionID) {
            return (
              <PageSeoWrapper
                title={`${func.name} ${separator} Functions ${separator} Developer ${separator} ${title}`}
                description={`Developer documentation of ${func.name} for ${title}`}
              >
                <Section key={func.name} id={func.name}>
                  {func.exampleCode}
                </Section>
              </PageSeoWrapper>
            );
          }
        })}
      </Section>
    </PageSeoWrapper>
  );
}

const pages = [
  {
    name: "Components",
    href: "components",
    gficon: "view_module",
    description: "A list of all UI components.",
    component: <ComponentsView />,
  },
  {
    name: "Functions",
    href: "functions",
    gficon: "functions",
    description: "A list of utility functions.",
    component: <FunctionsView />,
  },
];

const components = [
  {
    name: "Button",
    href: "button",
    gficon: "smart_button",
    description: "A clickable button component.",
    component: (
      <Button onClick={() => {}} title="Click Me">
        Click Me
      </Button>
    ),
    exampleCode: `<Button onClick={() => {
    alert("Button clicked!");
    }} title="Click Me">
      Click Me
    </Button>`,
  },
];

const functions = [
  {
    name: "firebaseGetRealtimeData",
    href: "firebaseGetRealtimeData",
    gficon: "functions",
    description: "A function to get realtime data from Firebase.",
    exampleCode: `import { firebaseGetRealtimeData } from "path/to/firebaseUtils
    
    function MyComponent() {
      const [data, setData] = useState(null);
      const [error, setError] = useState(null);

      useEffect(() => {
      `,
  },
];

function Sidebar(props: { pageID?: string }) {
  const { pageID } = props;

  return (
    <SidebarContainer>
      <nav>
        <ul>
          {!pageID && (
            <>
              {pages.map((page) => (
                <li key={page.name}>
                  <Button
                    href={`./${page.href}`}
                    title={page.name}
                    icon={{ gficon: page.gficon }}
                  >
                    {page.name}
                  </Button>
                </li>
              ))}
            </>
          )}
          {pageID && (
            <li>
              <Button
                href={"../"}
                title="Back to pages"
                icon={{ gficon: "arrow_back" }}
              >
                Back to pages
              </Button>
            </li>
          )}
          {pageID === "components" && (
            <>
              {components.map((component) => (
                <li key={component.name}>
                  <Button
                    href={`./${component.href}`}
                    title={component.name}
                    icon={{ gficon: component.gficon }}
                  >
                    {component.name}
                  </Button>
                </li>
              ))}
            </>
          )}
          {pageID === "functions" && (
            <>
              {functions.map((func) => (
                <li key={func.name}>
                  <Button
                    href={`./${func.href}`}
                    title={func.name}
                    icon={{ gficon: func.gficon }}
                  >
                    {func.name}
                  </Button>
                </li>
              ))}
            </>
          )}
        </ul>
      </nav>
    </SidebarContainer>
  );
}

function CodePreview(props: { code: string }) {
  const { code } = props;

  return (
    <div className={codecCSS.codePreview}>
      <CopyBlock
        text={code}
        language="jsx"
        showLineNumbers={true}
        startingLineNumber={1}
        theme={{
          ...dracula,
          backgroundColor: "rgba(0,0,0,0)",
          codeColor: "var(--text)",
          textColor: "var(--text)",
          functionColor: "var(--text)",
          lineNumberColor: "var(--text)",
          commentColor: "var(--text)",
        }}
      />
    </div>
  );
}

function ExampleUsage(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "5px",
        marginTop: "10px",
      }}
    >
      {children}
    </div>
  );
}
