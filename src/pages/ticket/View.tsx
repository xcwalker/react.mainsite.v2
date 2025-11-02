import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TicketType } from "../../types";
import firebaseGetRealtimeData from "../../functions/firebase/storage/useRealtimeData";
import ErrorPage from "../../ErrorPage";
import Section from "../../components/Section";
import SideBySide from "../../components/SideBySide";
import LoadingPage from "../../components/Loading";
import SidebarTitle from "../../components/Sidebar/SidebarTitle";
import SidebarDates from "../../components/Sidebar/SidebarDates";
import { SidebarContainer } from "../../components/Sidebar/SidebarContainer";
import SidebarUser from "../../components/Sidebar/SidebarUser";
import css from "../../styles/pages/ticket/view.module.css";
import SidebarUserSimple from "../../components/Sidebar/SidebarUserSimple";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import Button from "../../components/Button";
import firebaseSetData from "../../functions/firebase/storage/setData";
import { RoleProtect } from "../../components/Security/Protect";
import toTitleCase from "../../functions/toTitleCase";
import InputDropdown from "../../components/InputDropdown.tsx";

export default function TicketView() {
  const { ticketId } = useParams<string>();
  const [ticket, setTicket] = useState<TicketType | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!ticketId) {
      setError(true);
      return;
    }

    // Subscribe to real-time updates for the ticket
    firebaseGetRealtimeData(
      "tickets",
      ticketId as string,
      setTicket as React.Dispatch<React.SetStateAction<unknown>>,
      setError,
    ).then(() => {
      return;
    });
  }, [ticketId]);

  if (error) {
    return <ErrorPage code={404} error="Ticket not found" />;
  }

  if (ticket === undefined) {
    return <LoadingPage />;
  }

  return (
    <Section id="view-ticket">
      <SideBySide leftWidth="350px">
        <TicketSidebar ticket={ticket} />
        <TicketContent ticket={ticket} />
      </SideBySide>
    </Section>
  );
}

function TicketSidebar(props: { ticket: TicketType }) {
  const currentUser = useAuth();
  const { ticketId } = useParams();

  return (
    <SidebarContainer>
      <SidebarTitle
        title={props.ticket.data.title}
        subtitle={"Status: " + toTitleCase(props.ticket.metaData.status)}
      />
      <SidebarDates
        created={new Date(props.ticket.metaData.date.createdAt)}
        modified={new Date(props.ticket.metaData.date.updatedAt)}
      />
      {props.ticket.metaData.reporter.id && (
        <SidebarUser userId={props.ticket.metaData.reporter.id} />
      )}
      {props.ticket.metaData.reporter.name &&
        props.ticket.metaData.reporter.email && (
          <SidebarUserSimple
            name={props.ticket.metaData.reporter.name}
            email={props.ticket.metaData.reporter.email}
          />
        )}
      {props.ticket.metaData.assignee && (
        <SidebarUser userId={props.ticket.metaData.assignee} />
      )}
      {!props.ticket.metaData.assignee && (
        <div className={css.unassigned}>
          <span className={css.unassignedText}>Unassigned</span>
          <RoleProtect staffOnly>
            <Button
              className={css.assignButton}
              style="secondary"
              title="Claim Ticket"
              icon={{ gficon: "assignment_ind" }}
              onClick={() => {
                if (!currentUser) return;

                firebaseSetData("tickets", ticketId as string, {
                  ...props.ticket,
                  metaData: {
                    ...props.ticket.metaData,
                    assignee: currentUser.uid,
                  },
                }).then(() => {
                  return;
                });
              }}
            >
              Claim Ticket
            </Button>
          </RoleProtect>
        </div>
      )}
      <RoleProtect staffOnly>
        <InputDropdown
          id={"ticket-priority"}
          label={"Priority"}
          value={props.ticket.metaData.priority}
          values={[
            {
              value: "unknown",
              label: "Set Priority",
              icon: "assignment_ind",
            },
            {
              value: "low",
              label: "Low",
              icon: "assignment_ind",
            },
            {
              value: "medium",
              label: "Medium",
              icon: "assignment_ind",
            },
            {
              value: "high",
              label: "High",
              icon: "assignment_ind",
            },
            {
              value: "urgent",
              label: "Urgent",
              icon: "assignment_ind",
            },
          ]}
          onChange={(value) => {
            firebaseSetData(
              "tickets",
              ticketId as string,
              {
                ...props.ticket,
                metaData: {
                  ...props.ticket.metaData,
                  priority: value,
                },
              },
              {
                toast: {
                  loading: "Updating Ticket Priority",
                  error: "Unable to update Ticket Priority",
                  success: "Updated Ticket Priority",
                },
              },
            ).then(() => {
              return;
            });
          }}
        />
        <Button
          className={css.statusButton}
          style="secondary"
          title="Change Status"
          icon={{ gficon: "autorenew" }}
          onClick={() => {
            const newStatus =
              props.ticket.metaData.status === "open" ? "in-progress" : "open";

            firebaseSetData("tickets", ticketId as string, {
              ...props.ticket,
              metaData: {
                ...props.ticket.metaData,
                status: newStatus,
              },
            }).then(() => {
              return;
            });
          }}
        >
          {/*  in progress */}
          {props.ticket.metaData.status === "open"
            ? "Switch To In Progress"
            : "Re-Open"}
        </Button>
        <Button
          // Close ticket button
          className={css.closeButton}
          style="danger"
          title="Close Ticket"
          icon={{ gficon: "close" }}
          onClick={() => {
            firebaseSetData("tickets", ticketId as string, {
              ...props.ticket,
              metaData: {
                ...props.ticket.metaData,
                status: "closed",
              },
            }).then(() => {
              return;
            });
          }}
        >
          Close Ticket
        </Button>
      </RoleProtect>
    </SidebarContainer>
  );
}

function TicketContent(props: { ticket: TicketType }) {
  const { ticketId } = useParams();
  const currentUser = useAuth();
  const [messageContent, setMessageContent] = useState("");

  function sendMessage() {
    if (!messageContent || messageContent.trim() === "") return;

    firebaseSetData("tickets", ticketId as string, {
      ...props.ticket,
      data: {
        ...props.ticket.data,
        messages: [
          ...props.ticket.data.messages,
          {
            content: messageContent,
            sender: {
              id: currentUser?.uid,
              name: currentUser?.displayName
                ? currentUser.displayName
                : undefined,
            },
            date: new Date().toJSON(),
          },
        ],
      },
      metaData: {
        ...props.ticket.metaData,
        date: {
          ...props.ticket.metaData.date,
          updatedAt: new Date().toJSON(),
        },
      },
    }).then(() => {
      return;
    });

    // Clear the textarea
    setMessageContent("");
  }

  // scroll to bottom when a new message is added or on first load
  useEffect(() => {
    const messagesList = document.querySelector(`.${css.messages}`);
    if (messagesList) {
      messagesList.scrollTop = messagesList.scrollHeight;
    }
  }, [props.ticket.data.messages.length, props.ticket.data.messages]);

  return (
    <div className={css.content}>
      <ul className={css.messages}>
        {props.ticket.data.messages.length > 0 &&
          props.ticket.data.messages.map((message, index) => (
            <li
              key={index}
              className={
                css.message +
                ` ${
                  message.sender.id === currentUser?.uid ||
                  (message.sender.id && !currentUser)
                    ? css.ownMessage
                    : ""
                } ${
                  // if next message is from the same sender, add a class
                  index < props.ticket.data.messages.length - 1 &&
                  props.ticket.data.messages[index + 1].sender.id ===
                    message.sender.id
                    ? ""
                    : css.nextDiffSender
                } ${
                  // if previous message is from the same sender, add a class
                  index > 0 &&
                  props.ticket.data.messages[index - 1].sender.id ===
                    message.sender.id
                    ? ""
                    : css.prevDiffSender
                }`
              }
            >
              <div className={css.messageContent}>
                {message.content.split("\n").map((line, lineIndex) => (
                  <p key={lineIndex}>{line}</p>
                ))}
              </div>
              <span className={css.messageDate}>
                {/* only show time if the same day */}
                {new Date(message.date).toDateString() ===
                new Date().toDateString()
                  ? new Date(message.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : new Date(message.date).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </span>
            </li>
          ))}
      </ul>
      {currentUser && (
        <div className={css.messageInput}>
          <textarea
            className={css.textarea}
            placeholder="Type your message here..."
            rows={4}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            id="ticket-reply"
          />
          <Button
            className={css.sendButton}
            style="primary"
            icon={{ gficon: "send" }}
            title="Send Message"
            onClick={() => sendMessage()}
          >
            Send
          </Button>
        </div>
      )}
    </div>
  );
}
