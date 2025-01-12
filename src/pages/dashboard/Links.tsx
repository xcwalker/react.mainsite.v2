import css from "../../styles/pages/dashboard/links.module.css";

const links = [
  {
    title: "MOT Check",
    href: "https://www.check-mot.service.gov.uk/",
  },
  {
    title: "Met Office",
    href: "https://www.metoffice.gov.uk/",
  },
  {
    title: "Novo Auto",
    href: "https://www.novoautoltd.co.uk/",
  },
];

export default function DashboardLinks() {
  return (
    <section className={css.links}>
      <h2>Your Links</h2>
      <div className={css.container}>
        {links.map((link, index) => {
          const matches = link.href.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
          const domain = matches && matches[1];
          return (
            <a href={link.href} key={index} className={css.link}>
              <img
                src={
                  "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" +
                  link.href +
                  "&size=50"
                }
                alt=""
                className={css.favicon}
              />
              <span className={css.title}>{link.title}</span>
              <span className={css.domain}>
                {domain !== null && domain.replace("www.", "")}
                {domain === null && link.href}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
