import { Link } from "react-router-dom";
import css from "../../styles/pages/dashboard/create.module.css";

const links = [
  {
    title: "Recipe",
    href: "/recipe/create",
  },
  {
    title: "Project",
    href: "/project/create",
  },
  {
    title: "Blog Post",
    href: "/blog/create",
  },
]

export default function DashboardCreate() {
  return (
    <section className={css.create}>
      <div className={css.container}>
        <h2>Create New:</h2>
        <div className={css.links}>
          {links.map((link) => (
            <Link to={link.href}>{link.title}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
