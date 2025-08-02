import Section from "../../components/Section";
import css from "../../styles/pages/dashboard/search.module.css"
import { NewTabSearch } from "../newTab/Search";

export default function DashboardSearch() {
  return (
    <Section id={css.search} className={css.search}>
      <NewTabSearch
        hasCMDKey={false}
        modifierPressed={false}
        queryURL="https://www.google.com/search?q="
        searchProvider="google"
      />
    </Section>
  );
}