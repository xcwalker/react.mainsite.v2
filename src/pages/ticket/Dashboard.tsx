import { Fragment, useEffect, useState } from "react";
import Carousel from "../../components/Carousel";
import Section from "../../components/Section";
import { TicketType } from "../../types";
import ListItem from "../../components/ListItem";
import toTitleCase from "../../functions/toTitleCase";
import FirebaseGetRealtimeDataByDateForTickets from "../../functions/firebase/storage/useRealtimeDataByDateForTickets";
import devConsole from "../../functions/devConsole";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import { separator, title } from "../../App";

export default function TicketDashboard() {
  const [tickets, setTickets] = useState<{ value: TicketType; id: string }[]>(
    []
  );

  useEffect(() => {
    // Fetch tickets from database and setTickets
    FirebaseGetRealtimeDataByDateForTickets(
      "tickets",
      setTickets as React.Dispatch<React.SetStateAction<unknown>>
    );
  }, []);

  useEffect(() => {
    devConsole.log(tickets);
  }, [tickets]);

  return (
    <PageSeoWrapper
      title={`Ticket Dashboard ${separator} ${title}`}
      description="
        View and manage your support tickets."
    >
      <Section id="ticket-dashboard">
        <Carousel
          title="Tickets"
          defaultView="list"
          className="ticket-carousel"
          multipleViews={false}
          listView={
            <>
              {tickets.map(({ value, id }) => (
                <Fragment key={id}>
                  <ListItem
                    href={id}
                    title={value.data.title}
                    subTitle={`Status: ${toTitleCase(value.metaData.status)} | Priority: ${toTitleCase(
                      value.metaData.priority
                    )}`}
                    date={value.metaData.date.updatedAt}
                  />
                </Fragment>
              ))}
            </>
          }
        >
          <></>
        </Carousel>
      </Section>
    </PageSeoWrapper>
  );
}
