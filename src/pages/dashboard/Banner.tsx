import css from "../../styles/pages/dashboard/banner.module.css";

export default function DashboardBanner() {
  return (
    <section className={css.banner}>
      <div className={css.container}>
        <h1>Welcome Back</h1>
        <div className={css.backdrop} />
        <img src="/background.svg" alt="" className={css.background} />
      </div>
    </section>
  );
}