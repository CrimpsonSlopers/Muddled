import React from "react";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { formatStreamDate } from "utils/video_formatters";

const NavListItem = styled(ListItem)`
    && {
        padding: 0;
        cursor: pointer;
    }
`;

const StyledBox = styled(Box)`
    background: ${(props) => (props.selected ? "white" : "transparent")};
    color: ${(props) => (props.selected ? "#7222C2" : "rgba(0, 0, 0, 0.6)")};
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 16px;
    margin: 2px 12px;
    border-radius: 4px;
    user-select: none;
    white-space: nowrap;
    box-shadow: ${(props) =>
        props.selected ? "rgba(33, 35, 38, 0.1) 0px 10px 10px -10px" : "none"};
    transition: all 0.35s ease-in-out;

    &:hover,
    &:focus {
        background-color: ${(props) => (props.selected ? null : "white")};
        box-shadow: rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;
    }
`;

const StyledListItemText = styled(ListItemText)`
    && span {
        font-weight: ${(props) => (props.selected ? 500 : 300)};
    }
`;

export default function NavItems({ sessions, session, onNavClick }) {
    return sessions.map((sess, index) => {
        const selected = session === sess.id;

        return (
            <NavListItem
                key={index}
                component="li"
                onClick={() => onNavClick(sess)}
            >
                <StyledBox selected={selected}>
                    <StyledListItemText
                        primary={formatStreamDate(sess.created_at)}
                        selected={selected}
                    />
                </StyledBox>
            </NavListItem>
        );
    });
}
