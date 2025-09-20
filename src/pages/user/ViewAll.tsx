import { Fragment, useEffect, useState } from "react";
import { UserType } from "../../types";
import Section from "../../components/Section";
import Carousel from "../../components/Carousel";
import css from "../../styles/pages/user/viewAll.module.css";
import SidebarUser from "../../components/SidebarUser";
import ListItem from "../../components/ListItem";
import FirebaseGetRealtimeUsersByLastOnline from "../../functions/firebase/storage/useRealtimeUsersByLastOnline";

export function UserViewAll() {
  const [users, setUsers] = useState<{ value: UserType; id: string }[]>([]);

  useEffect(() => {
    FirebaseGetRealtimeUsersByLastOnline(
      setUsers as React.Dispatch<React.SetStateAction<unknown>>
    );
  }, []);

  return (
    <Section id="users-view-all">
      <Carousel
        className={css.carousel}
        title="Users"
        defaultView="grid"
        multipleViews={true}
        listView={
          <>
            {users.map((user, index) => (
              <Fragment key={index}>
                <ListItem
                  title={user.value.about.displayName}
                  subTitle={
                    "@" +
                    user.value.about.userName +
                    " | " +
                    user.value.about.firstName +
                    " " +
                    user.value.about.lastName
                  }
                  date={user.value.info.lastOnline}
                  href={"./" + user.id}
                />
              </Fragment>
            ))}
          </>
        }
      >
        <>
          {users.map((user) => (
            <Fragment key={user.id}>
              <SidebarUser userData={user.value} userId={user.id} />
            </Fragment>
          ))}
        </>
      </Carousel>
    </Section>
  );
}
