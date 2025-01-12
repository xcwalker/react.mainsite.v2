import css from "../../styles/pages/dashboard/create.module.css";
import { NavLinkInternal } from "../../components/Header";

const links = [
  {
    title: "Recipe",
    href: "/recipe/create",
    gficon: "stockpot",
  },
  {
    title: "Project",
    href: "/project/create",
    gficon: "design_services",
  },
  {
    title: "Blog Post",
    href: "/blog/create",
    gficon: "text_snippet",
  },
];

export default function DashboardCreate() {
  return (
    <section className={css.create}>
      <div className={css.container}>
        <h2>Create New:</h2>
        <div className={css.links}>
          {links.map((link) => (
            <NavLinkInternal href={link.href} title={link.title} gficon={link.gficon}/>
          ))}
        </div>
      </div>
    </section>
  );
}
