import css from "../../styles/pages/dashboard/banner.module.css";

export default function DashboardBanner(props: { name?: string }) {
  return (
    <section className={css.banner}>
      <div className={css.container}>
        <h1>Welcome Back{props.name && <>, {props.name}</>}</h1>
        <div className={css.backdrop} />
        <img src="/background.svg" alt="" className={css.background} />
      </div>
    </section>
  );
}
