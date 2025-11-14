import { Link, Navigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Section from "../components/Section";
import { SidebarContainer } from "../components/Sidebar/SidebarContainer";
import SideBySide from "../components/SideBySide";
import Input from "../components/Input";
import InputToggle from "../components/InputToggle";
import InputGroup from "../components/InputGroup";
import InputDropdown from "../components/InputDropdown";
import InputDate from "../components/InputDate";
import InputColor from "../components/InputColor";
import Carousel from "../components/Carousel";
import GridItem from "../components/GridItem";
import ListItem from "../components/ListItem";
import { CopyBlock, dracula } from "react-code-blocks";
import css from "../styles/pages/developer.module.css";
import snippetCSS from "../styles/components/codeSnippet.module.css";
import previewCSS from "../styles/components/codePreview.module.css";
import propsCSS from "../styles/components/codeProps.module.css";
import PageSeoWrapper from "../components/PageSeoWrapper";
import { separator, title } from "../App";
import SidebarButtonContainer from "../components/Sidebar/SidebarButtonContainer";
import SidebarTitle from "../components/Sidebar/SidebarTitle";
import toTitleCase from "../functions/toTitleCase";
import ShareModal from "../components/ShareModal";

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
                <Section
                  key={component.name}
                  id={component.name}
                  container={{ className: css.container }}
                >
                  <h2>{component.name}</h2>
                  <p className={css.description}>{component.description}</p>
                  <ExampleUsage>{component.component}</ExampleUsage>
                  <CodePreview code={component.exampleCode} />
                  <Props props={component.props} />
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
      <Section id="functions" container={{ className: css.container }}>
        {functions.map((func) => {
          if (func.href === sectionID) {
            return (
              <PageSeoWrapper
                title={`${func.name} ${separator} Functions ${separator} Developer ${separator} ${title}`}
                description={`Developer documentation of ${func.name} for ${title}`}
              >
                <Section key={func.name} id={func.name}>
                  <h2>{func.name}</h2>
                  <p className={css.description}>{func.description}</p>
                  <CodePreview code={func.exampleCode} />
                  {func.props && <Props props={func.props} />}
                  {func.returns && <Returns returnInfo={func.returns} />}
                </Section>
              </PageSeoWrapper>
            );
          }
        })}
      </Section>
    </PageSeoWrapper>
  );
}

function TypesView() {
  const { sectionID } = useParams();
  if (!sectionID) {
    return <Navigate to={"./" + types[0].href} />;
  }

  return (
    <PageSeoWrapper
      title={`Types ${separator} Developer ${separator} ${title}`}
      description={`Developer documentation of types for ${title}`}
    >
      <Section id="types">
        {types.map((type) => {
          if (type.href === sectionID) {
            return (
              <PageSeoWrapper
                title={`${type.name} ${separator} Types ${separator} Developer ${separator} ${title}`}
                description={`Developer documentation of ${type.name} for ${title}`}
              >
                <Section
                  key={type.name}
                  id={type.name}
                  container={{ className: css.container }}
                >
                  <h2>{type.name}</h2>
                  <p className={css.description}>{type.description}</p>
                  {type.props && <Props props={type.props} />}
                  <CodePreview code={type.typeDefinition} />
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
  {
    name: "Types",
    href: "types",
    gficon: "signpost",
    description: "A list of TypeScript types and interfaces.",
    component: <TypesView />,
  },
];

const components = [
  {
    name: "Button",
    href: "button",
    gficon: "smart_button",
    description: "A clickable button component.",
    component: (
      <Button onClick={() => {}} title="Click Me" style="primary">
        Click Me
      </Button>
    ),
    exampleCode: `<Button onClick={() => {
      alert("Button clicked!");
    }} 
    title="Click Me">
      Click Me
  </Button>`,
    props: [
      {
        name: "onClick",
        type: "function",
        description: "Function to call when the button is clicked.",
      },
      {
        name: "type",
        type: "string | undefined",
        description: "The button type attribute.",
        acceptedValues: ["button", "submit", "reset"],
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS class names.",
      },
      {
        name: "tabIndex",
        type: "number",
        description: "The tab index of the button.",
      },
      {
        name: "title",
        type: "string",
        description: "The title attribute for the button.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the button is disabled.",
      },
      {
        name: "style",
        type: "ButtonStyle",
        typeLink: "../types/buttonStyle",
        description: "The style variant of the button.",
      },
      {
        name: "icon",
        type: "Icon",
        typeLink: "../types/icon",
        description: "Icon to display in the button.",
      },
      {
        name: "href",
        type: "string",
        description: "URL for navigation when button is used as a link.",
      },
      {
        name: "target",
        type: "'newTab' | undefined",
        description: "Opens link in a new tab when set to 'newTab'.",
      },
      {
        name: "external",
        type: "boolean",
        description: "Whether the link is external (uses Link component).",
      },
      {
        name: "externalClassName",
        type: "string",
        description: "CSS class name for the external icon.",
      },
      {
        name: "pageNavigation",
        type: "boolean",
        description:
          "Whether the button is used for page navigation with # links.",
      },
      {
        name: "hidden",
        type: "'siteNavigation' | 'pageNavigation' | undefined",
        description: "Hides the button for specific navigation contexts.",
      },
      {
        name: "loading",
        type: "boolean",
        description: "Shows a loading state for the button.",
      },
      {
        name: "width",
        type: "string",
        description: "Sets the width of the button.",
      },
      {
        name: "isBeta",
        type: "boolean",
        description: "Shows a beta tag on the button.",
      },
      {
        name: "betaTagClassName",
        type: "string",
        description: "CSS class name for the beta tag.",
      },
      {
        name: "centered",
        type: "boolean",
        description: "Centers the button.",
      },
      {
        name: "onBlur",
        type: "function",
        description: "Function to call when the button loses focus.",
      },
      {
        name: "isActiveDisable",
        type: "boolean",
        description: "Disables the active state styling for NavLink buttons.",
      },
      {
        name: "children",
        type: "ReactNode",
        description: "The content to display inside the button.",
      },
    ],
  },
  {
    name: "SideBySide",
    href: "sideBySide",
    gficon: "view_sidebar",
    description:
      "A layout component for side-by-side content. Automatically adjusts for smaller screens.",
    component: (
      <SideBySide leftWidth="200px">
        <ExampleDiv color="var(--primary)">Left Content</ExampleDiv>
        <ExampleDiv color="var(--secondary)">Right Content</ExampleDiv>
      </SideBySide>
    ),
    exampleCode: `<SideBySide leftWidth="200px">
    <div>Left Content</div>
    <div>Right Content</div>
  </SideBySide>`,
    props: [
      {
        name: "leftWidth",
        type: "string",
        description: "The width of the left side content.",
      },
    ],
  },
  {
    name: "ShareModal",
    href: "shareModal",
    gficon: "qr_code",
    description: "A modal component to display a QR code for a given link.",
    component: (
      <ShareModal
        url="https://example.com"
        visibility={"demo"}
        setVisibility={() => {}}
      />
    ),
    exampleCode: `import { ShareModal } from "path/to/ShareModal";

<ShareModal
  url="https://example.com"
  visibility={true}
  setVisibility={() => {}}
/>`,
    props: [
      {
        name: "link",
        type: "string",
        description: "The URL to generate the QR code for.",
      },
      {
        name: "visible",
        type: "boolean",
        description: "Controls the visibility of the modal.",
      },
      {
        name: "close",
        type: "function",
        description: "Function to call to close the modal.",
      },
    ],
  },
  {
    name: "Input",
    href: "input",
    gficon: "text_fields",
    description:
      "A versatile input component supporting various input types including text, email, password, number, tel, url, and textarea.",
    component: (
      <Input
        id="example-input"
        label="Example Input"
        type="text"
        placeholder="Enter some text..."
      />
    ),
    exampleCode: `<Input
  id="email-input"
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required={true}
  onChange={(e) => console.log(e.target.value)}
/>`,
    props: [
      {
        name: "id",
        type: "string",
        description: "The unique identifier for the input element.",
      },
      {
        name: "label",
        type: "string",
        description: "The label text displayed above the input.",
      },
      {
        name: "name",
        type: "string",
        description: "The name attribute for the input element.",
      },
      {
        name: "type",
        type: "'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea'",
        description: "The type of input to render.",
      },
      {
        name: "required",
        type: "boolean",
        description: "Whether the input is required.",
      },
      {
        name: "placeholder",
        type: "string",
        description: "Placeholder text for the input.",
      },
      {
        name: "value",
        type: "string | number",
        description: "The controlled value of the input.",
      },
      {
        name: "onChange",
        type: "(e: React.ChangeEvent<HTMLInputElement>) => void",
        description: "Function called when the input value changes.",
      },
      {
        name: "onSubmit",
        type: "(e: React.ChangeEvent<HTMLInputElement>) => void",
        description: "Function called when the input is submitted.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the input is disabled.",
      },
      {
        name: "forgotPasswordHref",
        type: "string",
        description:
          "Link to the forgot password page (only for password type).",
      },
      {
        name: "maxLength",
        type: "number",
        description: "Maximum number of characters allowed.",
      },
      {
        name: "minLength",
        type: "number",
        description: "Minimum number of characters required.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS class names for the input container.",
      },
      {
        name: "isInvalid",
        type: "boolean",
        description: "Whether the input is in an invalid state.",
      },
    ],
  },
  {
    name: "InputToggle",
    href: "inputToggle",
    gficon: "toggle_on",
    description: "A toggle/checkbox input component with a label.",
    component: (
      <InputToggle
        id="example-toggle"
        label="Enable Feature"
        checked={false}
        onChange={() => {}}
      />
    ),
    exampleCode: `import { useState } from "react";

const [isEnabled, setIsEnabled] = useState(false);

<InputToggle
  id="feature-toggle"
  label="Enable Feature"
  checked={isEnabled}
  onChange={(checked) => setIsEnabled(checked)}
/>`,
    props: [
      {
        name: "id",
        type: "string",
        description: "The unique identifier for the toggle input element.",
      },
      {
        name: "label",
        type: "string",
        description: "The label text displayed for the toggle.",
      },
      {
        name: "checked",
        type: "boolean",
        description: "The controlled checked state of the toggle.",
      },
      {
        name: "onChange",
        type: "(checked: boolean) => void",
        description: "Function called when the toggle state changes.",
      },
    ],
  },
  {
    name: "InputGroup",
    href: "inputGroup",
    gficon: "view_week",
    description:
      "A container component to group multiple input elements together.",
    component: (
      <InputGroup direction="row">
        <Input id="first-name" label="First Name" type="text" />
        <Input id="last-name" label="Last Name" type="text" />
      </InputGroup>
    ),
    exampleCode: `<InputGroup direction="row" fullWidth={true}>
  <Input id="first-name" label="First Name" type="text" />
  <Input id="last-name" label="Last Name" type="text" />
</InputGroup>`,
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        description: "The input components to group together.",
      },
      {
        name: "direction",
        type: "string",
        description:
          "The layout direction for the inputs (e.g., 'row', 'column').",
      },
      {
        name: "fullWidth",
        type: "boolean",
        description: "Whether the input group should take full width.",
      },
    ],
  },
  {
    name: "InputDropdown",
    href: "inputDropdown",
    gficon: "arrow_drop_down",
    description: "A dropdown/select input component with customizable options.",
    component: (
      <InputDropdown
        id="example-dropdown"
        label="Select Option"
        value="option1"
        values={[
          { label: "Option 1", value: "option1", icon: "star" },
          { label: "Option 2", value: "option2", icon: "favorite" },
          { label: "Option 3", value: "option3", icon: "settings" },
        ]}
        onChange={() => {}}
      />
    ),
    exampleCode: `import { useState } from "react";

const [selected, setSelected] = useState("option1");

<InputDropdown
  id="theme-selector"
  label="Select Theme"
  value={selected}
  values={[
    { label: "Light", value: "light", icon: "light_mode" },
    { label: "Dark", value: "dark", icon: "dark_mode" },
    { label: "Auto", value: "auto", icon: "brightness_auto" },
  ]}
  onChange={(value) => setSelected(value)}
/>`,
    props: [
      {
        name: "id",
        type: "string",
        description: "The unique identifier for the dropdown element.",
      },
      {
        name: "label",
        type: "string",
        description: "The label text displayed above the dropdown.",
      },
      {
        name: "value",
        type: "string",
        description: "The currently selected value.",
      },
      {
        name: "values",
        type: "{ icon?: string; label: string; value: string }[]",
        description:
          "Array of options with optional icons, labels, and values.",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        description: "Function called when a new option is selected.",
      },
    ],
  },
  {
    name: "InputDate",
    href: "inputDate",
    gficon: "calendar_today",
    description: "A date picker input component.",
    component: (
      <InputDate
        id="example-date"
        label="Select Date"
        value="2025-11-14"
        onChange={() => {}}
      />
    ),
    exampleCode: `import { useState } from "react";

const [date, setDate] = useState("2025-11-14");

<InputDate
  id="birth-date"
  label="Date of Birth"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  required={true}
/>`,
    props: [
      {
        name: "id",
        type: "string",
        description: "The unique identifier for the date input element.",
      },
      {
        name: "label",
        type: "string",
        description: "The label text displayed above the date input.",
      },
      {
        name: "value",
        type: "string",
        description: "The controlled date value in YYYY-MM-DD format.",
      },
      {
        name: "onChange",
        type: "(e: React.ChangeEvent<HTMLInputElement>) => void",
        description: "Function called when the date value changes.",
      },
      {
        name: "required",
        type: "boolean",
        description: "Whether the date input is required.",
      },
    ],
  },
  {
    name: "InputColor",
    href: "inputColor",
    gficon: "palette",
    description:
      "A color picker input component using react-color's CompactPicker.",
    component: (
      <InputColor
        id="example-color"
        label="Pick a Color"
        value="#4D4D4D"
        onChange={() => {}}
      />
    ),
    exampleCode: `import { useState } from "react";

const [color, setColor] = useState("#4D4D4D");

<InputColor
  id="theme-color"
  label="Primary Color"
  value={color}
  onChange={(value) => setColor(value)}
/>`,
    props: [
      {
        name: "id",
        type: "string",
        description: "The unique identifier for the color input element.",
      },
      {
        name: "label",
        type: "string",
        description: "The label text displayed above the color picker.",
      },
      {
        name: "value",
        type: "string",
        description:
          "The controlled color value in hex format (e.g., '#4D4D4D').",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        description: "Function called when a new color is selected.",
      },
    ],
  },
  {
    name: "Carousel",
    href: "carousel",
    gficon: "view_carousel",
    description:
      "A carousel component with multiple view modes (column, grid, list) and navigation controls.",
    component: (
      <Carousel
        title="Example Carousel"
        multipleViews={true}
        defaultView="column"
        className=""
      >
        <ExampleDiv color="var(--primary)">Item 1</ExampleDiv>
        <ExampleDiv color="var(--secondary)">Item 2</ExampleDiv>
        <ExampleDiv color="var(--primary)">Item 3</ExampleDiv>
      </Carousel>
    ),
    exampleCode: `<Carousel
  title="My Items"
  multipleViews={true}
  hasChildViews={false}
  defaultView="column"
  className="custom-carousel"
  titleLink={{ text: "View All", href: "/items" }}
  showCreateButton="overlay"
>
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</Carousel>`,
    props: [
      {
        name: "children",
        type: "ReactNode",
        description: "The content to display in the carousel.",
      },
      {
        name: "listView",
        type: "ReactNode",
        description: "Optional content to display when in list view mode.",
      },
      {
        name: "title",
        type: "string",
        description: "The title displayed in the carousel header.",
      },
      {
        name: "multipleViews",
        type: "boolean",
        description:
          "Whether to show view mode toggle buttons (column/grid/list).",
      },
      {
        name: "hasChildViews",
        type: "boolean",
        description: "Whether to show child view controls in list mode.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS class names for the carousel.",
      },
      {
        name: "titleLink",
        type: "{ text: string; href: string }",
        description: "Optional link displayed next to the title.",
      },
      {
        name: "defaultView",
        type: "string",
        description: "The default view mode ('column', 'grid', or 'list').",
      },
      {
        name: "showCreateButton",
        type: "ItemTypes | 'overlay'",
        description:
          "Shows a create button for the specified item type (staff only).",
      },
    ],
  },
  {
    name: "GridItem",
    href: "gridItem",
    gficon: "grid_view",
    description:
      "A grid item component for displaying content with thumbnail, title, and metadata in a grid layout.",
    component: (
      <GridItem
        slug="example-item"
        href="items"
        item={{
          data: {
            title: "Example Item",
            subTitle: "Example Subtitle",
          },
          metaData: {
            thumbnail: "https://via.placeholder.com/300x200",
            date: {
              modified: new Date().toISOString(),
            },
            collection: "example-collection",
            collectionName: "Example Collection",
          },
        }}
        hasThumbnail={true}
        style={{
          maxWidth: "350px",
        }}
      />
    ),
    exampleCode: `<GridItem
  slug="my-item"
  href="items"
  item={{
    data: {
      title: "My Item",
      subTitle: "Subtitle",
    },
    metaData: {
      thumbnail: "/path/to/image.jpg",
      date: {
        modified: "2025-11-14T00:00:00Z",
      },
      collection: true,
      collectionName: "My Collection",
    },
  }}
  hasThumbnail={true}
  style={{ width: '300px' }}
/>`,
    props: [
      {
        name: "slug",
        type: "string",
        description: "The unique identifier/slug for the item.",
      },
      {
        name: "style",
        type: "React.CSSProperties",
        description: "Optional inline styles for the grid item.",
      },
      {
        name: "item",
        type: "GridItemProps",
        typeLink: "../types/gridItemProps",
        description:
          "The item data including title, subtitle, thumbnail, and metadata.",
      },
      {
        name: "href",
        type: "string",
        description: "The base URL path for the item link.",
      },
      {
        name: "hasThumbnail",
        type: "boolean",
        description: "Whether to display the thumbnail image.",
      },
    ],
  },
  {
    name: "ListItem",
    href: "listItem",
    gficon: "list",
    description:
      "A list item component for displaying content in a list format with title, subtitle, and date.",
    component: (
      <ListItem
        title="Example List Item"
        subTitle="Example Subtitle"
        href="/items/example"
        date={new Date().toISOString()}
      />
    ),
    exampleCode: `<ListItem
  title="My Article"
  subTitle="Technology"
  href="/articles/my-article"
  date="2025-11-14T00:00:00Z"
/>`,
    props: [
      {
        name: "title",
        type: "string",
        description: "The main title of the list item.",
      },
      {
        name: "subTitle",
        type: "string",
        description: "The subtitle or category of the list item.",
      },
      {
        name: "href",
        type: "string",
        description: "The URL the list item links to.",
      },
      {
        name: "date",
        type: "string",
        description: "The date string (ISO format) to display.",
      },
    ],
  },
];
const functions = [
  {
    name: "firebaseGetRealtimeData",
    href: "firebaseGetRealtimeData",
    gficon: "functions",
    description:
      "A function to get realtime data from Firebase Firestore with live updates.",
    exampleCode: `import firebaseGetRealtimeData from "../functions/firebase/storage/useRealtimeData";
import { useEffect, useState } from "react";

function MyComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Subscribe to realtime updates
    const unsubscribe = firebaseGetRealtimeData(
      "users",
      "user123",
      setData,
      setError
    );

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe.then(unsub => unsub());
      }
    };
  }, []);

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
}`,
    props: [
      {
        name: "pathID",
        type: "string",
        description: "The Firestore collection path (e.g., 'users', 'posts').",
      },
      {
        name: "docID",
        type: "string",
        description: "The document ID to listen to.",
      },
      {
        name: "setData",
        type: "React.Dispatch<React.SetStateAction<unknown>>",
        description: "State setter function to update data when changes occur.",
      },
      {
        name: "setError",
        type: "React.Dispatch<React.SetStateAction<boolean>>",
        description: "Optional state setter to track error state.",
      },
    ],
    returns: {
      type: "Promise<Unsubscribe>",
      description:
        "Returns a promise that resolves to an unsubscribe function to stop listening to updates.",
    },
  },
  {
    name: "checkIfDocExists",
    href: "checkIfDocExists",
    gficon: "search",
    description: "Checks if a document exists in a Firestore collection.",
    exampleCode: `import { checkIfDocExists } from "../functions/firebase/storage/checkIfDocExists";

const exists = await checkIfDocExists("users", "user123");
if (exists) {
  console.log("Document exists!");
} else {
  console.log("Document not found");
}`,
    props: [
      {
        name: "pathID",
        type: "string",
        description: "The Firestore collection path.",
      },
      {
        name: "docId",
        type: "string",
        description: "The document ID to check.",
      },
    ],
    returns: {
      type: "Promise<boolean>",
      description: "Returns true if the document exists, false otherwise.",
    },
  },
  {
    name: "firebaseCreateData",
    href: "firebaseCreateData",
    gficon: "add_circle",
    description: "Creates a new document in a Firestore collection with auto-generated ID.",
    exampleCode: `import firebaseCreateData from "../functions/firebase/storage/createData";

const newData = {
  title: "My New Item",
  createdAt: new Date().toISOString(),
};

const docRef = await firebaseCreateData("items", newData);
console.log("New document created with ID:", docRef?.id);`,
    props: [
      {
        name: "collection",
        type: "string",
        description: "The Firestore collection to add the document to.",
      },
      {
        name: "data",
        type: "unknown",
        description: "The data to store in the new document.",
      },
    ],
    returns: {
      type: "Promise<DocumentReference | undefined>",
      description: "Returns a document reference to the newly created document.",
    },
  },
  {
    name: "firebaseDeleteData",
    href: "firebaseDeleteData",
    gficon: "delete",
    description: "Deletes a document from a Firestore collection.",
    exampleCode: `import firebaseDeleteData from "../functions/firebase/storage/deleteData";

await firebaseDeleteData("users", "user123");
console.log("Document deleted successfully");`,
    props: [
      {
        name: "pathID",
        type: "string",
        description: "The Firestore collection path.",
      },
      {
        name: "docID",
        type: "string",
        description: "The document ID to delete.",
      },
    ],
    returns: {
      type: "Promise<void>",
      description: "Returns a promise that resolves when deletion is complete.",
    },
  },
  {
    name: "firebaseGetData",
    href: "firebaseGetData",
    gficon: "download",
    description: "Retrieves a single document from Firestore (one-time fetch).",
    exampleCode: `import firebaseGetData from "../functions/firebase/storage/getData";

const userData = await firebaseGetData("users", "user123");
console.log("User data:", userData);`,
    props: [
      {
        name: "pathID",
        type: "string",
        description: "The Firestore collection path.",
      },
      {
        name: "docID",
        type: "string",
        description: "The document ID to retrieve.",
      },
    ],
    returns: {
      type: "Promise<DocumentData | undefined>",
      description: "Returns the document data or undefined if not found.",
    },
  },
  {
    name: "firebaseGetDataWithKey",
    href: "firebaseGetDataWithKey",
    gficon: "key",
    description: "Retrieves a document from Firestore with an additional key verification.",
    exampleCode: `import { firebaseGetDataWithKey } from "../functions/firebase/storage/getData";

const data = await firebaseGetDataWithKey("items", "item123", "secret-key");
if (data) {
  console.log("Protected data:", data);
}`,
    props: [
      {
        name: "pathID",
        type: "string",
        description: "The Firestore collection path.",
      },
      {
        name: "docID",
        type: "string",
        description: "The document ID to retrieve.",
      },
      {
        name: "key",
        type: "string",
        description: "The key value to verify (must match metaData.key).",
      },
    ],
    returns: {
      type: "Promise<unknown>",
      description: "Returns the document data if key matches, undefined otherwise.",
    },
  },
  {
    name: "firebaseSetData",
    href: "firebaseSetData",
    gficon: "save",
    description: "Sets or updates a document in Firestore with optional toast notifications.",
    exampleCode: `import firebaseSetData from "../functions/firebase/storage/setData";

const data = { name: "John", age: 30 };

// With toast notifications
await firebaseSetData("users", "user123", data, {
  toast: {
    loading: "Saving user...",
    success: "User saved!",
    error: "Failed to save user",
  },
});

// Without toast
await firebaseSetData("users", "user123", data, {
  toast: { noToast: true },
});`,
    props: [
      {
        name: "pathID",
        type: "string",
        description: "The Firestore collection path.",
      },
      {
        name: "docID",
        type: "string",
        description: "The document ID to set/update.",
      },
      {
        name: "data",
        type: "unknown",
        description: "The data to store in the document.",
      },
      {
        name: "options",
        type: "object",
        description: "Optional configuration for toast notifications.",
      },
      {
        name: "options.toast.noToast",
        type: "boolean",
        description: "If true, disables toast notifications.",
      },
      {
        name: "options.toast.loading",
        type: "string",
        description: "Loading message for toast.",
      },
      {
        name: "options.toast.success",
        type: "string",
        description: "Success message for toast.",
      },
      {
        name: "options.toast.error",
        type: "string",
        description: "Error message for toast.",
      },
    ],
    returns: {
      type: "Promise<void>",
      description: "Returns a promise that resolves when the operation completes.",
    },
  },
  {
    name: "getDataByDate",
    href: "getDataByDate",
    gficon: "calendar_today",
    description: "Retrieves all documents from a collection ordered by modification date.",
    exampleCode: `import getDataByDate from "../functions/firebase/storage/getDataByDate";

const items = await getDataByDate("blog");
items.forEach(item => {
  console.log("ID:", item.id, "Data:", item.value);
});`,
    props: [
      {
        name: "firebaseCollection",
        type: "string",
        description: "The Firestore collection to query.",
      },
    ],
    returns: {
      type: "Promise<{ id: string; value: unknown }[]>",
      description: "Returns an array of documents with their IDs and data, ordered by modified date.",
    },
  },
  {
    name: "getDataByDateExcludeSlug",
    href: "getDataByDateExcludeSlug",
    gficon: "filter_list",
    description: "Retrieves documents ordered by date, excluding a specific document ID.",
    exampleCode: `import getDataByDateExcludeSlug from "../functions/firebase/storage/getDataByDateExcludeSlug";

// Get all blog posts except the current one
const relatedPosts = await getDataByDateExcludeSlug("blog", "current-post-id");`,
    props: [
      {
        name: "firebaseCollection",
        type: "string",
        description: "The Firestore collection to query.",
      },
      {
        name: "slugExclude",
        type: "string",
        description: "The document ID to exclude from results.",
      },
    ],
    returns: {
      type: "Promise<{ id: string; value: unknown }[]>",
      description: "Returns an array of documents excluding the specified slug.",
    },
  },
  {
    name: "arrayMove",
    href: "arrayMove",
    gficon: "swap_vert",
    description: "Moves an element in an array from one index to another, returning a new array.",
    exampleCode: `import { arrayMove } from "../functions/arrayMove";

const items = ["A", "B", "C", "D"];
const reordered = arrayMove(items, 0, 2);
// Result: ["B", "C", "A", "D"]

// Useful for drag-and-drop reordering
const handleDrop = (fromIndex: number, toIndex: number) => {
  setItems(arrayMove(items, fromIndex, toIndex));
};`,
    props: [
      {
        name: "array",
        type: "T[]",
        description: "The array to modify.",
      },
      {
        name: "fromIndex",
        type: "number",
        description: "The index of the element to move.",
      },
      {
        name: "toIndex",
        type: "number",
        description: "The destination index for the element.",
      },
    ],
    returns: {
      type: "T[]",
      description: "Returns a new array with the element moved to the new position.",
    },
  },
  {
    name: "devConsole",
    href: "devConsole",
    gficon: "terminal",
    description: "A development-only console wrapper that only logs in development mode.",
    exampleCode: `import devConsole from "../functions/devConsole";

// These only output in development mode
devConsole.log("Debug message", { data: "value" });
devConsole.error("An error occurred", error);
devConsole.warn("This is a warning");
devConsole.info("Some information");

// In production, these calls do nothing`,
    props: [
      {
        name: "log",
        type: "(message: unknown, ...optionalParams: unknown[]) => void",
        description: "Logs a message to console in development mode only.",
      },
      {
        name: "error",
        type: "(message: unknown, ...optionalParams: unknown[]) => void",
        description: "Logs an error to console in development mode only.",
      },
      {
        name: "warn",
        type: "(message: unknown, ...optionalParams: unknown[]) => void",
        description: "Logs a warning to console in development mode only.",
      },
      {
        name: "info",
        type: "(message: unknown, ...optionalParams: unknown[]) => void",
        description: "Logs info to console in development mode only.",
      },
    ],
    returns: {
      type: "void",
      description: "Does not return a value.",
    },
  },
  {
    name: "removeEmpty",
    href: "removeEmpty",
    gficon: "filter_alt",
    description: "Recursively removes undefined properties from an object.",
    exampleCode: `import { removeEmpty } from "../functions/removeEmpty";

const data = {
  name: "John",
  age: undefined,
  address: {
    street: "123 Main St",
    city: undefined,
    country: "USA"
  }
};

const cleaned = removeEmpty(data);
// Result: { name: "John", address: { street: "123 Main St", country: "USA" } }`,
    props: [
      {
        name: "obj",
        type: "{ [key: string]: unknown }",
        description: "The object to clean of undefined values.",
      },
    ],
    returns: {
      type: "object",
      description: "Returns a new object with all undefined properties removed.",
    },
  },
  {
    name: "toTitleCase",
    href: "toTitleCase",
    gficon: "title",
    description: "Converts a string to title case (capitalizes first letter of each word).",
    exampleCode: `import toTitleCase from "../functions/toTitleCase";

const title = toTitleCase("hello world");
// Result: "Hello World"

const name = toTitleCase("john doe");
// Result: "John Doe"

const phrase = toTitleCase("the quick brown fox");
// Result: "The Quick Brown Fox"`,
    props: [
      {
        name: "str",
        type: "string",
        description: "The string to convert to title case.",
      },
    ],
    returns: {
      type: "string",
      description: "Returns the string with each word capitalized.",
    },
  },
];

const types = [
  {
    name: "ButtonStyle",
    href: "buttonStyle",
    gficon: "gesture_select",
    description: "Type for button style variants.",
    typeDefinition: `type ButtonStyle = 'primary' | 'secondary' | 'danger' | 'success' | 'remove';`,
  },
  {
    name: "Icon",
    href: "icon",
    gficon: "image",
    description: "Type for icon properties.",
    typeDefinition: `type Icon = {
      gficon?: string;
      gfClassName?: string;
      inline?: ReactNode;
    };`,
    props: [
      {
        name: "gficon",
        type: "string",
        description: "The name of the Google Fonts icon to use.",
      },
      {
        name: "gfClassName",
        type: "string",
        description: "The CSS class name for the Google Fonts icon.",
      },
      {
        name: "inline",
        type: "ReactNode",
        description: "Inline React node to display as the icon.",
      },
    ],
  },
  {
    name: "ItemTypes",
    href: "itemTypes",
    gficon: "category",
    description:
      "Union type representing all available item types in the application.",
    typeDefinition: `type ItemTypes =
  | "projects"
  | "recipes"
  | "albums"
  | "blog"
  | "vehicles"
  | "videos";`,
  },
  {
    name: "GridItemProps",
    href: "gridItemProps",
    gficon: "grid_view",
    description:
      "Interface for grid item data structure including content and metadata.",
    typeDefinition: `interface GridItemProps {
  data: {
    title: string;
    subTitle: string;
    description?: string;
  };
  metaData: {
    date: {
      created?: string;
      modified: string;
    };
    thumbnail: string;
    hasThumbnail?: boolean;
    images?: string[];
    tags?: string[];
    collection?: string;
    collectionName?: string;
    authorID?: string;
  };
}`,
    props: [
      {
        name: "data",
        type: "object",
        description: "The main content data for the item.",
      },
      {
        name: "data.title",
        type: "string",
        description: "The title of the item.",
      },
      {
        name: "data.subTitle",
        type: "string",
        description: "The subtitle of the item.",
      },
      {
        name: "data.description",
        type: "string",
        description: "Optional description of the item.",
      },
      {
        name: "metaData",
        type: "object",
        description: "Metadata associated with the item.",
      },
      {
        name: "metaData.date",
        type: "object",
        description: "Date information for the item.",
      },
      {
        name: "metaData.date.created",
        type: "string",
        description: "Optional creation date in ISO format.",
      },
      {
        name: "metaData.date.modified",
        type: "string",
        description: "Last modified date in ISO format.",
      },
      {
        name: "metaData.thumbnail",
        type: "string",
        description: "URL or path to the thumbnail image.",
      },
      {
        name: "metaData.hasThumbnail",
        type: "boolean",
        description: "Whether the item has a thumbnail.",
      },
      {
        name: "metaData.images",
        type: "string[]",
        description: "Optional array of image URLs/paths.",
      },
      {
        name: "metaData.tags",
        type: "string[]",
        description: "Optional array of tags for the item.",
      },
      {
        name: "metaData.collection",
        type: "string",
        description: "Optional collection identifier the item belongs to.",
      },
      {
        name: "metaData.collectionName",
        type: "string",
        description: "Optional display name of the collection.",
      },
      {
        name: "metaData.authorID",
        type: "string",
        description: "Optional author identifier.",
      },
    ],
  },
];

function Sidebar(props: { pageID?: string }) {
  const { pageID } = props;

  return (
    <SidebarContainer>
      <SidebarTitle
        title={pageID ? toTitleCase(pageID) : "Developer"}
        subtitle={toTitleCase(
          (pageID ? "" : "Developer ") + "documentation and resources."
        )}
      />
      <SidebarButtonContainer navigation>
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
              title="Back to overview"
              icon={{ gficon: "arrow_back" }}
              isActiveDisable={true}
            >
              Back to overview
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
        {pageID === "types" && (
          <>
            {types.map((type) => (
              <li key={type.name}>
                <Button
                  href={`./${type.href}`}
                  title={type.name}
                  icon={{ gficon: type.gficon }}
                >
                  {type.name}
                </Button>
              </li>
            ))}
          </>
        )}
      </SidebarButtonContainer>
    </SidebarContainer>
  );
}

function CodePreview(props: { code: string }) {
  const { code } = props;

  return (
    <div className={snippetCSS.wrapper}>
      <h3>Code</h3>
      <div className={snippetCSS.codePreview}>
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
    </div>
  );
}

function ExampleUsage(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div className={previewCSS.wrapper}>
      <h3>Example Usage</h3>
      <div className={previewCSS.preview}>
        <div className={previewCSS.container}>{children}</div>
      </div>
    </div>
  );
}

function Props(props: {
  props: Array<{
    name: string;
    type: string;
    typeLink?: string;
    description: string;
  }>;
}) {
  const { props: propList } = props;

  return (
    <div className={propsCSS.wrapper}>
      <h3>Props</h3>
      <div className={propsCSS.tableWrapper}>
        <table className={propsCSS.propsTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {propList.map((prop) => (
              <tr key={prop.name}>
                <td>{prop.name}</td>
                <td>
                  {prop.typeLink ? (
                    <Link to={prop.typeLink}>{prop.type}</Link>
                  ) : (
                    prop.type
                  )}
                </td>
                <td>{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Returns(props: { returnInfo: { type: string; description: string } }) {
  const { returnInfo } = props;

  return (
    <div className={propsCSS.wrapper}>
      <h3>Returns</h3>
      <div className={propsCSS.tableWrapper}>
        <table className={propsCSS.propsTable}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{returnInfo.type}</td>
              <td>{returnInfo.description}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExampleDiv(props: { children: React.ReactNode; color: string }) {
  return (
    <div
      style={{ "--_background": props.color } as React.CSSProperties}
      className={css.exampleDiv}
    >
      {props.children}
    </div>
  );
}
