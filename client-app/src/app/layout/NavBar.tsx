import { Button, Container, Dropdown, Menu, Image } from "semantic-ui-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import useMediaQuery from "../common/hooks/useMediaQuery";
import { ReactComponent as HamburgerSvg } from "../../assets/svgs/hamburger.svg";
import { useState } from "react";
import "./navstyles.css";

export default observer(function NavBar() {
  const {
    userStore: { user, logout },
  } = useStore();
  const matches = useMediaQuery("(min-width: 767px)");
  const [navOpen, setNavOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div className={"navWrapper"}>
        <div className={"nav"}>
          <div className={`${"navcheck"} ${checked && "checked"}`} />
          <div className={"navheader"}>
            <div className={"navtitle"}>
              <img
                src="/assets/logo.png"
                alt="logo"
                style={{
                  width: matches ? "35px" : "35px",
                  height: "inherit",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              />
              <span>Reactivities</span>
              {matches && (
                <Menu.Item
                  as={NavLink}
                  to="/activities"
                  name="Activities"
                  className="activities"
                />
              )}
              {matches && (
                <Menu.Item>
                  <Button
                    as={NavLink}
                    to="/createActivity"
                    positive
                    content="Create Activity"
                  />
                </Menu.Item>
              )}
            </div>
          </div>
          <div className={"navbtn"} onClick={() => setChecked(!checked)}>
            <label htmlFor="navcheck">
              <span></span>
              <span></span>
              <span></span>
            </label>
          </div>

          <div className={"navlinks"}>
            {!matches && (
              <Menu.Item
                as={NavLink}
                to="/activities"
                name="Activities"
                onClick={() => setChecked(!checked)}
                className="activitiesButton"
              />
            )}
            {!matches && (
              <Menu.Item>
                <Button
                  as={NavLink}
                  to="/createActivity"
                  positive
                  content="Create Activity"
                  onClick={() => setChecked(!checked)}
                />
              </Menu.Item>
            )}
            <Menu.Item position="right">
              <Image
                avatar
                spaced="right"
                src={user?.image || "/assets/user.png"}
              />
              <Dropdown pointing="top left" text={user?.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profiles/${user?.username}`}
                    text="My Profile"
                    icon="user"
                    onClick={() => setChecked(!checked)}
                  />
                  <Dropdown.Item onClick={logout} text="Logout" icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </div>
        </div>
      </div>
      {/* <Menu inverted fixed="top">
          <Container className="">
            <Menu.Item as={NavLink} to="/" header>
              <img
                src="/assets/logo.png"
                alt="logo"
                style={{ marginRight: 10 }}
              />
              Reactivities
            </Menu.Item>
            <Menu.Item as={NavLink} to="/activities" name="Activities" />
            <Menu.Item>
              <Button
                as={NavLink}
                to="/createActivity"
                positive
                content="Create Activity"
              />
            </Menu.Item>
            <Menu.Item position="right">
              <Image
                avatar
                spaced="right"
                src={user?.image || "/assets/user.png"}
              />
              <Dropdown pointing="top left" text={user?.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profiles/${user?.username}`}
                    text="My Profile"
                    icon="user"
                  />
                  <Dropdown.Item onClick={logout} text="Logout" icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Container>
        </Menu> */}
    </>
  );
});
