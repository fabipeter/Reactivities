import React, { SyntheticEvent, useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
  Tab,
  Grid,
  Header,
  Card,
  Image,
  TabProps,
  Menu,
  Label,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { UserActivity } from "../../app/models/profile";
import { format } from "date-fns";
import { useStore } from "../../app/stores/store";
import useMediaQuery from "../../app/common/hooks/useMediaQuery";

export default observer(function ProfileActivities() {
  const { profileStore } = useStore();
  const { loadUserActivities, profile, loadingActivities, userActivities } =
    profileStore;
  const matches = useMediaQuery("(min-width: 767px)");
//   const minimatches = useMediaQuery("(min-width: 450px)");
  useEffect(() => {
    loadUserActivities(profile!.username);
  }, [loadUserActivities, profile]);
//   const menuItem = (name: string) => {
//     return (
//       <Menu.Item
//         key={name}
//         style={{ alignSelf: minimatches ? "" : "flex-end" }}
//       >
//         {name}
//       </Menu.Item>
//     );
//   };
  const panes = [
    { menuItem: "Future Events", pane: { key: "future" } },
    { menuItem: "Past Events", pane: { key: "past" } },
    { menuItem: "Hosting", pane: { key: "hosting" } },
  ];
  const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
    loadUserActivities(
      profile!.username,
      panes[data.activeIndex as number].pane.key
    );
  };
  return (
    <Tab.Pane loading={loadingActivities}>
      <Grid stackable>
        <Grid.Column width={16}>
          <Header floated="left" icon="calendar" content={"Activities"} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true, className: "profileEventMenu" }}
            onTabChange={(e, data) => handleTabChange(e, data)}
            className="tabPanme"
          />
          <br />
          <Card.Group itemsPerRow={matches ? 4 : 12}>
            {userActivities.map((activity: UserActivity) => (
              <Card
                as={Link}
                to={`/activities/${activity.id}`}
                key={activity.id}
                fluid={!matches}
              >
                <Image
                  src={`/assets/categoryImages/${activity.category}.jpg`}
                  style={{ minHeight: 100, objectFit: "cover" }}
                />
                <Card.Content>
                  <Card.Header textAlign="center">{activity.title}</Card.Header>
                  <Card.Meta textAlign="center">
                    <div>{format(new Date(activity.date), "do LLL")}</div>
                    <div>{format(new Date(activity.date), "h:mm a")}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
