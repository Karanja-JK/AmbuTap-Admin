import React from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { DashboardOutlined, PeopleAlt, DriveEta, TabletMac, SpaOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  listItemLight: {
    color: "#FAFAFA"
  }
});

const NavItems = props => {
  const classes = useStyles();

  const location = useLocation();

  const links = [
    {
      name: "Dashboard",
      icon: DashboardOutlined,
      to: "/",
      regex: new RegExp("^/$")
    },
    {
      name: "Users",
      icon: PeopleAlt,
      to: "/users",
      regex: new RegExp("/users")
    },
    {
        name: "Drivers",
        icon: DriveEta,
        to: "/drivers",
        regex: new RegExp("/drivers")
    },

    {
        name: "Driver Applications",
        icon: TabletMac,
        to: "/driverapplications",
        regex: new RegExp("/driverapplications")
    },

];

  return (
    <List>
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.to}
          style={{ color: "unset", textDecoration: "none" }}
        >
          <ListItem
            className={props.light ? classes.listItemLight : undefined}
            button
            selected={link.regex.test(location.pathname)}
          >
            <ListItemIcon
              className={props.light ? classes.listItemLight : undefined}
            >
              {<link.icon color="inherit" />}
            </ListItemIcon>
            <ListItemText primary={link.name} color="inherit" />
          </ListItem>
        </Link>
      ))}
    </List>
  );
};

NavItems.propTypes = {
  light: PropTypes.bool.isRequired
};

export default NavItems;