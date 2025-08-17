import css from "../../styles/pages/dashboard/create.module.css";
import Button from "../../components/Button";
import GFIcon from "../../components/GFIcon";

const links = [
  {
    title: "Recipe",
    href: "/recipes/create",
    gficon: "stockpot",
  },
  {
    title: "Project",
    href: "/projects/create",
    gficon: "design_services",
  },
  {
    title: "Blog Post",
    href: "/blog/create",
    gficon: "text_snippet",
  },
  {
    title: "Album",
    href: "/albums/create",
    gficon: "image",
  },
];

export default function DashboardCreate() {
  return (
    <section className={css.create}>
      <div className={css.container}>
        <h2>Create New:</h2>
        <div className={css.links}>
          {links.map((link) => (
            <Button
              href={link.href}
              title={link.title}
              className={css.content}
            >
              <GFIcon>
                {link.gficon}
              </GFIcon>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
