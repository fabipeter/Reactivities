import { observer } from "mobx-react-lite";
import { Label, Menu, Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import ProfileAbout from "./ProfileAbout";
import ProfileActivities from "./ProfileActivities";
import ProfileFollowings from "./ProfileFollowings";
import ProfilePhotos from "./ProfilePhotos";
import useMediaQuery from "../../app/common/hooks/useMediaQuery";

interface Props {
  profile: Profile;
}

export default observer(function ProfileContent({ profile }: Props) {
  const { profileStore } = useStore();
  const matches = useMediaQuery("(min-width: 450px)");
  const menuItem = (name: string) => {
    return (
      <Menu.Item
        key={name}
        style={{
          padding: matches ?"0.92857143em 1.14285714em":"0.92857143em 0.54285714em",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <Label
          style={{
            fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
            fontSize: matches ? "1rem" : "0.8rem",
            background: "none",
            fontWeight: "400",
            color: "rgba(0,0,0,.87)",
            margin: 0,
            padding: 0,
          }}
        >
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Label>
      </Menu.Item>
    );
  };

  const panes = [
    {
      menuItem: menuItem("about"),
      render: () => <ProfileAbout />,
    },
    {
      menuItem: menuItem("photos"),
      render: () => <ProfilePhotos profile={profile} />,
    },
    {
      menuItem: menuItem("events"),
      render: () => <ProfileActivities />,
    },
    { menuItem: menuItem('followers'), render: () => <ProfileFollowings /> },
    { menuItem: menuItem('following'), render: () => <ProfileFollowings /> },
  ];

  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex)}
    />
  );
});
